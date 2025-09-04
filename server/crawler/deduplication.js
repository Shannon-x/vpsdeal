/**
 * VPS数据去重工具
 * 基于内容哈希和模糊匹配防止重复条目
 */

const crypto = require('crypto');
const db = require('../db');

class DeduplicationService {
  constructor() {
    // 去重配置
    this.config = {
      // 用于生成哈希的字段
      hashFields: ['cpu', 'ram', 'storage', 'bandwidth', 'location'],
      // 相似度阈值（0-1）
      similarityThreshold: 0.85,
      // 价格变化容忍度（百分比）
      priceVarianceTolerance: 0.1
    };

    // 内存缓存已知的哈希值
    this.hashCache = new Map();
  }

  /**
   * 检查VPS是否重复
   * @param {Object} vpsData - VPS数据
   * @returns {Promise<Object>} 去重结果
   */
  async checkDuplicate(vpsData) {
    // 生成内容哈希
    const contentHash = this.generateHash(vpsData);
    
    // 检查内存缓存
    if (this.hashCache.has(contentHash)) {
      return {
        isDuplicate: true,
        duplicateId: this.hashCache.get(contentHash),
        method: 'exact_hash'
      };
    }

    // 检查数据库中的精确匹配
    const exactMatch = await this.findExactMatch(contentHash);
    if (exactMatch) {
      this.hashCache.set(contentHash, exactMatch.id);
      return {
        isDuplicate: true,
        duplicateId: exactMatch.id,
        method: 'exact_match'
      };
    }

    // 模糊匹配检查
    const similarMatch = await this.findSimilarVPS(vpsData);
    if (similarMatch) {
      return {
        isDuplicate: true,
        duplicateId: similarMatch.id,
        method: 'fuzzy_match',
        similarity: similarMatch.similarity
      };
    }

    // 不是重复，添加到缓存
    this.hashCache.set(contentHash, vpsData.id || 'pending');

    return {
      isDuplicate: false,
      contentHash
    };
  }

  /**
   * 批量去重检查
   * @param {Array<Object>} vpsDataArray - VPS数据数组
   * @returns {Promise<Array>} 去重结果数组
   */
  async checkDuplicateBatch(vpsDataArray) {
    const results = [];
    
    for (const vpsData of vpsDataArray) {
      const result = await this.checkDuplicate(vpsData);
      results.push({
        ...vpsData,
        deduplication: result
      });
    }

    // 返回唯一的条目
    return results.filter(item => !item.deduplication.isDuplicate);
  }

