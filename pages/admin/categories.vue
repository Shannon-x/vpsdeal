<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-white mb-2">分类管理</h1>
      <p class="text-gray-400">管理VPS产品分类，设置分类名称、图标和描述</p>
    </div>

    <!-- Add Category Button -->
    <div class="mb-6">
      <button @click="showAddModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
        <Icon name="ph:plus" class="w-4 h-4 mr-2" />
        添加分类
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="ph:spinner" class="w-8 h-8 text-gray-400 animate-spin" />
    </div>
    
    <div v-else-if="categories.length === 0" class="bg-gray-800 rounded-lg p-12 text-center">
      <Icon name="ph:folders" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p class="text-gray-400">暂无分类</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="category in categories" :key="category.id" 
           class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all">
        <!-- Category Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div :class="`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradientClass(category.gradient)} flex items-center justify-center`">
              <Icon :name="category.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-medium text-white">{{ category.title }}</h3>
              <p class="text-sm text-gray-400">{{ category.key }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button @click="editCategory(category)" class="text-gray-400 hover:text-primary-400 transition-colors">
              <Icon name="ph:pencil" class="w-5 h-5" />
            </button>
            <button @click="deleteCategory(category)" class="text-gray-400 hover:text-red-400 transition-colors">
              <Icon name="ph:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Category Info -->
        <p class="text-gray-400 text-sm mb-4">{{ category.description }}</p>
        
        <!-- Stats -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">产品数量</span>
          <span class="text-white font-medium">{{ category.productCount || 0 }}</span>
        </div>
        
        <!-- Status -->
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs text-gray-500">状态</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="category.isActive" @change="toggleStatus(category)" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" @click="closeModal">
            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="saveCategory">
              <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg font-medium text-white mb-4">
                  {{ showEditModal ? '编辑分类' : '添加分类' }}
                </h3>
                
                <div class="space-y-4">
                  <!-- Title -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">分类名称 *</label>
                    <input v-model="form.title" type="text" required 
                           class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  </div>
                  
                  <!-- Key -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">分类标识 *</label>
                    <input v-model="form.key" type="text" required pattern="[a-z0-9_]+"
                           class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           placeholder="例如：under_15_year">
                    <p class="mt-1 text-xs text-gray-500">只能包含小写字母、数字和下划线</p>
                  </div>
                  
                  <!-- Description -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">分类描述</label>
                    <textarea v-model="form.description" rows="2"
                              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                  </div>
                  
                  <!-- Icon -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">图标 *</label>
                    <div class="grid grid-cols-6 gap-2">
                      <button v-for="icon in iconOptions" :key="icon" type="button"
                              @click="form.icon = icon"
                              :class="form.icon === icon ? 'ring-2 ring-primary-500' : ''"
                              class="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <Icon :name="icon" class="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Gradient -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">渐变色 *</label>
                    <div class="grid grid-cols-4 gap-2">
                      <button v-for="gradient in gradientOptions" :key="gradient.key" type="button"
                              @click="form.gradient = gradient.key"
                              :class="form.gradient === gradient.key ? 'ring-2 ring-primary-500' : ''"
                              class="h-12 rounded-lg transition-all"
                              :style="`background: linear-gradient(135deg, ${gradient.colors})`">
                      </button>
                    </div>
                  </div>
                  
                  <!-- Order -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">排序</label>
                    <input v-model.number="form.order" type="number" min="0"
                           class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button type="submit" :disabled="submitting"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ submitting ? '保存中...' : '保存' }}
                </button>
                <button type="button" @click="closeModal"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// State
const loading = ref(false)
const submitting = ref(false)
const categories = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)

// Form
const form = ref({
  title: '',
  key: '',
  description: '',
  icon: 'ph:package',
  gradient: 'budget',
  order: 0,
  isActive: true
})

// Options
const iconOptions = [
  'ph:piggy-bank-bold',
  'ph:wallet-bold',
  'ph:coins-bold',
  'ph:gift-bold',
  'ph:database-duotone',
  'ph:share-network-bold',
  'ph:rocket-launch-bold',
  'ph:fire-bold',
  'ph:squares-four-bold',
  'ph:package',
  'ph:cloud-bold',
  'ph:server-bold'
]

const gradientOptions = [
  { key: 'budget', colors: '#10b981, #14b8a6' },
  { key: 'value', colors: '#3b82f6, #6366f1' },
  { key: 'premium', colors: '#a855f7, #ec4899' },
  { key: 'ultra', colors: '#f97316, #ef4444' },
  { key: 'free', colors: '#6b7280, #374151' },
  { key: 'vds', colors: '#6366f1, #a855f7' },
  { key: 'nat', colors: '#06b6d4, #3b82f6' },
  { key: 'high-end', colors: '#f43f5e, #ec4899' },
  { key: 'deals', colors: '#f59e0b, #f97316' }
]

// Methods
const fetchCategories = async () => {
  loading.value = true
  try {
    const { data } = await $fetch('/api/admin/categories')
    categories.value = data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

const getGradientClass = (gradient) => {
  const gradients = {
    'budget': 'from-emerald-500 to-teal-600',
    'value': 'from-blue-500 to-indigo-600',
    'premium': 'from-purple-500 to-pink-600',
    'ultra': 'from-orange-500 to-red-600',
    'free': 'from-gray-600 to-gray-800',
    'vds': 'from-indigo-600 to-purple-700',
    'nat': 'from-cyan-500 to-blue-600',
    'high-end': 'from-rose-600 to-pink-700',
    'deals': 'from-amber-500 to-orange-600'
  }
  return gradients[gradient] || 'from-primary-500 to-primary-600'
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    key: '',
    description: '',
    icon: 'ph:package',
    gradient: 'budget',
    order: 0,
    isActive: true
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    title: category.title,
    key: category.key,
    description: category.description,
    icon: category.icon,
    gradient: category.gradient,
    order: category.order || 0,
    isActive: category.isActive !== false
  }
  showEditModal.value = true
}

const saveCategory = async () => {
  submitting.value = true
  
  try {
    if (showEditModal.value && editingCategory.value) {
      // Update existing category
      await $fetch(`/api/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      // Create new category
      await $fetch('/api/admin/categories', {
        method: 'POST',
        body: form.value
      })
    }
    
    closeModal()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (category) => {
  try {
    await $fetch(`/api/admin/categories/${category.id}`, {
      method: 'PATCH',
      body: { isActive: category.isActive }
    })
  } catch (error) {
    console.error('Failed to update status:', error)
    category.isActive = !category.isActive // Revert on error
  }
}

const deleteCategory = async (category) => {
  if (!confirm(`确定要删除分类"${category.title}"吗？此操作不可恢复。`)) {
    return
  }
  
  try {
    await $fetch(`/api/admin/categories/${category.id}`, {
      method: 'DELETE'
    })
    
    categories.value = categories.value.filter(c => c.id !== category.id)
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

// Initialize
onMounted(() => {
  fetchCategories()
})
</script>