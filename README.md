# VPS优惠推荐网站

这是一个使用Vue.js和Tailwind CSS构建的VPS优惠推荐网站，提供各种价格区间的VPS优惠信息。

## 功能特点

- 按价格和类型分类展示VPS优惠
- 详细的VPS配置和价格信息
- 响应式设计，适配各种设备
- 管理后台用于内容管理
- SEO友好的页面结构

## 技术栈

- Vue 3 + Composition API
- Vuex 状态管理
- Vue Router 路由管理
- Tailwind CSS 样式框架
- PostCSS 预处理器

## 开发环境设置

### 安装依赖

```bash
# 安装依赖
npm install

# 如果依赖安装有冲突，可以尝试加上 --legacy-peer-deps 选项
npm install --legacy-peer-deps
```

### 本地开发

```bash
# 启动开发服务器
npm run serve
```

开发服务器将在 `http://localhost:8080` 启动。

### 构建生产版本

```bash
# 构建生产环境版本
npm run build
```

构建后的文件将生成在 `dist` 目录中。

## 部署指南

### 1. 部署到普通服务器

#### 使用Nginx部署

1. 构建生产版本
```bash
npm run build
```

2. 将`dist`目录的内容上传到服务器

3. 配置Nginx服务器（示例配置）
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/dist;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

4. 重启Nginx
```bash
sudo service nginx restart
```

#### 使用Apache部署

1. 构建生产版本并上传到服务器

2. 在`dist`目录创建`.htaccess`文件，内容如下：
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 2. 部署到Cloudflare Workers

1. 安装Wrangler CLI工具
```bash
npm install -g @cloudflare/wrangler
```

2. 登录Cloudflare账户
```bash
wrangler login
```

3. 创建`wrangler.toml`配置文件
```toml
name = "vps-deals"
type = "webpack"
account_id = "your-account-id"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./dist"
entry-point = "workers-site"
```

4. 构建生产版本
```bash
npm run build
```

5. 发布到Cloudflare Workers
```bash
wrangler publish
```

### 3. 使用Cloudflare Pages部署（推荐方式）

1. 在GitHub或GitLab上创建仓库并推送代码

2. 登录Cloudflare控制台，转到Pages服务

3. 点击"创建项目"按钮，连接Git仓库

4. 配置构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 环境变量（如需）：根据需要添加

5. 点击部署，Cloudflare将自动构建和部署网站

6. 部署完成后，可以配置自定义域名

## 管理后台

管理后台入口路径：`/adminshuhao1031`

初始密码：`admin123`

管理后台功能：
- 添加/编辑/删除VPS优惠信息
- 修改网站设置
- 管理用户留言
- 修改管理员密码

## 项目结构

```
vps-deals/
├── public/               # 静态资源
├── src/
│   ├── assets/           # 图片、字体等资源
│   ├── components/       # 公共组件
│   ├── data/             # 数据文件
│   ├── router/           # 路由配置
│   ├── store/            # Vuex状态管理
│   ├── styles/           # 全局样式
│   ├── views/            # 页面视图
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── .gitignore            # Git忽略配置
├── babel.config.js       # Babel配置
├── package.json          # 项目依赖
├── postcss.config.js     # PostCSS配置
├── tailwind.config.js    # Tailwind CSS配置
└── vue.config.js         # Vue CLI配置
```

## 自定义配置

### 修改数据源

VPS优惠数据在 `src/data/vps-deals.js` 文件中定义，按照文件中的格式添加或修改数据。

### 主题定制

Tailwind CSS主题配置在 `tailwind.config.js` 文件中，可以根据需要修改颜色、字体等样式。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 许可证

MIT 许可证# 测试更改

## 后端服务

### 安装后端依赖
```bash
cd server
npm install express cors body-parser jsonwebtoken
```

### 启动后端服务
```bash
# 在 server 目录下
npm run start  # 或 node index.js
```

### API 接口
- GET `/api/vps`：获取所有分类的 VPS 数据，返回 JSON 对象。  
- GET `/api/vps/:category`：获取指定分类的 VPS 列表。  
- POST `/api/vps/:category`：添加 VPS，需要在请求头 `Authorization: Bearer <token>` 中提供 JWT。  
- PUT `/api/vps/:category/:index`：编辑 VPS，需要认证。  
- DELETE `/api/vps/:category/:index`：删除 VPS，需要认证。  
- POST `/api/login`：管理员登录， body `{ "username":"...", "password":"..." }`，成功返回 `{ "token": "<JWT>" }`。

## 前端配置

### 安装前端依赖
```bash
cd vps-deals
npm install
npm install axios
```

### 配置 API 地址
在 `src/services/api.js` 中修改 `API_BASE_URL` 为后端服务器地址，例如：
```js
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api';
```

### 启动前端
```bash
npm run serve
```

这样，管理员在后台添加的 VPS 数据将保存在服务器上，前端用户打开网页时即可看到最新数据。

## Docker 部署

此项目可以使用 Docker 和 Docker Compose 快速部署前后端服务。

1. 构建并启动容器

```bash
docker-compose up --build -d
```

2. 访问服务
- 前端页面： http://localhost:8080
- 后端 API： http://localhost:3000/api

3. 停止并删除容器

```bash
docker-compose down
```
