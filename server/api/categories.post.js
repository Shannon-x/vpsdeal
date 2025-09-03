// 创建新分类（需要管理员权限）
import { getPool } from '../utils/db.js'
import { logger } from '../utils/logger.js'

export default defineEventHandler(async (event) => {
  // TODO: 添加管理员权限验证
  const pool = getPool();
  const body = await readBody(event);
  
  if (!body.name || !body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: '分类名称和ID不能为空'
    });
  }
  
  try {
    const slug = body.slug || body.id.replace(/_/g, '-');
    const [result] = await pool.execute(
      `INSERT INTO vps_categories (id, name, slug, description, priority) 
       VALUES (?, ?, ?, ?, ?)`,
      [body.id, body.name, slug, body.description || '', body.priority || 0]
    );
    
    return {
      success: true,
      id: body.id,
      message: '分类创建成功'
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        statusMessage: '分类ID或slug已存在'
      });
    }
    logger.error('创建分类失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '创建分类失败'
    });
  }
});