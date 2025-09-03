<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">爬虫管理</h1>
      
      <!-- 状态卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-sm text-gray-400 mb-2">运行状态</h3>
          <p class="text-2xl font-bold" :class="statusColor">
            {{ crawlerStatus.status === 'running' ? '运行中' : '已停止' }}
          </p>
        </div>
        
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-sm text-gray-400 mb-2">总运行次数</h3>
          <p class="text-2xl font-bold">{{ stats.totalRuns || 0 }}</p>
        </div>
        
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-sm text-gray-400 mb-2">成功次数</h3>
          <p class="text-2xl font-bold text-green-400">{{ stats.successfulRuns || 0 }}</p>
        </div>
        
        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-sm text-gray-400 mb-2">失败次数</h3>
          <p class="text-2xl font-bold text-red-400">{{ stats.failedRuns || 0 }}</p>
        </div>
      </div>
      
      <!-- 控制按钮 -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h2 class="text-xl font-semibold mb-4">爬虫控制</h2>
        
        <div class="flex gap-4">
          <button @click="runCrawler" 
                  :disabled="isRunning"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors">
            {{ isRunning ? '运行中...' : '手动运行爬虫' }}
          </button>
          
          <button @click="refreshStatus" 
                  class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
            刷新状态
          </button>
        </div>
        
        <div v-if="lastRun" class="mt-4 text-sm text-gray-400">
          上次运行时间：{{ formatDate(lastRun) }}
        </div>
        
        <div v-if="nextRun" class="text-sm text-gray-400">
          下次运行时间：{{ formatDate(nextRun) }}
        </div>
      </div>
      
      <!-- 配置编辑器 -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h2 class="text-xl font-semibold mb-4">爬虫配置</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">定时任务表达式</label>
          <input v-model="config.schedule" 
                 type="text"
                 class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500"
                 placeholder="0 */6 * * *">
          <p class="text-xs text-gray-500 mt-1">Cron表达式，例如：0 */6 * * * 表示每6小时运行一次</p>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">翻译服务</label>
          <select v-model="config.translation.provider"
                  class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500">
            <option value="simple">简单翻译（内置）</option>
            <option value="baidu">百度翻译API</option>
            <option value="libre">LibreTranslate</option>
          </select>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-2">重试次数</label>
          <input v-model.number="config.maxRetries" 
                 type="number"
                 class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500"
                 min="1" max="10">
        </div>
        
        <button @click="saveConfig" 
                class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
          保存配置
        </button>
      </div>
      
      <!-- 日志查看器 -->
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 class="text-xl font-semibold mb-4">运行日志</h2>
        
        <div class="bg-gray-950 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
          <div v-if="logs.length === 0" class="text-gray-500">
            暂无日志
          </div>
          <div v-else>
            <div v-for="(log, index) in logs" :key="index" class="mb-1">
              <span :class="getLogClass(log)">{{ log }}</span>
            </div>
          </div>
        </div>
        
        <button @click="loadLogs" 
                class="mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
          刷新日志
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// 状态数据
const crawlerStatus = ref({ status: 'stopped' })
const stats = ref({})
const isRunning = ref(false)
const lastRun = ref(null)
const nextRun = ref(null)
const logs = ref([])
const config = ref({
  schedule: '0 */6 * * *',
  maxRetries: 3,
  translation: {
    provider: 'simple'
  }
})

// 计算状态颜色
const statusColor = computed(() => {
  return crawlerStatus.value.status === 'running' ? 'text-green-400' : 'text-gray-400'
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

// 获取日志样式类
const getLogClass = (log) => {
  if (log.includes('error') || log.includes('错误')) return 'text-red-400'
  if (log.includes('warn') || log.includes('警告')) return 'text-yellow-400'
  if (log.includes('success') || log.includes('成功')) return 'text-green-400'
  return 'text-gray-300'
}

// 获取爬虫状态
const refreshStatus = async () => {
  try {
    const response = await $fetch('/api/admin/crawler/status', {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    crawlerStatus.value = response
    if (response.stats) {
      stats.value = response.stats
      isRunning.value = response.stats.isRunning
      lastRun.value = response.stats.lastRun
      nextRun.value = response.stats.nextRun
    }
  } catch (error) {
    toast.error('获取状态失败')
  }
}

// 手动运行爬虫
const runCrawler = async () => {
  if (isRunning.value) return
  
  try {
    isRunning.value = true
    const response = await $fetch('/api/admin/crawler/run', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    toast.success(response.message)
    
    // 定期检查状态
    const checkInterval = setInterval(async () => {
      await refreshStatus()
      if (!isRunning.value) {
        clearInterval(checkInterval)
      }
    }, 5000)
    
  } catch (error) {
    isRunning.value = false
    toast.error('运行爬虫失败')
  }
}

// 加载日志
const loadLogs = async () => {
  try {
    const response = await $fetch('/api/admin/crawler/logs', {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    logs.value = response.logs || []
  } catch (error) {
    toast.error('加载日志失败')
  }
}

// 加载配置
const loadConfig = async () => {
  try {
    const response = await $fetch('/api/admin/crawler/config', {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      }
    })
    
    config.value = response
  } catch (error) {
    toast.error('加载配置失败')
  }
}

// 保存配置
const saveConfig = async () => {
  try {
    await $fetch('/api/admin/crawler/config', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`
      },
      body: config.value
    })
    
    toast.success('配置保存成功')
  } catch (error) {
    toast.error('保存配置失败')
  }
}

// 页面加载时初始化
onMounted(() => {
  refreshStatus()
  loadLogs()
  loadConfig()
  
  // 定期刷新状态
  setInterval(refreshStatus, 30000)
})
</script>