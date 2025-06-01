# VPS优惠推荐网站

这是一个使用 Vue.js (前端) 和 Express.js (后端) 构建的 VPS 优惠推荐网站，采用 Tailwind CSS 进行样式设计。整个应用被容器化以便于部署和管理。
[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")

## 功能特点

- 按价格和类型分类展示VPS优惠
- 详细的VPS配置和价格信息
- 响应式设计，适配各种设备
- 管理后台用于 VPS 信息、分类和网站设置的内容管理
- 基于 JWT 的安全管理员认证
- 后台登录密码哈希存储
- 登录接口速率限制，增强安全性

## 技术栈

- **前端**: Vue 3 (Composition API), Vuex, Vue Router, Axios
- **后端**: Node.js, Express.js
- **样式**: Tailwind CSS, PostCSS
- **Web 服务器/反向代理 (容器内)**: Nginx
- **进程管理器 (容器内)**: Supervisord
- **容器化**: Docker, Docker Compose

## 先决条件

- [Node.js](https://nodejs.org/) (v18.x 或更高版本) - 主要用于理解项目结构和可选的本地前端检查。
- [npm](https://www.npmjs.com/) (通常随 Node.js 一起安装)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 项目结构

```
.
├── Dockerfile              # 用于构建统一应用镜像 (前端+后端+Nginx)
├── docker-compose.yml      # Docker Compose 配置文件
├── nginx.vps.conf          # Nginx 配置文件 (在容器内部使用)
├── supervisord.vps.conf    # Supervisord 配置文件 (在容器内部使用)
├── package.json            # 前端项目依赖和构建脚本
├── server/                 # 后端 Express.js 应用
│   ├── index.js            # 后端主服务文件
│   ├── package.json        # 后端项目依赖
│   └── data/               # (自动创建) 存储 VPS 数据和用户信息 (JSON 格式)
├── src/                    # 前端 Vue.js 应用源代码
├── public/                 # 前端公共静态资源
├── tailwind.config.js      # Tailwind CSS 配置文件
├── vue.config.js           # Vue CLI 配置文件
└── README.md               # 本文档
```

## Docker 部署 (推荐方式)

此项目推荐使用 Docker 和 Docker Compose进行部署，它将前端和后端打包到一个单独的容器中。

### 1. 克隆仓库

```bash
git clone <your-repository-url>
cd vps-main # 或者你的项目根目录名
```

### 2. 配置环境变量 (重要!)

在 `docker-compose.yml` 文件中，您 **必须** 修改 `JWT_SECRET` 的值。这是一个用于签发和验证登录令牌的密钥，请务必将其更改为一个强大且随机的字符串。

```yaml
# docker-compose.yml
services:
  app:
    # ...
    environment:
      JWT_SECRET: '在这里填写你自己的非常非常安全的密钥' # <--- 务必修改此值!
    # ...
```

### 3. 构建并启动容器

在项目根目录下执行以下命令：

```bash
docker-compose up --build -d
```

- `--build`: 强制重新构建 Docker 镜像。
- `-d`: 以分离模式在后台运行容器。

**首次运行注意事项:**
为了确保管理员账户以最新的哈希密码机制正确创建，如果在之前尝试运行过此项目并生成了 `server/data/users.json` 文件（特别是如果它包含明文密码），建议在执行上述 `docker-compose up --build -d` **之前删除旧的 `server/data/users.json` 文件**。应用启动时会自动为您使用默认凭据安全地重新创建此文件。

### 4. 访问应用

构建并成功启动后：

- **前端网站**: 访问 `http://localhost:18877` (或您在 `docker-compose.yml` 中为 `ports` 配置的主机端口)。
- **API 端点 (供参考)**: API 现在通过 `http://localhost:18877/api` 代理。

### 5. 停止应用

```bash
docker-compose down
```

此命令会停止并移除由 `docker-compose.yml` 定义的容器、网络等。数据卷 (如 `server/data`) 默认不会被删除，以便数据持久化。

## 管理后台

管理后台用于添加、编辑和删除 VPS 优惠信息。

- **访问路径**: `http://localhost:18877/adminshuhao1031`
- **默认用户名**: `shannon2206`
- **默认密码**: `xetwuh-supqyw-7xidQy`

**关于密码的重要说明**:
您提供的默认密码 (`xetwuh-supqyw-7xidQy`) **仅用于首次创建管理员账户时生成密码哈希**。系统 **不会以明文形式存储此密码**。实际存储在 `server/data/users.json` 中的是此密码经过 `bcrypt` 哈希处理后的结果。登录时，您输入的密码会再次哈希并与存储的哈希进行比较。

**安全性**:
- **密码哈希**: 管理员密码使用 `bcrypt` 进行哈希存储。
- **JWT 认证**: 管理后台操作通过 JSON Web Tokens 进行保护。
- **登录速率限制**: Nginx 配置了对登录接口 (`/api/login`) 的速率限制，以帮助防止暴力破解尝试。

## VPS 数据显示

通过上述 Docker 部署方式，前端和后端在同一来源 (`http://localhost:18877`) 提供服务，Nginx 将 `/api` 请求正确代理到后端。因此，在管理后台添加的 VPS 数据应该能够正确地显示在前端的 VPS 卡片中。

## API 接口 (通过 `/api` 路径访问)

- `POST /api/login`: 管理员登录。
  - 请求体: `{ "username": "...", "password": "..." }`
  - 成功响应: `{ "token": "<JWT>" }`
- `GET /api/vps`: 获取所有分类的 VPS 数据。
- `GET /api/vps/:category`: 获取指定分类的 VPS 列表。
- `POST /api/vps/:category`: (需认证) 添加新的 VPS 到指定分类。
- `PUT /api/vps/:category/:index`: (需认证) 更新指定分类中特定索引的 VPS 信息。
- `DELETE /api/vps/:category/:index`: (需认证) 删除指定分类中特定索引的 VPS。

## 故障排查

- **Docker 未运行**: 确保 Docker Desktop 或 Docker 服务正在您的系统上运行。
- **端口冲突**: 如果 `18877` 端口已被占用，您可以在 `docker-compose.yml` 中修改 `ports` 部分的映射，例如 `"8081:8080"`。
- **构建失败**: 检查 `Dockerfile` 中的命令和路径是否正确，确保所有必需的文件 (如 `package.json`, `server/package.json`) 都存在并且内容无误。检查 `npm install` 过程中的错误输出。
- **登录失败**:
    - 确认您已正确更改 `docker-compose.yml` 中的 `JWT_SECRET`。
    - 确认您在首次运行时已允许系统正确生成 `server/data/users.json`（或在必要时删除了旧版）。
    - 检查浏览器控制台和 `docker-compose logs app` 的输出以获取错误信息。

## 贡献指南

欢迎为此项目做出贡献！请遵循以下步骤：

1. Fork 项目。
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启一个 Pull Request。

## 许可证

本项目根据 MIT 许可证授权。详情请参阅 `LICENSE` 文件 (如果项目包含)。
