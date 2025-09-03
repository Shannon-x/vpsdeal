import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    // 验证JWT token
    const token = getCookie(event, 'admin-token')
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }

    // 获取分类ID
    const categoryId = getRouterParam(event, 'id')
    if (!categoryId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vps_deals'
    })

    try {
      // 检查分类是否存在
      const [existing] = await connection.execute(
        'SELECT id, name FROM categories WHERE id = ?',
        [categoryId]
      )

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category not found'
        })
      }

      // 检查是否有产品关联到此分类
      const [products] = await connection.execute(
        'SELECT COUNT(*) as count FROM vps_products WHERE category_id = ?',
        [categoryId]
      )

      if (products[0].count > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Cannot delete category with ${products[0].count} associated products`
        })
      }

      // 删除分类
      await connection.execute(
        'DELETE FROM categories WHERE id = ?',
        [categoryId]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, target_type, target_id, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Delete category',
          'delete',
          'category',
          categoryId,
          JSON.stringify({ name: existing[0].name }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Category deleted successfully'
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete category'
    })
  }
})