// 翻译服务 - 支持多种翻译API
const axios = require('axios');
const crypto = require('crypto');
const logger = require('./logger');

class TranslatorService {
  constructor(config = {}) {
    this.config = config;
    this.cache = new Map(); // 翻译缓存
  }

  // 百度翻译API
  async translateWithBaidu(texts, from = 'en', to = 'zh') {
    const appId = this.config.baidu?.appId || process.env.BAIDU_TRANSLATE_APP_ID;
    const appKey = this.config.baidu?.appKey || process.env.BAIDU_TRANSLATE_APP_KEY;
    
    if (!appId || !appKey) {
      throw new Error('百度翻译API配置缺失');
    }

    const salt = Date.now();
    const query = texts.join('\n');
    const sign = crypto.createHash('md5')
      .update(appId + query + salt + appKey)
      .digest('hex');

    try {
      const response = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
        params: {
          q: query,
          from,
          to,
          appid: appId,
          salt,
          sign
        }
      });

      if (response.data.error_code) {
        throw new Error(`百度翻译错误: ${response.data.error_msg}`);
      }

      return response.data.trans_result.map(item => item.dst);
    } catch (error) {
      logger.error('百度翻译失败:', error);
      throw error;
    }
  }

  // 有道翻译API (备选)
  async translateWithYoudao(texts) {
    // 实现有道翻译API
    // 这里提供接口，具体实现需要有道API密钥
    throw new Error('有道翻译API未实现');
  }

  // 使用免费的翻译服务（如LibreTranslate）
  async translateWithLibre(texts, from = 'en', to = 'zh') {
    const apiUrl = this.config.libre?.apiUrl || 'https://libretranslate.de/translate';
    
    try {
      const response = await axios.post(apiUrl, {
        q: texts,
        source: from,
        target: to,
        format: 'text'
      });

      return response.data.translatedText || texts;
    } catch (error) {
      logger.error('LibreTranslate翻译失败:', error);
      // 降级处理，返回原文
      return texts;
    }
  }

  // 翻译单个文本
  async translate(text, from = 'en', to = 'zh') {
    // 检查缓存
    const cacheKey = `${text}-${from}-${to}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let translated = text;
    
    try {
      // 尝试使用配置的翻译服务
      if (this.config.provider === 'baidu') {
        [translated] = await this.translateWithBaidu([text], from, to);
      } else if (this.config.provider === 'libre') {
        [translated] = await this.translateWithLibre([text], from, to);
      } else {
        // 默认使用简单的映射翻译
        translated = this.simpleTranslate(text);
      }
    } catch (error) {
      logger.warn(`翻译失败，使用原文: ${text}`);
    }

    // 缓存结果
    this.cache.set(cacheKey, translated);
    return translated;
  }

  // 简单的关键词映射翻译
  simpleTranslate(text) {
    const translations = {
      // 通用词汇
      'month': '月',
      'year': '年',
      'yearly': '年付',
      'monthly': '月付',
      'USD': '美元',
      
      // VPS相关词汇
      'vCPU': '核心',
      'Core': '核心',
      'RAM': '内存',
      'Memory': '内存',
      'Storage': '存储',
      'Disk': '硬盘',
      'Bandwidth': '带宽',
      'Traffic': '流量',
      'Port': '端口',
      'Speed': '速度',
      'Location': '位置',
      'Exclusive': '独家',
      'Deal': '优惠',
      'Free': '免费',
      'High Spec': '高配置',
      
      // 虚拟化技术
      'KVM': 'KVM',
      'OpenVZ': 'OpenVZ',
      'LXC': 'LXC',
      'NAT': 'NAT',
      
      // 地理位置
      'US': '美国',
      'USA': '美国',
      'EU': '欧洲',
      'Europe': '欧洲',
      'Asia': '亚洲',
      'Singapore': '新加坡',
      'Japan': '日本',
      'Germany': '德国',
      'Netherlands': '荷兰',
      'UK': '英国',
      'Canada': '加拿大',
      'Australia': '澳大利亚',
      
      // 数据中心
      'Los Angeles': '洛杉矶',
      'New York': '纽约',
      'Seattle': '西雅图',
      'Dallas': '达拉斯',
      'Chicago': '芝加哥',
      'Miami': '迈阿密',
      'Phoenix': '凤凰城',
      'London': '伦敦',
      'Frankfurt': '法兰克福',
      'Amsterdam': '阿姆斯特丹',
      'Paris': '巴黎',
      'Tokyo': '东京',
      'Hong Kong': '香港',
      'Seoul': '首尔'
    };

    let translated = text;
    
    // 替换已知词汇
    Object.entries(translations).forEach(([en, zh]) => {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      translated = translated.replace(regex, zh);
    });

    return translated;
  }
}

// 批量翻译VPS数据
async function translateBatch(vpsDeals, config = {}) {
  const translator = new TranslatorService(config);
  const translatedDeals = [];

  for (const deal of vpsDeals) {
    try {
      const translatedDeal = { ...deal };
      
      // 翻译需要翻译的字段
      translatedDeal.productNameZh = await translator.translate(deal.productName);
      translatedDeal.locationZh = await translator.translate(deal.location);
      
      // 翻译规格描述
      if (deal.originalSpecs && Array.isArray(deal.originalSpecs)) {
        translatedDeal.specsZh = await Promise.all(
          deal.originalSpecs.map(spec => translator.translate(spec))
        );
      }

      translatedDeals.push(translatedDeal);
      
      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      logger.error(`翻译VPS数据失败: ${deal.uniqueId}`, error);
      translatedDeals.push(deal); // 使用原数据
    }
  }

  logger.info(`完成翻译 ${translatedDeals.length} 个VPS优惠`);
  return translatedDeals;
}

module.exports = {
  TranslatorService,
  translateBatch
};