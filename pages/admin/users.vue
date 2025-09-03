<template>
  <div class="min-h-screen bg-gray-900">
    <AdminSidebar />
    
    <div class="lg:pl-64">
      <!-- 顶部导航 -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <h1 class="text-xl font-semibold text-white">用户管理</h1>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <main class="py-8">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <!-- 个人信息卡片 -->
          <div class="bg-gray-800 shadow rounded-lg mb-8">
            <div class="px-6 py-4 border-b border-gray-700">
              <h2 class="text-lg font-medium text-white">个人信息</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">用户名</label>
                  <p class="text-white">{{ adminInfo.username }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">邮箱</label>
                  <p class="text-white">{{ adminInfo.email || '未设置' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">角色</label>
                  <p class="text-white">超级管理员</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">最后登录</label>
                  <p class="text-white">{{ formatDate(adminInfo.last_login) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 修改密码卡片 -->
          <div class="bg-gray-800 shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-700">
              <h2 class="text-lg font-medium text-white">修改密码</h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="changePassword" class="space-y-6">
                <!-- 当前密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    当前密码
                  </label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <!-- 新密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    新密码
                  </label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p class="mt-1 text-sm text-gray-400">密码长度至少6个字符</p>
                </div>

                <!-- 确认新密码 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    确认新密码
                  </label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    required
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <!-- 错误提示 -->
                <div v-if="error" class="p-4 bg-red-900/20 border border-red-800 rounded-md">
                  <p class="text-sm text-red-400">{{ error }}</p>
                </div>

                <!-- 成功提示 -->
                <div v-if="success" class="p-4 bg-green-900/20 border border-green-800 rounded-md">
                  <p class="text-sm text-green-400">{{ success }}</p>
                </div>

                <!-- 提交按钮 -->
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <Icon v-if="loading" name="ph:spinner" class="animate-spin mr-2" />
                    {{ loading ? '修改中...' : '修改密码' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 操作日志 -->
          <div class="bg-gray-800 shadow rounded-lg mt-8">
            <div class="px-6 py-4 border-b border-gray-700">
              <h2 class="text-lg font-medium text-white">最近操作日志</h2>
            </div>
            <div class="p-6">
              <div v-if="logs.length === 0" class="text-center py-8">
                <p class="text-gray-400">暂无操作日志</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="log in logs" :key="log.id" class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  </div>
                  <div class="flex-1">
                    <p class="text-white">{{ log.action }}</p>
                    <p class="text-sm text-gray-400">{{ formatDate(log.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const adminInfo = ref({
  username: 'admin',
  email: '',
  last_login: new Date()
})
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const logs = ref([])

// 格式化日期
const formatDate = (date) => {
  if (!date) return '从未'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取管理员信息
const fetchAdminInfo = async () => {
  // TODO: 实现获取管理员信息的API
  const username = localStorage.getItem('admin-username') || 'admin'
  adminInfo.value.username = username
}

// 获取操作日志
const fetchLogs = async () => {
  try {
    const { data } = await $fetch('/api/admin/logs/me')
    logs.value = data || []
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  }
}

// 修改密码
const changePassword = async () => {
  error.value = ''
  success.value = ''

  // 验证密码
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    error.value = '两次输入的新密码不一致'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    error.value = '新密码长度至少6个字符'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/admin/users/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })

    success.value = '密码修改成功！'
    
    // 清空表单
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.data?.statusMessage || '密码修改失败，请重试'
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchAdminInfo()
  fetchLogs()
})
</script>