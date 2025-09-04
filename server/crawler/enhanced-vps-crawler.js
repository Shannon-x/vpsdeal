/**
 * 增强版VPS爬虫 - 集成翻译和去重功能
 */

const axios = require('axios');
const cheerio = require('cheerio');
const TranslationService = require('../utils/translation');
const DeduplicationService = require('./deduplication');
const PriceHistory = require('../models/price-history');
const Translation = require('../models/translations');
const logger = require('./simple-logger');

class EnhancedVPSCrawler {
  constructor(options = {}) {
    this.baseUrl = 'https://serverdeals.cc';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
    
    // 初始化服务
    this.translator = new TranslationService({
      targetLang: options.targetLang || 'zh',
      batchSize: 20,
      rateLimitDelay: 1500
    });
    
    this.deduplicator = new DeduplicationService();
    
    // 爬虫配置
    this.config = {
      translateFields: ['planName', 'provider', 'location', 'features'],
      trackPriceHistory: true,
      deduplicationEnabled: true,
      ...options
    };
    
    // 统计信息
    this.stats = {
      crawled: 0,
      translated: 0,
      duplicates: 0,
      errors: 0,
      saved: 0
    };
  }

  /**
   * 爬取VPS数据
   * @param {string} category - 分类
   * @returns {Promise<Array>} VPS数据数组
   */
  async crawl(category = '') {
    try {
      const url = category ? `${this.baseUrl}/category/${category}` : this.baseUrl;
      logger.info(`开始爬取: ${url}`);
      
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      
      // 提取所有VPS卡片
      const vpsCards = [];
      $('.vps-card, .deal-card, article.post').each((index, element) => {
        const vpsData = this.parseVPSCard($, element);
        if (vpsData) {
          vpsCards.push(vpsData);
        }
      });
      
      logger.info(`解析到 ${vpsCards.length} 个VPS产品`);
      this.stats.crawled += vpsCards.length;
      
      // 去重处理
      let uniqueCards = vpsCards;
      if (this.config.deduplicationEnabled) {
        uniqueCards = await this.deduplicator.checkDuplicateBatch(vpsCards);
        const duplicateCount = vpsCards.length - uniqueCards.length;
        this.stats.duplicates += duplicateCount;
        logger.info(`去重后剩余 ${uniqueCards.length} 个产品（去除 ${duplicateCount} 个重复）`);
      }
      
      // 批量翻译
      const translatedCards = await this.translateBatch(uniqueCards);
      
      // 价格历史追踪
      if (this.config.trackPriceHistory) {
        await this.trackPriceHistory(translatedCards);
      }
      
      return translatedCards;
    } catch (error) {
      logger.error(`爬取失败: ${error.message}`);
      this.stats.errors++;
      throw error;
    }
  }

