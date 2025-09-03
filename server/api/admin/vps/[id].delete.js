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
  
  // 模拟删除（实际应从数据库删除）
  return {
    success: true,
    message: 'VPS deleted successfully'
  }
})