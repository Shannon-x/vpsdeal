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
  
  // 构建查询参数
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const offset = (page - 1) * limit
  
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
      views: 1234,
      clicks: 234,
      category: 'under_15_year',
      ipv6: true,
      ddosProtection: true,
      ssdStorage: true,
      isHot: true
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
      views: 989,
      clicks: 189,
      category: 'monthly_2_under',
      ipv6: true,
      ssdStorage: true,
      isHot: false
    },
    {
      id: 3,
      productName: 'Free Trial VPS',
      providerName: 'Oracle Cloud',
      cpu: '1 OCPU',
      memory: '1GB',
      storage: '50GB',
      bandwidth: '10TB',
      location: '首尔',
      price: 0,
      originalPrice: 0,
      discount: 0,
      status: 'active',
      views: 3456,
      clicks: 567,
      category: 'free_vps',
      ipv6: true,
      ssdStorage: true,
      isHot: true
    },
    {
      id: 4,
      productName: 'High Performance VDS',
      providerName: 'Hetzner',
      cpu: '4 vCPU',
      memory: '8GB',
      storage: '80GB NVMe',
      bandwidth: '20TB',
      location: '德国',
      price: 24.99,
      originalPrice: 35.99,
      discount: 30,
      status: 'active',
      views: 678,
      clicks: 123,
      category: 'vds',
      ipv6: true,
      ddosProtection: true,
      ssdStorage: true,
      isHot: false
    },
    {
      id: 5,
      productName: 'NAT VPS Starter',
      providerName: 'MicroLXC',
      cpu: '1 vCPU',
      memory: '512MB',
      storage: '10GB',
      bandwidth: '1TB',
      location: '香港',
      price: 1.99,
      originalPrice: 2.99,
      discount: 33,
      status: 'sold_out',
      views: 456,
      clicks: 89,
      category: 'nat_openvz',
      ipv6: false,
      ssdStorage: false,
      isHot: false
    }
  ]
  
  // 过滤功能
  let filteredData = [...mockData]
  
  // 搜索过滤
  if (query.search) {
    const searchTerm = query.search.toString().toLowerCase()
    filteredData = filteredData.filter(vps => 
      vps.productName.toLowerCase().includes(searchTerm) ||
      vps.providerName.toLowerCase().includes(searchTerm)
    )
  }
  
  // 分类过滤
  if (query.category) {
    filteredData = filteredData.filter(vps => vps.category === query.category)
  }
  
  // 状态过滤
  if (query.status) {
    filteredData = filteredData.filter(vps => vps.status === query.status)
  }
  
  // 排序
  if (query.sort) {
    switch (query.sort) {
      case 'created_desc':
        filteredData.sort((a, b) => b.id - a.id)
        break
      case 'created_asc':
        filteredData.sort((a, b) => a.id - b.id)
        break
      case 'price_asc':
        filteredData.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filteredData.sort((a, b) => b.price - a.price)
        break
      case 'views_desc':
        filteredData.sort((a, b) => b.views - a.views)
        break
    }
  }
  
  // 分页
  const total = filteredData.length
  const paginatedData = filteredData.slice(offset, offset + limit)
  
  return {
    data: {
      items: paginatedData,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  }
})