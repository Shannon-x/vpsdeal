const db = require('../db');

/**
 * 翻译模型
 */
const Translation = {
  /**
   * 获取VPS产品的翻译内容
   */
  async getTranslatedFields(vpsId, language = 'zh') {
    try {
      const [rows] = await db.query(
        'SELECT translated_fields FROM vps_products WHERE id = ?',
        [vpsId]
      );
      
      if (rows.length && rows[0].translated_fields) {
        const translations = JSON.parse(rows[0].translated_fields);
        return translations[language] || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting translated fields:', error);
      throw error;
    }
  },

  /**
   * 更新翻译内容
   */
  async updateTranslations(vpsId, language, translations) {
    try {
      // 获取现有翻译
      const [rows] = await db.query(
        'SELECT translated_fields FROM vps_products WHERE id = ?',
        [vpsId]
      );
      
      let allTranslations = {};
      if (rows.length && rows[0].translated_fields) {
        allTranslations = JSON.parse(rows[0].translated_fields);
      }
      
      // 更新指定语言的翻译
      allTranslations[language] = {
        ...translations,
        updated_at: new Date().toISOString()
      };
      
      // 保存回数据库
      const [result] = await db.execute(
        'UPDATE vps_products SET translated_fields = ? WHERE id = ?',
        [JSON.stringify(allTranslations), vpsId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating translations:', error);
      throw error;
    }
  },

  /**
   * 批量更新翻译
   */
  async batchUpdateTranslations(translationData) {
    try {
      const results = [];
      
      for (const item of translationData) {
        const success = await this.updateTranslations(
          item.vps_id,
          item.language,
          item.translations
        );
        results.push({
          vps_id: item.vps_id,
          success
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error batch updating translations:', error);
      throw error;
    }
  },

  /**
   * 缓存翻译结果
   */
  async cacheTranslation(sourceText, sourceLang, targetLang, translatedText, provider = 'baidu') {
    try {
      // 检查是否已存在
      const [existing] = await db.query(
        `SELECT id FROM translation_cache 
         WHERE source_text = ? AND source_language = ? AND target_language = ?`,
        [sourceText, sourceLang, targetLang]
      );
      
      if (existing.length) {
        // 更新使用次数
        await db.execute(
          `UPDATE translation_cache 
           SET used_count = used_count + 1, last_used_at = NOW() 
           WHERE id = ?`,
          [existing[0].id]
        );
        return existing[0].id;
      }
      
      // 创建新缓存
      const [result] = await db.execute(
        `INSERT INTO translation_cache 
         (source_text, source_language, target_language, translated_text, provider) 
         VALUES (?, ?, ?, ?, ?)`,
        [sourceText, sourceLang, targetLang, translatedText, provider]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error caching translation:', error);
      throw error;
    }
  },

  /**
   * 从缓存获取翻译
   */
  async getCachedTranslation(sourceText, sourceLang, targetLang) {
    try {
      const [rows] = await db.query(
        `SELECT translated_text FROM translation_cache 
         WHERE source_text = ? AND source_language = ? AND target_language = ?`,
        [sourceText, sourceLang, targetLang]
      );
      
      if (rows.length) {
        // 更新使用统计
        await db.execute(
          `UPDATE translation_cache 
           SET used_count = used_count + 1, last_used_at = NOW() 
           WHERE source_text = ? AND source_language = ? AND target_language = ?`,
          [sourceText, sourceLang, targetLang]
        );
        
        return rows[0].translated_text;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached translation:', error);
      throw error;
    }
  },

  /**
   * 清理旧的翻译缓存
   */
  async cleanupOldCache(days = 90) {
    try {
      const [result] = await db.execute(
        `DELETE FROM translation_cache 
         WHERE last_used_at < DATE_SUB(NOW(), INTERVAL ? DAY) 
           OR (last_used_at IS NULL AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY))`,
        [days, days]
      );
      
      return result.affectedRows;
    } catch (error) {
      console.error('Error cleaning up cache:', error);
      throw error;
    }
  }
};

module.exports = Translation;