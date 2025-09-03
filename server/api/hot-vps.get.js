// Nuxt 3 API route
export default defineEventHandler(() => {
  // Return static VPS data for now
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
    },
    {
      id: 3,
      productName: 'Budget VPS - 1GB RAM',
      providerName: 'ValueHost',
      cpu: '1 vCPU',
      memory: '1GB',
      storage: '20GB SSD',
      bandwidth: '1TB',
      location: '洛杉矶',
      price: 2.99,
      originalPrice: 4.99,
      discount: 40,
      affiliateLink: 'https://example.com/deal3',
      pricePeriod: 'monthly',
      isHot: false,
      ipv6: true,
      ddosProtection: false,
      ssdStorage: true,
      rating: 4.2,
      reviewCount: 89
    }
  ]
})