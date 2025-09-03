<template>
  <div class="category-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">{{ category?.name || '加载中...' }}</h1>
      <p v-if="category?.description" class="page-description">
        {{ category.description }}
      </p>
    </div>

    <!-- 筛选和排序 -->
    <div class="filters-section">
      <div class="result-count">
        找到 <span class="count-number">{{ pagination.total }}</span> 个VPS优惠
      </div>
      
      <div class="sort-controls">
        <label class="sort-label">排序：</label>
        <select v-model="sortBy" @change="handleSortChange" class="sort-select">
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
          <option value="date_desc">最新发布</option>
          <option value="cpu_desc">CPU核心数</option>
          <option value="ram_desc">内存大小</option>
        </select>
      </div>
    </div>

    <!-- VPS列表 -->
    <div v-if="loading" class="loading-state">
      <Icon name="mdi:loading" class="animate-spin text-4xl text-blue-500" />
      <p>正在加载VPS优惠...</p>
    </div>

    <div v-else-if="vpsDeals.length === 0" class="empty-state">
      <Icon name="mdi:package-variant-closed" class="text-6xl text-gray-300" />
      <p>该分类暂无VPS优惠</p>
    </div>

    <div v-else class="vps-list">
      <VpsCardCompact 
        v-for="vps in vpsDeals" 
        :key="vps.id" 
        :vps="vps"
        class="vps-item"
      />
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="changePage(currentPage - 1)"
        :disabled="!pagination.hasPrev"
        class="page-btn"
      >
        <Icon name="mdi:chevron-left" />
        上一页
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="['page-number', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="changePage(currentPage + 1)"
        :disabled="!pagination.hasNext"
        class="page-btn"
      >
        下一页
        <Icon name="mdi:chevron-right" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(true)
const category = ref(null)
const vpsDeals = ref([])
const currentPage = ref(1)
const sortBy = ref('price_asc')
const pagination = ref({
  total: 0,
  hasNext: false,
  hasPrev: false
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(pagination.value.total / 20)
})

// 计算可见页码
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 获取VPS数据
const fetchVpsData = async () => {
  loading.value = true
  
  try {
    const { data } = await $fetch(`/api/categories/${route.params.slug}/vps`, {
      params: {
        page: currentPage.value,
        sort: sortBy.value,
        limit: 20
      }
    })
    
    category.value = data.category
    vpsDeals.value = data.vps
    pagination.value = data.pagination
  } catch (error) {
    console.error('获取VPS数据失败:', error)
    // 显示错误提示
  } finally {
    loading.value = false
  }
}

// 处理排序变化
const handleSortChange = () => {
  currentPage.value = 1
  fetchVpsData()
}

// 切换页面
const changePage = (page) => {
  if (page === '...' || page === currentPage.value) return
  currentPage.value = page
  fetchVpsData()
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听路由变化
watch(() => route.params.slug, () => {
  currentPage.value = 1
  fetchVpsData()
}, { immediate: true })

// SEO
useHead({
  title: () => category.value?.name || 'VPS分类',
  meta: [
    {
      name: 'description',
      content: () => category.value?.description || `查看${category.value?.name}分类下的所有VPS优惠`
    }
  ]
})
</script>

<style scoped>
.category-page {
  @apply max-w-6xl mx-auto px-4 py-8;
}

.page-header {
  @apply mb-8 text-center;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 dark:text-white mb-2;
}

.page-description {
  @apply text-gray-600 dark:text-gray-400;
}

.filters-section {
  @apply flex justify-between items-center mb-6 pb-4 border-b 
         border-gray-200 dark:border-gray-700;
}

.result-count {
  @apply text-gray-600 dark:text-gray-400;
}

.count-number {
  @apply font-semibold text-gray-900 dark:text-white;
}

.sort-controls {
  @apply flex items-center gap-2;
}

.sort-label {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.sort-select {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 
         rounded-md bg-white dark:bg-gray-800 text-gray-900 
         dark:text-white focus:ring-2 focus:ring-blue-500;
}

.loading-state, .empty-state {
  @apply flex flex-col items-center justify-center py-16 text-gray-500;
}

.vps-list {
  @apply space-y-4 mb-8;
}

.vps-item {
  @apply transform transition-transform hover:scale-[1.02];
}

.pagination {
  @apply flex items-center justify-center gap-2 mt-8;
}

.page-btn {
  @apply flex items-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-300 
         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.page-numbers {
  @apply flex items-center gap-1;
}

.page-number {
  @apply px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
         dark:hover:bg-gray-700 rounded-md transition-colors;
}

.page-number.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

/* 响应式 */
@media (max-width: 640px) {
  .filters-section {
    @apply flex-col items-start gap-3;
  }
  
  .pagination {
    @apply flex-wrap;
  }
  
  .page-numbers {
    @apply order-3 w-full justify-center mt-2;
  }
}
</style>