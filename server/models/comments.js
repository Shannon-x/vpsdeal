const db = require('../db');

/**
 * 评论模型
 */
const Comment = {
  /**
   * 获取VPS产品的所有评论
   */
  async getByVpsId(vpsId, status = null) {
    try {
      let query = `
        SELECT id, vps_id, author_name, rating, content, status, created_at
        FROM comments 
        WHERE vps_id = ?
      `;
      
      const params = [vpsId];
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  /**
   * 创建新评论
   */
  async create(commentData) {
    try {
      const {
        vps_id,
        author_name,
        author_email,
        author_ip,
        rating,
        content
      } = commentData;

      const [result] = await db.execute(
        `INSERT INTO comments 
         (vps_id, author_name, author_email, author_ip, rating, content) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [vps_id, author_name, author_email, author_ip, rating, content]
      );

      return {
        id: result.insertId,
        ...commentData,
        status: 'pending',
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * 更新评论状态
   */
  async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE comments SET status = ? WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating comment status:', error);
      throw error;
    }
  },

  /**
   * 删除评论
   */
  async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM comments WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  /**
   * 获取评论统计
   */
  async getStats(vpsId) {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total,
          AVG(rating) as avg_rating,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
        FROM comments 
        WHERE vps_id = ?
      `, [vpsId]);
      
      return stats[0];
    } catch (error) {
      console.error('Error getting comment stats:', error);
      throw error;
    }
  }
};

module.exports = Comment;