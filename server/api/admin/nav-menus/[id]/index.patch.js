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

    // 获取菜单ID
    const menuId = getRouterParam(event, 'id')
    if (!menuId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Menu ID is required'
      })
    }

    // 获取请求体
    const body = await readBody(event)

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vps_deals'
    })

    try {
      // 检查菜单是否存在
      const [existing] = await connection.execute(
        'SELECT id FROM nav_menus WHERE id = ?',
        [menuId]
      )

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Nav menu not found'
        })
      }

      // 处理状态切换
      if (body.is_active !== undefined) {
        await connection.execute(
          'UPDATE nav_menus SET is_active = ?, updated_at = NOW() WHERE id = ?',
          [body.is_active ? 1 : 0, menuId]
        )
      }

      return {
        success: true,
        message: 'Nav menu updated successfully'
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error updating nav menu:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update nav menu'
    })
  }
})