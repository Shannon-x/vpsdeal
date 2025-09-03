<template>
  <div class="min-h-screen bg-gray-900">
    <AdminSidebar />
    
    <div class="lg:pl-64">
      <!-- 顶部导航 -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <h1 class="text-xl font-semibold text-white">系统设置</h1>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <main class="py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <!-- 标签页导航 -->
          <div class="border-b border-gray-800">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                ]"
              >
                <Icon :name="tab.icon" class="mr-2 h-5 w-5" />
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- 基础设置 -->
          <div v-if="activeTab === 'general'" class="mt-8">
            <div class="bg-gray-800 shadow rounded-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-white mb-6">基础设置</h3>
                
                <form @submit.prevent="saveSettings" class="space-y-6">
                  <!-- 网站名称 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      网站名称
                    </label>
                    <input
                      v-model="settings.site_name"
                      type="text"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="输入网站名称"
                    />
                  </div>

                  <!-- 网站描述 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      网站描述
                    </label>
                    <textarea
                      v-model="settings.site_description"
                      rows="3"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="输入网站描述"
                    />
                  </div>

                  <!-- 网站Logo -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      网站Logo
                    </label>
                    <div class="flex items-center space-x-4">
                      <div v-if="settings.site_logo" class="flex-shrink-0">
                        <img :src="settings.site_logo" alt="Logo" class="h-16 w-auto bg-white rounded p-2" />
                      </div>
                      <div>
                        <input
                          type="file"
                          @change="handleLogoUpload"
                          accept="image/*"
                          class="hidden"
                          ref="logoInput"
                        />
                        <button
                          type="button"
                          @click="$refs.logoInput.click()"
                          class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          <Icon name="ph:upload" class="mr-2" />
                          上传Logo
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 网站Favicon -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      网站Favicon
                    </label>
                    <div class="flex items-center space-x-4">
                      <div v-if="settings.site_favicon" class="flex-shrink-0">
                        <img :src="settings.site_favicon" alt="Favicon" class="h-8 w-8" />
                      </div>
                      <div>
                        <input
                          type="file"
                          @change="handleFaviconUpload"
                          accept=".ico,.png,.jpg,.jpeg"
                          class="hidden"
                          ref="faviconInput"
                        />
                        <button
                          type="button"
                          @click="$refs.faviconInput.click()"
                          class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          <Icon name="ph:upload" class="mr-2" />
                          上传Favicon
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 联系邮箱 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      联系邮箱
                    </label>
                    <input
                      v-model="settings.contact_email"
                      type="email"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="admin@example.com"
                    />
                  </div>

                  <!-- 保存按钮 -->
                  <div class="flex justify-end pt-4">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Icon v-if="loading" name="ph:spinner" class="animate-spin mr-2" />
                      {{ loading ? '保存中...' : '保存设置' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- 导航设置 -->
          <div v-if="activeTab === 'navigation'" class="mt-8">
            <div class="bg-gray-800 shadow rounded-lg">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-medium text-white">导航菜单设置</h3>
                  <button
                    @click="showAddMenu = true"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <Icon name="ph:plus" class="mr-2" />
                    添加菜单
                  </button>
                </div>

                <!-- 菜单列表 -->
                <div class="space-y-2">
                  <div
                    v-for="menu in navMenus"
                    :key="menu.id"
                    class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div class="flex items-center space-x-4">
                      <Icon name="ph:dots-six-vertical" class="text-gray-400 cursor-move" />
                      <div>
                        <h4 class="text-white font-medium">{{ menu.title }}</h4>
                        <p class="text-sm text-gray-400">{{ menu.url || `分类: ${menu.category_name}` }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="toggleMenuStatus(menu)"
                        :class="[
                          menu.is_active ? 'bg-green-600' : 'bg-gray-600',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out'
                        ]"
                      >
                        <span
                          :class="[
                            menu.is_active ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          ]"
                        />
                      </button>
                      <button
                        @click="editMenu(menu)"
                        class="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Icon name="ph:pencil" />
                      </button>
                      <button
                        @click="deleteMenu(menu)"
                        class="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Icon name="ph:trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SEO设置 -->
          <div v-if="activeTab === 'seo'" class="mt-8">
            <div class="bg-gray-800 shadow rounded-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-white mb-6">SEO设置</h3>
                
                <form @submit.prevent="saveSettings" class="space-y-6">
                  <!-- 网站关键词 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      网站关键词
                    </label>
                    <input
                      v-model="settings.site_keywords"
                      type="text"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="关键词1, 关键词2, 关键词3"
                    />
                    <p class="mt-1 text-sm text-gray-400">多个关键词用逗号分隔</p>
                  </div>

                  <!-- Google Analytics -->
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      v-model="settings.google_analytics"
                      type="text"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <!-- 保存按钮 -->
                  <div class="flex justify-end pt-4">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Icon v-if="loading" name="ph:spinner" class="animate-spin mr-2" />
                      {{ loading ? '保存中...' : '保存设置' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 添加/编辑菜单弹窗 -->
    <div v-if="showAddMenu" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-white mb-4">
          {{ editingMenu ? '编辑菜单' : '添加菜单' }}
        </h3>
        
        <form @submit.prevent="saveMenu" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              菜单标题
            </label>
            <input
              v-model="menuForm.title"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              链接类型
            </label>
            <select
              v-model="menuForm.type"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="url">自定义链接</option>
              <option value="category">分类链接</option>
            </select>
          </div>

          <div v-if="menuForm.type === 'url'">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              链接地址
            </label>
            <input
              v-model="menuForm.url"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="/"
            />
          </div>

          <div v-else>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              选择分类
            </label>
            <select
              v-model="menuForm.category_id"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              排序
            </label>
            <input
              v-model.number="menuForm.sort_order"
              type="number"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeMenuDialog"
              class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {{ editingMenu ? '更新' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const loading = ref(false)
const activeTab = ref('general')
const settings = ref({})
const navMenus = ref([])
const categories = ref([])
const showAddMenu = ref(false)
const editingMenu = ref(null)
const menuForm = ref({
  title: '',
  type: 'url',
  url: '',
  category_id: null,
  sort_order: 0
})

const tabs = [
  { id: 'general', name: '基础设置', icon: 'ph:gear' },
  { id: 'navigation', name: '导航设置', icon: 'ph:list' },
  { id: 'seo', name: 'SEO设置', icon: 'ph:magnifying-glass' }
]

// 获取设置
const fetchSettings = async () => {
  try {
    const { data } = await $fetch('/api/admin/settings')
    // 将设置数据转换为简单对象
    const settingsObj = {}
    for (const [key, value] of Object.entries(data)) {
      settingsObj[key] = value.value
    }
    settings.value = settingsObj
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
}

// 获取导航菜单
const fetchNavMenus = async () => {
  try {
    const { data } = await $fetch('/api/admin/nav-menus')
    navMenus.value = data
  } catch (error) {
    console.error('Failed to fetch nav menus:', error)
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const { data } = await $fetch('/api/admin/categories')
    categories.value = data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 保存设置
const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: settings.value
    })
    
    await navigateTo('/admin/settings', { 
      external: true,
      replace: true 
    })
  } catch (error) {
    console.error('Failed to save settings:', error)
    alert('保存失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理Logo上传
const handleLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('logo', file)

  try {
    const { data } = await $fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    settings.value.site_logo = data.url
    await saveSettings()
  } catch (error) {
    console.error('Failed to upload logo:', error)
    alert('上传失败，请重试')
  }
}

// 处理Favicon上传
const handleFaviconUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('favicon', file)

  try {
    const { data } = await $fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })
    settings.value.site_favicon = data.url
    await saveSettings()
  } catch (error) {
    console.error('Failed to upload favicon:', error)
    alert('上传失败，请重试')
  }
}

// 切换菜单状态
const toggleMenuStatus = async (menu) => {
  try {
    await $fetch(`/api/admin/nav-menus/${menu.id}`, {
      method: 'PATCH',
      body: { is_active: !menu.is_active }
    })
    menu.is_active = !menu.is_active
  } catch (error) {
    console.error('Failed to toggle menu status:', error)
  }
}

// 编辑菜单
const editMenu = (menu) => {
  editingMenu.value = menu
  menuForm.value = {
    title: menu.title,
    type: menu.url ? 'url' : 'category',
    url: menu.url || '',
    category_id: menu.category_id,
    sort_order: menu.sort_order
  }
  showAddMenu.value = true
}

// 删除菜单
const deleteMenu = async (menu) => {
  if (!confirm('确定要删除这个菜单项吗？')) return

  try {
    await $fetch(`/api/admin/nav-menus/${menu.id}`, {
      method: 'DELETE'
    })
    await fetchNavMenus()
  } catch (error) {
    console.error('Failed to delete menu:', error)
  }
}

// 保存菜单
const saveMenu = async () => {
  try {
    const data = {
      title: menuForm.value.title,
      sort_order: menuForm.value.sort_order
    }

    if (menuForm.value.type === 'url') {
      data.url = menuForm.value.url
      data.category_id = null
    } else {
      data.category_id = menuForm.value.category_id
      data.url = null
    }

    if (editingMenu.value) {
      await $fetch(`/api/admin/nav-menus/${editingMenu.value.id}`, {
        method: 'PUT',
        body: data
      })
    } else {
      await $fetch('/api/admin/nav-menus', {
        method: 'POST',
        body: data
      })
    }

    closeMenuDialog()
    await fetchNavMenus()
  } catch (error) {
    console.error('Failed to save menu:', error)
    alert('保存失败，请重试')
  }
}

// 关闭菜单弹窗
const closeMenuDialog = () => {
  showAddMenu.value = false
  editingMenu.value = null
  menuForm.value = {
    title: '',
    type: 'url',
    url: '',
    category_id: null,
    sort_order: 0
  }
}

// 初始化
onMounted(() => {
  fetchSettings()
  fetchNavMenus()
  fetchCategories()
})
</script>