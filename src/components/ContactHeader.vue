<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10 transition-all duration-300" 
          :class="{ 'shadow-md': isScrolled }">
    <!-- 全局通知横幅 -->
    <div v-if="globalNotice" class="bg-primary-500 text-white py-2 px-4 text-center text-sm relative animate-fadeDown">
      <span>{{ globalNotice }}</span>
      <button @click="dismissNotice" class="absolute right-4 top-2 text-white hover:text-primary-100 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- 导航栏 -->
    <div class="w-full flex justify-between items-center py-3 px-4 md:px-6">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <!-- 移除了VPS标识 -->
          <img v-if="siteLogo" :src="siteLogo" alt="网站Logo" class="h-8 w-auto object-contain" />
        </router-link>
      </div>
      
      <!-- 桌面导航 -->
      <nav class="hidden md:flex items-center space-x-4 flex-1 justify-center">
        <!-- 主导航分类 -->
        <router-link 
          v-for="category in mainNavCategories" 
          :key="category.id"
          :to="category.path" 
          class="nav-link relative text-gray-600 hover:text-primary-600 font-medium transition px-2 py-1"
        >
          {{ category.name }}
          <span class="nav-indicator"></span>
        </router-link>
        
        <!-- 更多分类下拉菜单 -->
        <div class="relative dropdown" v-if="moreNavCategories.length > 0" @mouseenter="onDropdownEnter" @mouseleave="hideDropdownWithDelay">
          <button 
            @click="showMoreDropdown = true" 
            @mouseenter="onDropdownEnter"
            class="nav-link relative text-gray-600 hover:text-primary-600 font-medium transition flex items-center justify-between px-2 py-1"
          >
            <span>更多分类</span>
            <span class="nav-indicator"></span>
          </button>
          <div 
            v-show="showMoreDropdown" 
            class="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10"
          >
            <div class="flex justify-end px-2 pt-1">
              <button @click="showMoreDropdown = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <router-link 
              v-for="category in moreNavCategories"
              :key="category.id"
              :to="category.path"
              @click="() => {}"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {{ category.name }}
            </router-link>
          </div>
        </div>
        
        <router-link to="/contact" class="nav-link relative text-gray-600 hover:text-primary-600 font-medium transition px-2 py-1">
          联系我们
          <span class="nav-indicator"></span>
        </router-link>
      </nav>
      
      <!-- 移动端菜单按钮 -->
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-1">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- 移动端导航菜单 -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-white border-t border-gray-200 px-4 py-2 animate-slideDown"
    >
        <nav class="flex flex-col space-y-1 py-2">
        <!-- 主要导航链接 -->
        <router-link 
          v-for="category in mainNavCategories"
          :key="category.id"
          :to="category.path" 
          @click="mobileMenuOpen = false" 
          class="text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition py-3 px-2 rounded-md"
        >
            <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            {{ category.name }}
            </div>
          </router-link>
          
          <div class="border-t border-gray-100 my-2"></div>
          
        <!-- 更多导航链接 -->
        <router-link 
          v-for="category in moreNavCategories"
          :key="category.id"
          :to="category.path" 
          @click="mobileMenuOpen = false" 
          class="text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition py-3 px-2 rounded-md"
        >
            <div class="flex items-center">
            <svg class="w-5 h-5 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            {{ category.name }}
            </div>
          </router-link>
        </nav>
      </div>
    
    <!-- 标题区域 - 移除了标题区域，因为不需要在联系页面显示 -->
  </header>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'ContactHeader',
  data() {
    return {
      mobileMenuOpen: false,
      isScrolled: false,
      isHomePage: true,
      noticeVisible: true,
      showMoreDropdown: false,
      dropdownCloseTimer: null
    }
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // 从Vuex获取网站设置
    const siteSettings = computed(() => store.getters.getSiteSettings);
    const siteTitle = computed(() => siteSettings.value.siteTitle);
    const siteDescription = computed(() => siteSettings.value.siteDescription);
    const siteLogo = computed(() => siteSettings.value.siteLogo);
    const siteShortTitle = computed(() => siteSettings.value.siteShortTitle);
    const contactEmail = computed(() => siteSettings.value.contactEmail);
    const lastUpdated = computed(() => siteSettings.value.lastUpdated);
    const globalNotice = computed(() => siteSettings.value.globalNotice);
    
    // 获取导航分类数据
    const mainNavCategories = computed(() => store.getters.getMainNavCategories);
    const moreNavCategories = computed(() => store.getters.getMoreNavCategories);
    
    return {
      siteTitle,
      siteDescription,
      siteLogo,
      siteShortTitle,
      contactEmail,
      lastUpdated,
      globalNotice,
      mainNavCategories,
      moreNavCategories
    };
  },
  created() {
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll);

    // 监听路由变化
    this.$router.afterEach(() => {
      this.showMoreDropdown = false;
    });
    
    // 初始化计时器ID
    this.dropdownCloseTimer = null;
  },
  beforeUnmount() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.handleScroll);
    
    // 清理任何可能存在的计时器
    if (this.dropdownCloseTimer) {
      clearTimeout(this.dropdownCloseTimer);
      this.dropdownCloseTimer = null;
    }
  },
  methods: {
    handleScroll() {
      // 当滚动超过100px时，将isScrolled设为true
      this.isScrolled = window.scrollY > 100;
    },
    dismissNotice() {
      this.noticeVisible = false;
    },
    hideDropdownWithDelay() {
      this.dropdownCloseTimer = setTimeout(() => {
        this.showMoreDropdown = false;
      }, 2000);
    },
    onDropdownEnter() {
      // 清除任何可能存在的关闭计时器
      if (this.dropdownCloseTimer) {
        clearTimeout(this.dropdownCloseTimer);
        this.dropdownCloseTimer = null;
      }
      // 显示下拉菜单
      this.showMoreDropdown = true;
    }
  },
  computed: {
    globalNotice() {
      return this.noticeVisible ? this.$store.getters.getSiteSettings.globalNotice : '';
    }
  }
}
</script>

<style scoped>
/* 导航链接悬停效果 */
.nav-link {
  position: relative;
  display: block;
}

.nav-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: currentColor;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.3s;
}

.nav-link:hover .nav-indicator, 
.router-link-active .nav-indicator {
  opacity: 1;
  transform: scaleX(0.8);
}

/* 动画 */
.animate-fadeDown {
  animation: fadeDown 0.5s ease;
}

.animate-slideDown {
  animation: slideDown 0.3s ease;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
}
</style> 