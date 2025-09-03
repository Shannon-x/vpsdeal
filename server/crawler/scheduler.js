// 定时任务调度器
const cron = require('node-cron');
const VPSCrawler = require('./crawler');
const logger = require('./logger');
const fs = require('fs').promises;
const path = require('path');

class CrawlerScheduler {
  constructor(config = {}) {
    this.config = {
      schedule: config.schedule || '0 */6 * * *', // 默认每6小时运行一次
      timezone: config.timezone || 'Asia/Shanghai',
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 300000, // 5分钟
      ...config
    };
    
    this.task = null;
    this.isRunning = false;
    this.lastRun = null;
    this.stats = {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastError: null
    };
  }

  // 启动定时任务
  start() {
    if (this.task) {
      logger.warn('定时任务已经在运行');
      return;
    }

    logger.info(`启动爬虫定时任务，计划: ${this.config.schedule}`);
    
    this.task = cron.schedule(this.config.schedule, async () => {
      await this.runCrawler();
    }, {
      scheduled: true,
      timezone: this.config.timezone
    });

    // 立即运行一次（可选）
    if (this.config.runImmediately) {
      this.runCrawler();
    }
  }

  // 停止定时任务
  stop() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      logger.info('爬虫定时任务已停止');
    }
  }

  // 运行爬虫
  async runCrawler() {
    if (this.isRunning) {
      logger.warn('爬虫正在运行中，跳过本次执行');
      return;
    }

    this.isRunning = true;
    this.lastRun = new Date();
    this.stats.totalRuns++;
    
    logger.info('开始执行爬虫任务...');
    
    let retries = 0;
    let success = false;
    let lastError = null;

    while (retries < this.config.maxRetries && !success) {
      try {
        const crawler = new VPSCrawler(this.config.crawlerConfig);
        const result = await crawler.crawl();
        
        // 记录成功统计
        this.stats.successfulRuns++;
        success = true;
        
        // 保存运行结果
        await this.saveRunResult({
          status: 'success',
          startTime: this.lastRun,
          endTime: new Date(),
          result,
          retries
        });
        
        logger.info('爬虫任务执行成功', result);
        
        // 发送成功通知（如果配置了）
        if (this.config.onSuccess) {
          await this.config.onSuccess(result);
        }
        
      } catch (error) {
        lastError = error;
        retries++;
        
        logger.error(`爬虫执行失败 (第 ${retries} 次尝试):`, error);
        
        if (retries < this.config.maxRetries) {
          logger.info(`等待 ${this.config.retryDelay / 1000} 秒后重试...`);
          await this.delay(this.config.retryDelay);
        }
      }
    }

    if (!success) {
      this.stats.failedRuns++;
      this.stats.lastError = lastError?.message || 'Unknown error';
      
      // 保存失败结果
      await this.saveRunResult({
        status: 'failed',
        startTime: this.lastRun,
        endTime: new Date(),
        error: lastError?.message,
        retries
      });
      
      // 发送失败通知（如果配置了）
      if (this.config.onError) {
        await this.config.onError(lastError);
      }
    }

    this.isRunning = false;
  }

  // 手动触发爬虫
  async runOnce() {
    logger.info('手动触发爬虫任务');
    await this.runCrawler();
  }

  // 保存运行结果
  async saveRunResult(result) {
    const logDir = path.join(__dirname, '../../logs/crawler/runs');
    await fs.mkdir(logDir, { recursive: true });
    
    const filename = `run_${new Date().toISOString().replace(/:/g, '-')}.json`;
    const filepath = path.join(logDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(result, null, 2));
  }

  // 获取运行统计
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.task ? cron.getTasks().get(this.task)?.nextDates(1)[0] : null
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 创建默认实例
let scheduler = null;

// 启动爬虫调度器
function startCrawlerScheduler(config = {}) {
  if (!scheduler) {
    scheduler = new CrawlerScheduler(config);
  }
  scheduler.start();
  return scheduler;
}

// 停止爬虫调度器
function stopCrawlerScheduler() {
  if (scheduler) {
    scheduler.stop();
  }
}

// 获取调度器实例
function getScheduler() {
  return scheduler;
}

module.exports = {
  CrawlerScheduler,
  startCrawlerScheduler,
  stopCrawlerScheduler,
  getScheduler
};