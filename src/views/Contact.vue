<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    
    <main class="flex-grow container mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
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
        
        <div v-if="submitted" class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">您的留言已成功提交！我们会尽快回复您。</p>
            </div>
          </div>
        </div>
        
        <form class="space-y-4 mb-8" @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
              <label for="name" class="form-label">您的姓名</label>
                  <input 
                    type="text" 
                    id="name" 
                v-model="formData.name"
                class="form-input" 
                placeholder="请输入您的姓名"
                    required
                  >
                </div>
                <div>
              <label for="email" class="form-label">电子邮箱</label>
                  <input 
                    type="email" 
                    id="email" 
                v-model="formData.email"
                class="form-input" 
                placeholder="请输入您的电子邮箱"
                    required
                  >
            </div>
                </div>
                
                <div>
            <label for="subject" class="form-label">主题</label>
                  <input 
                    type="text" 
                    id="subject" 
              v-model="formData.subject"
              class="form-input" 
              placeholder="请输入主题"
                    required
                  >
                </div>
                
                <div>
            <label for="message" class="form-label">消息内容</label>
                  <textarea 
                    id="message" 
              rows="4" 
              v-model="formData.message"
              class="form-input" 
              placeholder="请详细描述您的问题或需求"
                    required
                  ></textarea>
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
              <span class="text-gray-700">starorigin2024@gmail.com</span>
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
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Contact',
  components: {
    Header
  },
  setup() {
    const store = useStore();
    const submitted = ref(false);
    const formData = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    const submitForm = () => {
      // 提交表单数据到Vuex
      store.commit('addUserMessage', {
        name: formData.value.name,
        email: formData.value.email,
        subject: formData.value.subject,
        message: formData.value.message
      });
      
      // 清空表单
      formData.value = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
      
      // 显示成功信息
      submitted.value = true;
        
      // 3秒后隐藏成功信息
      setTimeout(() => {
        submitted.value = false;
      }, 3000);
    };
    
    return {
      formData,
      submitted,
      submitForm
    };
  }
}
</script>

<style scoped>
/* 联系表单动画效果 */
form {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
