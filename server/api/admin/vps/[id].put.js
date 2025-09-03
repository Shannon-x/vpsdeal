export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
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
  
  // 模拟更新数据库（实际应使用数据库）
  const updatedVps = {
    id: parseInt(id),
    ...body,
    updatedAt: new Date().toISOString()
  }
  
  return {
    success: true,
    data: updatedVps
  }
})