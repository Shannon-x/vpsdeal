// 完整的爬虫执行脚本
const EnhancedVPSCrawler = require('./enhanced-crawler');
const EnhancedDBSync = require('./enhanced-db-sync');
const logger = require('./simple-logger');

async function runCompleteCrawl() {
  logger.info('开始执行完整爬虫任务...');
  
  const crawler = new EnhancedVPSCrawler();
  const dbSync = new EnhancedDBSync();
  
  try {
    // 1. 爬取所有分类的VPS数据
    logger.info('开始爬取VPS数据...');
    const allDeals = await crawler.crawlAllCategories();
    
    if (allDeals.length === 0) {
      logger.warn('没有爬取到任何VPS数据');
      return;
    }
    
    logger.info(`成功爬取 ${allDeals.length} 个VPS优惠`);
    
    // 2. 同步到数据库（包含智能分类）
    logger.info('开始同步数据到数据库...');
    const syncResults = await dbSync.syncMultipleVPS(allDeals);
    
    logger.info('数据同步完成:');
    logger.info(`- 成功: ${syncResults.success}`);
    logger.info(`- 失败: ${syncResults.failed}`);
    
    if (syncResults.failed > 0) {
      logger.error('部分数据同步失败:');
      syncResults.errors.forEach(err => {
        logger.error(`  - ${err.vps}: ${err.error}`);
      });
    }
    
    // 3. 清理过期数据
    logger.info('清理7天前的过期数据...');
    const cleaned = await dbSync.cleanupOldData(7);
    logger.info(`已清理 ${cleaned} 条过期数据`);
    
    // 4. 输出统计信息
    logger.info('爬虫任务完成！');
    
    // 输出一些示例数据用于验证
    if (allDeals.length > 0) {
      logger.info('\n示例VPS数据:');
      const sample = allDeals[0];
      logger.info(`提供商: ${sample.provider}`);
      logger.info(`规格: ${sample.specs.cpu.cores}核 ${sample.specs.ram.size}GB RAM ${sample.specs.storage.size}GB ${sample.specs.storage.type}`);
      logger.info(`价格: $${sample.priceInfo.amount}/${sample.priceInfo.period}`);
      logger.info(`位置: ${sample.specs.location.country || '未知'}`);
    }
    
  } catch (error) {
    logger.error('爬虫执行失败:', error);
    throw error;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runCompleteCrawl()
    .then(() => {
      logger.info('爬虫任务全部完成');
      process.exit(0);
    })
    .catch(error => {
      logger.error('爬虫任务失败:', error);
      process.exit(1);
    });
}

module.exports = { runCompleteCrawl };