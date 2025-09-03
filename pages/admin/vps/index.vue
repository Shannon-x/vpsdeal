<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-semibold text-white">VPS管理</h1>
            <p class="mt-1 text-sm text-gray-400">管理所有VPS产品信息</p>
          </div>
          <div class="flex gap-4">
            <button @click="exportData" class="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
              <Icon name="ph:export" class="w-4 h-4 mr-2" />
              导出数据
            </button>
            <NuxtLink to="/admin/vps/create" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
              <Icon name="ph:plus" class="w-4 h-4 mr-2" />
              添加VPS
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">搜索</label>
            <input v-model="filters.search" type="text" placeholder="产品名称或提供商" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">分类</label>
            <select v-model="filters.category" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">全部分类</option>
              <option value="under_15_year">年付15美元以下</option>
              <option value="under_25_year">年付25美元以下</option>
              <option value="monthly_2_under">月付2美元以下</option>
              <option value="free_vps">免费VPS</option>
              <option value="vds">VDS服务器</option>
              <option value="nat_openvz">NAT/OpenVZ</option>
              <option value="high_performance">高配VPS</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">状态</label>
            <select v-model="filters.status" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">全部状态</option>
              <option value="active">上架中</option>
              <option value="inactive">已下架</option>
              <option value="sold_out">已售罄</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">排序</label>
            <select v-model="filters.sort" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="created_desc">最新添加</option>
              <option value="created_asc">最早添加</option>
              <option value="price_asc">价格升序</option>
              <option value="price_desc">价格降序</option>
              <option value="views_desc">浏览最多</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- VPS List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div v-if="loading" class="text-center py-12">
        <Icon name="ph:spinner" class="w-8 h-8 text-gray-400 animate-spin" />
      </div>
      
      <div v-else-if="vpsList.length === 0" class="bg-gray-800 rounded-lg p-12 text-center">
        <Icon name="ph:package" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400">暂无VPS产品</p>
        <NuxtLink to="/admin/vps/create" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
          添加第一个VPS
        </NuxtLink>
      </div>

      <div v-else class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">产品信息</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">配置</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">价格</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">数据</th>
              <th class="relative px-6 py-3"><span class="sr-only">操作</span></th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            <tr v-for="vps in vpsList" :key="vps.id" class="hover:bg-gray-750 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-white">{{ vps.productName }}</div>
                  <div class="text-sm text-gray-400">{{ vps.providerName }} · {{ vps.location }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">
                  <div>{{ vps.cpu }} · {{ vps.memory }}</div>
                  <div class="text-xs text-gray-500">{{ vps.storage }} · {{ vps.bandwidth }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-white">${{ vps.price }}/年</div>
                  <div v-if="vps.originalPrice" class="text-xs text-gray-500 line-through">${{ vps.originalPrice }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(vps.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusText(vps.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <Icon name="ph:eye" class="w-4 h-4" />
                    <span>{{ vps.views || 0 }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="ph:cursor-click" class="w-4 h-4" />
                    <span>{{ vps.clicks || 0 }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center gap-2 justify-end">
                  <button @click="editVps(vps.id)" class="text-primary-400 hover:text-primary-300 transition-colors">
                    <Icon name="ph:pencil" class="w-5 h-5" />
                  </button>
                  <button @click="toggleStatus(vps)" class="text-yellow-400 hover:text-yellow-300 transition-colors">
                    <Icon :name="vps.status === 'active' ? 'ph:pause' : 'ph:play'" class="w-5 h-5" />
                  </button>
                  <button @click="deleteVps(vps)" class="text-red-400 hover:text-red-300 transition-colors">
                    <Icon name="ph:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-400">
                显示第 <span class="font-medium text-white">{{ (currentPage - 1) * perPage + 1 }}</span> 到 <span class="font-medium text-white">{{ Math.min(currentPage * perPage, totalCount) }}</span> 条，共 <span class="font-medium text-white">{{ totalCount }}</span> 条
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click="currentPage--" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Icon name="ph:caret-left" class="w-5 h-5" />
                </button>
                <button v-for="page in displayPages" :key="page" @click="currentPage = page" :class="currentPage === page ? 'bg-primary-600 border-primary-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  {{ page }}
                </button>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Icon name="ph:caret-right" class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// State
const loading = ref(false)
const vpsList = ref([])
const currentPage = ref(1)
const perPage = ref(20)
const totalCount = ref(0)

// Filters
const filters = ref({
  search: '',
  category: '',
  status: '',
  sort: 'created_desc'
})

// Computed
const totalPages = computed(() => Math.ceil(totalCount.value / perPage.value))
const displayPages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch filters
watchEffect(() => {
  fetchVpsList()
})

// Methods
const fetchVpsList = async () => {
  loading.value = true
  try {
    const { data } = await $fetch('/api/admin/vps', {
      params: {
        page: currentPage.value,
        limit: perPage.value,
        ...filters.value
      }
    })
    
    vpsList.value = data.items || []
    totalCount.value = data.total || 0
  } catch (error) {
    console.error('Failed to fetch VPS list:', error)
    vpsList.value = []
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    sold_out: 'bg-red-100 text-red-800'
  }
  return classes[status] || classes.inactive
}

const getStatusText = (status: string) => {
  const texts = {
    active: '上架中',
    inactive: '已下架',
    sold_out: '已售罄'
  }
  return texts[status] || '未知'
}

const editVps = (id: number) => {
  navigateTo(`/admin/vps/${id}`)
}

const toggleStatus = async (vps: any) => {
  const newStatus = vps.status === 'active' ? 'inactive' : 'active'
  
  try {
    await $fetch(`/api/admin/vps/${vps.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    
    vps.status = newStatus
    // 显示成功提示
  } catch (error) {
    console.error('Failed to update status:', error)
    // 显示错误提示
  }
}

const deleteVps = async (vps: any) => {
  if (!confirm(`确定要删除"${vps.productName}"吗？此操作不可恢复。`)) {
    return
  }
  
  try {
    await $fetch(`/api/admin/vps/${vps.id}`, {
      method: 'DELETE'
    })
    
    // 从列表中移除
    vpsList.value = vpsList.value.filter(v => v.id !== vps.id)
    totalCount.value--
    
    // 显示成功提示
  } catch (error) {
    console.error('Failed to delete VPS:', error)
    // 显示错误提示
  }
}

const exportData = async () => {
  try {
    const blob = await $fetch('/api/admin/vps/export', {
      responseType: 'blob',
      params: filters.value
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vps-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Failed to export data:', error)
    // 显示错误提示
  }
}

// Initialize
onMounted(() => {
  fetchVpsList()
})
</script>

<style scoped>
.hover\:bg-gray-750:hover {
  background-color: rgba(55, 65, 81, 0.5);
}
</style>