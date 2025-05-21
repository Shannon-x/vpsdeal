<template>
  <footer class="bg-gray-800 text-white py-4">
    <div class="container mx-auto px-4">
      <!-- 网站描述 -->
      <div class="text-center mb-3">
        <div class="flex items-center justify-center mb-2">
          <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white font-bold text-sm">VPS</span>
          </div>
          <h3 class="text-lg font-bold text-white">优惠VPS推荐</h3>
        </div>
        <p class="text-gray-300">您的一站式VPS优惠信息网站</p>
      </div>
      
      <!-- 网站统计 -->
      <div class="py-3">
        <div class="flex justify-center items-center">
          <div class="text-center px-4">
            <div class="text-xl font-bold text-indigo-400 transition-all duration-500">{{ visitorStats.totalVisits }}</div>
            <div class="text-xs text-gray-300">总访问量</div>
          </div>
          <div class="h-6 border-l border-gray-700"></div>
          <div class="text-center px-4">
            <div class="text-xl font-bold text-indigo-400 transition-all duration-500">{{ visitorStats.todayVisits }}</div>
            <div class="text-xs text-gray-300">今日访问</div>
          </div>
          <div class="h-6 border-l border-gray-700"></div>
          <div class="text-center px-4">
            <div class="text-xl font-bold text-indigo-400 transition-all duration-500">{{ visitorStats.onlineUsers }}</div>
            <div class="text-xs text-gray-300">在线用户</div>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="text-center text-gray-300 text-xs mt-3">
        <p>&copy; {{ new Date().getFullYear() }} 优惠VPS推荐. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Footer',
  setup() {
    const store = useStore();
    
    // 访问量统计数据 - 使用数字以便于计算
    const visitorStats = ref({
      totalVisits: 10520,
      todayVisits: 142,
      onlineUsers: 15
    });
    
    // 格式化数字为显示格式
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // 随机增加在线用户数（-2到+3之间的变化）
    const updateOnlineUsers = () => {
      const change = Math.floor(Math.random() * 6) - 2; // -2到+3的随机数
      let newValue = visitorStats.value.onlineUsers + change;
      // 确保不小于5
      visitorStats.value.onlineUsers = Math.max(5, newValue);
    };
    
    // 增加访问量
    const updateVisits = () => {
      // 有一定概率增加总访问量和今日访问量
      if (Math.random() > 0.3) { // 70%概率增加
        visitorStats.value.totalVisits += 1;
        visitorStats.value.todayVisits += 1;
      }
    };
    
    // 每个值的定时器ID
    let onlineUsersTimer = null;
    let visitsTimer = null;
    
    // 在组件挂载时开始定时更新
    onMounted(() => {
      // 每10-15秒更新一次在线用户数
      onlineUsersTimer = setInterval(() => {
        updateOnlineUsers();
      }, 10000 + Math.random() * 5000);
      
      // 每5-8秒更新一次访问量
      visitsTimer = setInterval(() => {
        updateVisits();
      }, 5000 + Math.random() * 3000);
      
      // 初始加载随机化数据
      visitorStats.value.totalVisits = 10520 + Math.floor(Math.random() * 100);
      visitorStats.value.todayVisits = 142 + Math.floor(Math.random() * 20);
      visitorStats.value.onlineUsers = 15 + Math.floor(Math.random() * 5);
    });
    
    // 组件卸载时清除定时器
    onUnmounted(() => {
      if (onlineUsersTimer) clearInterval(onlineUsersTimer);
      if (visitsTimer) clearInterval(visitsTimer);
    });
    
    return {
      // 使用代理自动格式化数字
      visitorStats: {
        get totalVisits() {
          return formatNumber(visitorStats.value.totalVisits) + '+';
        },
        get todayVisits() {
          return formatNumber(visitorStats.value.todayVisits);
        },
        get onlineUsers() {
          return formatNumber(visitorStats.value.onlineUsers);
        }
      }
    };
  }
}
</script>

<style scoped>
/* 数字变化动画 */
.text-indigo-400 {
  transition: all 0.3s ease-in-out;
}

/* 动画效果 */
@keyframes fadeUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-section {
  animation: fadeUp 0.8s;
}

/* 数字闪烁效果 */
@keyframes highlight {
  0% { color: theme('colors.indigo.400'); }
  50% { color: theme('colors.indigo.300'); }
  100% { color: theme('colors.indigo.400'); }
}

.text-xl {
  position: relative;
}

.text-xl.updated {
  animation: highlight 1s;
}
</style> 