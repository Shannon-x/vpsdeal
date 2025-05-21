<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <NProgress :loading="isLoading" :percent="loadingPercent" />
  <LoadingSpinner v-if="isLoading" fixed />
  <WhyChooseUs />
  <Footer />
  <NotificationSystem />
</template>

<script>
import LoadingSpinner from './components/LoadingSpinner.vue';
import NProgress from './components/NProgress.vue';
import BackToTop from './components/BackToTop.vue';
import NotificationSystem from './components/NotificationSystem.vue';
import Footer from './components/Footer.vue';
import WhyChooseUs from './components/WhyChooseUs.vue';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  components: {
    LoadingSpinner,
    NProgress,
    BackToTop,
    NotificationSystem,
    Footer,
    WhyChooseUs
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const isLoading = computed(() => store.getters.isLoading);
    const loadingPercent = ref(0);
    const loadingInterval = ref(null);
    
    // 监听加载状态变化
    watch(isLoading, (newVal) => {
      if (newVal) {
        // 开始加载
        loadingPercent.value = 0;
        startLoadingProgress();
      } else {
        // 结束加载
        loadingPercent.value = 100;
        clearInterval(loadingInterval.value);
      }
    });
    
    // 监听路由变化
    watch(() => route.path, () => {
      // 路由改变时重置滚动位置
      window.scrollTo({ top: 0 });
      
      // 触发加载状态
      store.commit('setLoading', true);
      setTimeout(() => {
        store.commit('setLoading', false);
      }, 800);
      
      // 增加访问计数（排除管理后台页面）
      if (!route.path.includes('/admin')) {
        // 增加访问统计
        store.commit('incrementVisits');
      }
    });
    
    // 模拟进度增长
    const startLoadingProgress = () => {
      clearInterval(loadingInterval.value);
      loadingInterval.value = setInterval(() => {
        if (loadingPercent.value < 90) {
          loadingPercent.value += (90 - loadingPercent.value) * 0.1;
        } else {
          clearInterval(loadingInterval.value);
        }
      }, 100);
    };
    
    return {
      isLoading,
      loadingPercent
    };
  }
}
</script>

<style>
@import './assets/styles/tailwind.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局表单样式 */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
}

/* 全局按钮样式 */
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500;
}

.btn-outline {
  @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500;
}
</style>