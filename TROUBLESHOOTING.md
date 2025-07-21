# VPS Deals 故障排除指南

## 常见问题

### 1. 数据库连接失败

**错误信息**: `ER_ACCESS_DENIED_ERROR` 或 `ECONNREFUSED`

**解决方案**:
1. 确保 MySQL 服务正在运行
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   
   # Windows
   net start mysql
   ```

2. 检查 `.env` 文件中的数据库配置
   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/vps_deals
   ```

3. 确保数据库用户有正确的权限
   ```sql
   GRANT ALL PRIVILEGES ON vps_deals.* TO 'your_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 2. 端口已被占用

**错误信息**: `EADDRINUSE: address already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000  # 前端
lsof -i :3001  # 后端

# 终止进程
kill -9 <PID>

# 或者修改端口
# 编辑 .env 文件修改 SERVER_PORT
```

### 3. 依赖安装失败

**错误信息**: `npm ERR!`

**解决方案**:
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 并重新安装
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
npm run install:all
```

### 4. 前端页面显示空白

**可能原因**:
1. 后端服务未启动
2. API 地址配置错误
3. CORS 配置问题

**解决方案**:
1. 确保后端服务正在运行
   ```bash
   npm run server:dev
   ```

2. 检查浏览器控制台错误信息

3. 验证 `.env` 中的 API 配置
   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:3000
   ```

### 5. 管理员登录失败

**错误信息**: "用户名或密码错误"

**解决方案**:
1. 检查 `.env` 文件中的管理员配置
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   ```

2. 重启后端服务以重新初始化管理员账户
   ```bash
   npm run server:dev
   ```

3. 查看服务器日志确认管理员账户是否创建成功

### 6. 数据库表不存在

**错误信息**: `ER_NO_SUCH_TABLE`

**解决方案**:
```bash
# 重新导入数据库架构
mysql -u root -p < database/schema.sql
```

### 7. 生产环境部署问题

**构建失败**:
```bash
# 确保生产环境变量配置正确
NODE_ENV=production npm run build
```

**PM2 启动失败**:
```bash
# 检查 PM2 日志
pm2 logs

# 重启应用
pm2 restart all

# 清理并重新启动
pm2 delete all
pm2 start ecosystem.config.js
```

## 调试技巧

### 启用详细日志
在 `.env` 文件中设置：
```env
LOG_LEVEL=debug
```

### 检查网络请求
使用浏览器开发者工具的 Network 标签查看 API 请求和响应

### 验证环境变量
```bash
# 在项目根目录运行
node -e "require('dotenv').config(); console.log(process.env)"
```

## 获取帮助

如果问题仍未解决：
1. 查看 [GitHub Issues](https://github.com/Shannon-x/vps/issues)
2. 提交新的 Issue，包含：
   - 错误信息截图
   - 运行环境信息（操作系统、Node.js 版本）
   - 重现步骤