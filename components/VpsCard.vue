<template>
  <div class="group relative overflow-hidden rounded-2xl glass p-6 hover:shadow-2xl transition-all duration-300 card-hover h-full flex flex-col">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Discount Badge -->
    <div v-if="vps.discount && vps.discount > 0" class="absolute -top-2 -right-2 z-10">
      <div class="relative">
        <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        <div class="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
          -{{ vps.discount }}%
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="relative z-10 flex flex-col flex-grow">
      <!-- Header -->
      <div class="mb-4">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all truncate flex-1" 
              :title="vps.productName">
            {{ vps.productName }}
          </h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 truncate" :title="vps.providerName">
          {{ vps.providerName }}
        </p>
      </div>

      <!-- Specs Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4 flex-grow">
        <div class="glass-dark rounded-lg p-3">
          <div class="flex items-center space-x-2 mb-1">
            <Icon name="ph:cpu-bold" class="w-4 h-4 text-primary-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">CPU</span>
          </div>
          <p class="font-semibold text-sm truncate" :title="vps.cpu">{{ vps.cpu }}</p>
        </div>
        
        <div class="glass-dark rounded-lg p-3">
          <div class="flex items-center space-x-2 mb-1">
            <Icon name="ph:memory-bold" class="w-4 h-4 text-primary-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">内存</span>
          </div>
          <p class="font-semibold text-sm">{{ vps.memory }}</p>
        </div>
        
        <div class="glass-dark rounded-lg p-3">
          <div class="flex items-center space-x-2 mb-1">
            <Icon name="ph:hard-drive-bold" class="w-4 h-4 text-primary-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">存储</span>
          </div>
          <p class="font-semibold text-sm">{{ vps.storage }}</p>
        </div>
        
        <div class="glass-dark rounded-lg p-3">
          <div class="flex items-center space-x-2 mb-1">
            <Icon name="ph:globe-bold" class="w-4 h-4 text-primary-500" />
            <span class="text-xs text-gray-600 dark:text-gray-400">流量</span>
          </div>
          <p class="font-semibold text-sm">{{ vps.bandwidth }}</p>
        </div>
      </div>

      <!-- Location -->
      <div class="flex items-center space-x-2 mb-4 glass-dark rounded-lg p-3">
        <Icon name="ph:map-pin-bold" class="w-4 h-4 text-accent-orange" />
        <span class="text-sm font-medium truncate" :title="vps.location">{{ vps.location }}</span>
      </div>

      <!-- Price -->
      <div class="mb-6">
        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-display font-bold gradient-text">
            ${{ vps.price }}
          </span>
          <span class="text-sm text-gray-600 dark:text-gray-400">/月</span>
        </div>
        <p v-if="vps.originalPrice && vps.originalPrice > vps.price" class="text-sm text-gray-500 line-through">
          原价: ${{ vps.originalPrice }}/月
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-auto">
        <button
          @click="$emit('view-details', vps)"
          class="flex-1 px-4 py-2 rounded-lg border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-200 font-medium text-sm"
        >
          查看详情
        </button>
        <a
          :href="vps.affiliateLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium text-sm text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          立即购买
        </a>
      </div>
    </div>

    <!-- Hover Effects -->
    <div class="absolute inset-0 rounded-2xl ring-2 ring-primary-500/0 group-hover:ring-primary-500/20 transition-all duration-300"></div>
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
}

defineProps<{
  vps: VpsProduct
}>()

defineEmits<{
  'view-details': [vps: VpsProduct]
}>()
</script>