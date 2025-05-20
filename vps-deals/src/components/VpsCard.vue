<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
    <!-- 卡片顶部 -->
    <div class="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ name }}</h3>
          <div class="text-sm text-gray-600 mt-1">{{ config }}</div>
        </div>
        <!-- 服务商Logo -->
        <div v-if="providerLogo" class="w-16 h-16 flex items-center justify-center">
          <img :src="providerLogo" alt="服务商Logo" class="max-w-full max-h-full object-contain">
        </div>
        <div v-else class="w-16 h-16 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-md flex items-center justify-center text-white font-bold">
          VPS
        </div>
      </div>
    </div>
    
    <!-- 卡片内容 -->
    <div class="p-4">
      <!-- 配置详情 -->
      <div class="mb-4">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
            <span class="text-gray-700">{{ details.cpu || 'N/A' }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span class="text-gray-700">{{ details.ram }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
            <span class="text-gray-700">{{ details.storage }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="text-gray-700">{{ details.bandwidth }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
            </svg>
            <span class="text-gray-700">{{ details.ipv4 }}</span>
          </div>
          <div class="flex items-center col-span-2">
            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-gray-700">{{ details.location }}</span>
          </div>
        </div>
      </div>
      
      <!-- 价格信息 -->
      <div class="mb-4 text-center">
        <div class="text-2xl font-bold text-indigo-600">{{ price }}</div>
    </div>
    
      <!-- 卡片底部 - 按钮 -->
      <div class="flex flex-col space-y-2">
        <a :href="link" target="_blank" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full">
          {{ buttonText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VpsCard',
  props: {
    name: {
      type: String,
      required: true
    },
    config: {
      type: String,
      required: true
    },
    details: {
      type: Object,
      required: true,
      default: () => ({
        cpu: '',
        ram: '',
        storage: '',
        bandwidth: '',
        ipv4: '',
        location: ''
      })
    },
    price: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: '立即购买'
    },
    providerLogo: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.vps-card-hover {
  transition: all 0.3s ease;
}

.vps-card-hover:hover {
  transform: translateY(-5px);
}
</style>