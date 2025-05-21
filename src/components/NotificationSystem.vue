<template>
  <div class="notification-container">
    <transition-group name="notification">
    <div
      v-for="notification in notifications"
      :key="notification.id"
        class="notification"
        :class="[`notification-${notification.type}`]"
    >
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-if="notification.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-if="notification.type === 'info'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-if="notification.type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div v-if="notification.message" class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" @click="removeNotification(notification.id)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
      </div>
    </transition-group>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'NotificationSystem',
  setup() {
    const notifications = ref([]);
    const nextId = ref(1);
    
    const addNotification = (notification) => {
      const id = nextId.value++;
      const newNotification = {
        id,
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        duration: notification.duration || 3000
      };
      
      notifications.value.push(newNotification);
      
      setTimeout(() => {
          removeNotification(id);
      }, newNotification.duration);

      return id;
    };

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        notifications.value.splice(index, 1);
      }
    };
    
    const success = (title, message = '', duration = 3000) => {
      return addNotification({ title, message, type: 'success', duration });
    };
    
    const error = (title, message = '', duration = 3000) => {
      return addNotification({ title, message, type: 'error', duration });
    };
    
    const info = (title, message = '', duration = 3000) => {
      return addNotification({ title, message, type: 'info', duration });
    };
    
    const warning = (title, message = '', duration = 3000) => {
      return addNotification({ title, message, type: 'warning', duration });
    };
    
    onMounted(() => {
      // 将通知方法添加到window对象，以便全局使用
      window.$notification = {
        add: addNotification,
        success,
        error,
        info,
        warning,
        remove: removeNotification
      };
    });
    
    return {
      notifications,
      removeNotification
    };
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 350px;
  max-width: calc(100vw - 40px);
}

.notification {
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
}

.notification-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex-grow: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 0.875rem;
  color: #666;
}

.notification-close {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.notification-success {
  border-left: 4px solid #10B981;
}

.notification-success .notification-icon {
  color: #10B981;
}

.notification-error {
  border-left: 4px solid #EF4444;
}

.notification-error .notification-icon {
  color: #EF4444;
}

.notification-info {
  border-left: 4px solid #3B82F6;
}

.notification-info .notification-icon {
  color: #3B82F6;
}

.notification-warning {
  border-left: 4px solid #F59E0B;
}

.notification-warning .notification-icon {
  color: #F59E0B;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
