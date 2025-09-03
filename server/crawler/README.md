# VPS Deals 爬虫系统

## 系统架构

### 核心组件

1. **爬虫引擎** (`crawler.js`)
   - 使用 Puppeteer 进行动态网页抓取
   - 支持 JavaScript 渲染的页面
   - 自动处理分页和加载更多

2. **数据解析器** (`parser.js`)
   - 提取 VPS 产品信息
   - 标准化数据格式
   - 数据验证和清洗

3. **翻译服务** (`translator.js`)
   - 集成多个翻译 API（Google Translate、百度翻译等）
   - 批量翻译优化
   - 翻译缓存机制

4. **数据同步器** (`sync.js`)
   - 数据去重逻辑
   - 增量更新机制
   - 数据映射和转换

5. **定时调度器** (`scheduler.js`)
   - Cron 定时任务
   - 错误重试机制
   - 任务状态监控

## 数据流程

1. 定时触发爬虫任务
2. 爬取 ServerDeals.CC 各分类页面
3. 解析提取 VPS 产品数据
4. 批量翻译产品信息
5. 映射到本地数据库格式
6. 同步更新到 MySQL 数据库
7. 记录爬取日志和状态

## 技术栈

- **爬虫框架**: Puppeteer（处理动态内容）
- **HTML解析**: Cheerio（jQuery-like服务端DOM操作）
- **翻译API**: Google Translate API / 百度翻译API
- **任务调度**: node-cron
- **数据存储**: MySQL（复用现有数据库）
- **日志系统**: Winston

## 配置说明

爬虫配置存储在 `config/crawler.json` 中，包括：
- 目标网站URL
- 爬取频率
- 翻译API配置
- 数据映射规则
- 重试策略