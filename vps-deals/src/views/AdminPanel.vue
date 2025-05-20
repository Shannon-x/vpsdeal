<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2 animate-pulse-slow">
                <span class="text-white font-bold text-sm">VPS</span>
              </div>
              <h1 class="text-xl font-bold text-gray-900">VPS 推荐管理后台</h1>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4 hidden sm:inline">欢迎，管理员</span>
            <button @click="logout" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="hidden sm:inline">退出登录</span>
              <span class="sm:hidden">退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 上次登录提示 -->
    <div v-if="lastLogin" class="bg-blue-50 border-b border-blue-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center text-sm text-blue-700">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>您上次登录时间: {{ formatDateTime(lastLogin.timestamp) }}</span>
          <span class="ml-2 text-xs bg-blue-100 px-2 py-0.5 rounded-full">{{ lastLogin.ipInfo ? lastLogin.ipInfo.substring(0, 50) + '...' : '未知设备' }}</span>
        </div>
      </div>
    </div>
    
    <div class="py-6 relative">
      <LoadingSpinner v-if="isLoading" />
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" v-if="!isLoading">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 class="text-2xl font-bold text-gray-900">{{ statsMode ? '访问统计' : (settingsMode || messagesMode ? (messagesMode ? '用户留言管理' : '网站设置') : 'VPS 管理') }}</h2>
          <div class="flex space-x-3">
            <button 
              v-if="!statsMode && !settingsMode && !messagesMode"
              @click="showStatsMode" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              访问统计
            </button>
            <button 
              v-if="!statsMode && !settingsMode && !messagesMode"
              @click="showMessagesMode" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              用户留言管理
            </button>
            <button 
              v-if="!statsMode && !settingsMode && !messagesMode"
              @click="showSettingsMode" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              网站设置
            </button>
            <router-link to="/" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              查看网站
            </router-link>
          </div>
        </div>
        
        <!-- 访问统计 -->
        <div v-if="statsMode" class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900">网站访问统计</h3>
            <button @click="hideStatsMode" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回VPS管理
            </button>
          </div>
          
          <!-- 访问统计组件 -->
          <VisitStatsPanel />
        </div>
        
        <!-- 网站设置和密码管理 -->
        <div v-if="settingsMode" class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900">网站设置</h3>
            <button @click="hideSettingsMode" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回VPS管理
            </button>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- 网站设置组件 -->
            <WebsiteSettings />
            
            <!-- 密码管理组件 -->
            <PasswordChange />
            
            <!-- 管理员账户重置 -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">管理员账户重置</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    将管理员账户重置为初始状态（仅在紧急情况下使用）
                  </p>
                </div>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-yellow-700">
                        警告：此操作将重置管理员账户为初始状态（用户名：shannon2206，密码：xetwuh-supqyw-7xidQy）。
                        <br>
                        仅在忘记密码或账户异常无法访问时使用。
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <button 
                    @click="confirmAdminReset" 
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    重置管理员账户
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 用户留言管理 -->
        <div v-else-if="messagesMode" class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900">用户留言管理</h3>
            <button @click="hideMessagesMode" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
              返回VPS管理
            </button>
                </div>
          
          <!-- 留言列表 -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">用户留言列表</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">管理用户通过网站联系表单提交的留言</p>
                </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">留言内容</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="userMessages.length === 0">
                    <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                      <p>暂无用户留言</p>
                    </td>
                  </tr>
                  <tr v-for="(message, index) in userMessages" :key="index" :class="{'bg-yellow-50': !message.read}">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span class="text-indigo-700 font-medium">{{ message.name.charAt(0).toUpperCase() }}</span>
              </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ message.name }}</div>
                          <div class="text-sm text-gray-500">{{ message.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div>
                        <div class="text-sm font-medium text-gray-900 mb-1">{{ message.subject }}</div>
                        <div class="text-sm text-gray-500 line-clamp-2">{{ message.message }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(message.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="message.read" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        已读
                      </span>
                      <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        未读
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button @click="viewMessage(index)" class="text-indigo-600 hover:text-indigo-900 mr-3">查看</button>
                      <button @click="confirmDeleteMessage(index)" class="text-red-600 hover:text-red-900">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 留言详情模态框 -->
          <div v-if="showMessageDetail" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- 背景遮罩 -->
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showMessageDetail = false"></div>
              
              <!-- 模态框内容 -->
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {{ currentMessage.subject }}
                      </h3>
                      <div class="mt-1 text-sm text-gray-500 flex justify-between">
                        <div>来自: {{ currentMessage.name }} ({{ currentMessage.email }})</div>
                        <div>{{ formatDate(currentMessage.date) }}</div>
                      </div>
                      <div class="mt-4 bg-gray-50 p-4 rounded-md">
                        <p class="text-sm text-gray-700 whitespace-pre-line">{{ currentMessage.message }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button @click="replyToMessage" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    回复邮件
                  </button>
                  <button @click="markAsRead(currentMessageIndex)" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    {{ currentMessage.read ? '标记为未读' : '标记为已读' }}
                  </button>
                  <button @click="showMessageDetail = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 确认删除模态框 -->
          <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <!-- 背景遮罩 -->
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDeleteConfirm = false"></div>
              
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
                        确认删除留言
                      </h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          您确定要删除这条留言吗？此操作无法撤销。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button @click="deleteMessage" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    删除
                  </button>
                  <button @click="showDeleteConfirm = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- VPS 管理界面 -->
        <div v-else>
          <!-- 分类与VPS管理集成界面 -->
          <div class="bg-white shadow mb-6 rounded-lg overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">分类与VPS管理</h3>
              <p class="mt-1 text-sm text-gray-500">管理网站导航栏分类并为每个分类添加VPS</p>
            </div>
          </div>

          <!-- 分类管理 -->
          <CategoryManager @select-category="handleCategorySelect" />

          <!-- 选中分类的VPS管理 -->
          <div v-if="selectedCategory && !statsMode && !settingsMode && !messagesMode" class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">{{ categoryTitle }}</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    {{ selectedCategoryName }}，共{{ categoryDeals.length || 0 }}项
                  </p>
                </div>
                <div class="flex space-x-3">
                  <button 
                    @click="openAddForm" 
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    添加VPS
                  </button>
                </div>
              </div>
              
              <!-- VPS卡片列表 -->
              <div v-if="categoryDeals && categoryDeals.length > 0" class="px-4 py-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- VPS卡片 -->
                  <div v-for="(vps, index) in categoryDeals" :key="index" class="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                    <!-- 卡片顶部 -->
                    <div class="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="text-lg font-semibold text-gray-900">{{ vps.name }}</h4>
                          <div class="text-sm text-gray-600 mt-1">{{ vps.config }}</div>
                        </div>
                        <!-- 服务商Logo -->
                        <div v-if="vps.providerLogo" class="w-16 h-16 flex items-center justify-center">
                          <img :src="vps.providerLogo" alt="服务商Logo" class="max-w-full max-h-full object-contain">
                        </div>
                        <div v-else class="w-16 h-16 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                          VPS
                        </div>
                      </div>
                    </div>
                    
                    <!-- 卡片内容 -->
                    <div class="p-4">
                      <!-- 配置详情 -->
                      <div class="mb-4">
                        <div class="grid grid-cols-2 gap-2 text-sm">
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.cpu || 'N/A' }}</span>
                          </div>
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.ram }}</span>
                          </div>
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.storage }}</span>
                          </div>
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.bandwidth }}</span>
                          </div>
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.ipv4 }}</span>
                          </div>
                          <div class="flex items-center col-span-2">
                            <svg class="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="text-gray-700">{{ vps.details.location }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- 价格信息 -->
                      <div class="mb-4 text-center">
                        <div class="text-2xl font-bold text-indigo-600">{{ vps.price }}</div>
                      </div>
                      
                      <!-- 卡片底部 - 操作按钮 -->
                      <div class="flex flex-col space-y-2">
                        <div class="flex justify-between">
                          <a :href="vps.link" target="_blank" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full">
                            {{ vps.buttonText || '立即购买' }}
                          </a>
                        </div>
                        <div class="flex space-x-2">
                          <a v-if="vps.reviewLink" :href="vps.reviewLink" target="_blank" class="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            查看评价
                          </a>
                          <button @click="editVps(index)" class="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 transition-colors">
                            编辑
                          </button>
                          <button @click="confirmDelete(index)" class="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 无数据提示 -->
              <div v-else class="px-4 py-12 bg-gray-50 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p class="text-gray-500 mb-4">当前分类尚无任何数据</p>
                <button 
                  @click="openAddForm" 
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  添加VPS
                </button>
              </div>
            </div>
            
            <!-- VPS添加/编辑表单 -->
            <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeForm"></div>

                <!-- 模态框内容 -->
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {{ isEditing ? '编辑' : '添加' }}VPS
                </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- 基本信息 -->
                      <div class="space-y-4">
                        <div>
                          <label for="vps-name" class="block text-sm font-medium text-gray-700">VPS名称</label>
                          <input 
                            v-model="currentVps.name" 
                            type="text" 
                            id="vps-name" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：高性能KVM-1"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-config" class="block text-sm font-medium text-gray-700">配置简述</label>
                          <input 
                            v-model="currentVps.config" 
                            type="text" 
                            id="vps-config" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：2核 / 4GB / 50GB SSD"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-price" class="block text-sm font-medium text-gray-700">价格</label>
                          <input 
                            v-model="currentVps.price" 
                            type="text" 
                            id="vps-price" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：$15/年"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-logo" class="block text-sm font-medium text-gray-700">服务商Logo (URL)</label>
                          <input 
                            v-model="currentVps.providerLogo" 
                            type="text" 
                            id="vps-logo" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="输入logo图片URL"
                          />
                          <p class="mt-1 text-xs text-gray-500">留空则显示默认背景</p>
                        </div>
                        
                        <div>
                          <label for="vps-link" class="block text-sm font-medium text-gray-700">购买链接</label>
                          <input 
                            v-model="currentVps.link" 
                            type="text" 
                            id="vps-link" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="输入购买链接URL"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-button" class="block text-sm font-medium text-gray-700">按钮文字</label>
                          <input 
                            v-model="currentVps.buttonText" 
                            type="text" 
                            id="vps-button" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="默认为：立即购买"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-review" class="block text-sm font-medium text-gray-700">评价链接</label>
                          <input 
                            v-model="currentVps.reviewLink" 
                            type="text" 
                            id="vps-review" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="输入评价链接URL"
                          />
                          <p class="mt-1 text-xs text-gray-500">留空则不显示查看评价按钮</p>
                      </div>
                    </div>
                    
                    <!-- 详细配置 -->
                      <div class="space-y-4">
                        <div>
                          <label for="vps-cpu" class="block text-sm font-medium text-gray-700">CPU</label>
                          <input 
                            v-model="currentVps.details.cpu" 
                            type="text" 
                            id="vps-cpu" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：2核心"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-ram" class="block text-sm font-medium text-gray-700">内存</label>
                          <input 
                            v-model="currentVps.details.ram" 
                            type="text" 
                            id="vps-ram" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：4GB"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-storage" class="block text-sm font-medium text-gray-700">存储</label>
                          <input 
                            v-model="currentVps.details.storage" 
                            type="text" 
                            id="vps-storage" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：50GB SSD"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-bandwidth" class="block text-sm font-medium text-gray-700">带宽</label>
                          <input 
                            v-model="currentVps.details.bandwidth" 
                            type="text" 
                            id="vps-bandwidth" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：1Gbps / 1TB"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-ipv4" class="block text-sm font-medium text-gray-700">IPv4</label>
                          <input 
                            v-model="currentVps.details.ipv4" 
                            type="text" 
                            id="vps-ipv4" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：1个独立IP"
                          />
                        </div>
                        
                        <div>
                          <label for="vps-location" class="block text-sm font-medium text-gray-700">位置</label>
                          <input 
                            v-model="currentVps.details.location" 
                            type="text" 
                            id="vps-location" 
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="例如：美国、荷兰、日本"
                          />
                        </div>
                        
                        <!-- 预览 -->
                        <div class="mt-6">
                          <h4 class="text-sm font-medium text-gray-700 mb-2">VPS卡片预览</h4>
                          <div class="border rounded-lg p-4 bg-gray-50">
                            <div class="flex justify-between items-center">
                              <div class="text-lg font-semibold text-gray-900">{{ currentVps.name || '示例VPS名称' }}</div>
                              <div v-if="currentVps.providerLogo" class="w-12 h-12 flex items-center justify-center">
                                <img :src="currentVps.providerLogo" alt="Logo预览" class="max-w-full max-h-full object-contain">
                      </div>
                              <div v-else class="w-12 h-12 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
                                VPS
                    </div>
                </div>
                            <div class="text-sm text-gray-600 mt-1">{{ currentVps.config || '2核 / 4GB / 50GB SSD' }}</div>
                            <div class="mt-2 text-center">
                              <div class="text-xl font-bold text-indigo-600">{{ currentVps.price || '$15/年' }}</div>
              </div>
            </div>
          </div>
                      </div>
                    </div>
                  </div>
                  
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="saveVps" 
                      type="button" 
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
                      {{ isEditing ? '保存修改' : '添加VPS' }}
            </button>
            <button 
              @click="closeForm" 
                      type="button" 
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
    
            <!-- 确认删除对话框 -->
            <div v-if="showConfirm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <!-- 模态框内容 -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full modal-confirm">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                      <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  确认操作
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="confirmAction()" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              确认
            </button>
            <button 
              @click="showConfirm = false" 
                      type="button" 
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import CategoryManager from '../components/CategoryManager.vue';
import WebsiteSettings from '../components/WebsiteSettings.vue';
import PasswordChange from '../components/PasswordChange.vue';
import VisitStatsPanel from '../components/VisitStatsPanel.vue';

