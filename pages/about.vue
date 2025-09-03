<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Page Header -->
    <section class="py-12 bg-gradient-to-r from-primary-500 to-primary-600">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-display font-bold text-white">关于我们</h1>
        <p class="text-lg text-white/80 mt-2">了解VPS Deals的故事</p>
      </div>
    </section>

    <!-- Content -->
    <section class="container mx-auto px-4 py-12 max-w-3xl">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">我们的使命</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          VPS Deals 致力于为用户提供最新、最全面的VPS优惠信息。我们深知选择合适的VPS服务对于个人开发者和企业的重要性，因此我们精心筛选和整理各大服务商的优惠方案，帮助您找到性价比最高的云服务器解决方案。
        </p>

        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">我们的优势</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="flex items-start gap-4">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">实时更新</h3>
              <p class="text-gray-600 dark:text-gray-400">我们持续监控各大VPS服务商的优惠活动，确保信息的时效性</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">精心筛选</h3>
              <p class="text-gray-600 dark:text-gray-400">只推荐可靠的服务商和真正优惠的方案</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">详细对比</h3>
              <p class="text-gray-600 dark:text-gray-400">提供详细的配置和价格对比，帮助您做出明智选择</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">用户至上</h3>
              <p class="text-gray-600 dark:text-gray-400">以用户需求为导向，不断优化我们的服务</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">联系我们</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
          如果您有任何问题或建议，欢迎通过以下方式联系我们：
        </p>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <Icon name="ph:envelope-bold" class="w-5 h-5 text-primary-500" />
            <a href="mailto:contact@vpsdeals.com" class="text-primary-500 hover:text-primary-600">
              contact@vpsdeals.com
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: '关于我们 - VPS Deals',
  meta: [
    { name: 'description', content: '了解VPS Deals，我们致力于为用户提供最新、最全面的VPS优惠信息' }
  ]
})
</script>