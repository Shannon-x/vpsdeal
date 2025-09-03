export default defineEventHandler(async (event) => {
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
  
  // 模拟更新状态
  return {
    success: true,
    data: {
      id: parseInt(id),
      isActive: body.isActive,
      updatedAt: new Date().toISOString()
    }
  }
})