export default {
  components: {
    LoadingSpinner,
    CategoryManager,
    WebsiteSettings,
    PasswordChange,
    VisitStatsPanel
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    // 用户认证检查
    onMounted(() => {
      // 强制刷新登录状态检查
      store.commit('checkLoginStatus');
      
      // 重新检查登录状态
      if (!store.getters.isLoggedIn) {
        router.push('/adminshuhao1031');
        return;
      }
      
      // 额外验证：检查localStorage中是否有有效的登录凭据
      try {
        const authData = localStorage.getItem('admin-auth');
        const credentialsData = localStorage.getItem('admin-credentials');
        
        if (!authData || !credentialsData) {
          // 如果没有登录信息或凭据，强制退出
          store.commit('logout');
          router.push('/adminshuhao1031');
          return;
        }
        
        const auth = JSON.parse(authData);
        const credentials = JSON.parse(credentialsData);
        
        // 检查登录状态的有效性
        if (!auth.isLoggedIn || !auth.username || auth.username !== credentials.username) {
          store.commit('logout');
          router.push('/adminshuhao1031');
        }
      } catch (e) {
        console.error('验证登录状态失败:', e);
        store.commit('logout');
        router.push('/adminshuhao1031');
      }
    });
    
    // 状态变量
    const selectedCategory = ref(null);
    const showForm = ref(false);
    const isEditing = ref(false);
    const editIndex = ref(-1);
    const isLoading = computed(() => store.getters.isLoading);
    const settingsMode = ref(false);
    const messagesMode = ref(false);
    const statsMode = ref(false);
    const adminMode = ref('vps');  // 'vps' 或 'categories'
    
    // 确认对话框相关
    const showConfirm = ref(false);
    const confirmMessage = ref('');
    const confirmAction = ref(() => {});
    
    // 新增选中的导航分类名称
    const selectedCategoryName = ref('');
    
    // 用户留言管理相关状态
    const userMessages = computed(() => store.getters.getUserMessages);
    const showMessageDetail = ref(false);
    const showDeleteConfirm = ref(false);
    const currentMessageIndex = ref(-1);
    const currentMessage = ref({});
    
    // 处理分类选择事件
    const handleCategorySelect = (categoryData) => {
      if (categoryData && categoryData.collection) {
        selectedCategory.value = categoryData.collection;
        selectedCategoryName.value = categoryData.name;
        // 确保对应的集合已初始化
        store.dispatch('ensureCategoryExists', categoryData.collection);
      }
    };
    
    // 监听自定义事件
    onMounted(() => {
      window.addEventListener('select-category', (event) => {
        if (event.detail) {
          handleCategorySelect(event.detail);
        }
      });
      
      // 确保必要的分类存在
      store.dispatch('ensureCategoryExists', 'vpsDeals');
      store.dispatch('ensureCategoryExists', 'vdsDeals');
      store.dispatch('ensureCategoryExists', 'dedicatedDeals');
      
      store.commit('setLoading', true);
      setTimeout(() => {
        store.commit('setLoading', false);
      }, 800);
    });
    
    // 当前分类的VPS列表
    const categoryDeals = computed(() => {
      return selectedCategory.value ? store.getters.getDeals(selectedCategory.value) : [];
    });
    
    // 当前分类标题
    const categoryTitle = computed(() => {
      return selectedCategoryName.value ? `${selectedCategoryName.value} 列表` : '';
    });
    
    // 当前编辑的VPS对象
    const currentVps = ref({
      name: '',
      config: '',
      details: {
        cpu: '',
        ram: '',
        storage: '',
        bandwidth: '',
        ipv4: '',
        location: ''
      },
      price: '',
      link: '',
      buttonText: '',
      providerLogo: '',
      reviewLink: ''
    });
    
    // 方法：创建新的VPS
    const openAddForm = () => {
      isEditing.value = false;
      currentVps.value = {
        name: '',
        config: '',
        details: {
          cpu: '',
          ram: '',
          storage: '',
          bandwidth: '',
          ipv4: '',
          location: ''
        },
        price: '',
        link: '',
        buttonText: '',
        providerLogo: '',
        reviewLink: ''
      };
      showForm.value = true;
    };
    
    // 方法：编辑现有VPS
    const editVps = (index) => {
      isEditing.value = true;
      editIndex.value = index;
      // 克隆对象以避免直接修改
      currentVps.value = JSON.parse(JSON.stringify(categoryDeals.value[index]));
      // 确保providerLogo属性存在
      if (!currentVps.value.providerLogo) {
        currentVps.value.providerLogo = '';
      }
      showForm.value = true;
    };
    
    // 方法：保存VPS数据
    const saveVps = () => {
      console.log('保存VPS数据:', currentVps.value);
      console.log('isEditing:', isEditing.value, 'editIndex:', editIndex.value);
      
      try {
        // 确定实际使用的集合名称
        let categoryKey = selectedCategory.value;
        // 在路由名和集合名之间建立映射关系
        const categoryToCollectionMap = {
          'monthly': 'monthlyUnder2Deals',
          'under15': 'annualUnder15Deals',
          'under25': 'annualUnder25Deals',
          'nat': 'natOpenVZDeals',
          'highspec': 'highSpecDeals',
          'storage': 'storageDeals',
          'free': 'freeDeals',
          'vds': 'vdsDeals'
        };
        
        if (categoryToCollectionMap[selectedCategory.value]) {
          categoryKey = categoryToCollectionMap[selectedCategory.value];
        }
        
        console.log('使用分类键:', categoryKey, '从选定分类:', selectedCategory.value);
        
        if (isEditing.value) {
          // 更新现有VPS
          store.commit('updateVps', {
            category: categoryKey,
            index: editIndex.value,
            vps: currentVps.value
          });
          console.log('VPS更新成功');
        } else {
          // 添加新VPS
          store.commit('addVps', {
            category: categoryKey,
            vps: currentVps.value
          });
          console.log('新VPS添加成功');
        }
        
        // 确保数据保存到localStorage
        setTimeout(() => {
          // 关闭表单
          showForm.value = false;
          
          // 显示成功提示
          store.commit('setNotification', {
            show: true,
            type: 'success',
            message: isEditing.value ? 'VPS编辑成功' : 'VPS添加成功',
            timeout: 3000
          });
        }, 200);
      } catch (error) {
        console.error('保存VPS时出错:', error);
        store.commit('setNotification', {
          show: true,
          type: 'error',
          message: '操作失败: ' + (error.message || '未知错误'),
          timeout: 5000
        });
      }
    };
    
    // 方法：关闭表单
    const closeForm = () => {
      showForm.value = false;
    };
    
    // 方法：确认删除
    const confirmDelete = (index) => {
      showConfirm.value = true;
      confirmMessage.value = '确定要删除这个VPS吗？此操作不可撤销。';
      confirmAction.value = () => {
        store.commit('deleteVps', {
          category: selectedCategory.value,
          index: index
        });
        showConfirm.value = false;
      };
    };
    
    // 方法：确认重置数据
    const confirmReset = () => {
      showConfirm.value = true;
      confirmMessage.value = '确定要重置所有数据吗？此操作将恢复到默认数据，且不可撤销。';
      confirmAction.value = () => {
        store.commit('resetData');
        showConfirm.value = false;
      };
    };
    
    // 方法：退出登录
    const logout = () => {
      store.commit('logout');
      router.push('/adminshuhao1031');
    };
    
    // 添加网站设置模式相关方法
    const showSettingsMode = () => {
      settingsMode.value = true;
      messagesMode.value = false;
    };

    const hideSettingsMode = () => {
      settingsMode.value = false;
    };

    // 添加用户留言管理模式相关方法
    const showMessagesMode = () => {
      messagesMode.value = true;
      settingsMode.value = false;
      statsMode.value = false;
    };
    
    // 添加访问统计模式相关方法
    const showStatsMode = () => {
      statsMode.value = true;
      messagesMode.value = false;
      settingsMode.value = false;
    };
    
    const hideStatsMode = () => {
      statsMode.value = false;
    };

    const hideMessagesMode = () => {
      messagesMode.value = false;
    };
    
    // 用户留言管理相关状态和方法
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };
    
    // 查看留言详情
    const viewMessage = (index) => {
      currentMessageIndex.value = index;
      currentMessage.value = { ...userMessages.value[index] };
      showMessageDetail.value = true;
      
      // 如果未读，则标记为已读
      if (!userMessages.value[index].read) {
        store.commit('updateMessageReadStatus', { index, read: true });
      }
    };
    
    // 标记为已读/未读
    const markAsRead = (index) => {
      const read = !userMessages.value[index].read;
      store.commit('updateMessageReadStatus', { index, read });
      currentMessage.value.read = read;
    };
    
    // 确认删除留言
    const confirmDeleteMessage = (index) => {
      currentMessageIndex.value = index;
      showDeleteConfirm.value = true;
    };
    
    // 删除留言
    const deleteMessage = () => {
      store.commit('deleteUserMessage', currentMessageIndex.value);
      showDeleteConfirm.value = false;
      
      // 如果当前正在查看该留言，则关闭详情模态框
      if (showMessageDetail.value) {
        showMessageDetail.value = false;
      }
    };
    
    // 回复邮件
    const replyToMessage = () => {
      const email = currentMessage.value.email;
      const subject = `回复: ${currentMessage.value.subject}`;
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
    };
    
    // 管理员账户重置
    const confirmAdminReset = () => {
      showConfirm.value = true;
      confirmMessage.value = '确定要重置管理员账户吗？此操作将重置管理员账户为初始状态（用户名：shannon2206，密码：xetwuh-supqyw-7xidQy）。';
      confirmAction.value = () => {
        try {
          // 直接调用store的resetAdmin方法
          store.commit('resetAdmin');
          
          // 显示成功提示
          setTimeout(() => {
            store.commit('setNotification', {
              show: true,
              type: 'success',
              message: '<strong>重置成功</strong><br>管理员账户已重置为初始状态'
            });
          }, 300);
          
          // 关闭确认对话框
          showConfirm.value = false;
          
          // 记录到控制台
          console.log('管理员账户已重置为初始状态: shannon2206/xetwuh-supqyw-7xidQy');
        } catch (e) {
          console.error('重置管理员账户失败:', e);
          
          // 显示错误提示
          store.commit('setNotification', {
            show: true,
            type: 'error',
            message: '<strong>重置失败</strong><br>重置管理员账户时发生错误'
          });
          
          // 关闭确认对话框
          showConfirm.value = false;
        }
      };
    };
    
    // 登录历史记录
    const lastLogin = ref(null);
    
    // 在组件挂载时获取上一次登录信息
    onMounted(() => {
      try {
        const loginLogs = JSON.parse(localStorage.getItem('login-logs') || '[]');
        // 获取最后2条成功登录记录（不包括当前登录）
        const successfulLogins = loginLogs
          .filter(log => log.success)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        if (successfulLogins.length >= 2) {
          // 第二条记录（即上一次的登录）
          lastLogin.value = successfulLogins[1];
        }
      } catch (e) {
        console.error('获取登录历史记录失败:', e);
      }
    });
    
    // 格式化日期时间
    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
    
    return {
      selectedCategory,
      categoryDeals,
      categoryTitle,
      showForm,
      isEditing,
      currentVps,
      showConfirm,
      confirmMessage,
      confirmAction,
      openAddForm,
      editVps,
      saveVps,
      closeForm,
      confirmDelete,
      confirmReset,
      logout,
      isLoading,
      settingsMode,
      messagesMode,
      statsMode,
      adminMode,
      selectedCategoryName,
      handleCategorySelect,
      userMessages,
      showMessageDetail,
      showDeleteConfirm,
      currentMessageIndex,
      currentMessage,
      formatDate,
      viewMessage,
      markAsRead,
      confirmDeleteMessage,
      deleteMessage,
      replyToMessage,
      showSettingsMode,
      hideSettingsMode,
      showMessagesMode,
      hideMessagesMode,
      showStatsMode,
      hideStatsMode,
      confirmAdminReset,
      lastLogin,
      formatDateTime
    };
  }
};
</script>

