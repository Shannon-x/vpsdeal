import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { existsSync } from 'fs'

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

    // 获取上传的文件
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    const uploadType = file.name // logo 或 favicon

    if (!['logo', 'favicon'].includes(uploadType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid upload type'
      })
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
    if (!allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, SVG and ICO files are allowed'
      })
    }

    // 生成文件名
    const timestamp = Date.now()
    const ext = extname(file.filename) || '.png'
    const filename = `${uploadType}-${timestamp}${ext}`

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 保存文件
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, file.data)

    // 更新数据库
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vps_deals'
    })

    try {
      const settingKey = uploadType === 'logo' ? 'site_logo' : 'site_favicon'
      const publicPath = `/uploads/${filename}`

      await connection.execute(
        'UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [publicPath, settingKey]
      )

      // 记录操作日志
      await connection.execute(
        `INSERT INTO admin_logs (admin_id, action, action_type, details, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          1, // TODO: 从token中获取真实的admin_id
          `Upload ${uploadType}`,
          'file_upload',
          JSON.stringify({ filename, path: publicPath }),
          getClientIP(event) || 'unknown',
          getHeader(event, 'user-agent') || 'unknown'
        ]
      )

      return {
        success: true,
        message: `${uploadType} uploaded successfully`,
        data: {
          url: publicPath
        }
      }
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to upload file'
    })
  }
})