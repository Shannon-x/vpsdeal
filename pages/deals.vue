<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Page Header -->
    <section class="relative py-20 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
      </div>
      
      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl">
          <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            全部VPS优惠
          </h1>
          <p class="text-xl text-gray-400 mb-8">
            发现最新、最优惠的VPS方案，实时更新，价格透明
          </p>
          
          <!-- Filter Tags -->
          <div class="flex flex-wrap gap-3">
            <button
              v-for="filter in quickFilters"
              :key="filter.key"
              @click="activeFilter = filter.key"
              :class="[
                'px-4 py-2 rounded-full border transition-all duration-200',
                activeFilter === filter.key
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-gray-700 text-gray-300 hover:border-primary-500 hover:text-white'
              ]"
            >
              <Icon :name="filter.icon" class="w-4 h-4 inline mr-2" />
              {{ filter.name }}
              <span class="ml-2 text-sm opacity-70">({{ filter.count }})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Filters Section -->
    <section class="container mx-auto px-4 mb-8">
      <div class="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Price Range -->
          <div>
            <label class="text-sm text-gray-400 font-medium mb-2 block">价格范围</label>
            <select v-model="filters.priceRange" class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-500 focus:outline-none">
              <option value="">所有价格</option>
              <option value="under5">$5/月以下</option>
              <option value="5to10">$5-10/月</option>
              <option value="10to20">$10-20/月</option>
              <option value="over20">$20/月以上</option>
            </select>
          </div>
          
          <!-- Location -->
          <div>
            <label class="text-sm text-gray-400 font-medium mb-2 block">服务器位置</label>
            <select v-model="filters.location" class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-500 focus:outline-none">
              <option value="">所有位置</option>
              <option value="usa">美国</option>
              <option value="hk">香港</option>
              <option value="sg">新加坡</option>
              <option value="jp">日本</option>
              <option value="eu">欧洲</option>
            </select>
          </div>
          
          <!-- Memory -->
          <div>
            <label class="text-sm text-gray-400 font-medium mb-2 block">内存大小</label>
            <select v-model="filters.memory" class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-500 focus:outline-none">
              <option value="">所有配置</option>
              <option value="1gb">1GB</option>
              <option value="2gb">2GB</option>
              <option value="4gb">4GB</option>
              <option value="8gb">8GB+</option>
            </select>
          </div>
          
          <!-- Sort -->
          <div>
            <label class="text-sm text-gray-400 font-medium mb-2 block">排序方式</label>
            <select v-model="filters.sort" class="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-500 focus:outline-none">
              <option value="price_asc">价格从低到高</option>
              <option value="price_desc">价格从高到低</option>
              <option value="discount">折扣最大</option>
              <option value="popular">最受欢迎</option>
              <option value="newest">最新上架</option>
            </select>
          </div>
        </div>
        
        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-3">
          <span class="text-sm text-gray-400">当前筛选：</span>
          <div class="flex flex-wrap gap-2">
            <span v-for="(value, key) in activeFiltersDisplay" :key="key"
                  class="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm flex items-center gap-2">
              {{ value }}
              <button @click="clearFilter(key)" class="hover:text-white">
                <Icon name="ph:x-bold" class="w-3 h-3" />
              </button>
            </span>
            <button @click="clearAllFilters" class="text-sm text-gray-400 hover:text-white">
              清除所有
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- VPS Grid -->
    <section class="container mx-auto px-4 pb-20">
      <!-- Results Count -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-400">
          找到 <span class="text-white font-semibold">{{ filteredVpsList.length }}</span> 个优惠方案
        </p>
        
        <!-- View Toggle -->
        <div class="flex items-center gap-2">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
            ]"
          >
            <Icon name="ph:grid-four-bold" class="w-5 h-5" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'
            ]"
          >
            <Icon name="ph:list-bold" class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="flex items-center gap-3">
          <Icon name="svg-spinners:3-dots-scale" class="w-12 h-12 text-primary-500" />
          <span class="text-gray-400">加载中...</span>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredVpsList.length === 0" class="text-center py-20">
        <Icon name="ph:package-bold" class="w-24 h-24 text-gray-700 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">没有找到符合条件的VPS</h3>
        <p class="text-gray-400 mb-6">尝试调整筛选条件或清除过滤器</p>
        <button @click="clearAllFilters" class="px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors">
          清除所有筛选
        </button>
      </div>
      
      <!-- VPS Grid/List -->
      <div v-else :class="[
        'grid gap-6',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      ]">
        <PremiumVpsCard
          v-for="vps in paginatedVpsList"
          :key="vps.id"
          :vps="vps"
          @view-details="viewDetails"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <div class="flex items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ph:caret-left-bold" class="w-5 h-5" />
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg transition-colors',
              currentPage === page
                ? 'bg-primary-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ph:caret-right-bold" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// SEO Meta
useHead({
  title: '全部VPS优惠 - VPS Deals',
  meta: [
    { name: 'description', content: '浏览所有VPS优惠方案，支持按价格、位置、配置等条件筛选，找到最适合您的VPS服务器' }
  ]
})

// State
const loading = ref(false)
const vpsList = ref([])
const activeFilter = ref('all')
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = 12

// Filters
const filters = ref({
  priceRange: '',
  location: '',
  memory: '',
  sort: 'price_asc'
})

