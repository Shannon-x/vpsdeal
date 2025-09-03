// 获取单个分类详情
import { getPool } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'

export default defineEventHandler(async (event) => {
  const pool = getPool();
  const categoryId = getRouterParam(event, 'id');
  
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM vps_categories WHERE id = ? OR slug = ?',
      [categoryId, categoryId]
    );
    
    if (categories.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '分类不存在'
      });
    }
    
    return categories[0];
  } catch (error) {
    if (error.statusCode === 404) throw error;
    logger.error('获取分类详情失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '获取分类详情失败'
    });
  }
});