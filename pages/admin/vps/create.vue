<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-semibold text-white">{{ isEdit ? '编辑VPS' : '添加VPS' }}</h1>
            <p class="mt-1 text-sm text-gray-400">{{ isEdit ? '修改VPS产品信息' : '添加新的VPS产品' }}</p>
          </div>
          <NuxtLink to="/admin/vps" class="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            返回列表
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Info -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-white mb-6">基本信息</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">产品名称 *</label>
              <input v-model="form.productName" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：Premium KVM VPS">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">提供商 *</label>
              <input v-model="form.providerName" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：RackNerd">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">分类 *</label>
              <select v-model="form.category" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">请选择分类</option>
                <option value="under_15_year">年付15美元以下</option>
                <option value="under_25_year">年付25美元以下</option>
                <option value="monthly_2_under">月付2美元以下</option>
                <option value="free_vps">免费VPS</option>
                <option value="vds">VDS服务器</option>
                <option value="nat_openvz">NAT/OpenVZ</option>
                <option value="high_performance">高配VPS</option>
                <option value="latest_deals">最新活动</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">地区位置 *</label>
              <input v-model="form.location" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：洛杉矶、香港、东京">
            </div>
          </div>
        </div>

        <!-- Configuration -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-white mb-6">配置信息</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">CPU配置 *</label>
              <input v-model="form.cpu" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：2 vCPU">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">内存 *</label>
              <input v-model="form.memory" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：2GB DDR4">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">存储 *</label>
              <input v-model="form.storage" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：30GB NVMe SSD">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">带宽 *</label>
              <input v-model="form.bandwidth" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：3TB">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">端口速度</label>
              <input v-model="form.portSpeed" type="text" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="例如：1Gbps">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">虚拟化技术</label>
              <select v-model="form.virtualization" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">请选择</option>
                <option value="KVM">KVM</option>
                <option value="OpenVZ">OpenVZ</option>
                <option value="Xen">Xen</option>
                <option value="VMware">VMware</option>
                <option value="Hyper-V">Hyper-V</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-white mb-6">价格信息</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">当前价格 (USD/年) *</label>
              <input v-model.number="form.price" type="number" step="0.01" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="0.00">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">原价 (USD/年)</label>
              <input v-model.number="form.originalPrice" type="number" step="0.01" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="0.00">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">折扣 (%)</label>
              <input v-model.number="form.discount" type="number" min="0" max="100" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="0">
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-white mb-6">特性</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label class="flex items-center">
              <input v-model="form.ipv6" type="checkbox" class="rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-700">
              <span class="ml-2 text-sm text-gray-300">IPv6支持</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.ddosProtection" type="checkbox" class="rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-700">
              <span class="ml-2 text-sm text-gray-300">DDoS防护</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.ssdStorage" type="checkbox" class="rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-700">
              <span class="ml-2 text-sm text-gray-300">SSD存储</span>
            </label>
            <label class="flex items-center">
              <input v-model="form.isHot" type="checkbox" class="rounded border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-700">
              <span class="ml-2 text-sm text-gray-300">热门推荐</span>
            </label>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-medium text-white mb-6">其他信息</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">推广链接 *</label>
              <input v-model="form.affiliateLink" type="url" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="https://...">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">产品描述</label>
              <textarea v-model="form.description" rows="4" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="输入产品的详细描述..."></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
              <select v-model="form.status" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="active">上架中</option>
                <option value="inactive">已下架</option>
                <option value="sold_out">已售罄</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-4">
          <NuxtLink to="/admin/vps" class="px-6 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
            取消
          </NuxtLink>
          <button type="submit" :disabled="submitting" class="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon v-if="submitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
            {{ submitting ? '保存中...' : (isEdit ? '更新' : '创建') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)

// Form data
const form = ref({
  productName: '',
  providerName: '',
  category: '',
  location: '',
  cpu: '',
  memory: '',
  storage: '',
  bandwidth: '',
  portSpeed: '',
  virtualization: '',
  price: null,
  originalPrice: null,
  discount: null,
  ipv6: false,
  ddosProtection: false,
  ssdStorage: false,
  isHot: false,
  affiliateLink: '',
  description: '',
  status: 'active'
})

// Load VPS data if editing
onMounted(async () => {
  if (isEdit.value) {
    try {
      const data = await $fetch(`/api/admin/vps/${route.params.id}`)
      Object.assign(form.value, data)
    } catch (error) {
      console.error('Failed to load VPS data:', error)
      // 显示错误提示
      navigateTo('/admin/vps')
    }
  }
})

// Handle form submission
const handleSubmit = async () => {
  submitting.value = true
  
  try {
    const url = isEdit.value ? `/api/admin/vps/${route.params.id}` : '/api/admin/vps'
    const method = isEdit.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: form.value
    })
    
    // 显示成功提��
    await navigateTo('/admin/vps')
  } catch (error) {
    console.error('Failed to save VPS:', error)
    // 显示错误提示
  } finally {
    submitting.value = false
  }
}

// Auto-calculate discount
watch([() => form.value.price, () => form.value.originalPrice], ([price, originalPrice]) => {
  if (price && originalPrice && originalPrice > price) {
    form.value.discount = Math.round((1 - price / originalPrice) * 100)
  }
})
</script>