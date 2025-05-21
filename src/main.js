import { createApp } from 'vue';
import App from './App.vue'; // SFC compiled via vue runtime compiler
import router from './router';
import store from './store';
import './assets/css/tailwind.css'; // 使用 Tailwind CSS

// 全局通知系统
window.$notification = {
  success: (title, message) => {
    store.commit('setNotification', { 
      show: true, 
      type: 'success', 
      message: `${title}: ${message}` 
    });
    
    setTimeout(() => {
      store.commit('hideNotification');
    }, 5000);
  },
  error: (title, message) => {
    store.commit('setNotification', { 
      show: true, 
      type: 'error', 
      message: `${title}: ${message}` 
    });
    
    setTimeout(() => {
      store.commit('hideNotification');
    }, 5000);
  }
};

// 添加初始化代码，在应用启动时清除旧的admin/admin凭据
function migrateAdminCredentials() {
  try {
    const data = localStorage.getItem('admin-credentials');
    if (data) {
      const credentials = JSON.parse(data);
      
      // 检测并迁移旧的默认凭据
      if (credentials.username === 'admin') {
        console.log('应用启动时检测到旧用户名，强制迁移凭据');
        
        // 删除旧凭据
        localStorage.removeItem('admin-credentials');
        localStorage.removeItem('admin-auth');
        
        // 重置为新默认凭据
        localStorage.setItem('admin-credentials', JSON.stringify({
          username: 'shannon2206',
          password: btoa('xetwuh-supqyw-7xidQy'), // 临时简单加密
          isEncrypted: false,
          isCustomized: false
        }));
      }
    }
  } catch (e) {
    console.error('应用启动时凭据迁移失败:', e);
  }
}

// 在应用启动时立即执行迁移
migrateAdminCredentials();

// 如果访问 /adminshuhao1031 或其子路径且没有 hash，重定向到对应的 hash 路径
const path = window.location.pathname;
if (path.startsWith('/adminshuhao1031') && !window.location.hash) {
  // 计算子路由：根登录页为 '/login'
  const sub = path === '/adminshuhao1031' ? '/login' : path.replace('/adminshuhao1031', '');
  window.location.replace(`/adminshuhao1031#${sub}`);
}

// 创建Vue应用实例
const app = createApp(App);

// 使用路由和状态管理
app.use(router);
app.use(store);

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err);
  console.error('出错组件:', vm);
  console.error('错误信息:', info);
  
  if (window.$notification) {
    window.$notification.error('应用错误', '发生了未预期的错误，请刷新页面重试');
  }
};

// 添加全局通知组件
app.config.globalProperties.$notification = {
  success(title, message) {
    store.commit('setNotification', {
      show: true,
      type: 'success',
      message: `<strong>${title}</strong><br>${message}`
    });
  },
  error(title, message) {
    store.commit('setNotification', {
      show: true,
      type: 'error',
      message: `<strong>${title}</strong><br>${message}`
    });
  },
  warning(title, message) {
    store.commit('setNotification', {
      show: true,
      type: 'warning',
      message: `<strong>${title}</strong><br>${message}`
    });
  },
  info(title, message) {
    store.commit('setNotification', {
      show: true,
      type: 'info',
      message: `<strong>${title}</strong><br>${message}`
    });
  }
};

// 添加登录恢复辅助函数
app.config.globalProperties.$resetAdminCredentials = () => {
  // 调用store的resetAdmin方法
  store.commit('resetAdmin');
};

// 记录初始加载
console.log('应用已加载，版本 1.0.0');

// 挂载到DOM
app.mount('#app');