<template>
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-purple rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative bg-gradient-to-r from-primary-500 to-accent-purple text-white font-bold text-xl px-4 py-2 rounded-lg">
              VPS Deals
            </div>
          </div>
          <span class="text-lg font-display font-semibold hidden sm:inline gradient-text-animated">
            超值优惠推荐
          </span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            class="relative font-medium text-gray-300 hover:text-primary-400 transition-colors group"
          >
            <span>{{ link.name }}</span>
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-purple group-hover:w-full transition-all duration-300"></span>
          </NuxtLink>
          
          <!-- 分类下拉菜单 -->
          <div class="relative" @mouseenter="showCategoryDropdown = true" @mouseleave="showCategoryDropdown = false">
            <button class="relative font-medium text-gray-300 hover:text-primary-400 transition-colors group flex items-center space-x-1">
              <span>分类浏览</span>
              <Icon name="ph:caret-down-bold" class="w-4 h-4" />
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-purple group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="showCategoryDropdown" class="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 max-h-96 overflow-y-auto">
                <NuxtLink
                  v-for="category in categories"
                  :key="category.id"
                  :to="`/categories/${category.slug}`"
                  class="flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span>{{ category.name }}</span>
                  <span class="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">{{ category.vps_count }}</span>
                </NuxtLink>
                <NuxtLink
                  to="/categories"
                  class="block px-4 py-2 text-primary-400 hover:bg-gray-700 border-t border-gray-700 mt-2"
                >
                  查看全部分类
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
            aria-label="切换主题"
          >
            <Icon name="ph:sun-bold" v-if="isDark" class="w-5 h-5" />
            <Icon name="ph:moon-bold" v-else class="w-5 h-5" />
          </button>

          <!-- Admin Login -->
          <NuxtLink
            to="/admin"
            class="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Icon name="ph:user-circle-bold" class="w-5 h-5" />
            <span>管理后台</span>
          </NuxtLink>

          <!-- Mobile Menu Toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
          >
            <Icon name="ph:list-bold" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden mt-4 py-4 border-t border-gray-800">
          <div class="space-y-2">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {{ link.name }}
            </NuxtLink>
            
            <!-- 移动端分类 -->
            <div class="border-t border-gray-700 mt-2 pt-2">
              <p class="px-4 py-2 text-sm font-semibold text-gray-500">VPS分类</p>
              <NuxtLink
                v-for="category in categories"
                :key="category.id"
                :to="`/categories/${category.slug}`"
                @click="mobileMenuOpen = false"
                class="flex items-center justify-between px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <span>{{ category.name }}</span>
                <span class="text-xs text-gray-500">{{ category.vps_count }}</span>
              </NuxtLink>
            </div>
            <NuxtLink
              to="/admin"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center"
            >
              管理后台
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const mobileMenuOpen = ref(false)
const showCategoryDropdown = ref(false)
const categories = ref([])

const navLinks = [
  { name: '首页', path: '/' },
  { name: '全部优惠', path: '/deals' },
  { name: '关于我们', path: '/about' }
]

// 获取分类列表
const fetchCategories = async () => {
  try {
    const data = await $fetch('/api/categories')
    categories.value = data.filter(cat => cat.vps_count > 0)
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

onMounted(() => {
  fetchCategories()
})
</script>