#!/bin/bash

echo "🚀 VPS Deals 项目快速启动脚本"
echo "================================"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ 未找到 .env 文件"
    echo "📝 正在从 .env.example 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，配置数据库连接信息"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL 命令行工具未安装，请确保 MySQL 服务器已运行"
fi

echo "📦 安装依赖..."
npm run install:all

echo ""
echo "✅ 安装完成！"
echo ""
echo "📚 使用说明："
echo "1. 确保 MySQL 服务已启动"
echo "2. 导入数据库: mysql -u root -p < database/schema.sql"
echo "3. 编辑 .env 文件，配置数据库连接"
echo "4. 启动开发服务器: npm run dev:all"
echo ""
echo "🔗 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端API: http://localhost:3001/api"
echo "   管理后台: http://localhost:3000/admin"