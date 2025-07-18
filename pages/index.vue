<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-purple/10"></div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float animation-delay-400"></div>
      
      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6">
          <span class="gradient-text-animated">发现超值</span>
          <br />
          <span class="text-gray-900 dark:text-white">VPS优惠方案</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          精选全球高性价比VPS服务商，为您提供最优质的云服务器解决方案
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/deals"
            class="px-8 py-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            浏览优惠
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="px-8 py-4 rounded-lg border-2 border-primary-500 text-primary-500 dark:text-primary-400 font-semibold text-lg hover:bg-primary-500 hover:text-white transition-all duration-200"
          >
            分类查看
          </NuxtLink>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ph:arrow-down-bold" class="w-6 h-6 text-gray-400" />
      </div>
    </section>

    <!-- Stats Section (Bento Grid) -->
    <section class="container mx-auto px-4 py-20">
      <div class="bento-grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <!-- Total Deals -->
        <div class="bento-item glass col-span-1 md:col-span-2 lg:col-span-1 group">
          <div class="flex items-center justify-between mb-4">
            <Icon name="ph:tag-bold" class="w-12 h-12 text-primary-500 group-hover:animate-pulse" />
            <span class="text-4xl font-display font-bold gradient-text">{{ stats.totalDeals }}+</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">优惠方案</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">精选全球VPS优惠</p>
        </div>
        
        <!-- Providers -->
        <div class="bento-item glass col-span-1 group">
          <div class="flex items-center justify-between mb-4">
            <Icon name="ph:buildings-bold" class="w-12 h-12 text-accent-purple group-hover:animate-pulse" />
            <span class="text-4xl font-display font-bold gradient-text">{{ stats.providers }}+</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">服务商</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">优质供应商</p>
        </div>
        
        <!-- Countries -->
        <div class="bento-item glass col-span-1 group">
          <div class="flex items-center justify-between mb-4">
            <Icon name="ph:globe-bold" class="w-12 h-12 text-accent-orange group-hover:animate-pulse" />
            <span class="text-4xl font-display font-bold gradient-text">{{ stats.countries }}+</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">国家地区</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">全球覆盖</p>
        </div>
        
        <!-- Users -->
        <div class="bento-item glass col-span-1 md:col-span-3 lg:col-span-1 group">
          <div class="flex items-center justify-between mb-4">
            <Icon name="ph:users-bold" class="w-12 h-12 text-accent-pink group-hover:animate-pulse" />
            <span class="text-4xl font-display font-bold gradient-text">{{ stats.users }}+</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">活跃用户</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">信任我们的选择</p>
        </div>
      </div>
    </section>

    <!-- Featured Deals -->
    <section class="container mx-auto px-4 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-display font-bold mb-4">
          <span class="gradient-text-animated">热门推荐</span>
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          本周最受欢迎的VPS优惠方案
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VpsCard
          v-for="vps in featuredDeals"
          :key="vps.id"
          :vps="vps"
          @view-details="viewDetails"
        />
      </div>
      
      <div class="text-center mt-12">
        <NuxtLink
          to="/deals"
          class="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200 font-semibold"
        >
          <span>查看全部优惠</span>
          <Icon name="ph:arrow-right-bold" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center group">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Icon name="ph:lightning-bold" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-3">实时更新</h3>
          <p class="text-gray-600 dark:text-gray-400">
            24小时监控价格变化，第一时间推送最新优惠
          </p>
        </div>
        
        <div class="text-center group">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Icon name="ph:shield-check-bold" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-3">严格筛选</h3>
          <p class="text-gray-600 dark:text-gray-400">
            只推荐信誉良好、服务稳定的VPS服务商
          </p>
        </div>
        
        <div class="text-center group">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-orange to-red-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <Icon name="ph:chart-line-up-bold" class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-3">性价比优先</h3>
          <p class="text-gray-600 dark:text-gray-400">
            专注于高性价比方案，让每一分钱都物有所值
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: '首页 - VPS Deals 超值VPS优惠推荐',
  meta: [
    { name: 'description', content: '发现全球最优惠的VPS主机方案，包括香港、美国、日本等地的高性价比云服务器' },
    { name: 'keywords', content: 'VPS优惠, 便宜VPS, VPS推荐, 云服务器, 香港VPS, 美国VPS' }
  ]
})

// Mock data - replace with API calls
const stats = ref({
  totalDeals: 120,
  providers: 35,
  countries: 15,
  users: 5000
})

const featuredDeals = ref([
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
    affiliateLink: 'https://example.com/deal1'
  },
  {
    id: 2,
    productName: 'Premium VPS - 4GB 高性能',
    providerName: 'SpeedHost Asia',
    cpu: '4 vCPU',
    memory: '4GB',
    storage: '80GB NVMe',
    bandwidth: '5TB',
    location: '新加坡',
    price: 12.99,
    originalPrice: 19.99,
    discount: 35,
    affiliateLink: 'https://example.com/deal2'
  },
  {
    id: 3,
    productName: 'Budget VPS 入门方案',
    providerName: 'ValueServers',
    cpu: '1 vCPU',
    memory: '1GB',
    storage: '20GB SSD',
    bandwidth: '1TB',
    location: '洛杉矶',
    price: 2.99,
    originalPrice: 4.99,
    discount: 40,
    affiliateLink: 'https://example.com/deal3'
  }
])

const viewDetails = (vps: any) => {
  // Navigate to details page or show modal
  navigateTo(`/vps/${vps.id}`)
}
</script>