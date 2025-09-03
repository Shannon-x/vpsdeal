// 测试改进的爬虫
const ImprovedVPSCrawler = require('./improved-crawler');
const logger = require('./simple-logger');

async function testImprovedCrawler() {
  logger.info('测试改进的爬虫...');
  
  const crawler = new ImprovedVPSCrawler();
  
  try {
    // 只爬取主页测试
    const deals = await crawler.crawlPage('https://serverdeals.cc');
    
    logger.info(`成功爬取 ${deals.length} 个VPS优惠`);
    
    // 显示前3个结果
    logger.info('\n=== 爬取结果示例 ===');
    deals.slice(0, 3).forEach((deal, index) => {
      logger.info(`\n--- VPS ${index + 1} ---`);
      logger.info(`提供商: ${deal.provider}`);
      logger.info(`计划名: ${deal.planName}`);
      logger.info(`价格: $${deal.priceInfo.amount}/${deal.priceInfo.period}`);
      logger.info(`规格:`);
      logger.info(`  - CPU: ${deal.specs.cpu.cores}核 ${deal.specs.cpu.type}`);
      logger.info(`  - 内存: ${deal.specs.ram.size}${deal.specs.ram.unit}`);
      logger.info(`  - 存储: ${deal.specs.storage.size}${deal.specs.storage.unit} ${deal.specs.storage.type}`);
      logger.info(`  - 带宽: ${deal.specs.bandwidth.unlimited ? '不限' : deal.specs.bandwidth.amount + deal.specs.bandwidth.unit}`);
      logger.info(`  - 网络: ${deal.specs.network.ipv4} IPv4, ${deal.specs.network.ipv6 ? '有IPv6' : '无IPv6'}`);
      logger.info(`  - 端口: ${deal.specs.network.port}`);
      logger.info(`  - 位置: ${deal.specs.location}`);
      logger.info(`购买链接: ${deal.buyLink}`);
    });
    
    // 测试分类映射
    const CategoryMapper = require('./category-mapper');
    const mapper = new CategoryMapper();
    
    logger.info('\n=== 测试分类映射 ===');
    const mappedResults = mapper.mapMultipleVPS(deals.slice(0, 3));
    
    mappedResults.forEach((result, index) => {
      logger.info(`\nVPS ${index + 1} 分类:`);
      logger.info(`  - 分类ID: ${result.categories.join(', ')}`);
      logger.info(`  - 分类名称: ${result.categoryNames.join(', ')}`);
    });
    
  } catch (error) {
    logger.error('测试失败:', error);
  }
}

// 执行测试
testImprovedCrawler();