<template>
  <section class="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">为什么选择我们推荐的VPS?</h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">我们精心挑选了性价比最高的VPS服务商，为您提供可靠的推荐</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div class="bg-white rounded-lg p-6 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">价格优惠</h3>
          </div>
          <p class="text-gray-600">精选年付低于$15的高性价比VPS，帮您节省预算</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">性能卓越</h3>
          </div>
          <p class="text-gray-600">所有推荐VPS均经过实际测试，确保稳定性和性能</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">全球覆盖</h3>
          </div>
          <p class="text-gray-600">提供多个数据中心位置，满足您的全球部署需求</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WhyChooseUs'
}
</script>

<style scoped>
/* 鼠标悬停卡片效果 */
.hover\:-translate-y-1:hover {
  transform: translateY(-4px);
}

/* 加载动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.8s ease-out;
}
</style> 