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
      // 获取所有分类及其产品数量
      const [categories] = await connection.execute(`
        SELECT 
          c.*,
          COUNT(v.id) as productCount
        FROM categories c
        LEFT JOIN vps_products v ON c.id = v.category_id AND v.status = 'active'
        GROUP BY c.id
        ORDER BY c.sort_order ASC, c.id ASC
      `)

      // 转换数据格式
      const formattedCategories = categories.map(cat => ({
        id: cat.id,
        title: cat.name,
        key: cat.slug,
        description: cat.description || '',
        icon: cat.icon || 'ph:package',
        gradient: cat.color || 'budget',
        order: cat.sort_order || 0,
        isActive: cat.is_active === 1 || cat.is_active === true,
        isFeatured: cat.is_featured === 1 || cat.is_featured === true,
        productCount: parseInt(cat.productCount) || 0,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at
      }))

      return {
        success: true,
        data: formattedCategories
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch categories'
    })
  }
})