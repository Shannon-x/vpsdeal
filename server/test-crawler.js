// 简单的爬虫测试脚本
const axios = require('axios');
const cheerio = require('cheerio');

async function testCrawler() {
  console.log('开始测试爬虫功能...');
  
  try {
    // 测试目标网站是否可访问
    console.log('1. 测试目标网站连接...');
    const response = await axios.get('https://serverdeals.cc', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ 网站连接成功，状态码:', response.status);
    
    // 测试HTML解析
    console.log('\n2. 测试HTML解析...');
    const $ = cheerio.load(response.data);
    
    // 查找VPS卡片
    const cards = $('.card');
    console.log(`✅ 找到 ${cards.length} 个VPS卡片`);
    
    // 解析第一个VPS信息
    if (cards.length > 0) {
      console.log('\n3. 解析第一个VPS信息:');
      const firstCard = cards.first();
      
      const provider = firstCard.find('.card-header, h5').text().trim();
      const price = firstCard.find('.price, .card-price').text().trim();
      
      console.log('- 提供商:', provider || '未找到');
      console.log('- 价格:', price || '未找到');
      
      // 获取规格列表
      const specs = [];
      firstCard.find('ul li').each((i, el) => {
        specs.push($(el).text().trim());
      });
      
      console.log('- 规格:');
      specs.forEach(spec => console.log('  •', spec));
    }
    
    // 测试翻译功能
    console.log('\n4. 测试简单翻译功能...');
    const testText = 'KVM VPS Monthly $5 US Location';
    const translated = simpleTranslate(testText);
    console.log(`原文: ${testText}`);
    console.log(`译文: ${translated}`);
    
    console.log('\n✅ 爬虫功能测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   无法连接到目标网站，请检查网络连接');
    }
  }
}

// 简单翻译函数
function simpleTranslate(text) {
  const translations = {
    'month': '月',
    'Monthly': '月付',
    'year': '年',
    'US': '美国',
    'Location': '位置',
    'KVM': 'KVM',
    'VPS': 'VPS'
  };
  
  let translated = text;
  Object.entries(translations).forEach(([en, zh]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, zh);
  });
  
  return translated;
}

// 如果直接运行此文件
if (require.main === module) {
  testCrawler();
}

module.exports = { testCrawler };