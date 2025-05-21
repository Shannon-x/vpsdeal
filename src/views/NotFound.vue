<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    
    <main class="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-primary-600">404</h1>
        <h2 class="text-3xl font-semibold text-gray-900 mt-4">页面未找到</h2>
        <p class="text-gray-600 mt-2 max-w-md mx-auto">抱歉，您请求的页面不存在或已被移除。</p>
        <div class="mt-6">
          <router-link to="/" class="btn btn-primary px-6 py-3">
            返回首页
          </router-link>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'NotFound',
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>
.text-9xl {
  font-size: 9rem;
  line-height: 1;
}
</style> 