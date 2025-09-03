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

    // 获取请求体（仅包含要更新的字段）
    const body = await readBody(event)

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
        'SELECT id FROM categories WHERE id = ?',
        [categoryId]
      )

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category not found'
        })
      }

      // 处理状态切换
      if (body.isActive !== undefined) {
        await connection.execute(
          'UPDATE categories SET is_active = ?, updated_at = NOW() WHERE id = ?',
          [body.isActive ? 1 : 0, categoryId]
        )
      }

      return {
        success: true,
        message: 'Category updated successfully'
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error updating category:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update category'
    })
  }
})