<template>
  <div class="premium-vps-card group relative">
    <!-- Background Layer -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900"></div>
    
    <!-- Animated Border -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
    
    <!-- Main Card -->
    <div class="relative rounded-3xl border border-gray-700/50 dark:border-gray-600/50 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-xl overflow-hidden">
      <!-- Premium Badge -->
      <div v-if="vps.isHot" class="absolute top-4 right-4 z-20">
        <div class="relative">
          <div class="absolute inset-0 bg-orange-500 rounded-full animate-ping"></div>
          <div class="relative bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            HOT
          </div>
        </div>
      </div>
      
      <!-- Discount Ribbon -->
      <div v-if="vps.discount && vps.discount > 0" class="absolute top-0 left-0 z-20">
        <div class="bg-gradient-to-br from-red-500 to-pink-500 text-white px-6 py-2 rounded-br-2xl shadow-lg">
          <span class="text-lg font-bold">-{{ vps.discount }}%</span>
        </div>
      </div>
      
      <!-- Card Content -->
      <div class="p-8">
        <!-- Provider Logo & Name -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-display font-bold text-white mb-1">{{ vps.productName }}</h3>
            <p class="text-gray-400 text-sm">{{ vps.providerName }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Icon name="ph:cloud-bold" class="w-6 h-6 text-white" />
          </div>
        </div>
        
        <!-- Main Specs -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-700/50 dark:border-gray-600/50">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ph:cpu-bold" class="w-4 h-4 text-primary-400" />
              <span class="text-xs text-gray-400">处理器</span>
            </div>
            <p class="text-white font-semibold">{{ vps.cpu }}</p>
          </div>
          
          <div class="bg-gray-800/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-700/50 dark:border-gray-600/50">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ph:memory-bold" class="w-4 h-4 text-accent-purple" />
              <span class="text-xs text-gray-400">内存</span>
            </div>
            <p class="text-white font-semibold">{{ vps.memory }}</p>
          </div>
          
          <div class="bg-gray-800/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-700/50 dark:border-gray-600/50">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ph:hard-drive-bold" class="w-4 h-4 text-accent-orange" />
              <span class="text-xs text-gray-400">存储空间</span>
            </div>
            <p class="text-white font-semibold">{{ vps.storage }}</p>
          </div>
          
          <div class="bg-gray-800/50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-700/50 dark:border-gray-600/50">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ph:wifi-high-bold" class="w-4 h-4 text-accent-pink" />
              <span class="text-xs text-gray-400">月流量</span>
            </div>
            <p class="text-white font-semibold">{{ vps.bandwidth }}</p>
          </div>
        </div>
        
        <!-- Additional Features -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span v-if="vps.ipv6" class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
            IPv6
          </span>
          <span v-if="vps.ddosProtection" class="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            DDoS防护
          </span>
          <span v-if="vps.ssdStorage" class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
            NVMe SSD
          </span>
          <span class="px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 text-xs font-medium">
            <Icon name="ph:map-pin" class="w-3 h-3 inline mr-1" />
            {{ vps.location }}
          </span>
        </div>
        
        <!-- Price Section -->
        <div class="border-t border-gray-700/50 dark:border-gray-600/50 pt-6">
          <div class="flex items-end justify-between mb-4">
            <div>
              <p v-if="vps.originalPrice && vps.originalPrice > vps.price" class="text-gray-400 line-through text-sm mb-1">
                ${{ vps.originalPrice }}/{{ getPeriodText(vps.pricePeriod) }}
              </p>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-purple">
                  ${{ vps.price }}
                </span>
                <span class="text-gray-400 text-sm">/{{ getPeriodText(vps.pricePeriod) }}</span>
              </div>
            </div>
            
            <!-- Rating -->
            <div v-if="vps.rating" class="flex items-center gap-1">
              <Icon v-for="i in 5" :key="i" 
                    :name="i <= vps.rating ? 'ph:star-fill' : 'ph:star'"
                    class="w-4 h-4"
                    :class="i <= vps.rating ? 'text-yellow-400' : 'text-gray-600'" />
              <span class="text-gray-400 text-sm ml-1">({{ vps.reviewCount }})</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button @click="$emit('view-details', vps)"
                    class="flex-1 px-4 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300 font-medium text-sm">
              详细信息
            </button>
            <a :href="vps.affiliateLink"
               target="_blank"
               rel="noopener noreferrer"
               class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:from-primary-600 hover:to-accent-purple/90 transition-all duration-300 font-medium text-sm text-center shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:-translate-y-0.5">
              立即购买
              <Icon name="ph:arrow-up-right-bold" class="w-4 h-4 inline ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 rounded-3xl ring-2 ring-primary-500/0 group-hover:ring-primary-500/50 transition-all duration-300 pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VpsProduct {
  id: number
  productName: string
  providerName: string
  cpu: string
  memory: string
  storage: string
  bandwidth: string
  location: string
  price: number
  originalPrice?: number
  discount?: number
  affiliateLink: string
  isHot?: boolean
  ipv6?: boolean
  ddosProtection?: boolean
  ssdStorage?: boolean
  rating?: number
  reviewCount?: number
  pricePeriod?: string
}

defineProps<{
  vps: VpsProduct
}>()

defineEmits<{
  'view-details': [vps: VpsProduct]
}>()

// 获取价格周期文本
const getPeriodText = (period?: string) => {
  const periodMap: Record<string, string> = {
    'monthly': '月',
    'quarterly': '季',
    'yearly': '年',
    'biennially': '两年',
    'triennially': '三年'
  }
  return periodMap[period || 'monthly'] || '月'
}
</script>

<style scoped>
.premium-vps-card {
  transition: transform 0.3s ease;
}

.premium-vps-card:hover {
  transform: translateY(-4px);
}
</style>