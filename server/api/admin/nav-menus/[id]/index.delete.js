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
        'SELECT id, title FROM nav_menus WHERE id = ?',
        [menuId]
      )

      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Nav menu not found'
        })
      }

      // 检查是否有子菜单
      const [children] = await connection.execute(
        'SELECT COUNT(*) as count FROM nav_menus WHERE parent_id = ?',
        [menuId]
      )

      if (children[0].count > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Cannot delete menu with ${children[0].count} sub-menus`
        })
      }

      // 删除菜单
      await connection.execute(
        'DELETE FROM nav_menus WHERE id = ?',
        [menuId]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, target_type, target_id, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Delete nav menu',
          'delete',
          'nav_menu',
          menuId,
          JSON.stringify({ title: existing[0].title }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Nav menu deleted successfully'
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error deleting nav menu:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete nav menu'
    })
  }
})