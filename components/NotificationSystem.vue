<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'max-w-sm w-full glass backdrop-blur-lg p-4 rounded-lg shadow-xl',
          'transform transition-all duration-300 ease-out',
          {
            'border-l-4 border-green-500': notification.type === 'success',
            'border-l-4 border-red-500': notification.type === 'error',
            'border-l-4 border-yellow-500': notification.type === 'warning',
            'border-l-4 border-blue-500': notification.type === 'info'
          }
        ]"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <Icon 
              :name="getIcon(notification.type)" 
              :class="[
                'w-6 h-6',
                {
                  'text-green-500': notification.type === 'success',
                  'text-red-500': notification.type === 'error',
                  'text-yellow-500': notification.type === 'warning',
                  'text-blue-500': notification.type === 'info'
                }
              ]"
            />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 dark:text-white">
              {{ notification.title }}
            </h4>
            <p v-if="notification.message" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const notifications = ref<Notification[]>([])

const getIcon = (type: Notification['type']) => {
  const icons = {
    success: 'ph:check-circle-bold',
    error: 'ph:x-circle-bold',
    warning: 'ph:warning-bold',
    info: 'ph:info-bold'
  }
  return icons[type]
}

const addNotification = (notification: Omit<Notification, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9)
  const newNotification = { ...notification, id }
  notifications.value.push(newNotification)

  if (notification.duration !== 0) {
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration || 5000)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const onEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateX(100%)'
}

const onLeave = (el: Element) => {
  (el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateX(100%)'
}

// Expose methods for global use
defineExpose({
  addNotification
})

// Global notification composable
provide('notify', {
  success: (title: string, message?: string) => addNotification({ type: 'success', title, message }),
  error: (title: string, message?: string) => addNotification({ type: 'error', title, message }),
  warning: (title: string, message?: string) => addNotification({ type: 'warning', title, message }),
  info: (title: string, message?: string) => addNotification({ type: 'info', title, message })
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease-out;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease-out;
}
</style>