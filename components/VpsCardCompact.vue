<template>
  <div class="vps-card-compact">
    <!-- 左侧：核心信息 -->
    <div class="card-main">
      <div class="provider-section">
        <h4 class="provider-name">{{ vps.provider }}</h4>
        <div class="location">
          <Icon name="mdi:map-marker" size="14" />
          {{ vps.location }}
        </div>
      </div>
      
      <div class="specs-section">
        <div class="spec-badge">
          <Icon name="mdi:cpu-64-bit" />
          {{ vps.cpu_cores }} 核
        </div>
        <div class="spec-badge">
          <Icon name="mdi:memory" />
          {{ vps.ram_gb }}GB
        </div>
        <div class="spec-badge">
          <Icon name="mdi:harddisk" />
          {{ vps.storage_gb }}GB {{ vps.storage_type }}
        </div>
        <div class="spec-badge">
          <Icon name="mdi:swap-horizontal" />
          {{ formatBandwidth(vps) }}
        </div>
      </div>
    </div>

    <!-- 右侧：价格和操作 -->
    <div class="card-sidebar">
      <div class="price-info">
        <div class="price-current">
          <span class="price-symbol">$</span>
          <span class="price-amount">{{ formatPrice(vps.price) }}</span>
          <span class="price-period">/{{ getPeriodShort(vps.price_period) }}</span>
        </div>
        <div v-if="vps.discount_percent > 0" class="discount-info">
          <span class="discount-percent">-{{ vps.discount_percent }}%</span>
          <span class="original-price">${{ vps.original_price }}</span>
        </div>
      </div>
      
      <NuxtLink 
        :to="vps.buy_link" 
        target="_blank" 
        rel="nofollow"
        class="buy-button"
      >
        查看详情
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  vps: {
    type: Object,
    required: true
  }
})

// 格式化价格
const formatPrice = (price) => {
  if (price < 1) return price.toFixed(2)
  return price % 1 === 0 ? price.toString() : price.toFixed(2)
}

// 获取短周期文本
const getPeriodShort = (period) => {
  const periodMap = {
    'monthly': '月',
    'quarterly': '季',
    'yearly': '年'
  }
  return periodMap[period] || period
}

// 格式化带宽
const formatBandwidth = (vps) => {
  if (vps.bandwidth_unlimited) return '不限流量'
  return vps.bandwidth_tb ? `${vps.bandwidth_tb}TB` : '1TB'
}
</script>

<style scoped>
.vps-card-compact {
  @apply flex items-center justify-between p-4 bg-white dark:bg-gray-800 
         rounded-lg border border-gray-200 dark:border-gray-700 
         hover:border-blue-300 dark:hover:border-blue-600 
         hover:shadow-md transition-all duration-200;
}

.card-main {
  @apply flex-1 space-y-3;
}

.provider-section {
  @apply flex items-center gap-4;
}

.provider-name {
  @apply text-base font-semibold text-gray-900 dark:text-white;
}

.location {
  @apply flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400;
}

.specs-section {
  @apply flex flex-wrap gap-2;
}

.spec-badge {
  @apply inline-flex items-center gap-1 px-2 py-1 text-xs 
         bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
         rounded-md;
}

.card-sidebar {
  @apply flex flex-col items-end gap-3 ml-4;
}

.price-info {
  @apply text-right;
}

.price-current {
  @apply flex items-baseline;
}

.price-symbol {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.price-amount {
  @apply text-xl font-bold text-blue-600 dark:text-blue-400 mx-1;
}

.price-period {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.discount-info {
  @apply flex items-center gap-2 text-xs;
}

.discount-percent {
  @apply px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 
         text-red-600 dark:text-red-400 rounded font-medium;
}

.original-price {
  @apply text-gray-500 line-through;
}

.buy-button {
  @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
         text-sm font-medium rounded-md transition-colors;
}

/* 响应式 */
@media (max-width: 640px) {
  .vps-card-compact {
    @apply flex-col items-stretch;
  }
  
  .card-main {
    @apply mb-3;
  }
  
  .card-sidebar {
    @apply flex-row items-center justify-between ml-0;
  }
}
</style>