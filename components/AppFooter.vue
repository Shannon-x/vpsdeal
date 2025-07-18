<template>
  <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
    <!-- Main Footer Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-2xl font-display font-bold mb-4 gradient-text-animated">
            VPS Deals
          </h3>
          <p class="text-gray-400 mb-6 leading-relaxed">
            发现全球最优惠的VPS主机方案。我们精心挑选高性价比的VPS服务商，
            为您提供可靠的云服务器解决方案。
          </p>
          <div class="flex space-x-4">
            <a href="#" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Icon name="ph:twitter-logo-bold" class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Icon name="ph:telegram-logo-bold" class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Icon name="ph:github-logo-bold" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-4">快速链接</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-white transition-colors">
                首页
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/deals" class="text-gray-400 hover:text-white transition-colors">
                优惠列表
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/categories" class="text-gray-400 hover:text-white transition-colors">
                分类浏览
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-400 hover:text-white transition-colors">
                关于我们
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-semibold mb-4">联系我们</h4>
          <ul class="space-y-3 text-gray-400">
            <li class="flex items-center space-x-2">
              <Icon name="ph:envelope-bold" class="w-5 h-5 text-primary-400" />
              <span>contact@vpsdeals.com</span>
            </li>
            <li class="flex items-center space-x-2">
              <Icon name="ph:telegram-logo-bold" class="w-5 h-5 text-primary-400" />
              <span>@vpsdeals</span>
            </li>
            <li class="flex items-center space-x-2">
              <Icon name="ph:clock-bold" class="w-5 h-5 text-primary-400" />
              <span>24/7 在线支持</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-sm text-gray-400">
            © {{ currentYear }} VPS Deals. All rights reserved.
          </p>
          <div class="flex space-x-6 text-sm">
            <NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">
              隐私政策
            </NuxtLink>
            <NuxtLink to="/terms" class="text-gray-400 hover:text-white transition-colors">
              服务条款
            </NuxtLink>
            <NuxtLink to="/sitemap" class="text-gray-400 hover:text-white transition-colors">
              网站地图
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = computed(() => new Date().getFullYear())
</script>