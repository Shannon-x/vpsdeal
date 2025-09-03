# Nuxt 3 Layer Handler 错误修复完成

## 错误原因
`layer.handler is not a function` 错误是由于以下原因造成的：

1. **混合模块系统**：项目中同时使用了 CommonJS (require) 和 ES Modules (import/export)
2. **Express 依赖污染**：Express 相关依赖被错误地包含在 Nuxt 项目的主 package.json 中
3. **API 文件格式错误**：server/api 目录中的文件使用了错误的模块导入方式

## 修复内容

### 1. 清理依赖
- 从主 package.json 中移除了 Express 相关依赖（express, body-parser, cors）
- 保留了 Nuxt 3 所需的核心依赖

### 2. 修复 API 文件
- 创建了 ESM 版本的数据库连接工具 (`/server/utils/db.js`)
- 创建了 ESM 版本的日志工具 (`/server/utils/logger.js`)
- 更新了所有 API 文件，使用正确的 ESM 导入语法

### 3. 分离架构
- 将 Express 相关的爬虫路由移至独立的 `backend-server` 目录
- 更新了 Docker 配置，使用单一的 Nuxt 服务处理所有请求
- 简化了 nginx 配置，移除了对独立后端的代理

### 4. 优化构建
- 更新了 Dockerfile，优化了构建过程
- 创建了 .dockerignore 文件，减少构建上下文
- 更新了 docker-compose.yml，使用正确的环境变量配置

## 部署步骤

### 1. 本地测试
```bash
# 安装依赖
npm ci

# 构建应用
npm run build

# 本地运行
node .output/server/index.mjs
```

### 2. Docker 部署
```bash
# 使用部署脚本
./deploy.sh

# 或手动执行
docker-compose build
docker-compose up -d
```

### 3. 验证部署
- 访问 http://localhost:13344 查看应用
- 检查 Docker 日志：`docker-compose logs -f`

## 环境变量配置
确保在 `.env` 文件中设置以下变量：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=vps_user
DB_PASSWORD=your_db_password
DB_DATABASE=vps_deals

# JWT配置
JWT_SECRET=yoursecretkeyforsupersecuritychangeit
JWT_EXPIRES_IN=7d

# 管理员配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password

# 站点配置
SITE_NAME=VPS Deals
SITE_URL=https://your-domain.com
SITE_DESCRIPTION=发现最优惠的VPS主机方案
```

## 目录结构
```
/opt/vps/
├── server/
│   ├── api/          # Nuxt 3 API 路由
│   └── utils/        # 工具函数（数据库、日志等）
├── backend-server/   # 独立的 Express 后端（如需要）
├── nginx/            # Nginx 配置
└── docker-compose.yml
```

## 注意事项
1. 所有 API 路由现在由 Nuxt 3 的 Nitro 服务器处理
2. 数据库连接使用了连接池，确保性能
3. 所有环境变量通过 useRuntimeConfig() 访问
4. API 文件必须使用 ESM 语法（import/export）

## 问题排查
如果遇到问题：
1. 检查 Docker 日志：`docker-compose logs frontend`
2. 确保数据库连接正常
3. 验证环境变量配置正确
4. 检查端口 13344 是否被占用

修复已完成，应用现在可以正常运行，不再出现 layer.handler 错误。