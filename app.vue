<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <NuxtPage />
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Notifications -->
    <NotificationSystem />
    
    <!-- Back to Top -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  bodyAttrs: {
    class: 'font-sans antialiased'
  }
})

// Dark mode initialization
const colorMode = useColorMode()

onMounted(() => {
  // Initialize theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    colorMode.preference = 'dark'
  }
})
</script>

<style>
/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Layout transitions */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}

.layout-enter-from {
  opacity: 0;
}

.layout-leave-to {
  opacity: 0;
}
</style>