<template>
  <div class="comparison-table-container">
    <!-- 头部工具栏 -->
    <div class="comparison-header mb-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">VPS产品对比</h2>
        <div class="flex gap-2">
          <button
            @click="exportData('csv')"
            class="btn-secondary flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            导出CSV
          </button>
          <button
            @click="shareComparison"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.684-5.368m2.684 5.368a3 3 0 01-5.368 0m5.368 0c-.203.404-.5.752-.868 1.016m-5.368-1.016c.203.404.5.752.868 1.016M12 9a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            分享对比
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-2">
        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        加载对比数据...
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- 对比表格 -->
    <div v-else-if="comparisonData" class="comparison-wrapper">
      <!-- 关键洞察 -->
      <div v-if="comparisonData.insights" class="insights-section mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-if="comparisonData.insights.cheapest" class="insight-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div class="text-sm text-green-600 dark:text-green-400 mb-1">💰 最低价格</div>
          <div class="font-semibold">{{ comparisonData.insights.cheapest.name }}</div>
          <div class="text-lg">${{ comparisonData.insights.cheapest.price.toFixed(2) }}/月</div>
        </div>
        
        <div v-if="comparisonData.insights.bestValue" class="insight-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div class="text-sm text-blue-600 dark:text-blue-400 mb-1">⭐ 最佳性价比</div>
          <div class="font-semibold">{{ comparisonData.insights.bestValue.name }}</div>
          <div class="text-lg">评分: {{ comparisonData.insights.bestValue.score.toFixed(2) }}</div>
        </div>
        
        <div v-if="comparisonData.insights.mostRAM" class="insight-card bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div class="text-sm text-purple-600 dark:text-purple-400 mb-1">💾 最大内存</div>
          <div class="font-semibold">{{ comparisonData.insights.mostRAM.name }}</div>
          <div class="text-lg">{{ comparisonData.insights.mostRAM.ram }}</div>
        </div>
        
        <div v-if="comparisonData.insights.mostStorage" class="insight-card bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div class="text-sm text-orange-600 dark:text-orange-400 mb-1">💿 最大存储</div>
          <div class="font-semibold">{{ comparisonData.insights.mostStorage.name }}</div>
          <div class="text-lg">{{ comparisonData.insights.mostStorage.storage }}</div>
        </div>
      </div>

      <!-- 对比表格（桌面版） -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="comparison-table w-full">
          <thead>
            <tr>
              <th class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800">项目</th>
              <th v-for="product in comparisonData.products" :key="product.id" class="text-center">
                <div class="product-header">
                  <img v-if="product.image" :src="product.image" :alt="product.name" class="w-16 h-16 mx-auto mb-2 object-contain">
                  <h3 class="font-semibold text-sm">{{ product.name }}</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ product.provider }}</p>
                  <button
                    @click="removeProduct(product.id)"
                    class="mt-2 text-red-500 hover:text-red-600 text-xs"
                  >
                    移除
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- 价格行 -->
            <tr class="price-row">
              <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 font-semibold">价格</td>
              <td v-for="product in comparisonData.products" :key="product.id" class="text-center">
                <div class="price-cell">
                  <div class="text-2xl font-bold text-primary">
                    ${{ product.price.current.toFixed(2) }}
                  </div>
                  <div v-if="product.price.original" class="text-sm text-gray-500 line-through">
                    ${{ product.price.original.toFixed(2) }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ getBillingText(product.price.billing) }}
                  </div>
                  <div v-if="product.price.discount" class="text-sm text-green-600">
                    -{{ product.price.discount }}% 优惠
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    月付约 ${{ product.price.monthly.toFixed(2) }}
                  </div>
                </div>
              </td>
            </tr>

            <!-- 规格行 -->
            <tr v-for="(specLabel, specKey) in specLabels" :key="specKey">
              <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 font-semibold">{{ specLabel }}</td>
              <td v-for="product in comparisonData.products" :key="product.id" class="text-center">
                <span :class="getSpecClass(specKey, product.specs[specKey])">
                  {{ product.specs[specKey] }}
                </span>
              </td>
            </tr>

            <!-- 评分行 -->
            <tr v-if="hasRatings">
              <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 font-semibold">用户评分</td>
              <td v-for="product in comparisonData.products" :key="product.id" class="text-center">
                <div v-if="product.rating > 0">
                  <div class="flex justify-center items-center gap-1">
                    <span class="text-yellow-500">★</span>
                    <span>{{ product.rating.toFixed(1) }}</span>
                  </div>
                  <div class="text-xs text-gray-500">{{ product.reviews }} 评价</div>
                </div>
                <div v-else class="text-gray-400">暂无评价</div>
              </td>
            </tr>

            <!-- 特性行 -->
            <tr v-if="hasFeatures">
              <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 font-semibold">特性</td>
              <td v-for="product in comparisonData.products" :key="product.id" class="text-center">
                <ul v-if="product.features && product.features.length > 0" class="text-sm space-y-1">
                  <li v-for="(feature, idx) in product.features.slice(0, 5)" :key="idx" class="text-gray-600 dark:text-gray-400">
                    • {{ feature }}
                  </li>
                </ul>
                <div v-else class="text-gray-400">-</div>
              </td>
            </tr>

            <!-- 操作行 -->
            <tr>
              <td class="sticky left-0 z-10 bg-white dark:bg-gray-900"></td>
              <td v-for="product in comparisonData.products" :key="product.id" class="text-center py-4">
                <a
                  :href="product.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-primary inline-block"
                >
                  查看详情 →
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 对比卡片（移动版） -->
      <div class="lg:hidden space-y-4">
        <div v-for="product in comparisonData.products" :key="product.id" class="comparison-card bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold">{{ product.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.provider }}</p>
            </div>
            <button
              @click="removeProduct(product.id)"
              class="text-red-500 hover:text-red-600 text-sm"
            >
              移除
            </button>
          </div>

          <div class="space-y-3">
            <!-- 价格 -->
            <div class="flex justify-between">
              <span class="font-medium">价格</span>
              <div class="text-right">
                <div class="text-lg font-bold text-primary">${{ product.price.current.toFixed(2) }}</div>
                <div class="text-xs text-gray-500">{{ getBillingText(product.price.billing) }}</div>
              </div>
            </div>

            <!-- 规格 -->
            <div v-for="(specLabel, specKey) in specLabels" :key="specKey" class="flex justify-between">
              <span class="font-medium">{{ specLabel }}</span>
              <span>{{ product.specs[specKey] }}</span>
            </div>

            <!-- 操作 -->
            <div class="pt-3 border-t">
              <a
                :href="product.link"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary block text-center"
              >
                查看详情 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">请选���至少2个VPS产品进行对比</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useComparisonStore } from '~/stores/comparison'
