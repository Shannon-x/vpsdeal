<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    
    <main class="flex-grow container mx-auto px-4 py-6 relative">
      <LoadingSpinner v-if="isLoading" />
      
      <div v-if="!isLoading">
        <!-- 联系我们页面 -->
        <div v-if="showContactPage" class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 class="text-2xl font-bold mb-4 text-gray-900">联系我们</h1>
          <p class="mb-6 text-gray-600">有任何问题、建议或需要VPS推荐，请通过以下方式联系我们。</p>
          
          <div class="bg-secondary-50 p-4 rounded-lg mb-6">
            <h2 class="text-lg font-semibold mb-2 text-secondary-700">我们能提供什么帮助</h2>
            <ul class="list-disc pl-5 text-gray-700 space-y-1">
              <li>VPS服务器选择建议</li>
              <li>网站配置和部署指导</li>
              <li>促销优惠信息推送</li>
              <li>网站合作与广告投放</li>
            </ul>
          </div>
          
          <form class="space-y-4 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="form-label">您的姓名</label>
                <input type="text" id="name" class="form-input" placeholder="请输入您的姓名">
              </div>
              <div>
                <label for="email" class="form-label">电子邮箱</label>
                <input type="email" id="email" class="form-input" placeholder="请输入您的电子邮箱">
              </div>
            </div>
            
            <div>
              <label for="subject" class="form-label">主题</label>
              <input type="text" id="subject" class="form-input" placeholder="请输入主题">
            </div>
            
            <div>
              <label for="message" class="form-label">消息内容</label>
              <textarea id="message" rows="4" class="form-input" placeholder="请详细描述您的问题或需求"></textarea>
            </div>
            
            <div>
              <button type="submit" class="btn btn-primary">发送消息</button>
            </div>
          </form>
          
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-800">其他联系方式</h2>
            <div class="space-y-3">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-gray-700">contact@vpsdeal.com</span>
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-700">周一至周五: 9:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- VPS 列表部分 -->
        <div v-if="!showContactPage">
          <!-- 分类介绍部分 -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8" v-if="showCategoryIntro">
            <div class="flex justify-between items-start mb-4">
              <h1 class="text-2xl font-bold text-gray-900">{{ categoryIntroTitle }}</h1>
              <button @click="showCategoryIntro = false" class="text-gray-500 hover:text-gray-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="prose max-w-none text-gray-600">
              <div v-html="categoryIntroContent"></div>
            </div>
          </div>
          
          <!-- 主页或无过滤时显示所有分类 -->
          <template v-if="!filter || filter === 'home'">
            <!-- 年付15美元以下 VPS 部分 -->
            <VpsSection 
              title="年付15美元以下 VPS" 
              description="经济实惠的年付VPS，适合长期运行的小型项目"
              :vpsList="annualUnder15Deals" 
              sectionId="annual15"
              @show-intro="showIntro('annual15')"
            />
            
            <!-- 年付25美元以下 VPS 部分 -->
            <VpsSection 
              title="年付25美元以下 VPS" 
              description="性价比更高的VPS，提供更好的配置和性能"
              :vpsList="annualUnder25Deals" 
              sectionId="annual25"
              @show-intro="showIntro('annual25')"
            />
            
            <!-- 月付2美元以下 VPS 部分 -->
            <VpsSection 
              title="月付2美元以下 VPS" 
              description="超低价格的入门级VPS，适合个人学习和测试使用"
              :vpsList="monthlyUnder2Deals" 
              sectionId="monthly2"
              @show-intro="showIntro('monthly2')"
            />
            
            <!-- 免费VPS 部分 -->
            <VpsSection 
              title="免费VPS"
              description="免费使用的虚拟服务器，适合简单测试和学习使用"
              :vpsList="freeDeals"
              sectionId="free"
              @show-intro="showIntro('free')"
            />
            
            <!-- VDS服务器 部分 -->
            <VpsSection 
              title="VDS服务器"
              description="专用虚拟服务器，提供更好的隔离性和专属资源"
              :vpsList="vdsDeals"
              sectionId="vds"
              @show-intro="showIntro('vds')"
            />
            
            <!-- NAT/OpenVZ主机 部分 -->
            <VpsSection 
              title="NAT/OpenVZ主机" 
              description="使用OpenVZ虚拟化技术和NAT网络的超低价VPS"
              :vpsList="natOpenVZDeals" 
              sectionId="natopenVZ"
              @show-intro="showIntro('natopenVZ')"
            />
            
            <!-- 高配VPS主机 部分 -->
            <VpsSection 
              title="高配VPS主机" 
              description="高性能VPS，适合资源密集型应用和高流量网站"
              :vpsList="highSpecDeals" 
              sectionId="highSpec"
              @show-intro="showIntro('highSpec')"
            />
            
            <!-- 存储型VPS 部分 -->
            <VpsSection 
              title="存储型VPS" 
              description="提供超大硬盘空间的VPS，适合数据存储和备份"
              :vpsList="storageDeals" 
              sectionId="storage"
              @show-intro="showIntro('storage')"
            />
          </template>
          
          <!-- 按过滤显示特定分类 -->
          <template v-else>
            <!-- 年付15美元以下 VPS 部分 -->
            <VpsSection 
              v-if="filter === 'annual15'"
              title="年付15美元以下 VPS" 
              description="经济实惠的年付VPS，适合长期运行的小型项目"
              :vpsList="annualUnder15Deals" 
              sectionId="annual15"
              @show-intro="showIntro('annual15')"
            />
            
            <!-- 年付25美元以下 VPS 部分 -->
            <VpsSection 
              v-if="filter === 'annual25'"
              title="年付25美元以下 VPS" 
              description="性价比更高的VPS，提供更好的配置和性能"
              :vpsList="annualUnder25Deals" 
              sectionId="annual25"
              @show-intro="showIntro('annual25')"
            />
            
            <!-- 月付2美元以下 VPS 部分 -->
            <VpsSection 
              v-if="filter === 'monthly2'"
              title="月付2美元以下 VPS" 
              description="超低价格的入门级VPS，适合个人学习和测试使用"
              :vpsList="monthlyUnder2Deals" 
              sectionId="monthly2"
              @show-intro="showIntro('monthly2')"
            />
            
            <!-- 免费VPS 部分 -->
            <VpsSection 
              v-if="filter === 'free'"
              title="免费VPS"
              description="免费使用的虚拟服务器，适合简单测试和学习使用"
              :vpsList="freeDeals"
              sectionId="free"
              @show-intro="showIntro('free')"
            />
            
            <!-- VDS服务器 部分 -->
            <VpsSection 
              v-if="filter === 'vds'"
              title="VDS服务器"
              description="专用虚拟服务器，提供更好的隔离性和专属资源"
              :vpsList="vdsDeals"
              sectionId="vds"
              @show-intro="showIntro('vds')"
            />
            
            <!-- NAT/OpenVZ主机 部分 -->
            <VpsSection 
              v-if="filter === 'natopenVZ'"
              title="NAT/OpenVZ主机" 
              description="使用OpenVZ虚拟化技术和NAT网络的超低价VPS"
              :vpsList="natOpenVZDeals" 
              sectionId="natopenVZ"
              @show-intro="showIntro('natopenVZ')"
            />
            
            <!-- 高配VPS主机 部分 -->
            <VpsSection 
              v-if="filter === 'highSpec'"
              title="高配VPS主机" 
              description="高性能VPS，适合资源密集型应用和高流量网站"
              :vpsList="highSpecDeals" 
              sectionId="highSpec"
              @show-intro="showIntro('highSpec')"
            />
            
            <!-- 存储型VPS 部分 -->
            <VpsSection 
              v-if="filter === 'storage'"
              title="存储型VPS" 
              description="提供超大硬盘空间的VPS，适合数据存储和备份"
              :vpsList="storageDeals" 
              sectionId="storage"
              @show-intro="showIntro('storage')"
            />
          </template>
        
        <!-- 底部回到顶部按钮 -->
          <div class="fixed bottom-6 right-6 z-10">
            <a href="#" class="inline-flex items-center p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full transition shadow-sm hover:shadow group">
              <svg class="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"></path>
            </svg>
          </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import VpsSection from '../components/VpsSection.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';

