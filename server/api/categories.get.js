// 获取所有分类
import { getPool } from '../utils/db.js'
import { logger } from '../utils/logger.js'

export default defineEventHandler(async (event) => {
  const pool = getPool();
  
  try {
    const [categories] = await pool.execute(`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.sort_order,
        COUNT(vp.id) as vps_count
      FROM categories c
      LEFT JOIN vps_products vp ON vp.category_id = c.id AND vp.status = 'active'
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `);
    
    return categories;
  } catch (error) {
    logger.error('获取分类失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '获取分类失败'
    });
  }
});