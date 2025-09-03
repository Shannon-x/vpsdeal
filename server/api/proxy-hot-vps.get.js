// Proxy to backend API
export default defineEventHandler(async (event) => {
  try {
    // Call the backend API
    const response = await $fetch('http://vps_backend:3001/api/vps', {
      query: {
        limit: 10,
        isHot: true
      }
    })
    
    // Transform the response to match frontend expectations
    if (Array.isArray(response)) {
      return response.map(vps => ({
        id: vps.id,
        productName: vps.product_name || vps.productName,
        providerName: vps.provider_name || vps.providerName,
        cpu: vps.cpu,
        memory: vps.memory,
        storage: vps.storage,
        bandwidth: vps.bandwidth,
        location: vps.location,
        price: parseFloat(vps.price),
        originalPrice: vps.original_price ? parseFloat(vps.original_price) : null,
        discount: vps.discount || 0,
        affiliateLink: vps.affiliate_link || vps.affiliateLink,
        pricePeriod: vps.price_period || vps.pricePeriod || 'monthly',
        isHot: vps.is_hot || vps.isHot || false,
        ipv6: vps.ipv6 || false,
        ddosProtection: vps.ddos_protection || vps.ddosProtection || false,
        ssdStorage: vps.ssd_storage || vps.ssdStorage || true,
        rating: vps.rating || 4.5,
        reviewCount: vps.review_count || vps.reviewCount || 0
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching hot VPS from backend:', error)
    
    // Return fallback data
    return [
      {
        id: 1,
        productName: 'KVM VPS - 2GB RAM 特惠版',
        providerName: 'CloudProvider Pro',
        cpu: '2 vCPU',
        memory: '2GB',
        storage: '40GB SSD',
        bandwidth: '2TB',
        location: '香港',
        price: 4.99,
        originalPrice: 9.99,
        discount: 50,
        affiliateLink: 'https://example.com/deal1',
        pricePeriod: 'monthly',
        isHot: true,
        ipv6: true,
        ddosProtection: true,
        ssdStorage: true,
        rating: 4.5,
        reviewCount: 128
      },
      {
        id: 2,
        productName: 'Premium VPS - 4GB RAM',
        providerName: 'HostingPro',
        cpu: '4 vCPU',
        memory: '4GB',
        storage: '80GB NVMe',
        bandwidth: '4TB',
        location: '新加坡',
        price: 12.99,
        originalPrice: 19.99,
        discount: 35,
        affiliateLink: 'https://example.com/deal2',
        pricePeriod: 'monthly',
        isHot: true,
        ipv6: true,
        ddosProtection: true,
        ssdStorage: true,
        rating: 4.8,
        reviewCount: 256
      }
    ]
  }
})