<template>
  <div class="p-6">
    <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">总VPS数</p>
              <p class="text-2xl font-bold text-white">{{ stats.totalVps || 0 }}</p>
            </div>
            <Icon name="ph:desktop-tower-bold" class="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">分类数</p>
              <p class="text-2xl font-bold text-white">{{ stats.totalCategories || 0 }}</p>
            </div>
            <Icon name="ph:folders-bold" class="w-8 h-8 text-accent-purple" />
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">今日浏览</p>
              <p class="text-2xl font-bold text-white">{{ stats.todayViews || 0 }}</p>
            </div>
            <Icon name="ph:eye-bold" class="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">总浏览量</p>
              <p class="text-2xl font-bold text-white">{{ stats.totalViews || 0 }}</p>
            </div>
            <Icon name="ph:chart-line-bold" class="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-white mb-4">快速操作</h2>
          <div class="space-y-3">
            <NuxtLink to="/admin/vps/create" class="block px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-center">
              添加新VPS优惠
            </NuxtLink>
            <NuxtLink to="/admin/vps" class="block px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-center">
              管理VPS列表
            </NuxtLink>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-white mb-4">最新VPS</h2>
          <div v-if="latestVps.length > 0" class="space-y-2">
            <div v-for="vps in latestVps" :key="vps.id" class="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
              <span class="text-white">{{ vps.product_name }}</span>
              <span class="text-primary-500 font-semibold">${{ vps.price }}</span>
            </div>
          </div>
          <p v-else class="text-gray-400">暂无VPS数据</p>
        </div>
      </div>
  </div>
</template>

<script setup>
// 需要登录验证
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

useHead({
  title: '管理后台 - VPS Deals',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const config = useRuntimeConfig()
const router = useRouter()

const stats = ref({})
const latestVps = ref([])

// 获取统计数据
const fetchStats = async () => {
  try {
    const token = useCookie('admin-token')
    const data = await $fetch(`${config.public.apiBase}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    stats.value = data
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

// 获取最新VPS
const fetchLatestVps = async () => {
  try {
    const token = useCookie('admin-token')
    const { data } = await $fetch(`${config.public.apiBase}/api/admin/vps?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    latestVps.value = data || []
  } catch (err) {
    console.error('Failed to fetch latest VPS:', err)
  }
}

// 退出登录
const handleLogout = () => {
  const token = useCookie('admin-token')
  token.value = null
  navigateTo('/admin')
}

// 初始化数据
onMounted(() => {
  fetchStats()
  fetchLatestVps()
})
</script>