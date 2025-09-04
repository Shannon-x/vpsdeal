/**
 * 增强的翻译工具
 * 支持批量翻译、队列管理、多提供商切换
 */

const Translation = require('../models/translations');
const LanguageDetector = require('./language-detector');
const crypto = require('crypto');

class TranslationService {
  constructor(options = {}) {
    this.languageDetector = new LanguageDetector();
    
    // 配置选项
    this.options = {
      targetLang: 'zh',
      batchSize: 50,
      rateLimitDelay: 1000, // 毫秒
      maxRetries: 3,
      cacheEnabled: true,
      providers: ['baidu', 'google', 'deepl'], // 优先级顺序
      ...options
    };

    // 翻译队列
    this.queue = [];
    this.isProcessing = false;
    
    // 统计信息
    this.stats = {
      translated: 0,
      cached: 0,
      failed: 0,
      skipped: 0
    };
  }

  /**
   * 翻译单个文本
   * @param {string} text - 要翻译的文本
   * @param {Object} options - 翻译选项
   * @returns {Promise<Object>} 翻译结果
   */
  async translate(text, options = {}) {
    const opts = { ...this.options, ...options };
    
    // 检测是否需要翻译
    if (!this.languageDetector.needsTranslation(text, opts.targetLang)) {
      this.stats.skipped++;
      return {
        original: text,
        translated: text,
        cached: false,
        skipped: true,
        language: opts.targetLang
      };
    }

    // 检查缓存
    if (opts.cacheEnabled) {
      const cached = await Translation.getCachedTranslation(
        text,
        'auto',
        opts.targetLang
      );
      
      if (cached) {
        this.stats.cached++;
        return {
          original: text,
          translated: cached,
          cached: true,
          skipped: false,
          language: opts.targetLang
        };
      }
    }

    // 执行翻译
    const result = await this.performTranslation(text, opts);
    
    // 缓存结果
    if (result.success && opts.cacheEnabled) {
      await Translation.cacheTranslation(
        text,
        'auto',
        opts.targetLang,
        result.translated,
        result.provider
      );
    }

    return result;
  }

  /**
   * 批量翻译
   * @param {Array<string>} texts - 文本数组
   * @param {Object} options - 翻译选项
   * @returns {Promise<Array>} 翻译结果数组
   */
  async translateBatch(texts, options = {}) {
    const opts = { ...this.options, ...options };
    const results = [];

    // 按批次处理
    for (let i = 0; i < texts.length; i += opts.batchSize) {
      const batch = texts.slice(i, i + opts.batchSize);
      const batchResults = await Promise.all(
        batch.map(text => this.translate(text, opts))
      );
      
      results.push(...batchResults);
      
      // 速率限制
      if (i + opts.batchSize < texts.length) {
        await this.delay(opts.rateLimitDelay);
      }
    }

    return results;
  }

  /**
   * 翻译对象字段
   * @param {Object} obj - 要翻译的对象
   * @param {Array<string>} fields - 要翻译的字段列表
   * @param {Object} options - 翻译选项
   * @returns {Promise<Object>} 包含翻译结果的对象
   */
  async translateFields(obj, fields, options = {}) {
    const translations = {};
    
    for (const field of fields) {
      if (obj[field] && typeof obj[field] === 'string') {
        const result = await this.translate(obj[field], options);
        translations[field] = result.translated;
      }
    }

    return {
      ...obj,
      translations: {
        [options.targetLang || this.options.targetLang]: translations,
        _metadata: {
          translatedAt: new Date().toISOString(),
          fields: fields
        }
      }
    };
  }

  /**
   * 添加到翻译队列
   * @param {Object} item - 队列项
   */
  addToQueue(item) {
    this.queue.push({
      id: this.generateId(),
      ...item,
      status: 'pending',
      addedAt: new Date()
    });

    // 如果队列未在处理中，开始处理
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * 处理翻译队列
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.find(i => i.status === 'pending');
      
      if (!item) {
        break;
      }

      item.status = 'processing';

      try {
        const result = await this.translate(item.text, item.options);
        item.status = 'completed';
        item.result = result;
        
        // 执行回调
        if (item.callback) {
          item.callback(null, result);
        }
      } catch (error) {
        item.status = 'failed';
        item.error = error;
        
        if (item.callback) {
          item.callback(error, null);
        }
      }

      // 移除已处理的项
      this.queue = this.queue.filter(i => i.id !== item.id);
      
      // 速率限制
      await this.delay(this.options.rateLimitDelay);
    }

    this.isProcessing = false;
  }

  /**
   * 执行实际的翻译
   */
  async performTranslation(text, options) {
    let lastError = null;

    // 尝试使用不同的提供商
    for (const provider of options.providers || this.options.providers) {
      try {
        const translated = await this.callTranslationAPI(text, provider, options);
        
        this.stats.translated++;
        
        return {
          original: text,
          translated,
          cached: false,
          skipped: false,
          language: options.targetLang,
          provider,
          success: true
        };
      } catch (error) {
        console.error(`Translation failed with ${provider}:`, error.message);
        lastError = error;
      }
    }

    // 所有提供商都失败
    this.stats.failed++;
    
    return {
      original: text,
      translated: text, // 返回原文
      cached: false,
      skipped: false,
      language: 'unknown',
      provider: 'none',
      success: false,
      error: lastError
    };
  }

  /**
   * 调用翻译API（模拟实现，实际需要根据提供商实现）
   */
  async callTranslationAPI(text, provider, options) {
    // 这里应该调用实际的翻译API
    // 现在返回模拟结果
    
    // 模拟API调用延迟
    await this.delay(100);
    
    // 模拟翻译结果
    if (provider === 'baidu') {
      // 实际应该调用百度翻译API
      return `[已翻译-${provider}] ${text}`;
    }
    
    throw new Error(`Provider ${provider} not implemented`);
  }

  /**
   * 获取翻译统计
   */
  getStats() {
    return {
      ...this.stats,
      queueLength: this.queue.length,
      cacheHitRate: this.stats.cached / (this.stats.translated + this.stats.cached) || 0
    };
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      translated: 0,
      cached: 0,
      failed: 0,
      skipped: 0
    };
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * 验证翻译质量
   */
  validateTranslation(original, translated) {
    // 基本验证规则
    if (!translated || translated === original) {
      return { valid: false, reason: 'Translation unchanged' };
    }

    if (translated.length < original.length * 0.5 || 
        translated.length > original.length * 2) {
      return { valid: false, reason: 'Translation length suspicious' };
    }

    // 检测是否包含目标语言字符
    const detected = this.languageDetector.detect(translated);
    if (detected.language !== this.options.targetLang) {
      return { valid: false, reason: 'Wrong target language' };
    }

    return { valid: true };
  }
}

module.exports = TranslationService;