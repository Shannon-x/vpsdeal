/**
 * 价格对比状态管理
 */

import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useComparisonStore = defineStore('comparison', {
  state: () => ({
    // 对比列表（最多5个）
    items: useLocalStorage('comparison-items', []),
    
    // 对比数据
    comparisonData: null,
    
    // 加载状态
    loading: false,
    error: null,
    
    // 会话ID（用于分享）
    sessionId: useLocalStorage('comparison-session', null),
    
    // UI状态
    isComparisonMode: false,
    showComparisonBar: false
  }),

  getters: {
    // 对比项目数量
    itemCount: (state) => state.items.length,
    
    // 是否可以添加更多
    canAddMore: (state) => state.items.length < 5,
    
    // 是否有足够的项目进行对比
    canCompare: (state) => state.items.length >= 2,
    
    // 检查某个VPS是否在对比列表中
    isInComparison: (state) => {
      return (vpsId) => state.items.includes(vpsId)
    },
    
    // 获取对比URL
    comparisonUrl: (state) => {
      if (state.items.length === 0) return null
      return `/compare?ids=${state.items.join(',')}`
    },
    
    // 获取分享URL
    shareUrl: (state) => {
      if (!state.sessionId) return null
      return `${window.location.origin}/compare/session/${state.sessionId}`
    }
  },

  actions: {
    // 添加到对比
    async addToComparison(vpsId) {
      if (this.items.includes(vpsId)) {
        return { success: false, message: '该产品已在对比列表中' }
      }
      
      if (this.items.length >= 5) {
        return { success: false, message: '最多只能对比5个产品' }
      }
      
      this.items.push(vpsId)
      this.showComparisonBar = true
      
      // 更新会话
      if (this.sessionId) {
        await this.updateSession('add', vpsId)
      }
      
      return { success: true, message: '已添加到对比' }
    },
    
    // 从对比中移除
    async removeFromComparison(vpsId) {
      const index = this.items.indexOf(vpsId)
      if (index === -1) return
      
      this.items.splice(index, 1)
      
      // 如果没有项目了，隐藏对比栏
      if (this.items.length === 0) {
        this.showComparisonBar = false
        this.isComparisonMode = false
      }
      
      // 更新会话
      if (this.sessionId) {
        await this.updateSession('remove', vpsId)
      }
    },
    
    // 切换对比状态
    toggleComparison(vpsId) {
      if (this.isInComparison(vpsId)) {
        this.removeFromComparison(vpsId)
      } else {
        this.addToComparison(vpsId)
      }
    },
    
    // 清空对比列表
    async clearComparison() {
      this.items = []
      this.comparisonData = null
      this.showComparisonBar = false
      this.isComparisonMode = false
      
      // 清空会话
      if (this.sessionId) {
        await this.updateSession('clear')
      }
    },
    
    // 获取对比数据
    async fetchComparisonData() {
      if (this.items.length < 2) {
        this.error = '至少需要选择2个产品进行对比'
        return
      }
      
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch(`/api/compare?ids=${this.items.join(',')}`)
        
        if (response.success) {
          this.comparisonData = response.data
        } else {
          this.error = response.error || '获取对比数据失败'
        }
      } catch (error) {
        console.error('获取对比数据失败:', error)
        this.error = '网络错误，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    // 创建分享会话
    async createShareSession() {
      if (this.items.length === 0) return
      
      try {
        const response = await $fetch('/api/compare/session', {
          method: 'POST'
        })
        
        if (response.success) {
          this.sessionId = response.sessionId
          
          // 添加当前项目到会话
          for (const vpsId of this.items) {
            await this.updateSession('add', vpsId)
          }
          
          return this.shareUrl
        }
      } catch (error) {
        console.error('创建分享会话失败:', error)
        return null
      }
    },
    
    // 更新会话
    async updateSession(action, vpsId = null) {
      if (!this.sessionId) return
      
      try {
        const url = `/api/compare/session/${this.sessionId}/${action}`
        const body = vpsId ? { vpsId } : {}
        
        await $fetch(url, {
          method: 'POST',
          body
        })
      } catch (error) {
        console.error('更新会话失败:', error)
      }
    },
    
    // 从URL加载对比
    async loadFromUrl(ids) {
      if (!ids) return
      
      const idArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
      
      if (idArray.length > 0) {
        this.items = idArray.slice(0, 5)
        this.showComparisonBar = true
        await this.fetchComparisonData()
      }
    },
    
    // 从会话加载对比
    async loadFromSession(sessionId) {
      try {
        const response = await $fetch(`/api/compare/session/${sessionId}`)
        
        if (response.success && response.session) {
          this.items = response.session.items
          this.sessionId = sessionId
          this.showComparisonBar = true
          
          if (this.items.length >= 2) {
            await this.fetchComparisonData()
          }
        }
      } catch (error) {
        console.error('加载会话失败:', error)
      }
    },
    
    // 导出对比数据
    exportComparison(format = 'csv') {
      if (!this.comparisonData) return
      
      if (format === 'csv') {
        this.exportAsCSV()
      } else if (format === 'json') {
        this.exportAsJSON()
      }
    },
    
    // 导出为CSV
    exportAsCSV() {
      const data = this.comparisonData.products
      const headers = ['产品名称', '提供商', '月付价格', 'CPU', 'RAM', '存储', '带宽', '位置']
      
      const rows = data.map(product => [
        product.name,
        product.provider,
        `$${product.price.monthly.toFixed(2)}`,
        product.specs.cpu,
        product.specs.ram,
        product.specs.storage,
        product.specs.bandwidth,
        product.specs.location
      ])
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `vps-comparison-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    
    // 导出为JSON
    exportAsJSON() {
      const json = JSON.stringify(this.comparisonData, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `vps-comparison-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    
    // 切换对比模式
    toggleComparisonMode() {
      this.isComparisonMode = !this.isComparisonMode
    },
    
    // 切换对比栏显示
    toggleComparisonBar() {
      this.showComparisonBar = !this.showComparisonBar
    }
  }
})