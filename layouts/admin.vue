<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center justify-between px-6 bg-gray-900">
          <NuxtLink to="/admin/dashboard" class="flex items-center gap-2">
            <Icon name="ph:chart-bar-fill" class="w-8 h-8 text-primary-400" />
            <span class="text-xl font-bold text-white">VPS Admin</span>
          </NuxtLink>
          <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
            <Icon name="ph:x" class="w-6 h-6" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-3 py-4">
          <NuxtLink v-for="item in navigation" :key="item.name" :to="item.href" 
                    class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    :class="isActive(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">
            <Icon :name="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
            {{ item.name }}
            <span v-if="item.count" class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
              {{ item.count }}
            </span>
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div class="border-t border-gray-700 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Icon name="ph:user-bold" class="h-6 w-6 text-white" />
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-white">管理员</p>
              <p class="text-xs text-gray-400">admin@vpsdeals.com</p>
            </div>
            <button @click="logout" class="ml-2 text-gray-400 hover:text-white transition-colors">
              <Icon name="ph:sign-out" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64 flex flex-col flex-1">
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button @click="sidebarOpen = true" class="lg:hidden -m-2.5 p-2.5 text-gray-400 hover:text-white">
          <Icon name="ph:list" class="h-6 w-6" />
        </button>

        <!-- Breadcrumb -->
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex items-center gap-x-2 text-sm">
            <NuxtLink to="/admin/dashboard" class="text-gray-400 hover:text-white transition-colors">控制台</NuxtLink>
            <Icon name="ph:caret-right" class="h-4 w-4 text-gray-500" />
            <span class="text-white">{{ currentPageName }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <button class="text-gray-400 hover:text-white transition-colors">
            <Icon name="ph:bell" class="h-6 w-6" />
          </button>
          <button @click="toggleColorMode" class="text-gray-400 hover:text-white transition-colors">
            <Icon :name="$colorMode.value === 'dark' ? 'ph:sun' : 'ph:moon'" class="h-6 w-6" />
          </button>
          <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">
            <Icon name="ph:globe" class="h-6 w-6" />
          </NuxtLink>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const sidebarOpen = ref(false)

// Navigation items
const navigation = [
  { name: '仪表板', href: '/admin/dashboard', icon: 'ph:chart-bar' },
  { name: 'VPS管理', href: '/admin/vps', icon: 'ph:package' },
  { name: '分类管理', href: '/admin/categories', icon: 'ph:folders' },
  { name: '用户管理', href: '/admin/users', icon: 'ph:users' },
  { name: '评论管理', href: '/admin/reviews', icon: 'ph:chat-text' },
  { name: '数据统计', href: '/admin/analytics', icon: 'ph:chart-line-up' },
  { name: '系统设置', href: '/admin/settings', icon: 'ph:gear' },
]

// Check if route is active
const isActive = (href: string) => {
  return route.path.startsWith(href)
}

// Get current page name
const currentPageName = computed(() => {
  const item = navigation.find(i => isActive(i.href))
  return item?.name || '页面'
})

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Logout
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/admin')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>