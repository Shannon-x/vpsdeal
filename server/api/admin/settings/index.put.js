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
    
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
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
      // 开始事务
      await connection.beginTransaction()

      // 更新每个设置
      for (const [key, value] of Object.entries(body)) {
        await connection.execute(
          'UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
          [value, key]
        )
      }

      // 提交事务
      await connection.commit()

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          'Update site settings',
          'settings_update',
          JSON.stringify({ updated_keys: Object.keys(body) }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Settings updated successfully'
      }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update settings'
    })
  }
})