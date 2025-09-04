<template>
  <div class="compare-page">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">VPS产品对比</h1>
        <p class="text-gray-600 dark:text-gray-400">
          对比不同VPS产品的规格、价格和特性，找到最适合您的方案
        </p>
      </div>

      <!-- 如果没有选择产品 -->
      <div v-if="!hasProducts" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 class="text-xl font-semibold mb-2">还没有选择要对比的产品</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          请先从VPS列表中选择至少2个产品进行对比
        </p>
        <NuxtLink to="/" class="btn-primary">
          浏览VPS产品
        </NuxtLink>
      </div>

      <!-- 对比表格 -->
      <ComparisonTable v-else />

      <!-- 推荐产品 -->
      <div v-if="hasProducts" class="mt-12">
        <h2 class="text-2xl font-bold mb-6">您可能还感兴趣的产品</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VpsCardModern
            v-for="product in recommendedProducts"
            :key="product.id"
            :vps="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useComparisonStore } from '~/stores/comparison'
import { useHead } from '#app'

const route = useRoute()
const router = useRouter()
const comparisonStore = useComparisonStore()

// 推荐产品数据（实际应从API获取）
const recommendedProducts = ref([])

// 是否有选择产品
const hasProducts = computed(() => comparisonStore.itemCount >= 2)

// 设置页面元信息
useHead({
  title: 'VPS产品对比 - 找到最适合您的VPS方案',
  meta: [
    {
      name: 'description',
      content: '对比不同VPS产品的CPU、内存、存储、带宽和价格，帮助您做出最佳选择'
    }
  ]
})

// 监听路由参数变化
watch(() => route.query.ids, (newIds) => {
  if (newIds) {
    comparisonStore.loadFromUrl(newIds)
  }
})

// 监听对比项目变化，更新URL
watch(() => comparisonStore.items, (newItems) => {
  if (newItems.length > 0) {
    const currentIds = route.query.ids
    const newIds = newItems.join(',')
    
    if (currentIds !== newIds) {
      router.replace({
        query: { ids: newIds }
      })
    }
  } else {
    // 如果没有项目，清除URL参数
    router.replace({ query: {} })
  }
}, { deep: true })

// 加载推荐产品
const loadRecommendedProducts = async () => {
  try {
    // 实际应该调用API获取推荐产品
    // const { data } = await $fetch('/api/vps/recommended', {
    //   params: {
    //     exclude: comparisonStore.items.join(','),
    //     limit: 3
    //   }
    // })
    // recommendedProducts.value = data
  } catch (error) {
    console.error('加载推荐产品失败:', error)
  }
}

// 页面加载时处理
onMounted(async () => {
  // 从URL加载对比数据
  if (route.query.ids) {
    await comparisonStore.loadFromUrl(route.query.ids)
  }
  
  // 从会话加载
  if (route.params.sessionId) {
    await comparisonStore.loadFromSession(route.params.sessionId)
  }
  
  // 如果有产品，获取对比数据
  if (hasProducts.value) {
    await comparisonStore.fetchComparisonData()
    await loadRecommendedProducts()
  }
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors inline-block;
}
</style>