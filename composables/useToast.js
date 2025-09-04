/**
 * Toast 提示通知组合式函数
 */

import { ref } from 'vue'

// 存储所有toast消息
const toasts = ref([])

// Toast ID计数器
let toastId = 0

/**
 * 显示toast消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info, warning)
 * @param {number} duration - 显示时长（毫秒）
 */
const showToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastId
  
  const toast = {
    id,
    message,
    type,
    visible: true
  }
  
  toasts.value.push(toast)
  
  // 自动隐藏
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

/**
 * 移除指定toast
 * @param {number} id - Toast ID
 */
const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

/**
 * 清空所有toast
 */
const clearToasts = () => {
  toasts.value = []
}

export const useToast = () => {
  return {
    toasts,
    showToast,
    removeToast,
    clearToasts
  }
}