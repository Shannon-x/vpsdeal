// 增强版数据库同步模块
const pool = require('../db');
const logger = require('./simple-logger');
const CategoryMapper = require('./category-mapper');

class EnhancedDBSync {
  constructor() {
    this.categoryMapper = new CategoryMapper();
  }

  // 确保分类表存在
  async ensureCategoriesTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS vps_categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        priority INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    const createMappingTableSQL = `
      CREATE TABLE IF NOT EXISTS vps_category_mapping (
        vps_id INT,
        category_id VARCHAR(50),
        PRIMARY KEY (vps_id, category_id),
        FOREIGN KEY (vps_id) REFERENCES vps_deals(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES vps_categories(id) ON DELETE CASCADE
      )
    `;

    try {
      await pool.execute(createTableSQL);
      await pool.execute(createMappingTableSQL);
      logger.info('分类表结构已确保存在');
    } catch (error) {
      logger.error('创建分类表失败:', error);
      throw error;
    }
  }

  // 初始化默认分类
  async initializeCategories() {
    const categories = this.categoryMapper.getAllCategories();
    
    for (const category of categories) {
      try {
        const slug = category.id.replace(/_/g, '-');
        await pool.execute(
          `INSERT INTO vps_categories (id, name, slug, priority) 
           VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE name = VALUES(name)`,
          [category.id, category.name, slug, 0]
        );
      } catch (error) {
        logger.error(`初始化分类 ${category.id} 失败:`, error);
      }
    }
    
    logger.info('默认分类已初始化');
  }

  // 同步单个VPS数据
  async syncVPSDeal(vpsData, categories) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 计算月付价格（用于统一比较）
      let monthlyPrice = vpsData.priceInfo.amount;
      if (vpsData.priceInfo.period === 'yearly') {
        monthlyPrice = vpsData.priceInfo.amount / 12;
      } else if (vpsData.priceInfo.period === 'quarterly') {
        monthlyPrice = vpsData.priceInfo.amount / 3;
      }

      // 插入或更新VPS数据
      const [result] = await connection.execute(
        `INSERT INTO vps_deals (
          provider, 
          plan_name,
          cpu_cores, 
          cpu_type,
          ram_gb, 
          storage_gb, 
          storage_type,
          bandwidth_tb, 
          bandwidth_unlimited,
          network_speed,
          ipv4_count,
          ipv6_available,
          virtualization,
          location,
          price, 
          price_period,
          original_price,
          discount_percent,
          monthly_price,
          features,
          buy_link,
          is_active,
          last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          plan_name = VALUES(plan_name),
          cpu_cores = VALUES(cpu_cores),
          cpu_type = VALUES(cpu_type),
          ram_gb = VALUES(ram_gb),
          storage_gb = VALUES(storage_gb),
          storage_type = VALUES(storage_type),
          bandwidth_tb = VALUES(bandwidth_tb),
          bandwidth_unlimited = VALUES(bandwidth_unlimited),
          network_speed = VALUES(network_speed),
          ipv4_count = VALUES(ipv4_count),
          ipv6_available = VALUES(ipv6_available),
          virtualization = VALUES(virtualization),
          location = VALUES(location),
          price = VALUES(price),
          price_period = VALUES(price_period),
          original_price = VALUES(original_price),
          discount_percent = VALUES(discount_percent),
          monthly_price = VALUES(monthly_price),
          features = VALUES(features),
          buy_link = VALUES(buy_link),
          is_active = VALUES(is_active),
          last_updated = NOW()`,
        [
          vpsData.provider,
          `${vpsData.specs.cpu.cores}核 ${vpsData.specs.ram.size}GB RAM`,
          vpsData.specs.cpu.cores,
          vpsData.specs.cpu.type || null,
          vpsData.specs.ram.size,
          vpsData.specs.storage.size,
          vpsData.specs.storage.type,
          vpsData.specs.bandwidth.unlimited ? null : vpsData.specs.bandwidth.amount,
          vpsData.specs.bandwidth.unlimited,
          vpsData.specs.network.port || '1Gbps',
          vpsData.specs.network.ipv4,
          vpsData.specs.network.ipv6 ? 1 : 0,
          vpsData.specs.virtualization,
          vpsData.specs.location.country || '未知',
          vpsData.priceInfo.amount,
          vpsData.priceInfo.period,
          vpsData.priceInfo.originalAmount || vpsData.priceInfo.amount,
          vpsData.priceInfo.discount || 0,
          monthlyPrice,
          JSON.stringify(vpsData.specs.features || []),
          vpsData.buyLink,
          1
        ]
      );

      const vpsId = result.insertId || result.affectedRows;

      // 如果是更新，先删除旧的分类映射
      if (!result.insertId && result.affectedRows) {
        // 获取实际的VPS ID
        const [rows] = await connection.execute(
          'SELECT id FROM vps_deals WHERE provider = ? AND cpu_cores = ? AND ram_gb = ? AND price = ?',
          [vpsData.provider, vpsData.specs.cpu.cores, vpsData.specs.ram.size, vpsData.priceInfo.amount]
        );
        
        if (rows.length > 0) {
          const actualVpsId = rows[0].id;
          await connection.execute(
            'DELETE FROM vps_category_mapping WHERE vps_id = ?',
            [actualVpsId]
          );
          
          // 插入新的分类映射
          for (const categoryId of categories) {
            await connection.execute(
              'INSERT INTO vps_category_mapping (vps_id, category_id) VALUES (?, ?)',
              [actualVpsId, categoryId]
            );
          }
        }
      } else if (result.insertId) {
        // 插入分类映射
        for (const categoryId of categories) {
          await connection.execute(
            'INSERT INTO vps_category_mapping (vps_id, category_id) VALUES (?, ?)',
            [result.insertId, categoryId]
          );
        }
      }

      await connection.commit();
      logger.info(`成功同步VPS: ${vpsData.provider} - ${vpsData.uniqueId}`);
      
      return true;
    } catch (error) {
      await connection.rollback();
      logger.error(`同步VPS失败: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  // 批量同步VPS数据
  async syncMultipleVPS(vpsDataArray) {
    await this.ensureCategoriesTable();
    await this.initializeCategories();

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    // 使用分类映射器处理数据
    const mappedData = this.categoryMapper.mapMultipleVPS(vpsDataArray);

    for (const { vpsData, categories } of mappedData) {
      try {
        await this.syncVPSDeal(vpsData, categories);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          vps: vpsData.uniqueId,
          error: error.message
        });
      }
    }

    // 分析并报告分类情况
    const analysis = this.categoryMapper.analyzeAndRecommendCategories(vpsDataArray);
    
    logger.info('同步完成统计:');
    logger.info(`- 成功: ${results.success}`);
    logger.info(`- 失败: ${results.failed}`);
    logger.info('分类统计:');
    Object.entries(analysis.categoryStats).forEach(([cat, count]) => {
      logger.info(`  - ${cat}: ${count} 个VPS`);
    });
    logger.info(`- 未分类: ${analysis.uncategorized} 个`);
    
    if (analysis.recommendations.length > 0) {
      logger.info('建议创建的新分类:');
      analysis.recommendations.forEach(rec => {
        logger.info(`  - ${rec.suggestion} (${rec.count} 个VPS)`);
      });
    }

    return results;
  }

  // 获取某个分类下的所有VPS
  async getVPSByCategory(categoryId, limit = 20, offset = 0) {
    const sql = `
      SELECT vd.*, GROUP_CONCAT(vcm.category_id) as categories
      FROM vps_deals vd
      INNER JOIN vps_category_mapping vcm ON vd.id = vcm.vps_id
      WHERE vcm.category_id = ? AND vd.is_active = 1
      GROUP BY vd.id
      ORDER BY vd.monthly_price ASC
      LIMIT ? OFFSET ?
    `;

    try {
      const [rows] = await pool.execute(sql, [categoryId, limit, offset]);
      return rows;
    } catch (error) {
      logger.error('获取分类VPS失败:', error);
      throw error;
    }
  }

  // 清理过期数据
  async cleanupOldData(daysOld = 7) {
    try {
      const [result] = await pool.execute(
        'UPDATE vps_deals SET is_active = 0 WHERE last_updated < DATE_SUB(NOW(), INTERVAL ? DAY)',
        [daysOld]
      );
      
      logger.info(`标记了 ${result.affectedRows} 个过期VPS为不活跃`);
      return result.affectedRows;
    } catch (error) {
      logger.error('清理过期数据失败:', error);
      throw error;
    }
  }
}

module.exports = EnhancedDBSync;