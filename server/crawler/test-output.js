// 测试爬虫输出样例
const EnhancedVPSCrawler = require('./enhanced-crawler');
const logger = require('./simple-logger');

async function testCrawlerOutput() {
  logger.info('测试爬虫输出...');
  
  const crawler = new EnhancedVPSCrawler();
  
  try {
    // 只爬取主页
    logger.info('开始爬取主页数据...');
    const deals = await crawler.crawlPage('https://serverdeals.cc');
    
    logger.info(`成功爬取 ${deals.length} 个VPS优惠`);
    
    // 输出前3个示例
    logger.info('\n=== VPS数据示例 ===');
    deals.slice(0, 3).forEach((deal, index) => {
      logger.info(`\n--- 示例 ${index + 1} ---`);
      logger.info(`提供商: ${deal.provider}`);
      logger.info(`唯一ID: ${deal.uniqueId}`);
      logger.info(`价格信息:`);
      logger.info(`  - 金额: $${deal.priceInfo.amount}`);
      logger.info(`  - 周期: ${deal.priceInfo.period}`);
      logger.info(`  - 是否促销: ${deal.priceInfo.isPromo}`);
      logger.info(`规格信息:`);
      logger.info(`  - CPU: ${deal.specs.cpu.cores}核 ${deal.specs.cpu.type || '未知型号'}`);
      logger.info(`  - 内存: ${deal.specs.ram.size}${deal.specs.ram.unit}`);
      logger.info(`  - 存储: ${deal.specs.storage.size}${deal.specs.storage.unit} ${deal.specs.storage.type}`);
      logger.info(`  - 带宽: ${deal.specs.bandwidth.unlimited ? '不限流量' : deal.specs.bandwidth.amount + deal.specs.bandwidth.unit}`);
      logger.info(`  - 网络: ${deal.specs.network.ipv4} IPv4, 端口${deal.specs.network.port || '未知'}`);
      logger.info(`  - 虚拟化: ${deal.specs.virtualization}`);
      logger.info(`  - 位置: ${deal.specs.location.country || '未知'}`);
      logger.info(`购买链接: ${deal.buyLink}`);
      logger.info(`来源分类: ${deal.sourceCategory || '主页'}`);
    });
    
    // 测试分类映射
    const CategoryMapper = require('./category-mapper');
    const mapper = new CategoryMapper();
    
    logger.info('\n=== 分类映射测试 ===');
    const mappedData = mapper.mapMultipleVPS(deals.slice(0, 3));
    
    mappedData.forEach((item, index) => {
      logger.info(`\n示例 ${index + 1} 分类映射:`);
      logger.info(`  - VPS: ${item.vpsData.uniqueId}`);
      logger.info(`  - 分类ID: ${item.categories.join(', ')}`);
      logger.info(`  - 分类名称: ${item.categoryNames.join(', ')}`);
    });
    
  } catch (error) {
    logger.error('测试失败:', error);
  }
}

// 执行测试
testCrawlerOutput();