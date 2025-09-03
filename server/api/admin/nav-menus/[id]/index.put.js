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

      // 构建更新语句
      const updates = []
      const values = []

      if (body.title !== undefined) {
        updates.push('title = ?')
        values.push(body.title)
      }
      if (body.url !== undefined) {
        updates.push('url = ?')
        values.push(body.url || null)
      }
      if (body.category_id !== undefined) {
        updates.push('category_id = ?')
        values.push(body.category_id || null)
      }
      if (body.icon !== undefined) {
        updates.push('icon = ?')
        values.push(body.icon || null)
      }
      if (body.sort_order !== undefined) {
        updates.push('sort_order = ?')
        values.push(body.sort_order)
      }
      if (body.is_active !== undefined) {
        updates.push('is_active = ?')
        values.push(body.is_active ? 1 : 0)
      }
      if (body.target !== undefined) {
        updates.push('target = ?')
        values.push(body.target)
      }

      if (updates.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No fields to update'
        })
      }

      // 添加updated_at
      updates.push('updated_at = NOW()')
      
      // 添加where条件的值
      values.push(menuId)

      // 执行更新
      await connection.execute(
        `UPDATE nav_menus SET ${updates.join(', ')} WHERE id = ?`,
        values
      )

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