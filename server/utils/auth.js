import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { useRuntimeConfig } from '#imports'

export function generateToken(payload) {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
}

export function verifyToken(token) {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return null
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Nuxt 3 认证中间件辅助函数
export function requireAuth(event) {
  const token = getCookie(event, 'admin-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权'
    })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'token无效或已过期'
    })
  }
  
  return payload
}