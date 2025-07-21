# VPS Deals 开发指南

## 项目架构

本项目采用前后端分离架构：
- **前端**: Nuxt 3 (Vue 3) + Tailwind CSS
- **后端**: Express.js + MySQL
- **状态管理**: Pinia
- **认证**: JWT

## 开发环境设置

### 必需软件
- Node.js 16+ 
- MySQL 5.7+
- Git

### 推荐工具
- VS Code
- MySQL Workbench
- Postman (API测试)

## 开发流程

### 1. 初始设置
```bash
# 克隆项目
git clone https://github.com/Shannon-x/vps.git
cd vps

# 运行设置脚本
./setup.sh

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件
```

### 2. 数据库设置
```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE vps_deals"

# 导入架构
mysql -u root -p vps_deals < database/schema.sql
```

### 3. 启动开发服务器
```bash
# 同时启动前端和后端
npm run dev:all
```

## 代码结构

### 前端结构
```
pages/          # 页面组件（自动路由）
components/     # 可复用组件
composables/    # 组合式函数
stores/         # Pinia 状态管理
assets/         # 静态资源
```

### 后端结构
```
server/
├── index-mysql.js    # 主服务器文件
├── routes/          # API路由（可扩展）
├── middleware/      # 中间件（可扩展）
└── utils/          # 工具函数（可扩展）
```

## API 开发

### 添加新的 API 端点

1. 在 `server/index-mysql.js` 中添加路由：
```javascript
app.get('/api/your-endpoint', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT * FROM your_table');
    res.json(results);
  } catch (error) {
    console.error('错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});
```

2. 需要认证的端点：
```javascript
app.post('/api/admin/your-endpoint', authenticateToken, async (req, res) => {
  // 认证后的逻辑
});
```

### 前端调用 API

使用 Nuxt 3 的 `$fetch`:
```vue
<script setup>
const { data } = await $fetch('/api/vps')
</script>
```

或在组件中：
```javascript
const fetchData = async () => {
  try {
    const data = await $fetch('/api/vps', {
      query: { category: 'hongkong' }
    })
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
```

## 组件开发

### 创建新组件

1. 在 `components/` 目录创建 Vue 文件
2. 组件自动注册，无需导入

示例：
```vue
<!-- components/PriceDisplay.vue -->
<template>
  <div class="price-display">
    <span class="currency">$</span>
    <span class="amount">{{ price }}</span>
    <span class="period">/月</span>
  </div>
</template>

<script setup>
defineProps({
  price: {
    type: Number,
    required: true
  }
})
</script>
```

使用：
```vue
<PriceDisplay :price="9.99" />
```

## 样式开发

### Tailwind CSS 使用

1. 使用预定义的类：
```vue
<div class="bg-primary-500 text-white p-4 rounded-lg">
  内容
</div>
```

2. 自定义样式在 `tailwind.config.ts` 中配置

3. 组件样式：
```vue
<style scoped>
.custom-class {
  @apply bg-gradient-to-r from-primary-500 to-accent-500;
}
</style>
```

## 状态管理

### 创建 Pinia Store

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null
  }),
  
  actions: {
    async login(credentials) {
      const { token } = await $fetch('/api/admin/login', {
        method: 'POST',
        body: credentials
      })
      this.token = token
    }
  }
})
```

## 测试

### API 测试
使用 Postman 或 curl：
```bash
# 获取VPS列表
curl http://localhost:3001/api/vps

# 管理员登录
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

### 前端测试
使用浏览器开发者工具和 Vue DevTools

## 部署准备

### 生产构建
```bash
# 构建前端
npm run build

# 安装生产依赖
cd server && npm install --production
```

### 环境变量
确保生产环境 `.env` 文件包含：
- 安全的 JWT_SECRET
- 生产数据库连接
- 正确的 SITE_URL

## 最佳实践

1. **安全性**
   - 永远不要提交 `.env` 文件
   - 使用强密码和 JWT 密钥
   - 验证所有用户输入

2. **性能**
   - 使用数据库索引
   - 实现分页
   - 使用缓存（Redis）

3. **代码质量**
   - 运行 ESLint: `npm run lint`
   - 保持代码整洁
   - 添加注释说明复杂逻辑

4. **Git 工作流**
   - 功能分支开发
   - 清晰的提交信息
   - 定期推送代码