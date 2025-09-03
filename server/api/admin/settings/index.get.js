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

    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vps_deals'
    })

    try {
      // 获取所有设置
      const [settings] = await connection.execute(
        'SELECT setting_key, setting_value, setting_type, description FROM site_settings ORDER BY setting_key'
      )

      // 将设置转换为键值对格式
      const settingsMap = {}
      settings.forEach(setting => {
        settingsMap[setting.setting_key] = {
          value: setting.setting_value,
          type: setting.setting_type,
          description: setting.description
        }
      })

      return {
        success: true,
        data: settingsMap
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch settings'
    })
  }
})