// Quick Filters
const quickFilters = ref([
  { key: 'all', name: '全部', icon: 'ph:squares-four-bold', count: 256 },
  { key: 'hot', name: '热门推荐', icon: 'ph:fire-bold', count: 42 },
  { key: 'new', name: '最新上架', icon: 'ph:sparkle-bold', count: 18 },
  { key: 'discount', name: '限时优惠', icon: 'ph:percent-bold', count: 35 },
  { key: 'budget', name: '预算方案', icon: 'ph:piggy-bank-bold', count: 68 }
])

// Get URL params
const route = useRoute()
const router = useRouter()

// Initialize filters from URL
onMounted(() => {
  if (route.query.category) {
    activeFilter.value = route.query.category
  }
  loadVpsList()
})

// Load VPS List
const loadVpsList = async () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    vpsList.value = generateMockVpsList()
    loading.value = false
  }, 500)
}

// Generate Mock Data
const generateMockVpsList = () => {
  const providers = ['CloudProvider Pro', 'HostingPro', 'ValueHost', 'RackNerd', 'Vultr', 'Contabo', 'DigitalOcean', 'Linode', 'Hetzner']
  const locations = ['洛杉矶', '纽约', '伦敦', '法兰克福', '新加坡', '东京', '香港']
  const planTypes = [
    { name: 'KVM VPS - 1GB RAM', cpu: '1 vCPU', memory: '1GB', storage: '20GB SSD' },
    { name: 'KVM VPS - 2GB RAM', cpu: '2 vCPU', memory: '2GB', storage: '40GB SSD' },
    { name: 'Premium VPS - 4GB RAM', cpu: '4 vCPU', memory: '4GB', storage: '80GB NVMe' },
    { name: 'Enterprise VPS - 8GB RAM', cpu: '8 vCPU', memory: '8GB', storage: '160GB NVMe' },
    { name: 'Budget VPS - 512MB RAM', cpu: '1 vCPU', memory: '512MB', storage: '10GB SSD' },
    { name: 'Standard VPS - 3GB RAM', cpu: '3 vCPU', memory: '3GB', storage: '60GB SSD' }
  ]
  
  return Array.from({ length: 50 }, (_, i) => {
    const plan = planTypes[Math.floor(Math.random() * planTypes.length)]
    const price = Number((Math.random() * 50 + 2).toFixed(2))
    const originalPrice = price + Number((Math.random() * 30 + 10).toFixed(2))
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100)
    
    return {
      id: i + 1,
      productName: plan.name,
      providerName: providers[Math.floor(Math.random() * providers.length)],
      cpu: plan.cpu,
      memory: plan.memory,
      storage: plan.storage,
      bandwidth: `${Math.floor(Math.random() * 5) + 1}TB`,
      location: locations[Math.floor(Math.random() * locations.length)],
      price: price,
      originalPrice: originalPrice,
      discount: discount > 0 ? discount : 0,
      affiliateLink: '#',
      pricePeriod: 'monthly',
      isHot: Math.random() > 0.8,
      ipv6: Math.random() > 0.5,
      ddosProtection: Math.random() > 0.6,
      ssdStorage: true,
      rating: Number((Math.random() * 1 + 4).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 50
    }
  })
}

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.priceRange || filters.value.location || filters.value.memory
})

const activeFiltersDisplay = computed(() => {
  const display = {}
  if (filters.value.priceRange) display.priceRange = getPriceRangeLabel(filters.value.priceRange)
  if (filters.value.location) display.location = getLocationLabel(filters.value.location)
  if (filters.value.memory) display.memory = `内存: ${filters.value.memory.toUpperCase()}`
  return display
})

const filteredVpsList = computed(() => {
  let list = [...vpsList.value]
  
  // Apply quick filter
  if (activeFilter.value !== 'all') {
    // Filter logic based on activeFilter
  }
  
  // Apply price filter
  if (filters.value.priceRange) {
    // Price filter logic
  }
  
  // Apply location filter
  if (filters.value.location) {
    // Location filter logic
  }
  
  // Apply memory filter
  if (filters.value.memory) {
    // Memory filter logic
  }
  
  // Apply sorting
  switch (filters.value.sort) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'discount':
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0))
      break
    case 'popular':
      list.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'newest':
      // Sort by ID descending (mock newest)
      list.sort((a, b) => b.id - a.id)
      break
  }
  
  return list
})

const totalPages = computed(() => Math.ceil(filteredVpsList.value.length / itemsPerPage))

const paginatedVpsList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredVpsList.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...', total)
    }
  }
  
  return pages.filter(p => p !== '...')
})

// Methods
const clearFilter = (key: string) => {
  filters.value[key] = ''
}

const clearAllFilters = () => {
  filters.value = {
    priceRange: '',
    location: '',
    memory: '',
    sort: 'price_asc'
  }
  activeFilter.value = 'all'
}

const viewDetails = (vps: any) => {
  navigateTo(`/vps/${vps.id}`)
}

const getPriceRangeLabel = (range: string) => {
  const labels = {
    'under5': '$5/月以下',
    '5to10': '$5-10/月',
    '10to20': '$10-20/月',
    'over20': '$20/月以上'
  }
  return labels[range] || range
}

const getLocationLabel = (location: string) => {
  const labels = {
    'usa': '美国',
    'hk': '香港',
    'sg': '新加坡',
    'jp': '日本',
    'eu': '欧洲'
  }
  return labels[location] || location
}

// Watch for filter changes
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>