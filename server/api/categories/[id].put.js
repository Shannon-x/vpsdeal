// 更新分类（需要管理员权限）
import { getPool } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'

export default defineEventHandler(async (event) => {
  // TODO: 添加管理员权限验证
  const pool = getPool();
  const categoryId = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  try {
    const [result] = await pool.execute(
      `UPDATE vps_categories 
       SET name = ?, description = ?, priority = ?
       WHERE id = ?`,
      [body.name, body.description || '', body.priority || 0, categoryId]
    );
    
    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '分类不存在'
      });
    }
    
    return {
      success: true,
      message: '分类更新成功'
    };
  } catch (error) {
    if (error.statusCode === 404) throw error;
    logger.error('更新分类失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '更新分类失败'
    });
  }
});