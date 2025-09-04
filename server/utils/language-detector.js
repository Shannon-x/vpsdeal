/**
 * 语言检测工具
 * 支持检测英语、中文、日语、韩语等常见语言
 */

class LanguageDetector {
  constructor() {
    // 语言特征模式
    this.patterns = {
      zh: {
        // 中文Unicode范围
        regex: /[\u4e00-\u9fa5]/g,
        name: 'Chinese',
        minRatio: 0.3
      },
      ja: {
        // 日文平假名、片假名
        regex: /[\u3040-\u309f\u30a0-\u30ff]/g,
        name: 'Japanese',
        minRatio: 0.2
      },
      ko: {
        // 韩文
        regex: /[\uac00-\ud7af]/g,
        name: 'Korean',
        minRatio: 0.3
      },
      ar: {
        // 阿拉伯文
        regex: /[\u0600-\u06ff]/g,
        name: 'Arabic',
        minRatio: 0.3
      },
      ru: {
        // 西里尔字母（俄文等）
        regex: /[\u0400-\u04ff]/g,
        name: 'Russian',
        minRatio: 0.3
      }
    };
  }

  /**
   * 检测文本语言
   * @param {string} text - 要检测的文本
   * @returns {Object} 检测结果 {language: 'zh', confidence: 0.95, name: 'Chinese'}
   */
  detect(text) {
    if (!text || typeof text !== 'string') {
      return { language: 'unknown', confidence: 0, name: 'Unknown' };
    }

    // 清理文本（去除HTML标签、数字、标点等）
    const cleanText = this.cleanText(text);
    const textLength = cleanText.length;

    if (textLength === 0) {
      return { language: 'unknown', confidence: 0, name: 'Unknown' };
    }

    // 检测各种语言的字符比例
    const scores = {};
    
    for (const [lang, pattern] of Object.entries(this.patterns)) {
      const matches = cleanText.match(pattern.regex) || [];
      const ratio = matches.length / textLength;
      
      if (ratio >= pattern.minRatio) {
        scores[lang] = {
          ratio,
          name: pattern.name
        };
      }
    }

    // 如果没有检测到特定语言字符，检查是否为英文
    if (Object.keys(scores).length === 0) {
      const englishRatio = this.getEnglishRatio(cleanText);
      if (englishRatio > 0.8) {
        return {
          language: 'en',
          confidence: englishRatio,
          name: 'English'
        };
      }
    }

    // 找出得分最高的语言
    let topLanguage = 'unknown';
    let topScore = 0;
    let topName = 'Unknown';

    for (const [lang, score] of Object.entries(scores)) {
      if (score.ratio > topScore) {
        topScore = score.ratio;
        topLanguage = lang;
        topName = score.name;
      }
    }

    // 特殊处理：如果同时包含中文和日文，需要进一步判断
    if (scores.zh && scores.ja) {
      const result = this.distinguishChineseJapanese(text);
      return result;
    }

    return {
      language: topLanguage,
      confidence: topScore,
      name: topName
    };
  }

  /**
   * 批量检测多个文本的语言
   * @param {Array<string>} texts - 文本数组
   * @returns {Array<Object>} 检测结果数组
   */
  detectBatch(texts) {
    return texts.map(text => this.detect(text));
  }

  /**
   * 清理文本，去除无关字符
   */
  cleanText(text) {
    return text
      .replace(/<[^>]*>/g, '') // 去除HTML标签
      .replace(/[0-9]/g, '') // 去除数字
      .replace(/[^\w\u0080-\uFFFF\s]/g, '') // 保留字母和Unicode字符
      .replace(/\s+/g, ' ') // 压缩空格
      .trim();
  }

  /**
   * 计算英文字符比例
   */
  getEnglishRatio(text) {
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    const totalChars = text.replace(/\s/g, '').length;
    return totalChars > 0 ? englishChars.length / totalChars : 0;
  }

  /**
   * 区分中文和日文
   */
  distinguishChineseJapanese(text) {
    // 检查是否包含仅日���有的假名
    const kanaOnly = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
    
    if (kanaOnly) {
      return {
        language: 'ja',
        confidence: 0.9,
        name: 'Japanese'
      };
    }

    // 检查常见的中文词汇
    const commonChineseWords = /的|是|在|了|和|有|我|你|他|她|这|那|个|们|要|会|就|不|也|对|说|而|之|与/;
    const hasChineseWords = commonChineseWords.test(text);

    if (hasChineseWords) {
      return {
        language: 'zh',
        confidence: 0.9,
        name: 'Chinese'
      };
    }

    // 默认返回中文（基于字符比例）
    return {
      language: 'zh',
      confidence: 0.7,
      name: 'Chinese'
    };
  }

  /**
   * 检测是否需要翻译
   * @param {string} text - 原文
   * @param {string} targetLang - 目标语言
   * @returns {boolean}
   */
  needsTranslation(text, targetLang = 'zh') {
    const detected = this.detect(text);
    
    // 如果检测结果是目标语言，不需要翻译
    if (detected.language === targetLang) {
      return false;
    }

    // 如果是未知语言且置信度低，可能不需要翻译
    if (detected.language === 'unknown' && detected.confidence < 0.5) {
      return false;
    }

    return true;
  }
}

module.exports = LanguageDetector;