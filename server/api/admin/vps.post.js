export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 验证管理员权限
  const token = getCookie(event, 'admin-token')
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  // 获取请求体
  const body = await readBody(event)
  
  // 验证必填字段
  const requiredFields = ['productName', 'providerName', 'category', 'location', 'cpu', 'memory', 'storage', 'bandwidth', 'price', 'affiliateLink']
  for (const field of requiredFields) {
    if (!body[field]) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required field: ${field}`
      })
    }
  }
  
  // 模拟保存到数据库（实际应使用数据库）
  const newVps = {
    id: Date.now(),
    ...body,
    views: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // 返回创建的VPS数据
  return {
    success: true,
    data: newVps
  }
})