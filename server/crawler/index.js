// 爬虫系统主入口
const { startCrawlerScheduler, stopCrawlerScheduler, getScheduler } = require('./scheduler');
const VPSCrawler = require('./crawler');
const logger = require('./logger');
const fs = require('fs').promises;
const path = require('path');

// 加载配置
async function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const configData = await fs.readFile(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    logger.error('加载配置文件失败:', error);
    return {};
  }
}

// 初始化爬虫系统
async function initCrawlerSystem() {
  logger.info('初始化爬虫系统...');
  
  // 创建必要的目录
  const dirs = [
    path.join(__dirname, '../../logs/crawler'),
    path.join(__dirname, '../../logs/crawler/runs')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
  
  // 加载配置
  const config = await loadConfig();
  
  return config;
}

// 手动运行爬虫（用于测试）
async function runCrawlerManually() {
  const config = await loadConfig();
  const crawler = new VPSCrawler(config.crawlerConfig);
  
  try {
    logger.info('手动运行爬虫...');
    const result = await crawler.crawl();
    logger.info('爬虫运行完成:', result);
    return result;
  } catch (error) {
    logger.error('爬虫运行失败:', error);
    throw error;
  }
}

// 启动爬虫服务
async function startCrawlerService() {
  const config = await initCrawlerSystem();
  
  // 配置成功和失败的回调
  config.onSuccess = async (result) => {
    logger.info('爬虫任务成功完成，数据已同步');
    // 这里可以添加通知逻辑，如发送邮件或webhook
  };
  
  config.onError = async (error) => {
    logger.error('爬虫任务失败，需要人工介入', error);
    // 这里可以添加告警逻辑
  };
  
  // 启动定时任务
  const scheduler = startCrawlerScheduler(config);
  
  logger.info('爬虫服务已启动');
  
  // 设置优雅退出
  process.on('SIGINT', () => {
    logger.info('收到退出信号，正在关闭爬虫服务...');
    stopCrawlerScheduler();
    process.exit(0);
  });
  
  return scheduler;
}

// 导出API供Express路由使用
module.exports = {
  initCrawlerSystem,
  runCrawlerManually,
  startCrawlerService,
  getScheduler
};

// 如果直接运行此文件，启动爬虫服务
if (require.main === module) {
  startCrawlerService().catch(error => {
    logger.error('启动爬虫服务失败:', error);
    process.exit(1);
  });
}