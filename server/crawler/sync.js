// 数据同步到MySQL数据库
const mysql = require('mysql2/promise');
const logger = require('./logger');

class DataSync {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
    this.pool = null;
  }

  async init() {
    this.pool = mysql.createPool({
      host: this.dbConfig.host || process.env.DB_HOST,
      port: this.dbConfig.port || process.env.DB_PORT || 3306,
      user: this.dbConfig.user || process.env.DB_USER,
      password: this.dbConfig.password || process.env.DB_PASSWORD,
      database: this.dbConfig.database || process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    logger.info('数据库连接池初始化成功');
  }

  // 映射爬取的数据到数据库格式
  mapToDbFormat(crawledData) {
    // 根据价格和地区确定分类
    const categoryId = this.determineCategoryId(crawledData);
    
    return {
      // 基本信息
      provider: crawledData.provider,
      name: crawledData.productNameZh || crawledData.productName,
      name_en: crawledData.productName,
      slug: crawledData.uniqueId,
      
      // 价格信息
      price: crawledData.price?.amount || 0,
      price_type: crawledData.price?.period || 'monthly',
      original_price: crawledData.price?.amount || 0,
      discount_percentage: 0, // 可以后续计算
      
      // 规格信息
      cpu_cores: this.extractNumber(crawledData.cpu),
      cpu_type: crawledData.cpu,
      ram: this.extractNumber(crawledData.ram),
      ram_unit: this.extractUnit(crawledData.ram, 'GB'),
      storage: this.extractNumber(crawledData.storage),
      storage_type: this.extractStorageType(crawledData.storage),
      storage_unit: this.extractUnit(crawledData.storage, 'GB'),
      bandwidth: this.extractNumber(crawledData.bandwidth),
      bandwidth_unit: this.extractUnit(crawledData.bandwidth, 'TB'),
      
      // 网络信息
      ipv4_count: this.extractIPCount(crawledData.ipv4),
      ipv6_count: this.extractIPCount(crawledData.ipv6),
      port_speed: this.extractNumber(crawledData.port),
      port_speed_unit: this.extractUnit(crawledData.port, 'Gbps'),
      
      // 位置和技术
      location: crawledData.locationZh || crawledData.location,
      location_en: crawledData.location,
      virtualization: crawledData.virtualization,
      
      // 其他信息
      features: JSON.stringify(crawledData.specsZh || crawledData.originalSpecs || []),
      affiliate_link: crawledData.buyLink,
      source_url: crawledData.sourceUrl,
      category_id: categoryId,
      
      // 状态
      status: 'active',
      is_featured: false,
      stock_status: 'in_stock',
      
      // 时间戳
      crawled_at: crawledData.crawledAt,
      last_updated: new Date()
    };
  }

  // 确定分类ID
  determineCategoryId(data) {
    const categoryMap = {
      '免费VPS': 1,
      '月付2美元以下': 2,
      '年付15美元以下KVM': 3,
      '年付25美元以下KVM': 4,
      '高配置VPS': 5,
      '存储型VPS': 6,
      'NAT/OpenVZ/LXC': 7,
      'VDS优惠': 8,
      '独家优惠': 9
    };

    return categoryMap[data.category] || 10; // 默认为"其他"分类
  }

  // 提取数字
  extractNumber(str) {
    if (!str) return 0;
    const match = str.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // 提取单位
  extractUnit(str, defaultUnit) {
    if (!str) return defaultUnit;
    
    const units = {
      'GB': ['GB', 'GiB'],
      'TB': ['TB', 'TiB'],
      'MB': ['MB', 'MiB'],
      'Mbps': ['Mbps', 'Mbit/s'],
      'Gbps': ['Gbps', 'Gbit/s']
    };

    for (const [unit, patterns] of Object.entries(units)) {
      if (patterns.some(p => str.includes(p))) {
        return unit;
      }
    }
    
    return defaultUnit;
  }

  // 提取存储类型
  extractStorageType(str) {
    if (!str) return 'SSD';
    
    if (str.includes('NVMe')) return 'NVMe';
    if (str.includes('SSD')) return 'SSD';
    if (str.includes('HDD')) return 'HDD';
    
    return 'SSD'; // 默认
  }

  // 提取IP数量
  extractIPCount(str) {
    if (!str) return 0;
    
    const match = str.match(/(\d+)\s*(?:x|×)?/);
    return match ? parseInt(match[1]) : 1;
  }

  // 同步单个VPS数据
  async syncVPS(vpsData) {
    const connection = await this.pool.getConnection();
    
    try {
      const mapped = this.mapToDbFormat(vpsData);
      
      // 检查是否已存在
      const [existing] = await connection.execute(
        'SELECT id, price, last_updated FROM vps_products WHERE slug = ?',
        [mapped.slug]
      );

      if (existing.length > 0) {
        // 更新现有记录
        const updateFields = [];
        const updateValues = [];
        
        // 只更新变化的字段
        Object.entries(mapped).forEach(([key, value]) => {
          if (key !== 'slug' && key !== 'crawled_at') {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
          }
        });
        
        updateValues.push(existing[0].id);
        
        await connection.execute(
          `UPDATE vps_products SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        
        return { action: 'updated', id: existing[0].id };
      } else {
        // 插入新记录
        const fields = Object.keys(mapped);
        const placeholders = fields.map(() => '?').join(', ');
        const values = Object.values(mapped);
        
        const [result] = await connection.execute(
          `INSERT INTO vps_products (${fields.join(', ')}) VALUES (${placeholders})`,
          values
        );
        
        return { action: 'inserted', id: result.insertId };
      }
    } finally {
      connection.release();
    }
  }

  // 批量同步
  async syncBatch(vpsDataList) {
    const results = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const vpsData of vpsDataList) {
      try {
        const result = await this.syncVPS(vpsData);
        
        if (result.action === 'inserted') {
          results.inserted++;
        } else if (result.action === 'updated') {
          results.updated++;
        }
        
        logger.info(`${result.action} VPS: ${vpsData.uniqueId}`);
        
      } catch (error) {
        logger.error(`同步VPS失败: ${vpsData.uniqueId}`, error);
        results.errors.push({ vps: vpsData.uniqueId, error: error.message });
        results.skipped++;
      }
    }

    return results;
  }

  // 清理过期数据
  async cleanupOldData(daysToKeep = 30) {
    const connection = await this.pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        `UPDATE vps_products 
         SET status = 'inactive' 
         WHERE last_updated < DATE_SUB(NOW(), INTERVAL ? DAY) 
         AND status = 'active'`,
        [daysToKeep]
      );
      
      logger.info(`标记 ${result.affectedRows} 个过期VPS为非活跃状态`);
      return result.affectedRows;
      
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

// 导出同步函数
async function syncToDatabase(vpsDataList, dbConfig = {}) {
  const sync = new DataSync(dbConfig);
  
  try {
    await sync.init();
    const results = await sync.syncBatch(vpsDataList);
    
    // 清理过期数据
    await sync.cleanupOldData();
    
    return results;
  } finally {
    await sync.close();
  }
}

module.exports = {
  DataSync,
  syncToDatabase
};