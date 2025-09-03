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
      // 获取所有导航菜单
      const [menus] = await connection.execute(`
        SELECT 
          nm.*,
          c.name as category_name
        FROM nav_menus nm
        LEFT JOIN categories c ON nm.category_id = c.id
        WHERE nm.parent_id IS NULL
        ORDER BY nm.sort_order ASC, nm.id ASC
      `)

      return {
        success: true,
        data: menus
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error fetching nav menus:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch nav menus'
    })
  }
})