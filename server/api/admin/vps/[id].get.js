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
  
  // 模拟数据（实际应从数据库获取）
  const mockData = {
    1: {
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
      views: 1234,
      clicks: 234,
      category: 'under_15_year',
      ipv6: true,
      ddosProtection: true,
      ssdStorage: true,
      isHot: true,
      portSpeed: '1Gbps',
      virtualization: 'KVM',
      affiliateLink: 'https://example.com/aff/123',
      description: '高性能KVM VPS，采用最新AMD EPYC处理器'
    }
  }
  
  const vps = mockData[id]
  
  if (!vps) {
    throw createError({
      statusCode: 404,
      statusMessage: 'VPS not found'
    })
  }
  
  return vps
})