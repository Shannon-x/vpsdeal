export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  // 验证管理员权限
  const token = getCookie(event, 'admin-token')
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  // 模拟数据（实际应从数据库获取）
  const mockData = [
    {
      id: 1,
      productName: 'Premium KVM VPS',
      providerName: 'RackNerd',
      cpu: '2 vCPU',
      memory: '2GB DDR4',
      storage: '30GB NVMe SSD',
      bandwidth: '3TB',
      location: '洛杉矶',
      price: 11.88,
      originalPrice: 23.88,
      discount: 50,
      status: 'active',
      category: 'under_15_year'
    },
    {
      id: 2,
      productName: 'Budget VPS Special',
      providerName: 'Vultr',
      cpu: '1 vCPU',
      memory: '1GB',
      storage: '25GB SSD',
      bandwidth: '1TB',
      location: '东京',
      price: 2.50,
      originalPrice: 5.00,
      discount: 50,
      status: 'active',
      category: 'monthly_2_under'
    }
  ]
  
  // 生成CSV内容
  const headers = ['ID', '产品名称', '提供商', 'CPU', '内存', '存储', '带宽', '位置', '价格', '原价', '折扣', '状态', '分类']
  const rows = mockData.map(vps => [
    vps.id,
    vps.productName,
    vps.providerName,
    vps.cpu,
    vps.memory,
    vps.storage,
    vps.bandwidth,
    vps.location,
    vps.price,
    vps.originalPrice,
    vps.discount,
    vps.status,
    vps.category
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // 设置响应头
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="vps-export-${new Date().toISOString().split('T')[0]}.csv"`)
  
  return csvContent
})