<style scoped>
/* 动画效果 */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 交互效果 */
.dashboard-icon {
  transition: all 0.3s ease;
}

.transform.hover\:scale-102:hover {
  transform: scale(1.02);
}

.dashboard-icon:hover {
  transform: rotate(10deg);
}

.category-icon {
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.vps-item {
  transition: all 0.3s ease;
}

.vps-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.feature-item {
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

/* 表单动画 */
.form-input {
  transition: all 0.3s ease;
}

.form-input:focus {
  transform: scale(1.02);
}

/* 模态框动画 */
.modal-content {
  animation: modal-appear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-confirm {
  animation: modal-appear 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-appear {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* 响应式布局优化 */
@media (max-width: 640px) {
  .vps-item {
    padding: 1rem 0.75rem;
  }
  
  .dashboard-card {
    padding: 1rem;
  }
  
  .category-card {
    padding: 0.75rem;
  }
  
  /* 改进移动端的响应效果 */
  .counter {
    font-size: 1.5rem;
  }
}

/* 计数器动画 */
.counter {
  position: relative;
  display: inline-block;
}

.counter::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(79, 70, 229, 0) 0%, rgba(79, 70, 229, 1) 50%, rgba(79, 70, 229, 0) 100%);
  animation: counter-line 1.5s infinite;
}

@keyframes counter-line {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
}
</style>
