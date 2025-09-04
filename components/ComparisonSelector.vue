<template>
  <div class="comparison-selector">
    <!-- 浮动对比栏 -->
    <Transition name="slide">
      <div
        v-if="comparisonStore.showComparisonBar && comparisonStore.itemCount > 0"
        class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-40"
      >
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- 已选产品预览 -->
            <div class="flex-1 flex items-center gap-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                对比列表 ({{ comparisonStore.itemCount }}/5)
              </h3>
              
              <div class="flex gap-2 overflow-x-auto">
                <div
                  v-for="item in comparisonItems"
                  :key="item.id"
                  class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg whitespace-nowrap"
                >
                  <span class="text-sm">{{ item.name }}</span>
                  <button
                    @click="comparisonStore.removeFromComparison(item.id)"
                    class="text-red-500 hover:text-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2">
              <button
                @click="comparisonStore.clearComparison"
                class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                清空
              </button>
              
              <NuxtLink
                v-if="comparisonStore.canCompare"
                :to="comparisonStore.comparisonUrl"
                class="btn-primary flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                开始对比
              </NuxtLink>
              
              <button
                v-else
                disabled
                class="btn-disabled flex items-center gap-2"
              >
                至少选择2个产品
              </button>
              
              <button
                @click="comparisonStore.toggleComparisonBar"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 浮动对比按钮（当对比栏隐藏时显示） -->
    <Transition name="fade">
      <button
        v-if="!comparisonStore.showComparisonBar && comparisonStore.itemCount > 0"
        @click="comparisonStore.toggleComparisonBar"
        class="fixed bottom-8 right-8 bg-primary text-white rounded-full shadow-lg p-4 z-40 hover:bg-primary-dark transition-colors"
      >
        <div class="relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ comparisonStore.itemCount }}
          </span>
        </div>
      </button>
    </Transition>

    <!-- 对比模式提示 -->
    <Transition name="fade">
      <div
        v-if="comparisonStore.isComparisonMode"
        class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">对比模式已开启，点击产品卡片添加到对比列表</span>
          <button
            @click="comparisonStore.toggleComparisonMode"
            class="ml-2 text-xs underline"
          >
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useComparisonStore } from '~/stores/comparison'

const route = useRoute()
const comparisonStore = useComparisonStore()

// 获取已选产品的详细信息（这里简化处理，实际应从API或store获取）
const comparisonItems = computed(() => {
  return comparisonStore.items.map(id => ({
    id,
    name: `VPS #${id}` // 实际应从产品数据中获取
  }))
})

// 从URL加载对比数据
onMounted(() => {
  if (route.query.ids) {
    comparisonStore.loadFromUrl(route.query.ids)
  }
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors;
}

.btn-disabled {
  @apply bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>