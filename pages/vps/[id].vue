<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Structured Data -->
    <StructuredData type="product" :data="vps" />
    <StructuredData type="breadcrumb" :data="breadcrumbs" />
    
    <!-- Breadcrumb -->
    <nav class="container mx-auto px-4 py-4">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">首页</NuxtLink>
        </li>
        <li class="text-gray-600">/</li>
        <li>
          <NuxtLink to="/deals" class="text-gray-400 hover:text-white transition-colors">VPS优惠</NuxtLink>
        </li>
        <li class="text-gray-600">/</li>
        <li class="text-white">{{ vps?.productName }}</li>
      </ol>
    </nav>
    
    <!-- Product Details -->
    <section class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="ph:spinner" class="w-8 h-8 text-gray-400 animate-spin" />
      </div>
      
      <div v-else-if="!vps" class="text-center py-12">
        <Icon name="ph:warning" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400">VPS产品不存在</p>
        <NuxtLink to="/deals" class="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          返回VPS列表
        </NuxtLink>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Product Header -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">{{ vps.productName }}</h1>
                <div class="flex items-center gap-4 text-gray-400">
                  <span class="flex items-center gap-1">
                    <Icon name="ph:building" class="w-4 h-4" />
                    {{ vps.providerName }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="ph:map-pin" class="w-4 h-4" />
                    {{ vps.location }}
                  </span>
                </div>
              </div>
              
              <div v-if="vps.discount > 0" class="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg">
                <span class="text-2xl font-bold">-{{ vps.discount }}%</span>
              </div>
            </div>
            
            <!-- Rating -->
            <div v-if="vps.rating" class="flex items-center gap-4 mb-6">
              <div class="flex items-center">
                <Icon v-for="i in 5" :key="i" 
                      :name="i <= Math.floor(vps.rating) ? 'ph:star-fill' : 'ph:star'" 
                      class="w-5 h-5 text-yellow-400" />
              </div>
              <span class="text-white font-medium">{{ vps.rating }}/5</span>
              <span class="text-gray-400">({{ vps.reviewCount }} 评价)</span>
            </div>
            
            <!-- Specifications -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-800/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ph:cpu" class="w-5 h-5 text-primary-400" />
                  <span class="text-gray-400 text-sm">处理器</span>
                </div>
                <p class="text-white font-medium">{{ vps.cpu }}</p>
              </div>
              
              <div class="bg-gray-800/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ph:memory" class="w-5 h-5 text-purple-400" />
                  <span class="text-gray-400 text-sm">内存</span>
                </div>
                <p class="text-white font-medium">{{ vps.memory }}</p>
              </div>
              
              <div class="bg-gray-800/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ph:hard-drive" class="w-5 h-5 text-orange-400" />
                  <span class="text-gray-400 text-sm">存储空间</span>
                </div>
                <p class="text-white font-medium">{{ vps.storage }}</p>
              </div>
              
              <div class="bg-gray-800/50 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="ph:wifi-high" class="w-5 h-5 text-cyan-400" />
                  <span class="text-gray-400 text-sm">月流量</span>
                </div>
                <p class="text-white font-medium">{{ vps.bandwidth }}</p>
              </div>
            </div>
            
            <!-- Additional Features -->
            <div class="space-y-3">
              <h3 class="text-lg font-medium text-white mb-3">产品特性</h3>
              <div class="flex flex-wrap gap-2">
                <span v-if="vps.ipv6" class="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm">
                  <Icon name="ph:wifi" class="w-4 h-4 inline mr-1" />
                  IPv6支持
                </span>
                <span v-if="vps.ddosProtection" class="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
                  <Icon name="ph:shield-check" class="w-4 h-4 inline mr-1" />
                  DDoS防护
                </span>
                <span v-if="vps.ssdStorage" class="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm">
                  <Icon name="ph:lightning" class="w-4 h-4 inline mr-1" />
                  SSD存储
                </span>
                <span v-if="vps.portSpeed" class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-sm">
                  <Icon name="ph:gauge" class="w-4 h-4 inline mr-1" />
                  {{ vps.portSpeed }}
                </span>
                <span v-if="vps.virtualization" class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-sm">
                  <Icon name="ph:cube" class="w-4 h-4 inline mr-1" />
                  {{ vps.virtualization }}
                </span>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="vps.description" class="mt-6 pt-6 border-t border-gray-800">
              <h3 class="text-lg font-medium text-white mb-3">产品描述</h3>
              <p class="text-gray-400 leading-relaxed">{{ vps.description }}</p>
            </div>
          </div>
          
          <!-- Related Products -->
          <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 class="text-2xl font-bold text-white mb-6">相关推荐</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="related in relatedProducts" :key="related.id" 
                   class="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800 transition-colors cursor-pointer"
                   @click="navigateTo(`/vps/${related.id}`)">
                <h4 class="text-white font-medium mb-1">{{ related.productName }}</h4>
                <p class="text-gray-400 text-sm mb-2">{{ related.providerName }}</p>
                <p class="text-xl font-bold text-primary-400">${{ related.price }}/年</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Price Card -->
          <div class="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-4">
            <div class="text-center mb-6">
              <p v-if="vps.originalPrice" class="text-gray-500 line-through text-lg mb-1">
                ${{ vps.originalPrice }}/年
              </p>
              <p class="text-4xl font-bold text-white mb-1">
                ${{ vps.price }}
              </p>
              <p class="text-gray-400">每年</p>
            </div>
            
            <a :href="vps.affiliateLink" 
               target="_blank" 
               rel="noopener noreferrer nofollow"
               class="block w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-center font-medium rounded-xl hover:from-primary-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-4">
              立即购买
              <Icon name="ph:arrow-up-right" class="w-4 h-4 inline ml-1" />
            </a>
            
            <p class="text-xs text-gray-500 text-center mb-4">
              * 点击后将跳转到商家官网
            </p>
            
            <!-- Share Buttons -->
            <div class="flex items-center justify-center gap-2 pt-4 border-t border-gray-800">
              <button @click="shareProduct('twitter')" class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Icon name="mdi:twitter" class="w-5 h-5 text-gray-400" />
              </button>
              <button @click="shareProduct('facebook')" class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Icon name="mdi:facebook" class="w-5 h-5 text-gray-400" />
              </button>
              <button @click="copyLink" class="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Icon name="ph:link" class="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// SEO Meta
const vps = ref(null)
const loading = ref(false)
const relatedProducts = ref([])

// 面包屑数据
const breadcrumbs = [
  { name: '首页', url: '/' },
  { name: 'VPS优惠', url: '/deals' },
  { name: vps.value?.productName || 'VPS详情', url: `/vps/${route.params.id}` }
]

// 获取VPS详情
const fetchVpsDetails = async () => {
  loading.value = true
  try {
    // 模拟API请求（实际应从API获取）
    const mockData = {
      id: route.params.id,
      productName: 'Premium KVM VPS',
      providerName: 'RackNerd',
      cpu: '2 vCPU (Intel/AMD)',
      memory: '2GB DDR4',
      storage: '30GB NVMe SSD',
      bandwidth: '3TB',
      location: '洛杉矶',
      price: 11.88,
      originalPrice: 23.88,
      discount: 50,
      affiliateLink: '#',
      isHot: true,
      ipv6: true,
      ddosProtection: true,
      ssdStorage: true,
      portSpeed: '1Gbps',
      virtualization: 'KVM',
      description: '高性能KVM VPS，采用最新AMD EPYC处理器，NVMe SSD存储，提供稳定可靠的云计算服务。适合网站托管、应用部署等多种用途。',
      rating: 4.8,
      reviewCount: 234
    }
    
    vps.value = mockData
    
    // 获取相关产品
    relatedProducts.value = [
      { id: 2, productName: 'Budget VPS', providerName: 'Vultr', price: 2.50 },
      { id: 3, productName: 'Free Trial VPS', providerName: 'Oracle Cloud', price: 0 }
    ]
    
    // 设置页面SEO
    useHead({
      title: `${mockData.productName} - ${mockData.providerName} | VPS Deals`,
      meta: [
        { name: 'description', content: `${mockData.productName} - ${mockData.cpu} • ${mockData.memory} • ${mockData.storage} • ${mockData.bandwidth} • $${mockData.price}/年` },
        { name: 'keywords', content: `${mockData.providerName}, ${mockData.productName}, VPS, 云服务器, ${mockData.location}` },
        { property: 'og:title', content: `${mockData.productName} - ${mockData.providerName}` },
        { property: 'og:description', content: mockData.description },
        { property: 'og:type', content: 'product' },
        { property: 'product:price:amount', content: mockData.price },
        { property: 'product:price:currency', content: 'USD' }
      ]
    })
  } catch (error) {
    console.error('Failed to fetch VPS details:', error)
  } finally {
    loading.value = false
  }
}

// 分享功能
const shareProduct = (platform: string) => {
  const url = window.location.href
  const text = `${vps.value?.productName} - 仅需$${vps.value?.price}/年！`
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  }
  
  window.open(shareUrls[platform], '_blank', 'width=600,height=400')
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  // 显示复制成功提示
}

// 初始化
onMounted(() => {
  fetchVpsDetails()
})
</script>