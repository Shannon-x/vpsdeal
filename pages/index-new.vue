<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Hero Section with Advanced Animation -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <!-- Gradient Mesh -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        <!-- Animated Orbs -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse animation-delay-400"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px] animate-pulse animation-delay-800"></div>
        
        <!-- Grid Pattern -->
        <div class="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      </div>
      
      <!-- Hero Content -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-5xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span class="text-primary-400 text-sm font-medium">实时更新全球VPS优惠</span>
          </div>
          
          <!-- Main Title -->
          <h1 class="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 animate-gradient-x">
              最优惠的VPS
            </span>
            <br />
            <span class="text-white">
              一站式推荐平台
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            精选全球高性价比VPS服务器，涵盖免费试用、超低价年付、高配置等多种方案，助您找到最适合的云服务器
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button @click="scrollToCategories"
                    class="group relative px-8 py-4 rounded-2xl overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 transition-transform duration-300 group-hover:scale-110"></div>
              <span class="relative text-white font-semibold text-lg flex items-center justify-center gap-2">
                浏览分类
                <Icon name="ph:arrow-down-bold" class="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
            
            <NuxtLink to="/deals"
                      class="group px-8 py-4 rounded-2xl border-2 border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white transition-all duration-300 font-semibold text-lg inline-flex items-center justify-center gap-2">
              查看全部优惠
              <Icon name="ph:arrow-right-bold" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
          
          <!-- Live Stats -->
          <div class="flex flex-wrap justify-center gap-8">
            <div class="text-center">
              <p class="text-3xl font-bold text-white mb-1">{{ animatedStats.deals }}+</p>
              <p class="text-sm text-gray-400">活跃优惠</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-white mb-1">{{ animatedStats.providers }}+</p>
              <p class="text-sm text-gray-400">优质商家</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-white mb-1">{{ animatedStats.countries }}+</p>
              <p class="text-sm text-gray-400">覆盖国家</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-white mb-1">{{ animatedStats.users }}+</p>
              <p class="text-sm text-gray-400">活跃用户</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div class="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center p-2">
          <div class="w-1 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
    
    <!-- Price Categories Section -->
    <section id="categories" class="container mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          按价格分类浏览
        </h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          根据您的预算快速找到最合适的VPS方案
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Price Categories -->
        <PriceCategory
          title="年付15美元以下"
          description="超低价入门方案，适合个人博客和轻量应用"
          icon="ph:piggy-bank-bold"
          :count="priceCategories.under15"
          gradient="budget"
          category="price_under_15"
        />
        
        <PriceCategory
          title="年付25美元以下"
          description="高性价比选择，满足大部分网站需求"
          icon="ph:wallet-bold"
          :count="priceCategories.under25"
          gradient="value"
          category="price_under_25"
        />
        
        <PriceCategory
          title="月付2美元以下"
          description="月付灵活方案，短期项目首选"
          icon="ph:coins-bold"
          :count="priceCategories.monthly2"
          gradient="premium"
          category="price_monthly_2"
        />
        
        <PriceCategory
          title="免��VPS"
          description="免费试用和永久免费方案"
          icon="ph:gift-bold"
          :count="priceCategories.free"
          gradient="free"
          category="free_vps"
        />
        
        <PriceCategory
          title="VDS服务器"
          description="虚拟独立服务器，性能更强"
          icon="ph:database-duotone"
          :count="priceCategories.vds"
          gradient="vds"
          category="vds"
        />
        
        <PriceCategory
          title="NAT/OpenVZ"
          description="共享IP和轻量虚拟化方案"
          icon="ph:share-network-bold"
          :count="priceCategories.nat"
          gradient="nat"
          category="nat_openvz"
        />
      </div>
      
      <!-- Additional Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PriceCategory
          title="高配VPS主机"
          description="大内存、高性能配置"
          icon="ph:rocket-launch-bold"
          :count="priceCategories.highEnd"
          gradient="high-end"
          category="high_performance"
        />
        
        <PriceCategory
          title="最新活动"
          description="限时优惠和促销活动"
          icon="ph:fire-bold"
          :count="priceCategories.deals"
          gradient="deals"
          category="latest_deals"
        />
        
        <PriceCategory
          title="全部优惠"
          description="浏览所有VPS优惠方案"
          icon="ph:squares-four-bold"
          :count="priceCategories.total"
          gradient="primary"
          category="all"
        />
      </div>
    </section>
    
    <!-- Hot Deals Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
          <Icon name="ph:fire-fill" class="w-4 h-4 text-orange-400" />
          <span class="text-orange-400 text-sm font-medium">热门推荐</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          本周最火VPS优惠
        </h2>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          用户评价最高、销量最好的VPS方案
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PremiumVpsCard
          v-for="vps in hotDeals"
          :key="vps.id"
          :vps="vps"
          @view-details="viewDetails"
        />
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-20 bg-gray-900/50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
              <Icon name="ph:shield-check-fill" class="w-8 h-8 text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">严格筛选</h3>
            <p class="text-gray-400 text-sm">只推荐信誉良好的服务商</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
              <Icon name="ph:lightning-fill" class="w-8 h-8 text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">实时更新</h3>
            <p class="text-gray-400 text-sm">24小时监控价格变化</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center">
              <Icon name="ph:chart-line-up-fill" class="w-8 h-8 text-pink-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">性价比优先</h3>
            <p class="text-gray-400 text-sm">专注高性价比方案</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
              <Icon name="ph:users-three-fill" class="w-8 h-8 text-orange-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">用户推荐</h3>
            <p class="text-gray-400 text-sm">基于真实用户反馈</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// SEO Meta
