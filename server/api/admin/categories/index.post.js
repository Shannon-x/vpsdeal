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
    if (!body.title || !body.key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and key are required'
      })
    }

    // 验证key格式
    if (!/^[a-z0-9_]+$/.test(body.key)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Key must contain only lowercase letters, numbers and underscores'
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
      // 检查key是否已存在
      const [existing] = await connection.execute(
        'SELECT id FROM categories WHERE slug = ?',
        [body.key]
      )

      if (existing.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category with this key already exists'
        })
      }

      // 插入新分类
      const [result] = await connection.execute(
        `INSERT INTO categories (name, slug, description, icon, color, sort_order, is_featured, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.title,
          body.key,
          body.description || '',
          body.icon || 'ph:package',
          body.gradient || 'budget',
          body.order || 0,
          body.isFeatured ? 1 : 0,
          body.isActive !== false ? 1 : 0
        ]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, target_type, target_id, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Create category',
          'create',
          'category',
          result.insertId,
          JSON.stringify({ name: body.title, slug: body.key }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Category created successfully',
        data: {
          id: result.insertId
        }
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error creating category:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create category'
    })
  }
})