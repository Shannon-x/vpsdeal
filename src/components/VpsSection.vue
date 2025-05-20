<template>
  <section :id="sectionId" class="py-10">
    <div class="mb-8">
      <div class="flex items-center mb-2">
        <div class="w-10 h-1 bg-gradient-to-r from-secondary-500 to-primary-600 rounded mr-3"></div>
        <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        <div class="ml-auto flex items-center gap-2">
          <button 
            @click="$emit('show-intro')"
            class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            了解分类
          </button>
          <div class="bg-secondary-50 text-secondary-800 text-xs font-medium px-2.5 py-1 rounded-full">{{ vpsList.length }} 个优惠</div>
        </div>
      </div>
      <p v-if="description" class="mt-2 text-gray-600 max-w-2xl">{{ description }}</p>
    </div>
    
    <!-- VPS卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <VpsCard
        v-for="(vps, index) in vpsList"
        :key="index"
        :name="vps.name"
        :config="vps.config"
        :details="vps.details"
        :price="vps.price"
        :link="vps.link"
        :button-text="vps.buttonText || '查看优惠'"
        :provider-logo="vps.providerLogo"
      />
    </div>
    
    <!-- 空状态 -->
    <div v-if="vpsList.length === 0" class="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-8 text-center shadow-sm">
      <svg class="w-16 h-16 mx-auto text-secondary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-800 mb-2">暂无{{ title }}数据</h3>
      <p class="text-gray-600 max-w-md mx-auto">我们正在努力收集更多优惠信息，请稍后再来查看。</p>
    </div>
  </section>
</template>

<script>
import VpsCard from './VpsCard.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    VpsCard,
  },
  setup() {
    const store = useStore();
    const siteSettings = computed(() => store.getters.getSiteSettings);
    
    return {
      siteSettings
    };
  },
  props: {
    title: {
      type: String,
      default: "VPS 优惠"
    },
    description: {
      type: String,
      default: ""
    },
    vpsList: {
      type: Array,
      required: true
    },
    sectionId: {
      type: String,
      default() {
        // 根据标题生成ID
        if (this.title.includes('VPS')) return 'vps';
        if (this.title.includes('VDS')) return 'vds';
        if (this.title.includes('独立')) return 'dedicated';
        return '';
      }
    }
  },
  emits: ['show-intro']
};
</script>