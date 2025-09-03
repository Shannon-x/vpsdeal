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

    // 获取请求体
    const body = await readBody(event)
    
    // 验证必填字段
    if (!body.title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required'
      })
    }

    // 验证url或category_id必须有一个
    if (!body.url && !body.category_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either URL or category must be specified'
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
      // 如果指定了分类，验证分类是否存在
      if (body.category_id) {
        const [category] = await connection.execute(
          'SELECT id FROM categories WHERE id = ?',
          [body.category_id]
        )

        if (category.length === 0) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Category not found'
          })
        }
      }

      // 插入新菜单项
      const [result] = await connection.execute(
        `INSERT INTO nav_menus (title, url, category_id, icon, sort_order, is_active, target, parent_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.title,
          body.url || null,
          body.category_id || null,
          body.icon || null,
          body.sort_order || 0,
          body.is_active !== false ? 1 : 0,
          body.target || '_self',
          body.parent_id || null
        ]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, target_type, target_id, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Create nav menu',
          'create',
          'nav_menu',
          result.insertId,
          JSON.stringify({ title: body.title }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Nav menu created successfully',
        data: {
          id: result.insertId
        }
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error creating nav menu:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create nav menu'
    })
  }
})