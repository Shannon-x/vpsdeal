# VPS Deals - 超值VPS优惠推荐平台

一个现代化的VPS优惠信息展示平台，采用Nuxt.js构建，支持SSR/SSG以优化SEO，并配备了现代化的UI设计。

[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")

## 技术栈

- **前端框架**: Nuxt.js 3 (Vue.js 3)
- **UI框架**: Tailwind CSS
- **状态管理**: Pinia
- **后端**: Express.js + MySQL
- **认证**: JWT (JSON Web Tokens)
- **密码加密**: bcryptjs
- **数据库**: MySQL

## 主要特性

- ✨ **现代化UI设计**
  - Glassmorphism（玻璃态）效果
  - Neumorphism（新拟态）设计
  - 动态渐变背景
  - 3D变换效果
  - 响应式设计

- 🚀 **SEO优化**
  - 服务端渲染(SSR)
  - 静态站点生成(SSG)
  - 结构化数据
  - Meta标签优化

- 🔒 **安全特性**
  - JWT认证
  - 密码加密存储
  - CORS配置
  - 环境变量保护

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Shannon-x/vps.git
cd vps
```

### 2. 安装依赖

```bash
# 安装所有依赖（前端 + 后端）
npm run install:all

# 或者分别安装
npm install          # 前端依赖
npm run server:install   # 后端依赖
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并填写相应配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息：

```env
# 数据库配置
DATABASE_URL=mysql://username:password@localhost:3306/vps_deals

# JWT配置
JWT_SECRET=your-super-secret-jwt-key

# 管理员账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# 其他配置...
```

### 4. 初始化数据库

```bash
# 导入数据库结构
mysql -u root -p < database/schema.sql
```

### 5. 启动开发服务器

```bash
# 同时启动前端和后端（推荐）
npm run dev:all

# 或者分别启动
npm run server:dev   # 后端API服务器 (端口 3001)
npm run dev          # 前端服务器 (端口 3000)
```

访问 http://localhost:3000 查看网站。

## 生产部署

### 使用PM2部署

1. 构建生产版本：

```bash
npm run build
```

2. 安装PM2：

```bash
npm install -g pm2
```

3. 创建 PM2 配置文件：

```bash
cp ecosystem.config.js.example ecosystem.config.js
```

4. 启动应用：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 使用Docker部署

1. 构建Docker镜像：

```bash
docker build -t vps-deals .
```

2. 运行容器：

```bash
docker run -d \
  --name vps-deals \
  -p 3000:3000 \
  -p 3001:3001 \
  --env-file .env \
  vps-deals
```

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API接口文档

### 公开接口

- `GET /api/categories` - 获取所有分类
- `GET /api/vps` - 获取VPS列表（支持筛选）
- `GET /api/vps/:id` - 获取单个VPS详情

### 管理接口（需要认证）

- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/stats` - 获取统计数据
- `POST /api/admin/vps` - 添加VPS
- `PUT /api/admin/vps/:id` - 更新VPS
- `DELETE /api/admin/vps/:id` - 删除VPS

## 管理后台

管理后台用于添加、编辑和删除 VPS 优惠信息。

- **访问路径**: `http://localhost:3000/admin`
- **默认用户名**: 在 `.env` 中配置 (默认: `admin`)
- **默认密码**: 在 `.env` 中配置 (请修改默认密码)

## 项目结构

```
vps/
├── app.vue             # Nuxt.js 主应用组件
├── nuxt.config.ts      # Nuxt.js 配置文件
├── tailwind.config.ts  # Tailwind CSS 配置
├── package.json        # 项目依赖
├── .env.example        # 环境变量示例
│
├── components/         # Vue 组件
│   ├── AppHeader.vue   # 应用头部
│   ├── AppFooter.vue   # 应用底部
│   ├── VpsCard.vue     # VPS 卡片组件
│   ├── BackToTop.vue   # 返回顶部按钮
│   └── NotificationSystem.vue # 通知系统
│
├── pages/              # Nuxt.js 页面
│   └── index.vue       # 首页
│
├── layouts/            # Nuxt.js 布局
├── composables/        # Vue 组合式函数
├── stores/             # Pinia 状态管理
│
├── assets/             # 静态资源
│   └── css/
│       └── main.css    # 主样式文件（包含现代化UI效果）
│
├── public/             # 公共静态文件
│   ├── favicon.ico
│   └── images/
│
├── server/             # 后端服务器
│   ├── index.js        # Express 服务器（JSON文件版本）
│   ├── index-mysql.js  # Express 服务器（MySQL版本）
│   └── package.json    # 服务器依赖
│
├── database/           # 数据库
│   └── schema.sql      # MySQL 数据库架构
│
├── docker-compose.yml  # Docker Compose 配置
├── Dockerfile          # Docker 镜像配置
├── nginx.conf          # Nginx 配置
│
├── ecosystem.config.js.example  # PM2 配置示例
├── setup.sh            # 快速启动脚本
│
└── old-vue-version/    # 旧版 Vue 3 代码备份
    ├── src/            # 旧版源代码
    ├── cheapvps.html   # 旧版静态页面
    └── admin-reset.html # 旧版管理页面
```

## 贡献指南

欢迎为此项目做出贡献！请遵循以下步骤：

1. Fork 项目。
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启一个 Pull Request。

## 许可证

本项目根据 MIT 许可证授权。详情请参阅 `LICENSE` 文件。