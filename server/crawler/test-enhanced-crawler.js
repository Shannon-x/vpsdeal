/**
 * 测试增强版爬虫
 */

const EnhancedVPSCrawler = require('./enhanced-vps-crawler');

async function testCrawler() {
  console.log('=== 测试增强版VPS爬虫 ===\n');
  
  const crawler = new EnhancedVPSCrawler({
    targetLang: 'zh',
    translateFields: ['planName', 'provider', 'location'],
    deduplicationEnabled: true,
    trackPriceHistory: false // 测试时暂时关闭
  });
  
  try {
    // 测试爬取
    console.log('1. 开始爬取数据...');
    const results = await crawler.crawl();
    
    console.log(`\n2. 爬取结果:`);
    console.log(`   - 总数: ${results.length}`);
    console.log(`   - 第一个产品示例:`);
    
    if (results.length > 0) {
      const sample = results[0];
      console.log(`     原始信息:`);
      console.log(`       - Provider: ${sample.provider}`);
      console.log(`       - Plan: ${sample.planName}`);
      console.log(`       - Location: ${sample.location}`);
      console.log(`       - Price: $${sample.price}/${sample.billingCycle}`);
      
      if (sample.translatedFields) {
        console.log(`     翻译信息:`);
        console.log(`       - 提供商: ${sample.translatedFields.provider || '未翻译'}`);
        console.log(`       - 方案: ${sample.translatedFields.planName || '未翻译'}`);
        console.log(`       - 位置: ${sample.translatedFields.location || '未翻译'}`);
      }
      
      console.log(`     去重信息:`);
      console.log(`       - Content Hash: ${sample.contentHash?.substring(0, 16)}...`);
    }
    
    // 显示统计信息
    console.log('\n3. 统计信息:');
    const stats = crawler.getStats();
    console.log(`   - 爬取: ${stats.crawled}`);
    console.log(`   - 翻译: ${stats.translated}`);
    console.log(`   - 重复: ${stats.duplicates}`);
    console.log(`   - 错误: ${stats.errors}`);
    
    console.log('\n4. 翻译服务统计:');
    console.log(`   - 已翻译: ${stats.translationStats.translated}`);
    console.log(`   - 缓存命中: ${stats.translationStats.cached}`);
    console.log(`   - 跳过: ${stats.translationStats.skipped}`);
    console.log(`   - 失败: ${stats.translationStats.failed}`);
    
    console.log('\n=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
if (require.main === module) {
  testCrawler();
}

module.exports = testCrawler;