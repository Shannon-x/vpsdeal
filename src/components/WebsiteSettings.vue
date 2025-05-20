<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">网站设置</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          自定义网站标题、Logo和联系方式
        </p>
      </div>
    </div>
    
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <form @submit.prevent="saveSettings" class="space-y-6">
        <!-- 基本信息 -->
        <div class="bg-gray-50 px-4 py-4 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">基本信息</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">网站标题</label>
              <input 
                v-model="settings.siteTitle" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
              <p class="mt-1 text-xs text-gray-500">显示在浏览器标签和搜索结果中</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">网站描述</label>
              <input 
                v-model="settings.siteDescription" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
              <p class="mt-1 text-xs text-gray-500">用于搜索引擎优化</p>
            </div>
          </div>
        </div>
        
        <!-- LOGO 设置 -->
        <div class="bg-gray-50 px-4 py-4 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">LOGO 设置</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">网站 LOGO URL</label>
              <input 
                v-model="settings.siteLogo" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input"
                placeholder="https://example.com/logo.png（可选）"
              >
              <p class="mt-1 text-xs text-gray-500">留空则使用默认Logo</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo 尺寸</label>
              <select
                v-model="settings.logoSize"
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input"
              >
                <option value="small">小尺寸</option>
                <option value="normal">中等尺寸</option>
                <option value="large">大尺寸</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">控制VPS卡片中提供商Logo显示尺寸</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo 预览</label>
              <div class="mt-1 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 h-20">
                <div v-if="settings.siteLogo" class="bg-white p-2 rounded">
                  <img :src="settings.siteLogo" class="h-14 max-w-xs object-contain" alt="Site Logo">
                </div>
                <div v-else class="flex items-center justify-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                    <span class="text-white font-bold text-lg">VPS</span>
                  </div>
                  <span class="ml-2 text-lg font-bold text-gray-700">{{ settings.siteShortTitle || '优惠VPS' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 联系方式 -->
        <div class="bg-gray-50 px-4 py-4 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">联系方式</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
              <input 
                v-model="settings.contactEmail" 
                type="email" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">更新日期</label>
              <input 
                v-model="settings.lastUpdated" 
                type="date" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
          </div>
        </div>
        
        <!-- 其他设置 -->
        <div class="bg-gray-50 px-4 py-4 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">其他设置</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">网站简称</label>
              <input 
                v-model="settings.siteShortTitle" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                placeholder="例如：优惠VPS"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">全局通知</label>
              <textarea 
                v-model="settings.globalNotice" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                placeholder="网站顶部显示的通知（可选）"
                rows="2"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">留空则不显示通知横幅</p>
            </div>
          </div>
        </div>
        
        <!-- 底部统计数据设置 -->
        <div class="bg-gray-50 px-4 py-4 rounded-md">
          <h4 class="text-sm font-medium text-gray-700 mb-3">底部统计数据</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">已收录VPS数量</label>
              <input 
                v-model="settings.footerStats.vpsCount" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">服务商数量</label>
              <input 
                v-model="settings.footerStats.providerCount" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">数据中心数量</label>
              <input 
                v-model="settings.footerStats.datacenterCount" 
                type="text" 
                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-input" 
                required
              >
            </div>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            保存设置
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'WebsiteSettings',
  setup() {
    const store = useStore();
    const settings = ref({
      siteTitle: '优惠VPS推荐 - KVM、NAT、OpenVZ高性价比服务器',
      siteDescription: 'KVM、NAT、OpenVZ、LXC、年付低于$15的高配VPS，性价比最高的虚拟服务器推荐',
      siteLogo: '',
      siteShortTitle: '优惠VPS推荐',
      contactEmail: 'cheapvpsdeals@gmail.com',
      lastUpdated: new Date().toISOString().split('T')[0],
      globalNotice: '',
      footerStats: {
        vpsCount: '',
        providerCount: '',
        datacenterCount: ''
      }
    });
    
    // 加载设置
    onMounted(() => {
      try {
        const savedSettings = localStorage.getItem('site-settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          // 合并默认设置和保存的设置
          settings.value = { ...settings.value, ...parsedSettings };
        }
      } catch (e) {
        console.error('加载网站设置失败:', e);
      }
    });
    
    // 保存设置
    const saveSettings = () => {
      try {
        localStorage.setItem('site-settings', JSON.stringify(settings.value));
        
        // 更新Vuex store中的设置
        store.commit('updateSiteSettings', settings.value);
        
        // 更新标题和描述
        store.commit('setPageTitle', settings.value.siteTitle);
        store.commit('setPageDescription', settings.value.siteDescription);
        
        // 更新网站结构化数据
        updateStructuredData();
        
        // 显示成功提示
        if (window.$notification) {
          window.$notification.success('设置已保存', '网站设置已成功更新');
        }
      } catch (e) {
        console.error('保存网站设置失败:', e);
        if (window.$notification) {
          window.$notification.error('保存失败', '网站设置保存失败，请重试');
        }
      }
    };
    
    // 更新结构化数据
    const updateStructuredData = () => {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": settings.value.siteTitle,
        "description": settings.value.siteDescription,
        "url": window.location.origin
      };
      
      let script = document.querySelector('#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    };
    
    return {
      settings,
      saveSettings
    };
  }
};
</script>