  /**
   * 解析VPS卡片（增强版）
   */
  parseVPSCard($, card) {
    try {
      const $card = $(card);
      
      // 基础信息提取
      const vpsData = {
        // 原始数据
        provider: this.extractProvider($, $card),
        planName: this.extractPlanName($, $card),
        location: this.extractLocation($, $card),
        
        // 规格信息
        cpu: this.extractCPU($, $card),
        ram: this.extractRAM($, $card),
        storage: this.extractStorage($, $card),
        bandwidth: this.extractBandwidth($, $card),
        
        // 价格信息
        price: this.extractPrice($, $card),
        originalPrice: this.extractOriginalPrice($, $card),
        currency: 'USD',
        billingCycle: this.extractBillingCycle($, $card),
        
        // 附加信息
        features: this.extractFeatures($, $card),
        link: this.extractLink($, $card),
        crawledAt: new Date(),
        
        // 元数据
        sourceUrl: $card.find('a').first().attr('href') || '',
        sourceCategory: $card.closest('.category').data('category') || 'general'
      };
      
      // 生成内容哈希
      vpsData.contentHash = this.deduplicator.generateHash(vpsData);
      
      return vpsData;
    } catch (error) {
      logger.error(`解析VPS卡片失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 批量翻译VPS数据
   */
  async translateBatch(vpsDataArray) {
    const translatedResults = [];
    
    for (const vpsData of vpsDataArray) {
      try {
        // 准备要翻译的字段
        const fieldsToTranslate = {};
        
        for (const field of this.config.translateFields) {
          if (vpsData[field]) {
            fieldsToTranslate[field] = vpsData[field];
          }
        }
        
        // 执行翻译
        const translations = await this.translator.translateFields(
          fieldsToTranslate,
          this.config.translateFields,
          { targetLang: this.config.targetLang }
        );
        
        // 合并翻译结果
        const translatedVPS = {
          ...vpsData,
          translations: translations.translations,
          translatedFields: translations.translations[this.config.targetLang || 'zh']
        };
        
        translatedResults.push(translatedVPS);
        this.stats.translated++;
        
        // 记录翻译统计
        logger.info(`翻译完成: ${vpsData.planName} -> ${translatedVPS.translatedFields?.planName}`);
      } catch (error) {
        logger.error(`翻译失败: ${error.message}`);
        // 即使翻译失败也保留原始数据
        translatedResults.push(vpsData);
      }
    }
    
    return translatedResults;
  }

  /**
   * 追踪价格历史
   */
  async trackPriceHistory(vpsDataArray) {
    const priceUpdates = [];
    
    for (const vpsData of vpsDataArray) {
      if (vpsData.id && vpsData.price) {
        priceUpdates.push({
          vps_id: vpsData.id,
          price: vpsData.price,
          original_price: vpsData.originalPrice,
          currency: vpsData.currency,
          billing_cycle: vpsData.billingCycle,
          discount_percentage: this.calculateDiscount(vpsData.originalPrice, vpsData.price)
        });
      }
    }
    
    if (priceUpdates.length > 0) {
      await PriceHistory.trackBulkPrices(priceUpdates);
      logger.info(`记录了 ${priceUpdates.length} 个价格更新`);
    }
  }

  // === 提取方法 ===
  
  extractProvider($, $card) {
    return $card.find('.provider-name, .company-name, h3').first().text().trim() || 'Unknown';
  }
  
  extractPlanName($, $card) {
    return $card.find('.plan-name, .product-name, h4').first().text().trim() || 'VPS Plan';
  }
  
  extractLocation($, $card) {
    const locationText = $card.find('.location, .datacenter, .region').text().trim();
    return this.normalizeLocation(locationText);
  }
  
  extractCPU($, $card) {
    const cpuText = $card.find('.cpu, .processor, li:contains("CPU"), li:contains("vCPU")')
      .text().trim();
    const match = cpuText.match(/(\d+)\s*(vCPU|Core|核)/i);
    return match ? match[1] + ' vCPU' : '1 vCPU';
  }
  
  extractRAM($, $card) {
    const ramText = $card.find('.ram, .memory, li:contains("RAM"), li:contains("内存")')
      .text().trim();
    const match = ramText.match(/(\d+(?:\.\d+)?)\s*(GB|MB)/i);
    if (match) {
      return match[1] + ' ' + match[2].toUpperCase();
    }
    return '1 GB';
  }
  
  extractStorage($, $card) {
    const storageText = $card.find('.storage, .disk, li:contains("Storage"), li:contains("SSD")')
      .text().trim();
    const match = storageText.match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
    if (match) {
      return match[1] + ' ' + match[2].toUpperCase() + ' SSD';
    }
    return '20 GB SSD';
  }
  
  extractBandwidth($, $card) {
    const bwText = $card.find('.bandwidth, li:contains("Bandwidth"), li:contains("流量")')
      .text().trim();
    
    if (bwText.toLowerCase().includes('unlimited') || bwText.includes('不限')) {
      return 'Unlimited';
    }
    
    const match = bwText.match(/(\d+(?:\.\d+)?)\s*(TB|GB)/i);
    if (match) {
      return match[1] + ' ' + match[2].toUpperCase();
    }
    return '1 TB';
  }
  
  extractPrice($, $card) {
    const priceText = $card.find('.price, .amount, .cost').first().text();
    const match = priceText.match(/\$?(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }
  
  extractOriginalPrice($, $card) {
    const originalText = $card.find('.original-price, .strikethrough, del').text();
    const match = originalText.match(/\$?(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }
  
  extractBillingCycle($, $card) {
    const priceText = $card.find('.price, .billing-cycle').text().toLowerCase();
    
    if (priceText.includes('month') || priceText.includes('mo')) {
      return 'monthly';
    } else if (priceText.includes('year') || priceText.includes('yr')) {
      return 'yearly';
    } else if (priceText.includes('quarter')) {
      return 'quarterly';
    }
    
    return 'monthly';
  }
  
  extractFeatures($, $card) {
    const features = [];
    
    $card.find('.feature, .spec-item, ul li').each((i, el) => {
      const feature = $(el).text().trim();
      if (feature && !feature.match(/^\d+\s*(GB|TB|vCPU)/)) {
        features.push(feature);
      }
    });
    
    return features;
  }
  
  extractLink($, $card) {
    const link = $card.find('a.btn, a.button, a[href*="aff"], a[href*="visit"]')
      .first().attr('href');
    
    if (link && !link.startsWith('http')) {
      return this.baseUrl + link;
    }
    
    return link || '';
  }
  
  // === 辅助方法 ===
  
  normalizeLocation(location) {
    const locationMap = {
      'hk': 'Hong Kong',
      'hongkong': 'Hong Kong',
      'usa': 'United States',
      'us': 'United States',
      'jp': 'Japan',
      'sg': 'Singapore',
      'uk': 'United Kingdom',
      'de': 'Germany',
      'nl': 'Netherlands'
    };
    
    const normalized = location.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    for (const [key, value] of Object.entries(locationMap)) {
      if (normalized.includes(key)) {
        return value;
      }
    }
    
    return location;
  }
  
  calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) {
      return 0;
    }
    
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  
  /**
   * 获取爬虫统计信息
   */
  getStats() {
    return {
      ...this.stats,
      translationStats: this.translator.getStats(),
      cacheStats: this.deduplicator.getCacheStats()
    };
  }
  
  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      crawled: 0,
      translated: 0,
      duplicates: 0,
      errors: 0,
      saved: 0
    };
    
    this.translator.resetStats();
    this.deduplicator.clearCache();
  }
}

module.exports = EnhancedVPSCrawler;