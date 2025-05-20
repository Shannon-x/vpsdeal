<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">网站访问统计</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          实时监控网站的访问量与用户活跃度
        </p>
      </div>
      <div>
        <button 
          @click="resetStats" 
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          重置
        </button>
      </div>
    </div>
    
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 总访问量 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">总访问量</div>
                <div class="text-2xl font-bold text-blue-700">{{ formatNumber(visitStats.totalVisits) }}</div>
              </div>
            </div>
            <div>
              <button 
                @click="incrementTotalVisits" 
                class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                title="手动增加访问量"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 今日访问量 -->
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">今日访问量</div>
                <div class="text-2xl font-bold text-green-700">{{ formatNumber(visitStats.todayVisits) }}</div>
              </div>
            </div>
            <div>
              <button 
                @click="incrementTodayVisits" 
                class="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                title="手动增加今日访问量"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            最近更新: {{ formatDate(visitStats.lastUpdated) }}
          </div>
        </div>
        
        <!-- 在线用户 -->
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">在线用户</div>
                <div class="text-2xl font-bold text-purple-700">{{ formatNumber(visitStats.onlineUsers) }}</div>
              </div>
            </div>
            <div class="flex space-x-1">
              <button 
                @click="decrementOnlineUsers" 
                class="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-100 transition-colors"
                title="减少在线用户"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <button 
                @click="incrementOnlineUsers" 
                class="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-purple-100 transition-colors"
                title="增加在线用户"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 日志记录和操作区域 -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-700">访问记录</h4>
          <div>
            <button 
              @click="addRandomVisits"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
              </svg>
              模拟访问
            </button>
          </div>
        </div>
        <div class="max-h-32 overflow-y-auto text-xs text-gray-600 border border-gray-200 rounded p-2 bg-white">
          <div v-if="logs.length === 0" class="text-center py-2 text-gray-400">
            暂无访问记录
          </div>
          <div v-for="(log, index) in logs" :key="index" class="py-1 border-b border-gray-100 last:border-0">
            <span class="text-gray-500">[{{ log.time }}]</span> {{ log.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'VisitStatsPanel',
  setup() {
    const store = useStore();
    const logs = ref([]);
    
    // 从store获取访问统计数据
    const visitStats = computed(() => store.getters.getVisitStats);
    
    // 格式化数字
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // 增加总访问量
    const incrementTotalVisits = () => {
      store.commit('updateVisitStats', {
        totalVisits: visitStats.value.totalVisits + 1
      });
      addLog('手动增加总访问量 +1');
    };
    
    // 增加今日访问量
    const incrementTodayVisits = () => {
      store.commit('updateVisitStats', {
        todayVisits: visitStats.value.todayVisits + 1
      });
      addLog('手动增加今日访问量 +1');
    };
    
    // 增加在线用户
    const incrementOnlineUsers = () => {
      store.commit('updateVisitStats', {
        onlineUsers: visitStats.value.onlineUsers + 1
      });
      addLog('手动增加在线用户 +1');
    };
    
    // 减少在线用户
    const decrementOnlineUsers = () => {
      if (visitStats.value.onlineUsers > 0) {
        store.commit('updateVisitStats', {
          onlineUsers: visitStats.value.onlineUsers - 1
        });
        addLog('手动减少在线用户 -1');
      }
    };
    
    // 重置统计数据
    const resetStats = () => {
      if (confirm('确定要重置所有访问统计数据吗？此操作不可撤销。')) {
        store.commit('updateVisitStats', {
          totalVisits: 0,
          todayVisits: 0,
          onlineUsers: 0,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
        addLog('已重置所有访问统计数据');
      }
    };
    
    // 模拟随机访问
    const addRandomVisits = () => {
      const totalVisitsIncrease = Math.floor(Math.random() * 10) + 5; // 5-14
      const todayVisitsIncrease = Math.floor(Math.random() * 5) + 3;  // 3-7
      const onlineUsersChange = Math.floor(Math.random() * 5) - 1;    // -1-3
      
      store.commit('updateVisitStats', {
        totalVisits: visitStats.value.totalVisits + totalVisitsIncrease,
        todayVisits: visitStats.value.todayVisits + todayVisitsIncrease,
        onlineUsers: Math.max(0, visitStats.value.onlineUsers + onlineUsersChange)
      });
      
      addLog(`模拟访问: 总访问量 +${totalVisitsIncrease}, 今日访问 +${todayVisitsIncrease}, 在线用户 ${onlineUsersChange >= 0 ? '+' + onlineUsersChange : onlineUsersChange}`);
    };
    
    // 添加日志
    const addLog = (message) => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      logs.value.unshift({
        time,
        message
      });
      
      // 限制日志数量
      if (logs.value.length > 50) {
        logs.value = logs.value.slice(0, 50);
      }
    };
    
    // 组件挂载时检查日期
    onMounted(() => {
      // 检查是否需要重置今日访问量
      const today = new Date().toISOString().split('T')[0];
      if (visitStats.value.lastUpdated !== today) {
        store.commit('updateVisitStats', {
          todayVisits: 0,
          lastUpdated: today
        });
        addLog('日期已更新，重置今日访问量');
      }
      
      addLog('访问统计面板已加载');
    });
    
    return {
      visitStats,
      logs,
      formatNumber,
      formatDate,
      incrementTotalVisits,
      incrementTodayVisits,
      incrementOnlineUsers,
      decrementOnlineUsers,
      resetStats,
      addRandomVisits
    };
  }
};
</script> 