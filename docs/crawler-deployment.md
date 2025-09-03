# VPS Deals 爬虫系统部署指南

## 系统架构总结

我已经为你的VPS优惠网站创建了一个完整的爬虫系统，用于自动从 ServerDeals.CC（原 lowend-deals.xbit.win 已停止更新）抓取VPS优惠信息，翻译成中文并同步到你的数据库。

## 核心功能

1. **自动爬取**：定时从 ServerDeals.CC 爬取所有分类的VPS优惠
2. **智能翻译**：自动将英文内容翻译成中文，支持多种翻译API
3. **数据同步**：智能去重，增量更新到MySQL数据库
4. **定时调度**：使用Cron表达式配置爬取频率
5. **管理界面**：提供Web界面管理爬虫状态和配置
6. **日志系统**：完整的运行日志记录

## 技术实现

### 爬虫系统文件结构
```
/opt/vps/server/crawler/
├── README.md           # 爬虫系统说明
├── index.js           # 主入口文件
├── crawler.js         # 爬虫引擎（使用Puppeteer）
├── parser.js          # HTML解析器
├── translator.js      # 翻译服务
├── sync.js            # 数据库同步
├── scheduler.js       # 定时任务调度
├── logger.js          # 日志系统
└── config.json        # 配置文件

/opt/vps/server/api/
└── crawler.js         # 爬虫管理API

/opt/vps/pages/admin/
└── crawler.vue        # 爬虫管理页面
```

## 部署步骤

### 1. 安装依赖

```bash
cd /opt/vps/server
npm install
```

### 2. 配置环境变量

在 `.env` 文件中添加（可选）：

```env
# 百度翻译API（可选，提供更好的翻译质量）
BAIDU_TRANSLATE_APP_ID=your_app_id
BAIDU_TRANSLATE_APP_KEY=your_app_key
```

### 3. 初始化数据库

确保数据库表结构支持爬虫数据：

```sql
-- 在 vps_products 表中需要以下字段
ALTER TABLE vps_products ADD COLUMN IF NOT EXISTS `slug` VARCHAR(255) UNIQUE;
ALTER TABLE vps_products ADD COLUMN IF NOT EXISTS `source_url` VARCHAR(500);
ALTER TABLE vps_products ADD COLUMN IF NOT EXISTS `crawled_at` DATETIME;
ALTER TABLE vps_products ADD COLUMN IF NOT EXISTS `last_updated` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### 4. 重启服务

```bash
docker-compose down
docker-compose up -d --build
```

## 使用方法

### 1. 访问管理界面

访问 `http://your-domain:13344/admin/crawler` 进入爬虫管理页面。

### 2. 手动运行爬虫

点击"手动运行爬虫"按钮立即执行一次爬取。

### 3. 配置定时任务

- 默认每6小时运行一次
- 可在管理界面修改Cron表达式
- 常用配置：
  - `0 */6 * * *` - 每6小时
  - `0 0 * * *` - 每天午夜
  - `0 */12 * * *` - 每12小时

### 4. 查看日志

管理界面实时显示爬虫运行日志，便于监控和调试。

## 数据映射说明

爬虫会自动将ServerDeals.CC的分类映射到你的网站分类：

- Free VPS → 免费VPS
- Monthly under $2 → 月付2美元以下
- KVM under $15/year → 年付15美元以下KVM
- High Spec VPS → 高配置VPS
- Storage VPS → 存储型VPS
- 等等...

## 注意事项

1. **爬虫礼貌**：默认配置了请求延迟，避免对目标网站造成压力
2. **数据去重**：使用唯一标识符避免重复数据
3. **错误重试**：自动重试失败的请求
4. **资源占用**：Puppeteer需要一定的内存，建议服务器至少2GB RAM

## 扩展功能

1. **添加更多数据源**：可以轻松扩展爬取其他VPS优惠网站
2. **价格监控**：可以添加价格变化提醒功能
3. **自动分类**：可以基于AI自动分类VPS产品
4. **图片处理**：可以添加VPS提供商Logo自动下载

## 故障排除

1. **爬虫无法启动**
   - 检查Puppeteer依赖是否正确安装
   - 查看日志文件：`/opt/vps/logs/crawler/error.log`

2. **翻译失败**
   - 检查翻译API配置
   - 默认使用简单翻译，可能不够准确

3. **数据未同步**
   - 检查数据库连接
   - 查看数据库表结构是否正确

## 监控建议

1. 设置爬虫失败告警
2. 监控数据更新频率
3. 定期检查数据质量
4. 监控目标网站变化