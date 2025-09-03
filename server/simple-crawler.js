// 简化版爬虫 - 不使用Puppeteer，只使用axios和cheerio
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');
const logger = require('./simple-logger');

class SimpleCrawler {
  constructor() {
    this.baseUrl = 'https://serverdeals.cc';
  }

  // 爬取页面
  async fetchPage(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 30000
      });
      
      return response.data;
    } catch (error) {
      logger.error(`获取页面失败 ${url}:`, error.message);
      throw error;
    }
  }

  // 解析VPS数据
  parseVPSData($, element) {
    try {
      const $card = $(element);
      
      // 提取信息
      const provider = $card.find('.card-header, h5.card-title').first().text().trim();
      const priceText = $card.find('.price, .text-primary').text().trim();
      
      // 提取规格
      const specs = [];
      $card.find('ul li').each((i, el) => {
        specs.push($(el).text().trim());
      });
      
      // 如果没有找到li，尝试其他方式
      if (specs.length === 0) {
        const bodyText = $card.find('.card-body').text();
        const lines = bodyText.split('\n').map(s => s.trim()).filter(s => s);
        specs.push(...lines);
      }
      
      // 解析规格
      const vpsData = {
        provider,
        price: priceText,
        specs: {},
        originalSpecs: specs
      };
      
      // 解析具体规格
      specs.forEach(spec => {
        if (spec.match(/cpu|core/i)) {
          vpsData.specs.cpu = spec;
        } else if (spec.match(/ram|memory/i)) {
          vpsData.specs.ram = spec;
        } else if (spec.match(/storage|disk|ssd|nvme/i)) {
          vpsData.specs.storage = spec;
        } else if (spec.match(/bandwidth|traffic/i)) {
          vpsData.specs.bandwidth = spec;
        } else if (spec.match(/location/i)) {
          vpsData.specs.location = spec;
        }
      });
      
      return vpsData;
    } catch (error) {
      logger.error('解析VPS数据失败:', error);
      return null;
    }
  }

  // 爬取所有VPS
  async crawlAll() {
    const results = [];
    
    try {
      logger.info('开始爬取ServerDeals.cc...');
      
      // 爬取首页
      const html = await this.fetchPage(this.baseUrl);
      const $ = cheerio.load(html);
      
      // 查找所有VPS卡片
      const cards = $('.card, .deal-card, .vps-card');
      logger.info(`找到 ${cards.length} 个VPS卡片`);
      
      // 解析每个卡片
      cards.each((index, element) => {
        const vpsData = this.parseVPSData($, element);
        if (vpsData && vpsData.provider) {
          results.push(vpsData);
        }
      });
      
      logger.info(`成功解析 ${results.length} 个VPS优惠`);
      
      return results;
      
    } catch (error) {
      logger.error('爬取失败:', error);
      throw error;
    }
  }
}

// 测试函数
async function testSimpleCrawler() {
  const crawler = new SimpleCrawler();
  
  try {
    const results = await crawler.crawlAll();
    
    console.log('\n爬取结果:');
    results.slice(0, 3).forEach((vps, index) => {
      console.log(`\n${index + 1}. ${vps.provider}`);
      console.log(`   价格: ${vps.price}`);
      console.log(`   规格:`);
      Object.entries(vps.specs).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    });
    
    return results;
  } catch (error) {
    console.error('测试失败:', error);
  }
}

module.exports = {
  SimpleCrawler,
  testSimpleCrawler
};