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
  
  // 检查是否有产品使用此分类（实际应查询数据库）
  // if (productCount > 0) {
  //   throw createError({
  //     statusCode: 400,
  //     statusMessage: 'Cannot delete category with products'
  //   })
  // }
  
  // 模拟删除
  return {
    success: true,
    message: 'Category deleted successfully'
  }
})