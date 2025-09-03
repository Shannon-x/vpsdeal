#!/bin/bash

# 构建并启动 VPS Deals 应用

set -e

echo "开始构建 VPS Deals 应用..."

# 清理旧的构建
echo "清理旧的构建文件..."
rm -rf .nuxt .output

# 安装依赖
echo "安装依赖..."
npm ci

# 构建应用
echo "构建 Nuxt 应用..."
npm run build

# 使用 Docker Compose 构建和启动
echo "使用 Docker Compose 构建镜像..."
docker-compose build

echo "启动服务..."
docker-compose up -d

echo "等待服务启动..."
sleep 10

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

echo "构建和部署完成！"
echo "应用已在端口 13344 上运行"
echo "访问: http://localhost:13344"