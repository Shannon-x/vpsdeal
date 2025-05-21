# 使用轻量级 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制后端依赖文件并安装
COPY package.json package-lock.json ./
RUN npm install --production

# 复制后端源代码
COPY . .

# 暴露服务端口
EXPOSE 3000

# 启动后端服务
CMD ["npm", "start"] 