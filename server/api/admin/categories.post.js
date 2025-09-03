export default defineEventHandler(async (event) => {
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
  const requiredFields = ['title', 'key', 'icon', 'gradient']
  for (const field of requiredFields) {
    if (!body[field]) {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required field: ${field}`
      })
    }
  }
  
  // 验证key格式
  if (!/^[a-z0-9_]+$/.test(body.key)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid key format. Only lowercase letters, numbers and underscores are allowed.'
    })
  }
  
  // 模拟保存到数据库
  const newCategory = {
    id: Date.now(),
    ...body,
    isActive: body.isActive !== false,
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return {
    success: true,
    data: newCategory
  }
})