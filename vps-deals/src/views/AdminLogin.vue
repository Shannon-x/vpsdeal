<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- 登录表单头部 -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-center">VPS 推荐网站后台</h1>
        <p class="text-center text-blue-100 mt-1">请登录以管理VPS数据</p>
      </div>
      
      <!-- 登录表单 -->
      <div class="p-6">
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
        
        <!-- 账户锁定提示 -->
        <div v-if="isLocked" class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="font-medium">账户已锁定</p>
              <p class="mt-1">由于多次登录失败，账户已临时锁定。请在 {{ remainingTime }} 分钟后重试，或联系管理员解锁。</p>
            </div>
          </div>
        </div>
        
        <!-- 登录尝试警告 -->
        <div v-if="!isLocked && attempts > 0" class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="mt-1">已尝试登录 {{ attempts }} 次，超过 {{ maxAttempts }} 次将触发账户锁定。</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="管理员用户名"
                required
              >
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="管理员密码"
                required
              >
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? '验证中...' : '登录' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 flex items-center justify-center">
          <router-link to="/" class="text-sm text-blue-600 hover:text-blue-500 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import bcrypt from 'bcryptjs';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    
    // 新增的状态
    const isLocked = ref(false);
    const remainingTime = ref(0);
    const attempts = ref(0);
    const maxAttempts = ref(3); // 开始锁定的尝试次数
    
    // 在组件挂载时检查登录状态和锁定状态
    onMounted(() => {
      // 强制刷新登录状态检查
      store.commit('checkLoginStatus');
      
      // 检查账户是否被锁定
      try {
        const loginAttemptsData = localStorage.getItem('login-attempts');
        if (loginAttemptsData) {
          const attempts = JSON.parse(loginAttemptsData);
          const now = Date.now();
          
          if (attempts.lockedUntil > now) {
            isLocked.value = true;
            remainingTime.value = Math.ceil((attempts.lockedUntil - now) / (60 * 1000));
          }
        }
      } catch (e) {
        console.error('读取登录尝试记录失败:', e);
      }
      
      // 如果用户已登录，直接重定向到管理面板
      if (store.getters.isLoggedIn) {
        router.push('/adminshuhao1031/panel');
      }
    });
    
    // 监听登录状态变化
    watch(() => store.getters.isLoggedIn, (newValue) => {
      if (newValue === true) {
        console.log('检测到登录状态变为true，准备跳转到管理面板');
        router.push('/adminshuhao1031/panel');
      }
    });
    
    // 登录验证
    const login = async () => {
      // 清除之前的错误
      error.value = '';
      isLoading.value = true;
      
      // 检查登录凭据是否为空
      if (!username.value || !password.value) {
        error.value = '请输入用户名和密码';
        isLoading.value = false;
        return;
      }
      
      // 检查账户是否被锁定
      if (isLocked.value) {
        error.value = `账户已被锁定，请在 ${remainingTime.value} 分钟后重试`;
        isLoading.value = false;
        return;
      }
      
      console.log('开始登录验证');
      
      try {
        // 获取登录结果
        const result = await new Promise((resolve) => {
          // 调用store的login方法
          const loginResult = store.commit('login', {
            username: username.value,
            password: password.value
          });
          
          // 如果异步处理中，等待一段时间检查登录状态
          if (loginResult && loginResult.success === 'pending') {
            console.log('登录请求处于等待状态，等待验证...');
            setTimeout(() => {
              if (store.getters.isLoggedIn) {
                resolve({ success: true });
              } else {
                resolve({ success: false });
              }
            }, 1000); // 给异步验证一些时间
          } else {
            // 如果是同步结果
            resolve(loginResult || { success: store.getters.isLoggedIn });
          }
        });
        
        // 检查登录状态
        if (result.success === true || store.getters.isLoggedIn) {
          console.log('登录成功，由watch处理跳转');
        } else {
          // 登录失败
          // 从localStorage获取登录尝试信息
          try {
            const loginAttemptsData = localStorage.getItem('login-attempts');
            if (loginAttemptsData) {
              const attemptsData = JSON.parse(loginAttemptsData);
              
              if (attemptsData.lockedUntil > Date.now()) {
                // 账户已锁定
                isLocked.value = true;
                remainingTime.value = Math.ceil((attemptsData.lockedUntil - Date.now()) / (60 * 1000));
                error.value = `账户已被锁定，请在 ${remainingTime.value} 分钟后重试`;
              } else {
                // 显示剩余尝试次数
                attempts.value = attemptsData.count;
                const remaining = maxAttempts.value - attempts.value;
                error.value = `用户名或密码不正确，还有 ${remaining > 0 ? remaining : 0} 次尝试机会`;
                
                // 如果剩余尝试次数为0，显示锁定警告
                if (remaining <= 0) {
                  error.value += '。继续尝试将导致账户锁定';
                }
              }
            } else {
              error.value = '用户名或密码不正确';
            }
          } catch (e) {
            console.error('读取登录尝试失败:', e);
            error.value = '用户名或密码不正确';
          }
        }
      } catch (e) {
        console.error('登录过程中发生错误:', e);
        error.value = '登录过程中发生错误，请重试';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      username,
      password,
      error,
      login,
      isLocked,
      remainingTime,
      attempts,
      maxAttempts,
      isLoading
    };
  }
};
</script>
