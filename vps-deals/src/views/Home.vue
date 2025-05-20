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
              <div v-if="currentCategory === 'monthly2'">
                <p>月付2美元以下VPS是适合小型网站、个人博客或学习测试使用的经济实惠选择。这些VPS特点如下：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>超低价格，月付2美元以下</li>
                  <li>基础配置，适合轻量级应用</li>
                  <li>通常带有一定的流量限制</li>
                  <li>适合个人学习使用或低流量网站</li>
                  <li>性价比较高，入门级选择</li>
                </ul>
                <p>尽管价格便宜，我们精选的此类VPS仍然保证基本的稳定性和可用性。</p>
                </div>
              
              <div v-else-if="currentCategory === 'annual15'">
                <p>年付15美元以下VPS提供了更好的性价比，适合长期稳定运行的小型项目。这类VPS的特点包括：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>年付总价格低于15美元，平均月费约1.25美元</li>
                  <li>相比月付方案有更大的折扣</li>
                  <li>适合长期运行的小型网站和应用</li>
                  <li>基本配置通常包括1核CPU、512MB-1GB内存</li>
                  <li>稳定可靠，适合建站新手</li>
                </ul>
                <p>这些VPS非常适合预算有限但需要长期稳定服务的用户。</p>
              </div>
              
              <div v-else-if="currentCategory === 'annual25'">
                <p>年付25美元以下的VPS提供了更好的配置和性能，同时仍保持较低的价格。主要特点有：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>年付总价在15-25美元之间</li>
                  <li>通常提供1-2核CPU、1-2GB内存</li>
                  <li>存储空间更大，通常为20-40GB</li>
                  <li>带宽和流量限制更为宽松</li>
                  <li>适合中小型网站和应用程序</li>
                </ul>
                <p>这类VPS在性能和价格之间取得了很好的平衡，适合大多数个人网站和小型企业使用。</p>
                </div>
              
              <div v-else-if="currentCategory === 'natopenVZ'">
                <p>NAT/OpenVZ主机采用轻量级的虚拟化技术，提供高效但资源共享的VPS环境。其特点包括：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>使用OpenVZ虚拟化技术，资源利用率高</li>
                  <li>NAT网络模式，共享IP地址</li>
                  <li>价格极为低廉，通常是最便宜的VPS选择</li>
                  <li>适合轻量级应用和代理服务</li>
                  <li>资源超售率较高，但价格极具吸引力</li>
                </ul>
                <p>这类VPS主要适合对网络性能要求不高的应用场景，或用作辅助服务器。</p>
              </div>
              
              <div v-else-if="currentCategory === 'highSpec'">
                <p>高配VPS主机提供更强大的性能和资源，适合资源密集型应用和高流量网站。主要特点如下：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>多核CPU配置，通常4核以上</li>
                  <li>大内存设计，通常8GB以上</li>
                  <li>高速SSD存储，容量更大</li>
                  <li>带宽更高，通常提供1Gbps以上的网络连接</li>
                  <li>适合高流量网站、数据库服务和企业应用</li>
                </ul>
                <p>高配VPS虽然价格较高，但能满足对计算资源和性能有更高要求的场景。</p>
                </div>
              
              <div v-else-if="currentCategory === 'storage'">
                <p>存储型VPS专为大容量数据存储和备份设计，提供大容量的硬盘空间。特点包括：</p>
                <ul class="list-disc pl-5 my-4">
                  <li>超大硬盘空间，通常在100GB以上</li>
                  <li>可能使用HDD硬盘以提供更大容量</li>
                  <li>适合文件存储、备份和媒体服务器</li>
                  <li>通常带有较高的月流量限制</li>
                  <li>CPU和内存配置适中，专注于存储性能</li>
                </ul>
                <p>存储型VPS是需要大量存储空间但计算需求适中的应用的理想选择。</p>
              </div>
            </div>
          </div>
          
          <!-- 主页或无过滤时显示所有分类 -->
          <template v-if="!filter || filter === 'home'">
            <!-- 月付2美元以下 VPS 部分 -->
            <VpsSection 
              title="月付2美元以下 VPS" 
              description="超低价格的入门级VPS，适合个人学习和测试使用"
              :vpsList="monthlyUnder2Deals" 
              sectionId="monthly2"
              @show-intro="showIntro('monthly2')"
            />
            
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
          </template>
          
          <!-- 按过滤显示特定分类 -->
          <template v-else>
            <!-- 月付2美元以下 VPS 部分 -->
            <VpsSection 
              v-if="filter === 'monthly2'"
              title="月付2美元以下 VPS" 
              description="超低价格的入门级VPS，适合个人学习和测试使用"
              :vpsList="monthlyUnder2Deals" 
              sectionId="monthly2"
              @show-intro="showIntro('monthly2')"
            />
            
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
      
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      showIntro
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
