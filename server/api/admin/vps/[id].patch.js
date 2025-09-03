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
  
  // 模拟更新状态（实际应使用数据库）
  return {
    success: true,
    data: {
      id: parseInt(id),
      status: body.status,
      updatedAt: new Date().toISOString()
    }
  }
})