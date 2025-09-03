// 删除分类（需要管理员权限）
import { getPool } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'

export default defineEventHandler(async (event) => {
  // TODO: 添加管理员权限验证
  const pool = getPool();
  const categoryId = getRouterParam(event, 'id');
  
  try {
    const [result] = await pool.execute(
      'DELETE FROM vps_categories WHERE id = ?',
      [categoryId]
    );
    
    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '分类不存在'
      });
    }
    
    return {
      success: true,
      message: '分类删除成功'
    };
  } catch (error) {
    if (error.statusCode === 404) throw error;
    logger.error('删除分类失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '删除分类失败'
    });
  }
});