import { useToast } from '~/composables/useToast'

const comparisonStore = useComparisonStore()
const { showToast } = useToast()

// 从store获取数据
const loading = computed(() => comparisonStore.loading)
const error = computed(() => comparisonStore.error)
const comparisonData = computed(() => comparisonStore.comparisonData)

// 规格标签映射
const specLabels = {
  cpu: 'CPU',
  ram: '内存',
  storage: '存储',
  bandwidth: '带宽',
  location: '位置'
}

// 计费周期文本
const getBillingText = (billing) => {
  const billingMap = {
    monthly: '月付',
    quarterly: '季付',
    'semi-annually': '半年付',
    yearly: '年付',
    annually: '年付'
  }
  return billingMap[billing] || billing
}

// 检查是否有评分数据
const hasRatings = computed(() => {
  return comparisonData.value?.products.some(p => p.rating > 0)
})

// 检查是否有特性数据
const hasFeatures = computed(() => {
  return comparisonData.value?.products.some(p => p.features && p.features.length > 0)
})

// 获取规格样式类（用于高亮最佳值）
const getSpecClass = (specKey, value) => {
  if (!comparisonData.value || !comparisonData.value.differences) return ''
  
  const diff = comparisonData.value.differences.find(d => d.spec === specKey)
  if (!diff) return ''
  
  const numValue = parseFloat(value) || 0
  
  // 对于价格，最小值是最好的
  if (specKey === 'price') {
    if (numValue === diff.min) return 'text-green-600 font-semibold'
    if (numValue === diff.max) return 'text-red-600'
  } 
  // 对于其他规格，最大值是最好的
  else {
    if (numValue === diff.max) return 'text-green-600 font-semibold'
    if (numValue === diff.min) return 'text-red-600'
  }
  
  return ''
}

// 移除产品
const removeProduct = (productId) => {
  comparisonStore.removeFromComparison(productId)
  
  // 如果少于2个产品，清空对比数据
  if (comparisonStore.items.length < 2) {
    comparisonStore.comparisonData = null
  } else {
    // 重新获取对比数据
    comparisonStore.fetchComparisonData()
  }
}

// 导出数据
const exportData = (format) => {
  comparisonStore.exportComparison(format)
  showToast('对比数据已导出', 'success')
}

// 分享对比
const shareComparison = async () => {
  const shareUrl = await comparisonStore.createShareSession()
  
  if (shareUrl) {
    // 尝试使用Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VPS产品对比',
          text: '查看我的VPS产品对比结果',
          url: shareUrl
        })
      } catch (error) {
        // 用户取消分享或不支持
        copyToClipboard(shareUrl)
      }
    } else {
      // 复制到剪贴板
      copyToClipboard(shareUrl)
    }
  } else {
    showToast('创建分享链接失败', 'error')
  }
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('分享链接已复制到剪贴板', 'success')
  } catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请手动复制', 'error')
  }
}
</script>

<style scoped>
.comparison-table {
  @apply border-collapse;
}

.comparison-table th,
.comparison-table td {
  @apply border border-gray-200 dark:border-gray-700 px-4 py-3;
}

.comparison-table thead th {
  @apply bg-gray-50 dark:bg-gray-800 font-semibold;
}

.comparison-table tbody tr:hover {
  @apply bg-gray-50 dark:bg-gray-800/50;
}

.price-row {
  @apply bg-blue-50 dark:bg-blue-900/20;
}

.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors;
}
</style>