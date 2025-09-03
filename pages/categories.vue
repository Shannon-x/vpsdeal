<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Page Header -->
    <section class="relative py-20 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div class="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px]"></div>
      </div>
      
      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            VPS分类浏览
          </h1>
          <p class="text-xl text-gray-400">
            按照价格区间、服务器类型和地理位置快速找到适合您的VPS方案
          </p>
        </div>
      </div>
    </section>
    
    <!-- Main Categories Grid -->
    <section class="container mx-auto px-4 py-12">
      <!-- Price Categories -->
      <div class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <Icon name="ph:currency-dollar-bold" class="w-8 h-8 text-primary-400" />
          <h2 class="text-3xl font-display font-bold text-white">按价格分类</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PriceCategory
            title="年付15美元以下"
            description="超低价入门方案，适合个人博客和轻量应用"
            icon="ph:piggy-bank-bold"
            :count="42"
            gradient="budget"
            category="price_under_15"
          />
          
          <PriceCategory
            title="年付25美元以下"
            description="高性价比选择，满足大部分网站需求"
            icon="ph:wallet-bold"
            :count="68"
            gradient="value"
            category="price_under_25"
          />
          
          <PriceCategory
            title="月付2美元以下"
            description="月付灵活方案，短期项目首选"
            icon="ph:coins-bold"
            :count="35"
            gradient="premium"
            category="price_monthly_2"
          />
          
          <PriceCategory
            title="免费VPS"
            description="免费试用和永久免费方案"
            icon="ph:gift-bold"
            :count="12"
            gradient="free"
            category="free_vps"
          />
          
          <PriceCategory
            title="VDS服务器"
            description="虚拟独立服务器，性能更强"
            icon="ph:database-duotone"
            :count="28"
            gradient="vds"
            category="vds"
          />
          
          <PriceCategory
            title="NAT/OpenVZ"
            description="共享IP和轻量虚拟化方案"
            icon="ph:share-network-bold"
            :count="19"
            gradient="nat"
            category="nat_openvz"
          />
        </div>
      </div>
      
      <!-- Additional Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PriceCategory
          title="高配VPS主机"
          description="大内存、高性能配置"
          icon="ph:rocket-launch-bold"
          :count="45"
          gradient="high-end"
          category="high_performance"
        />
        
        <PriceCategory
          title="最新活动"
          description="限时优惠和促销活动"
          icon="ph:fire-bold"
          :count="31"
          gradient="deals"
          category="latest_deals"
        />
        
        <PriceCategory
          title="全部优惠"
          description="浏览所有VPS优惠方案"
          icon="ph:squares-four-bold"
          :count="256"
          gradient="primary"
          category="all"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'VPS分类浏览 - 按价格、类型、地区分类',
  meta: [
    { name: 'description', content: '按照价格区间、服务器类型、地理位置等多维度分类浏览VPS优惠，快速找到最适合您的方案' }
  ]
})
</script>