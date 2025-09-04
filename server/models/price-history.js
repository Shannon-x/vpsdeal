const db = require('../db');

/**
 * 价格历史模型
 */
const PriceHistory = {
  /**
   * 记录价格变化
   */
  async trackPriceChange(vpsId, priceData) {
    try {
      const {
        price,
        original_price = null,
        currency = 'USD',
        billing_cycle = 'monthly',
        discount_percentage = null,
        source = 'crawler'
      } = priceData;

      // 检查是否有变化
      const [lastPrice] = await db.query(
        `SELECT price FROM price_history 
         WHERE vps_id = ? 
         ORDER BY recorded_at DESC 
         LIMIT 1`,
        [vpsId]
      );

      // 只有价格变化时才记录
      if (!lastPrice.length || lastPrice[0].price !== price) {
        const [result] = await db.execute(
          `INSERT INTO price_history 
           (vps_id, price, original_price, currency, billing_cycle, discount_percentage, source) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [vpsId, price, original_price, currency, billing_cycle, discount_percentage, source]
        );

        return {
          id: result.insertId,
          vps_id: vpsId,
          ...priceData,
          recorded_at: new Date()
        };
      }

      return null; // 价格未变化
    } catch (error) {
      console.error('Error tracking price change:', error);
      throw error;
    }
  },

  /**
   * 获取价格历史
   */
  async getHistory(vpsId, limit = 30) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM price_history 
         WHERE vps_id = ? 
         ORDER BY recorded_at DESC 
         LIMIT ?`,
        [vpsId, limit]
      );
      
      return rows;
    } catch (error) {
      console.error('Error getting price history:', error);
      throw error;
    }
  },

  /**
   * 获取价格趋势
   */
  async getPriceTrend(vpsId, days = 30) {
    try {
      const [rows] = await db.query(
        `SELECT 
          DATE(recorded_at) as date,
          MIN(price) as min_price,
          MAX(price) as max_price,
          AVG(price) as avg_price,
          COUNT(*) as price_points
         FROM price_history 
         WHERE vps_id = ? 
           AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY DATE(recorded_at)
         ORDER BY date ASC`,
        [vpsId, days]
      );
      
      return rows;
    } catch (error) {
      console.error('Error getting price trend:', error);
      throw error;
    }
  },

  /**
   * 批量记录价格
   */
  async trackBulkPrices(priceDataArray) {
    try {
      const results = [];
      
      for (const priceData of priceDataArray) {
        const result = await this.trackPriceChange(priceData.vps_id, priceData);
        if (result) {
          results.push(result);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error tracking bulk prices:', error);
      throw error;
    }
  },

  /**
   * 获取最低价格记录
   */
  async getLowestPrice(vpsId, days = 365) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM price_history 
         WHERE vps_id = ? 
           AND recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
         ORDER BY price ASC 
         LIMIT 1`,
        [vpsId, days]
      );
      
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting lowest price:', error);
      throw error;
    }
  }
};

module.exports = PriceHistory;