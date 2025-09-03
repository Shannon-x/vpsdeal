<template>
  <div class="vps-card-modern">
    <!-- 头部：提供商和优惠标签 -->
    <div class="card-header">
      <div class="provider-info">
        <h3 class="provider-name">{{ vps.provider }}</h3>
        <span v-if="vps.discount_percent > 0" class="discount-badge">
          -{{ vps.discount_percent }}%
        </span>
      </div>
      <div class="location-badge">
        <Icon name="mdi:map-marker" />
        {{ vps.location }}
      </div>
    </div>

    <!-- 价格区域 -->
    <div class="price-section">
      <div class="price-main">
        <span class="currency">$</span>
        <span class="amount">{{ formatPrice(vps.price) }}</span>
        <span class="period">/{{ getPeriodText(vps.price_period) }}</span>
      </div>
      <div v-if="vps.original_price > vps.price" class="price-original">
        原价: ${{ vps.original_price }}
      </div>
      <div class="monthly-equivalent" v-if="vps.price_period !== 'monthly'">
        约 ${{ vps.monthly_price.toFixed(2) }}/月
      </div>
    </div>

    <!-- 核心规格 -->
    <div class="specs-grid">
      <div class="spec-item">
        <Icon name="mdi:cpu-64-bit" class="spec-icon" />
        <div class="spec-details">
          <span class="spec-value">{{ vps.cpu_cores }}</span>
          <span class="spec-label">vCPU</span>
        </div>
      </div>
      
      <div class="spec-item">
        <Icon name="mdi:memory" class="spec-icon" />
        <div class="spec-details">
          <span class="spec-value">{{ vps.ram_gb }}</span>
          <span class="spec-label">GB RAM</span>
        </div>
      </div>
      
      <div class="spec-item">
        <Icon name="mdi:harddisk" class="spec-icon" />
        <div class="spec-details">
          <span class="spec-value">{{ vps.storage_gb }}</span>
          <span class="spec-label">GB {{ vps.storage_type }}</span>
        </div>
      </div>
      
      <div class="spec-item">
        <Icon name="mdi:swap-horizontal" class="spec-icon" />
        <div class="spec-details">
          <span class="spec-value">{{ formatBandwidth(vps) }}</span>
          <span class="spec-label">流量</span>
        </div>
      </div>
    </div>

    <!-- 详细规格（可展开） -->
    <div class="extra-specs" v-if="showDetails">
      <div class="spec-row" v-if="vps.cpu_type">
        <span class="spec-name">CPU型号:</span>
        <span class="spec-value">{{ vps.cpu_type }}</span>
      </div>
      <div class="spec-row">
        <span class="spec-name">网络:</span>
        <span class="spec-value">{{ vps.network_speed || '1Gbps' }}</span>
      </div>
      <div class="spec-row">
        <span class="spec-name">IPv4/IPv6:</span>
        <span class="spec-value">
          {{ vps.ipv4_count }} IPv4
          <span v-if="vps.ipv6_available">+ IPv6</span>
        </span>
      </div>
      <div class="spec-row">
        <span class="spec-name">虚拟化:</span>
        <span class="spec-value">{{ vps.virtualization }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="card-actions">
      <button @click="showDetails = !showDetails" class="btn-details">
        <Icon :name="showDetails ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
        {{ showDetails ? '收起' : '详情' }}
      </button>
      <a :href="vps.buy_link" target="_blank" rel="nofollow" class="btn-buy">
        立即购买
        <Icon name="mdi:open-in-new" />
      </a>
    </div>

    <!-- 标签 -->
    <div class="feature-tags" v-if="vps.features && vps.features.length">
      <span v-for="feature in parseFeatures(vps.features)" :key="feature" class="feature-tag">
        {{ feature }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  vps: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)

// 格式化价格
const formatPrice = (price) => {
  if (price < 1) {
    return price.toFixed(2)
  }
  return price % 1 === 0 ? price.toString() : price.toFixed(2)
}

// 获取周期文本
const getPeriodText = (period) => {
  const periodMap = {
    'monthly': '月',
    'quarterly': '季',
    'yearly': '年',
    'biennially': '两年',
    'triennially': '三年'
  }
  return periodMap[period] || period
}

// 格式化带宽
const formatBandwidth = (vps) => {
  if (vps.bandwidth_unlimited) {
    return '不限'
  }
  return vps.bandwidth_tb ? `${vps.bandwidth_tb}TB` : '1TB'
}

// 解析特性
const parseFeatures = (features) => {
  try {
    return typeof features === 'string' ? JSON.parse(features) : features
  } catch {
    return []
  }
}
</script>

<style scoped>
.vps-card-modern {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg 
         transition-all duration-300 overflow-hidden border border-gray-100 
         dark:border-gray-700;
}

.card-header {
  @apply flex justify-between items-start p-4 bg-gradient-to-r from-blue-50 
         to-purple-50 dark:from-gray-900 dark:to-gray-800;
}

.provider-info {
  @apply flex items-center gap-2;
}

.provider-name {
  @apply text-lg font-bold text-gray-900 dark:text-white;
}

.discount-badge {
  @apply px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full;
}

.location-badge {
  @apply flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400;
}

.price-section {
  @apply p-4 text-center border-b border-gray-100 dark:border-gray-700;
}

.price-main {
  @apply flex items-baseline justify-center gap-1;
}

.currency {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

.amount {
  @apply text-3xl font-bold text-blue-600 dark:text-blue-400;
}

.period {
  @apply text-lg text-gray-600 dark:text-gray-400;
}

.price-original {
  @apply text-sm text-gray-500 line-through mt-1;
}

.monthly-equivalent {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.specs-grid {
  @apply grid grid-cols-2 gap-3 p-4;
}

.spec-item {
  @apply flex items-center gap-3 p-3 rounded-lg bg-gray-50 
         dark:bg-gray-700/50;
}

.spec-icon {
  @apply text-2xl text-blue-500 dark:text-blue-400;
}

.spec-details {
  @apply flex flex-col;
}

.spec-value {
  @apply font-semibold text-gray-900 dark:text-white;
}

.spec-label {
  @apply text-xs text-gray-600 dark:text-gray-400;
}

.extra-specs {
  @apply px-4 pb-4 space-y-2;
}

.spec-row {
  @apply flex justify-between text-sm;
}

.spec-row .spec-name {
  @apply text-gray-600 dark:text-gray-400;
}

.spec-row .spec-value {
  @apply font-medium text-gray-900 dark:text-white;
}

.card-actions {
  @apply flex gap-3 p-4;
}

.btn-details {
  @apply flex items-center gap-1 px-4 py-2 text-sm text-gray-600 
         dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
         transition-colors;
}

.btn-buy {
  @apply flex-1 flex items-center justify-center gap-2 px-4 py-2 
         bg-gradient-to-r from-blue-600 to-purple-600 text-white 
         font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 
         transition-all duration-300 shadow-sm hover:shadow-md;
}

.feature-tags {
  @apply flex flex-wrap gap-2 p-4 pt-0;
}

.feature-tag {
  @apply px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 
         dark:text-gray-300 rounded-full;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .specs-grid {
    @apply grid-cols-1;
  }
  
  .price-main .amount {
    @apply text-2xl;
  }
}
</style>