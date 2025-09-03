<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white">管理后台</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">请登录以继续</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <form @submit.prevent="handleLogin">
          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              用户名
            </label>
            <input
              v-model="credentials.username"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入用户名"
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              密码
            </label>
            <input
              v-model="credentials.password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入密码"
            />
          </div>

          <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
            <p class="text-red-500 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="!loading">登录</span>
            <Icon v-else name="svg-spinners:3-dots-scale" class="w-5 h-5" />
          </button>
        </form>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">
          ← 返回首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '管理员登录 - VPS Deals',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const config = useRuntimeConfig()
const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await $fetch(`${config.public.apiBase}/api/admin/login`, {
      method: 'POST',
      body: credentials.value
    })

    if (response.token) {
      // 保存token到cookie或localStorage
      const token = useCookie('admin-token', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7天
      })
      token.value = response.token

      // 跳转到管理后台
      await navigateTo('/admin/dashboard')
    }
  } catch (err) {
    error.value = err.data?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>