  /**
   * 生成VPS数据的哈希值
   * @param {Object} vpsData - VPS数据
   * @returns {string} 哈希值
   */
  generateHash(vpsData) {
    // 提取关键字段
    const keyData = {};
    
    for (const field of this.config.hashFields) {
      if (vpsData[field]) {
        keyData[field] = this.normalizeValue(vpsData[field], field);
      }
    }

    // 生成哈希
    const dataString = JSON.stringify(keyData, Object.keys(keyData).sort());
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * 标准化字段值
   * @param {any} value - 原始值
   * @param {string} field - 字段名
   * @returns {any} 标准化后的值
   */
  normalizeValue(value, field) {
    switch (field) {
      case 'cpu':
        // 提取CPU核心数
        const cpuMatch = String(value).match(/(\d+)/);
        return cpuMatch ? parseInt(cpuMatch[1]) : value;
        
      case 'ram':
      case 'storage':
        // 转换为统一单位（GB）
        return this.parseStorageSize(value);
        
      case 'bandwidth':
        // 转换为统一单位（GB）
        return this.parseBandwidth(value);
        
      case 'location':
        // 标准化位置名称
        return this.normalizeLocation(value);
        
      default:
        return value;
    }
  }

  /**
   * 解析存储大小
   * @param {string} sizeStr - 存储大小字符串
   * @returns {number} GB单位的数值
   */
  parseStorageSize(sizeStr) {
    const match = String(sizeStr).match(/(\d+(?:\.\d+)?)\s*(GB|TB|MB)/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case 'TB': return value * 1024;
      case 'GB': return value;
      case 'MB': return value / 1024;
      default: return value;
    }
  }

  /**
   * 解析带宽
   * @param {string} bandwidthStr - 带宽字符串
   * @returns {number} GB单位的数值
   */
  parseBandwidth(bandwidthStr) {
    const str = String(bandwidthStr).toLowerCase();
    
    if (str.includes('unlimited') || str.includes('unmetered')) {
      return 999999; // 表示无限
    }

    const match = str.match(/(\d+(?:\.\d+)?)\s*(gb|tb|mb)/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case 'TB': return value * 1024;
      case 'GB': return value;
      case 'MB': return value / 1024;
      default: return value;
    }
  }

  /**
   * 标准化位置名称
   * @param {string} location - 位置字符串
   * @returns {string} 标准化的位置
   */
  normalizeLocation(location) {
    const locationMap = {
      'hk': 'Hong Kong',
      'hongkong': 'Hong Kong',
      'usa': 'United States',
      'us': 'United States',
      'jp': 'Japan',
      'japan': 'Japan',
      'sg': 'Singapore',
      'singapore': 'Singapore',
      'uk': 'United Kingdom',
      'gb': 'United Kingdom',
      'de': 'Germany',
      'germany': 'Germany',
      'nl': 'Netherlands',
      'netherlands': 'Netherlands'
    };

    const normalized = location.toLowerCase().trim();
    return locationMap[normalized] || location;
  }

  /**
   * 在数据库中查找精确匹配
   * @param {string} contentHash - 内容哈希
   * @returns {Promise<Object|null>} 匹配的VPS记录
   */
  async findExactMatch(contentHash) {
    try {
      const [rows] = await db.query(
        'SELECT id FROM vps_products WHERE content_hash = ? LIMIT 1',
        [contentHash]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      // 如果content_hash字段不存在，返回null
      console.error('Error finding exact match:', error.message);
      return null;
    }
  }

  /**
   * 查找相似的VPS
   * @param {Object} vpsData - VPS数据
   * @returns {Promise<Object|null>} 最相似的VPS记录
   */
  async findSimilarVPS(vpsData) {
    try {
      // 构建查询条件
      const conditions = [];
      const params = [];

      // CPU相似
      if (vpsData.cpu) {
        const cpuCores = this.normalizeValue(vpsData.cpu, 'cpu');
        conditions.push('(cpu LIKE ? OR cpu LIKE ?)');
        params.push(`%${cpuCores} core%`, `%${cpuCores} vCore%`);
      }

      // RAM相似
      if (vpsData.ram) {
        const ramSize = this.normalizeValue(vpsData.ram, 'ram');
        conditions.push('(ram LIKE ? OR ram LIKE ?)');
        params.push(`%${ramSize}GB%`, `%${ramSize} GB%`);
      }

      // 存储相似
      if (vpsData.storage) {
        const storageSize = this.normalizeValue(vpsData.storage, 'storage');
        conditions.push('(storage LIKE ? OR storage LIKE ?)');
        params.push(`%${storageSize}GB%`, `%${storageSize} GB%`);
      }

      // 位置相同
      if (vpsData.location) {
        conditions.push('location = ?');
        params.push(vpsData.location);
      }

      if (conditions.length === 0) {
        return null;
      }

      const query = `
        SELECT id, cpu, ram, storage, bandwidth, location, price
        FROM vps_products
        WHERE ${conditions.join(' AND ')}
        LIMIT 10
      `;

      const [candidates] = await db.query(query, params);

      // 计算相似度并找出最佳匹配
      let bestMatch = null;
      let bestSimilarity = 0;

      for (const candidate of candidates) {
        const similarity = this.calculateSimilarity(vpsData, candidate);
        
        if (similarity > bestSimilarity && similarity >= this.config.similarityThreshold) {
          bestSimilarity = similarity;
          bestMatch = {
            ...candidate,
            similarity
          };
        }
      }

      return bestMatch;
    } catch (error) {
      console.error('Error finding similar VPS:', error.message);
      return null;
    }
  }

  /**
   * 计算两个VPS的相似度
   * @param {Object} vps1 - VPS数据1
   * @param {Object} vps2 - VPS数据2
   * @returns {number} 相似度分数（0-1）
   */
  calculateSimilarity(vps1, vps2) {
    const weights = {
      cpu: 0.2,
      ram: 0.2,
      storage: 0.2,
      bandwidth: 0.15,
      location: 0.15,
      price: 0.1
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [field, weight] of Object.entries(weights)) {
      if (vps1[field] && vps2[field]) {
        const score = this.compareField(vps1[field], vps2[field], field);
        totalScore += score * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * 比较两个字段值
   * @param {any} value1 - 值1
   * @param {any} value2 - 值2
   * @param {string} field - 字段名
   * @returns {number} 相似度分数（0-1）
   */
  compareField(value1, value2, field) {
    const norm1 = this.normalizeValue(value1, field);
    const norm2 = this.normalizeValue(value2, field);

    if (field === 'location') {
      // 位置必须完全匹配
      return norm1 === norm2 ? 1 : 0;
    }

    if (field === 'price') {
      // 价格在容忍范围内
      const diff = Math.abs(norm1 - norm2) / Math.max(norm1, norm2);
      return diff <= this.config.priceVarianceTolerance ? 1 : 0;
    }

    // 数值字段使用相对差异
    if (typeof norm1 === 'number' && typeof norm2 === 'number') {
      const maxValue = Math.max(norm1, norm2);
      const diff = Math.abs(norm1 - norm2);
      return maxValue > 0 ? 1 - (diff / maxValue) : 0;
    }

    // 字符串精确匹配
    return norm1 === norm2 ? 1 : 0;
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.hashCache.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.hashCache.size,
      entries: Array.from(this.hashCache.entries())
    };
  }
}

module.exports = DeduplicationService;