import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

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

    let tokenData
    try {
      tokenData = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }

    // 获取请求体
    const body = await readBody(event)
    
    // 验证必填字段
    if (!body.currentPassword || !body.newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password and new password are required'
      })
    }

    // 验证新密码强度
    if (body.newPassword.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password must be at least 6 characters long'
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
      // 获取当前管理员信息
      const [admins] = await connection.execute(
        'SELECT id, username, password_hash FROM admins WHERE username = ?',
        [tokenData.username || 'admin']
      )

      if (admins.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Admin not found'
        })
      }

      const admin = admins[0]

      // 验证当前密码
      let isValidPassword = false
      
      // 如果数据库中有哈希密码，使用bcrypt验证
      if (admin.password_hash && admin.password_hash.startsWith('$2')) {
        isValidPassword = await bcrypt.compare(body.currentPassword, admin.password_hash)
      } else {
        // 否则直接比较（兼容旧系统）
        isValidPassword = body.currentPassword === admin.password_hash
      }

      if (!isValidPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Current password is incorrect'
        })
      }

      // 生成新密码的哈希
      const saltRounds = 10
      const newPasswordHash = await bcrypt.hash(body.newPassword, saltRounds)

      // 更新密码
      await connection.execute(
        'UPDATE admins SET password_hash = ?, updated_at = NOW() WHERE id = ?',
        [newPasswordHash, admin.id]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          admin.id,
          'Change password',
          'security',
          JSON.stringify({ username: admin.username }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: 'Password changed successfully'
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error changing password:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to change password'
    })
  }
})