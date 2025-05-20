<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">导航分类管理</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
        管理网站导航栏和主页显示的VPS分类
      </p>
    </div>
    
    <div class="px-4 py-5 sm:p-6">
      <!-- 分类列表 -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-base font-medium text-gray-900">当前分类</h4>
          <button 
            @click="openAddCategoryModal" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            添加分类
          </button>
        </div>
        
        <div class="bg-gray-50 rounded-md border border-gray-200">
          <div class="grid grid-cols-12 gap-2 px-4 py-3 font-medium text-gray-700 bg-gray-100 rounded-t-md">
            <div class="col-span-1">排序</div>
            <div class="col-span-3">名称</div>
            <div class="col-span-3">路径</div>
            <div class="col-span-2">显示位置</div>
            <div class="col-span-3 text-center">操作</div>
          </div>
          
          <div v-if="categories.length === 0" class="px-4 py-8 text-center text-gray-500">
            没有找到分类，请添加新分类
          </div>
          
          <div v-else>
            <div v-for="(category, index) in categories" :key="category.id" 
                 class="grid grid-cols-12 gap-2 px-4 py-3 border-t border-gray-200 items-center hover:bg-gray-50 transition-colors">
              <div class="col-span-1 flex items-center space-x-1">
                <button 
                  @click="moveCategory(index, 'up')" 
                  :disabled="index === 0"
                  :class="index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-indigo-600'"
                  class="focus:outline-none"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                </button>
                <button 
                  @click="moveCategory(index, 'down')" 
                  :disabled="index === categories.length - 1"
                  :class="index === categories.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-indigo-600'"
                  class="focus:outline-none"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              <div class="col-span-3 truncate font-medium">{{ category.name }}</div>
              <div class="col-span-3 truncate text-gray-600">{{ category.path }}</div>
              <div class="col-span-2">
                <span 
                  class="px-2 py-1 text-xs rounded-full" 
                  :class="category.isMainNav ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ category.isMainNav ? '主导航' : '更多菜单' }}
                </span>
              </div>
              <div class="col-span-3 flex justify-center space-x-2">
                <button 
                  @click="selectCategory(category)"
                  class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  title="管理此分类VPS"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </button>
                <button 
                  @click="openEditCategoryModal(category)"
                  class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  title="编辑"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="toggleNavDisplay(category)"
                  class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  :title="category.isMainNav ? '移至更多菜单' : '移至主导航'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="category.isMainNav" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                </button>
                <button 
                  @click="confirmDeleteCategory(category)"
                  class="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-red-50"
                  title="删除"
                  :disabled="category.id === 'home'"
                  :class="category.id === 'home' ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 批量操作按钮 -->
      <div class="flex justify-end">
        <button 
          @click="confirmResetCategories" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          重置为默认分类
        </button>
      </div>
    </div>
    
    <!-- 添加/编辑分类模态框 -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>
        
        <!-- 模态框内容 -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ editMode ? '编辑分类' : '添加分类' }}
            </h3>
            
            <div class="space-y-4">
              <div>
                <label for="category-name" class="block text-sm font-medium text-gray-700">分类名称</label>
                <input 
                  v-model="currentCategory.name" 
                  type="text" 
                  id="category-name" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="例如：高性能VPS"
                  :disabled="editMode && currentCategory.id === 'home'"
                />
              </div>
              
              <div>
                <label for="category-path" class="block text-sm font-medium text-gray-700">分类路径</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /
                  </span>
                  <input 
                    v-model="currentCategory.pathSegment" 
                    type="text" 
                    id="category-path" 
                    class="block w-full border border-gray-300 rounded-none rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="例如：high-performance"
                    :disabled="editMode && currentCategory.id === 'home'"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">请使用英文字母、数字和连字符</p>
              </div>
              
              <div>
                <label for="category-nav" class="block text-sm font-medium text-gray-700">显示位置</label>
                <select 
                  v-model="currentCategory.isMainNav" 
                  id="category-nav" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option :value="true">主导航</option>
                  <option :value="false">更多菜单</option>
                </select>
              </div>
              
              <div>
                <label for="create-collection" class="flex items-center text-sm font-medium text-gray-700">
                  <input 
                    v-model="currentCategory.createCollection" 
                    type="checkbox" 
                    id="create-collection" 
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                    :disabled="editMode"
                  />
                  <span>创建对应的VPS数据集合</span>
                </label>
                <p class="mt-1 text-sm text-gray-500">如果勾选，系统将自动创建对应的VPS数据集合，供您添加新的VPS数据</p>
              </div>
              <div class="mt-4">
                <label for="category-description" class="block text-sm font-medium text-gray-700">分类简介</label>
                <textarea
                  v-model="currentCategory.description"
                  id="category-description"
                  rows="4"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="请输入了解分类内容，支持HTML"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">可使用 &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; 等HTML标签</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="saveCategory" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ editMode ? '保存修改' : '添加分类' }}
            </button>
            <button 
              @click="closeModal" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认删除模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelDelete"></div>
        
        <!-- 模态框内容 -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  确认删除分类
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    您确定要删除分类 "{{ categoryToDelete && categoryToDelete.name }}" 吗？此操作不可逆。
                    <template v-if="hasDealCollection">
                      <br><br>
                      <span class="font-medium text-red-500">警告: 此分类包含 {{ dealCount }} 个VPS数据，删除分类将同时删除所有关联的VPS数据。</span>
                    </template>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteCategory" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              确认删除
            </button>
            <button 
              @click="cancelDelete" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认重置模态框 -->
    <div v-if="showResetModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelReset"></div>
        
        <!-- 模态框内容 -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  确认重置分类
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    您确定要将所有分类重置为默认值吗？此操作将删除所有自定义分类，但不会删除默认分类关联的VPS数据。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="resetCategories" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              确认重置
            </button>
            <button 
              @click="cancelReset" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  emits: ['select-category'],
  name: 'CategoryManager',
  setup(props, { emit }) {
    const store = useStore();
    
    // 获取所有分类
    const categories = computed(() => store.getters.getAllCategories);
    
    // 模态框状态
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const showResetModal = ref(false);
    const editMode = ref(false);
    const currentCategory = ref({
      name: '',
      pathSegment: '',
      isMainNav: false,
      createCollection: true,
      description: ''
    });
    const categoryToDelete = ref(null);
    
    // 计算属性：要删除的分类是否有关联的VPS数据集合
    const hasDealCollection = computed(() => {
      if (!categoryToDelete.value) return false;
      const id = categoryToDelete.value.id;
      return store.state[`${id}Deals`] !== undefined;
    });
    
    // 计算关联的VPS数量
    const dealCount = computed(() => {
      if (!hasDealCollection.value) return 0;
      const id = categoryToDelete.value.id;
      return store.state[`${id}Deals`] && store.state[`${id}Deals`].length || 0;
    });
    
    // 打开添加分类模态框
    const openAddCategoryModal = () => {
      editMode.value = false;
      currentCategory.value = {
        name: '',
        pathSegment: '',
        isMainNav: false,
        createCollection: true,
        description: ''
      };
      showModal.value = true;
    };
    
    // 打开编辑分类模态框
    const openEditCategoryModal = (category) => {
      editMode.value = true;
      // 提取路径部分，去除前面的'/'
      const pathSegment = category.path.startsWith('/') ? category.path.substring(1) : category.path;
      currentCategory.value = { 
        ...category, 
        pathSegment,
        createCollection: false,
        description: category.description || ''
      };
      showModal.value = true;
    };
    
    // 关闭模态框
    const closeModal = () => {
      showModal.value = false;
    };
    
    // 保存分类
    const saveCategory = () => {
      try {
        if (!currentCategory.value.name.trim()) {
          alert('分类名称不能为空');
          return;
        }
        
        // 处理路径
        let path = currentCategory.value.pathSegment.trim();
        // 如果为空，则使用分类ID或名称的小写版本
        if (!path) {
          path = currentCategory.value.name.toLowerCase().replace(/\s+/g, '-');
        }
        
        // 确保路径以/开头
        if (!path.startsWith('/')) {
          path = '/' + path;
        }
        
        if (editMode.value) {
          // 更新分类
          store.commit('updateCategory', {
            id: currentCategory.value.id,
            category: {
              name: currentCategory.value.name,
              path: path,
              isMainNav: currentCategory.value.isMainNav,
              description: currentCategory.value.description
            }
          });
        } else {
          // 添加分类
          store.commit('addCategory', {
            name: currentCategory.value.name,
            path: path,
            isMainNav: currentCategory.value.isMainNav,
            createCollection: currentCategory.value.createCollection,
            description: currentCategory.value.description
          });
        }
        
        // 显示成功通知
        store.commit('setNotification', {
          show: true,
          type: 'success',
          message: editMode.value ? '分类已更新' : '分类已添加'
        });
        
        closeModal();
      } catch (error) {
        alert(error.message || '操作失败，请重试');
      }
    };
    
    // 确认删除分类
    const confirmDeleteCategory = (category) => {
      if (category.id === 'home') return;
      categoryToDelete.value = category;
      showDeleteModal.value = true;
    };
    
    // 取消删除
    const cancelDelete = () => {
      categoryToDelete.value = null;
      showDeleteModal.value = false;
    };
    
    // 删除分类
    const deleteCategory = () => {
      try {
        if (categoryToDelete.value) {
          store.commit('deleteCategory', categoryToDelete.value.id);
          
          // 显示成功通知
          store.commit('setNotification', {
            show: true,
            type: 'success',
            message: '分类已删除'
          });
        }
        cancelDelete();
      } catch (error) {
        alert(error.message || '删除失败，请重试');
      }
    };
    
    // 确认重置分类
    const confirmResetCategories = () => {
      showResetModal.value = true;
    };
    
    // 取消重置
    const cancelReset = () => {
      showResetModal.value = false;
    };
    
    // 重置分类
    const resetCategories = () => {
      try {
        store.commit('resetCategories');
        
        // 显示成功通知
        store.commit('setNotification', {
          show: true,
          type: 'success',
          message: '分类已重置为默认值'
        });
        
        cancelReset();
      } catch (error) {
        alert(error.message || '重置失败，请重试');
      }
    };
    
    // 切换分类在导航栏中的显示位置
    const toggleNavDisplay = (category) => {
      try {
        store.commit('updateCategory', {
          id: category.id,
          category: {
            isMainNav: !category.isMainNav
          }
        });
        
        // 显示成功通知
        store.commit('setNotification', {
          show: true,
          type: 'success',
          message: `分类已移至${!category.isMainNav ? '主导航' : '更多菜单'}`
        });
      } catch (error) {
        alert(error.message || '操作失败，请重试');
      }
    };
    
    // 移动分类（上移/下移）
    const moveCategory = (index, direction) => {
      const category = categories.value[index];
      if (!category) return;
      
      try {
        let newOrder;
        
        if (direction === 'up' && index > 0) {
          newOrder = category.order - 1;
        } else if (direction === 'down' && index < categories.value.length - 1) {
          newOrder = category.order + 1;
        } else {
          return;
        }
        
        store.commit('reorderCategories', {
          id: category.id,
          newOrder
        });
      } catch (error) {
        alert(error.message || '移动失败，请重试');
      }
    };
    
    // 选择分类，通知父组件
    const selectCategory = (category) => {
      let collection = null;
      // 根据分类ID确定正确的数据集合
      switch(category.id) {
        case 'monthly':
          collection = 'monthlyUnder2Deals';
          break;
        case 'under15':
          collection = 'annualUnder15Deals';
          break;
        case 'under25':
          collection = 'annualUnder25Deals';
          break;
        case 'nat':
          collection = 'natOpenVZDeals';
          break;
        case 'storage':
          collection = 'storageDeals';
          break;
        case 'highspec':
          collection = 'highSpecDeals';
          break;
        case 'vds':
          collection = 'vdsDeals';
          break;
        case 'free':
          collection = 'freeDeals';
          break;
        default:
          collection = `${category.id}Deals`;
      }

      // 发送事件
      emit('select-category', { 
        id: category.id, 
        name: category.name, 
        collection: collection 
      });
      // 同时触发window事件，便于其他组件捕获
      window.dispatchEvent(new CustomEvent('select-category', { 
        detail: { 
          id: category.id, 
          name: category.name, 
          collection: collection 
        }
      }));
    };
    
    return {
      categories,
      showModal,
      showDeleteModal,
      showResetModal,
      editMode,
      currentCategory,
      categoryToDelete,
      hasDealCollection,
      dealCount,
      openAddCategoryModal,
      openEditCategoryModal,
      closeModal,
      saveCategory,
      confirmDeleteCategory,
      cancelDelete,
      deleteCategory,
      confirmResetCategories,
      cancelReset,
      resetCategories,
      toggleNavDisplay,
      moveCategory,
      selectCategory
    };
  }
};
</script> 