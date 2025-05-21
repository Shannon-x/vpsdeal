<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">修改管理员账户</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          更新您的管理后台用户名和密码
        </p>
      </div>
    </div>
    
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <form @submit.prevent="changePassword" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">管理员用户名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input 
                v-model="username"
                type="text" 
                id="username" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            <p class="mt-1 text-xs text-gray-500">修改管理员账户的用户名</p>
          </div>
        
          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input 
                v-model="currentPassword"
                type="password" 
                id="current-password" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            <p class="mt-1 text-xs text-gray-500">请输入您的当前密码</p>
          </div>
          
          <div class="mb-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input 
              v-model="newPassword" 
              type="password" 
              id="newPassword" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="请输入新密码"
            />
            <!-- 密码强度指示器 -->
            <div v-if="newPassword" class="mt-2">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500">密码强度:</span>
                <span class="text-xs font-medium" :class="`text-${passwordStrengthColor}-600`">{{ passwordStrengthText }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.min(100, passwordStrength * 16.7)}%` }"
                  :class="`bg-${passwordStrengthColor}-500`"
                ></div>
              </div>
              <div class="mt-1 text-xs text-gray-500">
                <ul class="space-y-1 pl-5 list-disc">
                  <li>至少8个字符</li>
                  <li>包含大小写字母、数字和特殊字符</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <input 
                v-model="confirmPassword"
                type="password" 
                id="confirm-password" 
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            <p class="mt-1 text-xs text-gray-500">请再次输入新密码确认</p>
          </div>
        </div>
        
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded">
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
        
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            :disabled="isLoading"
          >
            <svg v-if="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? '保存中...' : '更新密码' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import bcrypt from 'bcryptjs';

// 验证密码的兼容方法
const verifyPasswordWithBcrypt = async (inputPassword, storedCredentials) => {
  try {
    // 如果有bcrypt哈希
    if (storedCredentials.passwordHash && storedCredentials.usesBcrypt) {
      return await bcrypt.compare(inputPassword, storedCredentials.passwordHash);
    }
    // 如果是旧的加密方式，从store获取验证方法
    else if (storedCredentials.isEncrypted) {
      // 这里需要实现解密逻辑，但为简单起见，我们可以直接与默认凭据比较
      return inputPassword === storedCredentials.password;
    }
    // 直接比较（兼容模式）
    else {
      return inputPassword === storedCredentials.password;
    }
  } catch (e) {
    console.error('密码验证失败:', e);
    return false;
  }
};

export default {
  name: 'PasswordChange',
  setup() {
    const username = ref('');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const isLoading = ref(false);
    const store = useStore();
    
    // 密码强度检查
    const passwordStrength = ref(0);
    const passwordStrengthText = ref('');
    const passwordStrengthColor = ref('red');

    // 检查密码强度
    const checkPasswordStrength = (password) => {
      if (!password) {
        passwordStrength.value = 0;
        passwordStrengthText.value = '';
        return;
      }
      
      let strength = 0;
      
      // 检查长度
      if (password.length >= 8) strength += 1;
      if (password.length >= 12) strength += 1;
      
      // 检查复杂性
      if (/[A-Z]/.test(password)) strength += 1; // 大写字母
      if (/[a-z]/.test(password)) strength += 1; // 小写字母
      if (/[0-9]/.test(password)) strength += 1; // 数字
      if (/[^A-Za-z0-9]/.test(password)) strength += 1; // 特殊字符
      
      // 设置强度级别
      passwordStrength.value = strength;
      
      // 更新显示
      if (strength <= 2) {
        passwordStrengthText.value = '弱';
        passwordStrengthColor.value = 'red';
      } else if (strength <= 4) {
        passwordStrengthText.value = '中';
        passwordStrengthColor.value = 'orange';
      } else {
        passwordStrengthText.value = '强';
        passwordStrengthColor.value = 'green';
      }
    };

    // 监听密码变化
    watch(newPassword, (value) => {
      checkPasswordStrength(value);
    });
    
    // 确保从localStorage获取最新凭据
    const loadCredentialsFromLocalStorage = () => {
      try {
        const savedCredentials = localStorage.getItem('admin-credentials');
        if (savedCredentials) {
          console.log('从localStorage读取到的原始凭据:', savedCredentials);
          const credentials = JSON.parse(savedCredentials);
          console.log('解析后的凭据对象:', {
            username: credentials.username,
            password: credentials.password ? '(password存在)' : '(password不存在)',
            passwordHash: credentials.passwordHash ? '(passwordHash存在)' : '(passwordHash不存在)',
            usesBcrypt: credentials.usesBcrypt || false
          });
          
          // 只在初始化时更新用户名，避免用户修改时被覆盖
          if (!username.value) {
            username.value = credentials.username;
          }
          
          return credentials;
        }
      } catch (e) {
        console.error('从本地存储加载管理员凭据失败：', e);
      }
      // 如果没有保存的凭据或加载失败，则使用store中的凭据
      console.log('未找到localStorage凭据，使用store中的凭据');
      return store.state.adminAuth.credentials;
    };
    
    const changePassword = async () => {
      // 重置错误
      error.value = '';
      
      // 验证
      if (newPassword.value.length < 8) {
        error.value = '新密码长度必须至少为8个字符';
        return;
      }
      
      if (passwordStrength.value < 4) {
        error.value = '密码强度不足，请包含大小写字母、数字和特殊字符';
        return;
      }
      
      if (newPassword.value !== confirmPassword.value) {
        error.value = '两次输入的新密码不匹配';
        return;
      }
      
      // 从localStorage获取最新的凭据
      const currentCredentials = loadCredentialsFromLocalStorage();
      
      // 验证当前密码
      const isPasswordValid = await verifyPasswordWithBcrypt(currentPassword.value, currentCredentials);
      
      if (!isPasswordValid) {
        // 额外检查是否为默认密码
        const isDefaultPassword = 
          (currentPassword.value === 'xetwuh-supqyw-7xidQy') && 
          (currentCredentials.username === 'shannon2206') && 
          (!currentCredentials.isCustomized);
          
        if (!isDefaultPassword) {
          error.value = '当前密码不正确';
          console.error('当前密码验证失败');
          return;
        }
      }
      
      console.log('当前密码验证成功');
      
      // 模拟加载
      isLoading.value = true;
      
      setTimeout(() => {
        try {
          // 先清除登录状态以确保状态刷新
          localStorage.removeItem('admin-auth');
          
          // 更新Vuex store中的密码
          store.commit('updateAdminPassword', newPassword.value);
          
          // 更新Vuex store中的用户名
          if (username.value !== store.state.adminAuth.credentials.username) {
            store.commit('updateAdminUsername', username.value);
          }
          
          // 创建新的登录状态
          const authData = {
            isLoggedIn: true,
            username: username.value,
            timestamp: Date.now()
          };
          localStorage.setItem('admin-auth', JSON.stringify(authData));
          
          // 强制刷新登录状态
          store.commit('syncLoginStatus');
          
          // 显示成功通知
          if (window.$notification) {
            window.$notification.success('账户已更新', '您的管理员账户信息已成功更新');
          }
          
          // 重置表单
          currentPassword.value = '';
          newPassword.value = '';
          confirmPassword.value = '';
          
          // 显示提示信息
          error.value = '密码已成功更新！';
        } catch (e) {
          error.value = '密码更新失败，请重试';
          console.error('密码更新失败:', e);
          
          if (window.$notification) {
            window.$notification.error('更新失败', '密码更新过程中发生错误');
          }
        } finally {
          isLoading.value = false;
        }
      }, 1000);
    };
    
    // 组件挂载时初始化
    onMounted(() => {
      // 从localStorage获取最新的凭据
      const currentCredentials = loadCredentialsFromLocalStorage();
      username.value = currentCredentials.username;
      console.log('加载的凭据:', {
        username: currentCredentials.username,
        passwordHash: currentCredentials.passwordHash ? '(已设置)' : '(未设置)',
        usesBcrypt: currentCredentials.usesBcrypt || false
      });
    });
    
    return {
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      error,
      isLoading,
      changePassword,
      passwordStrength,
      passwordStrengthText,
      passwordStrengthColor
    };
  }
};
</script>