export default {
  components: {
    Header,
    VpsSection,
    LoadingSpinner
  },
  props: {
    filter: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    
    // 分类介绍相关状态
    const showCategoryIntro = ref(false);
    const currentCategory = ref('');
    const categoryIntroTitle = ref('');
    
    // 显示分类介绍
    const showIntro = (category) => {
      currentCategory.value = category;
      showCategoryIntro.value = true;
      
      // 设置标题
      switch(category) {
        case 'monthly2':
          categoryIntroTitle.value = '月付2美元以下VPS介绍';
          break;
        case 'annual15':
          categoryIntroTitle.value = '年付15美元以下VPS介绍';
          break;
        case 'annual25':
          categoryIntroTitle.value = '年付25美元以下VPS介绍';
          break;
        case 'natopenVZ':
          categoryIntroTitle.value = 'NAT/OpenVZ主机介绍';
          break;
        case 'highSpec':
          categoryIntroTitle.value = '高配VPS主机介绍';
          break;
        case 'storage':
          categoryIntroTitle.value = '存储型VPS介绍';
          break;
        case 'free':
          categoryIntroTitle.value = '免费VPS介绍';
          break;
        case 'vds':
          categoryIntroTitle.value = 'VDS服务器介绍';
          break;
      }
      
      // 立即跳转到页面顶部，避免头部高度抖动
      window.scrollTo(0, 0);
    };
    
    // 获取VPS列表数据
    const monthlyUnder2Deals = computed(() => store.getters.getDeals('monthlyUnder2Deals'));
    const annualUnder15Deals = computed(() => store.getters.getDeals('annualUnder15Deals'));
    const annualUnder25Deals = computed(() => store.getters.getDeals('annualUnder25Deals'));
    const natOpenVZDeals = computed(() => store.getters.getDeals('natOpenVZDeals'));
    const highSpecDeals = computed(() => store.getters.getDeals('highSpecDeals'));
    const storageDeals = computed(() => store.getters.getDeals('storageDeals'));
    const freeDeals = computed(() => store.getters.getDeals('freeDeals'));
    const vdsDeals = computed(() => store.getters.getDeals('vdsDeals'));
    
    // 判断是否显示联系页面
    const showContactPage = computed(() => route.query.page === 'contact');
    
    // 设置SEO信息
    onMounted(() => {
      // 显示加载动画
      store.commit('setLoading', true);
      
      // 设置页面标题和描述
      let pageTitle = '优惠VPS推荐 - 高性价比服务器精选';
      let pageDescription = '精选优质VPS服务器，性价比最高的虚拟服务器推荐，帮您找到最实惠的服务器';
      
      // 根据过滤条件调整标题和描述
      if (props.filter) {
        switch(props.filter) {
          case 'monthly2':
            pageTitle = '月付2美元以下VPS推荐';
            pageDescription = '精选超低价格的入门级VPS，适合个人学习和测试使用';
            break;
          case 'annual15':
            pageTitle = '年付15美元以下VPS推荐';
            pageDescription = '经济实惠的年付VPS，适合长期运行的小型项目';
            break;
          case 'annual25':
            pageTitle = '年付25美元以下VPS推荐';
            pageDescription = '性价比更高的VPS，提供更好的配置和性能';
            break;
          case 'natopenVZ':
            pageTitle = 'NAT/OpenVZ主机推荐';
            pageDescription = '使用OpenVZ虚拟化技术和NAT网络的超低价VPS';
            break;
          case 'highSpec':
            pageTitle = '高配VPS主机推荐';
            pageDescription = '高性能VPS，适合资源密集型应用和高流量网站';
            break;
          case 'storage':
            pageTitle = '存储型VPS推荐';
            pageDescription = '提供超大硬盘空间的VPS，适合数据存储和备份';
            break;
          case 'free':
            pageTitle = '免费VPS推荐';
            pageDescription = '免费使用的虚拟服务器，适合简单测试和学习使用';
            break;
          case 'vds':
            pageTitle = 'VDS服务器推荐';
            pageDescription = '专用虚拟服务器，提供更好的隔离性和专属资源';
            break;
          case 'contact':
            pageTitle = '联系我们 - VPS优惠推荐';
            pageDescription = '有问题或建议？欢迎联系我们，我们将为您提供最适合的VPS推荐和解决方案';
            break;
        }
      }
      
      store.commit('setPageTitle', pageTitle);
      store.commit('setPageDescription', pageDescription);
      
      // 模拟数据加载
      setTimeout(() => {
        store.commit('setLoading', false);
      }, 800);
      
      // 添加结构化数据
      addStructuredData();
    });
    
    // 添加结构化数据
    const addStructuredData = () => {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "优惠VPS推荐",
        "description": "精选优质VPS服务器推荐",
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
    
    // 清理
    onUnmounted(() => {
      const script = document.querySelector('#structured-data');
      if (script) {
        script.remove();
      }
    });
    
    // 可配置的分类介绍内容（将 Section ID 映射到 store 分类 ID）
    const categories = computed(() => store.getters.getAllCategories);
    const categoryIntroContent = computed(() => {
      const idMap = {
        annual15: 'under15',
        annual25: 'under25',
        monthly2: 'monthly',
        free: 'free',
        vds: 'vds',
        natopenVZ: 'nat',
        highSpec: 'highspec',
        storage: 'storage'
      };
      const internalId = idMap[currentCategory.value] || currentCategory.value;
      const cat = categories.value.find(c => c.id === internalId);
      return cat && cat.description ? cat.description : '';
    });
    
    return {
      monthlyUnder2Deals,
      annualUnder15Deals,
      annualUnder25Deals,
      natOpenVZDeals,
      highSpecDeals,
      storageDeals,
      freeDeals,
      vdsDeals,
      showContactPage,
      isLoading: computed(() => store.state.isLoading),
      showCategoryIntro,
      currentCategory,
      categoryIntroTitle,
      showIntro,
      categoryIntroContent
    };
  }
}
</script>

<style scoped>
/* 为移动设备优化 */
@media (max-width: 640px) {
  main {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .py-12 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

/* 添加页面淡入效果 */
main > div {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
