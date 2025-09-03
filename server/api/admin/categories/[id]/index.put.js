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

      // 如果更新key，检查是否与其他分类冲突
      if (body.key) {
        const [duplicate] = await connection.execute(
          'SELECT id FROM categories WHERE slug = ? AND id != ?',
          [body.key, categoryId]
        )

        if (duplicate.length > 0) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Another category with this key already exists'
          })
        }
      }

      // 构建更新语句
      const updates = []
      const values = []

      if (body.title !== undefined) {
        updates.push('name = ?')
        values.push(body.title)
      }
      if (body.key !== undefined) {
        updates.push('slug = ?')
        values.push(body.key)
      }
      if (body.description !== undefined) {
        updates.push('description = ?')
        values.push(body.description)
      }
      if (body.icon !== undefined) {
        updates.push('icon = ?')
        values.push(body.icon)
      }
      if (body.gradient !== undefined) {
        updates.push('color = ?')
        values.push(body.gradient)
      }
      if (body.order !== undefined) {
        updates.push('sort_order = ?')
        values.push(body.order)
      }
      if (body.isFeatured !== undefined) {
        updates.push('is_featured = ?')
        values.push(body.isFeatured ? 1 : 0)
      }
      if (body.isActive !== undefined) {
        updates.push('is_active = ?')
        values.push(body.isActive ? 1 : 0)
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
      values.push(categoryId)

      // 执行更新
      await connection.execute(
        `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
        values
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, target_type, target_id, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Update category',
          'update',
          'category',
          categoryId,
          JSON.stringify({ 
            name: existing[0].name,
            updated_fields: Object.keys(body)
          }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

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