useHead({
  title: 'VPS优惠推荐 - 全球高性价比VPS一站式平台',
  meta: [
    { name: 'description', content: '精选全球最优惠的VPS主机方案，包括免费VPS、年付15美元以下、月付2美元以下等各类高性价比云服务器推荐' },
    { name: 'keywords', content: 'VPS优惠, 便宜VPS, 免费VPS, VPS推荐, 年付VPS, 月付VPS, VDS服务器, NAT VPS' }
  ]
})

// Animated Stats
const animatedStats = ref({
  deals: 0,
  providers: 0,
  countries: 0,
  users: 0
})

const targetStats = {
  deals: 256,
  providers: 48,
  countries: 23,
  users: 8500
}

// Price Categories Count
const priceCategories = ref({
  under15: 42,
  under25: 68,
  monthly2: 35,
  free: 12,
  vds: 28,
  nat: 19,
  highEnd: 45,
  deals: 31,
  total: 256
})

// Hot Deals
const hotDeals = ref([
  {
    id: 1,
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
    rating: 4.8,
    reviewCount: 234
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
    affiliateLink: '#',
    ipv6: true,
    ssdStorage: true,
    rating: 4.5,
    reviewCount: 189
  },
  {
    id: 3,
    productName: 'High Memory VPS',
    providerName: 'Contabo',
    cpu: '4 vCPU',
    memory: '8GB',
    storage: '200GB SSD',
    bandwidth: '32TB',
    location: '德国',
    price: 6.99,
    originalPrice: 9.99,
    discount: 30,
    affiliateLink: '#',
    isHot: true,
    ddosProtection: true,
    ssdStorage: true,
    rating: 4.6,
    reviewCount: 412
  }
])

// Animate stats on mount
onMounted(() => {
  const duration = 2000
  const steps = 60
  const interval = duration / steps
  
  const increments = {
    deals: targetStats.deals / steps,
    providers: targetStats.providers / steps,
    countries: targetStats.countries / steps,
    users: targetStats.users / steps
  }
  
  let step = 0
  const timer = setInterval(() => {
    step++
    animatedStats.value = {
      deals: Math.round(increments.deals * step),
      providers: Math.round(increments.providers * step),
      countries: Math.round(increments.countries * step),
      users: Math.round(increments.users * step)
    }
    
    if (step >= steps) {
      clearInterval(timer)
      animatedStats.value = targetStats
    }
  }, interval)
})

// Scroll to categories
const scrollToCategories = () => {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
}

// View VPS details
const viewDetails = (vps: any) => {
  navigateTo(`/vps/${vps.id}`)
}
</script>

<style scoped>
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 4s ease infinite;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-800 {
  animation-delay: 800ms;
}
</style>