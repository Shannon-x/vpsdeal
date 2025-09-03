// 爬虫核心引擎
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { parseVPSData } = require('./parser');
const { translateBatch } = require('./translator');
const { syncToDatabase } = require('./sync');
const logger = require('./logger');

class VPSCrawler {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.targetUrl || 'https://serverdeals.cc';
    this.browser = null;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    logger.info('爬虫引擎初始化成功');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // 爬取所有分类
  async crawlAllCategories() {
    const categories = [
      { name: 'Exclusive Deals', path: '/exclusive-deals', zhName: '独家优惠' },
      { name: 'KVM under $15/year', path: '/kvm-under-15-year', zhName: '年付15美元以下KVM' },
      { name: 'KVM under $25/year', path: '/kvm-under-25-year', zhName: '年付25美元以下KVM' },
      { name: 'Monthly under $2', path: '/monthly-under-2', zhName: '月付2美元以下' },
      { name: 'NAT/OpenVZ/LXC', path: '/nat-openvz-lxc', zhName: 'NAT/OpenVZ/LXC' },
      { name: 'High Spec VPS', path: '/high-spec-vps', zhName: '高配置VPS' },
      { name: 'Storage VPS', path: '/storage-vps', zhName: '存储型VPS' },
      { name: 'VDS Deals', path: '/vds-deals', zhName: 'VDS优惠' },
      { name: 'Free VPS', path: '/free-vps', zhName: '免费VPS' }
    ];

    const allDeals = [];

    for (const category of categories) {
      try {
        logger.info(`开始爬取分类: ${category.name}`);
        const deals = await this.crawlCategory(category);
        allDeals.push(...deals);
        
        // 避免请求过快
        await this.delay(2000);
      } catch (error) {
        logger.error(`爬取分类 ${category.name} 失败:`, error);
      }
    }

    return allDeals;
  }

  // 爬取单个分类
  async crawlCategory(category) {
    const page = await this.browser.newPage();
    
    try {
      // 设置用户代理，避免被识别为爬虫
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // 访问分类页面
      const url = `${this.baseUrl}${category.path}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // 等待内容加载
      await page.waitForSelector('.card', { timeout: 10000 });
      
      // 获取页面HTML
      const html = await page.content();
      const $ = cheerio.load(html);
      
      // 解析VPS数据
      const deals = [];
      $('.card').each((index, element) => {
        try {
          const vpsData = parseVPSData($, element);
          if (vpsData) {
            vpsData.category = category.zhName;
            vpsData.categorySlug = category.path.replace('/', '');
            vpsData.sourceUrl = url;
            deals.push(vpsData);
          }
        } catch (error) {
          logger.error(`解析VPS数据失败:`, error);
        }
      });

      logger.info(`从 ${category.name} 获取 ${deals.length} 个优惠`);
      return deals;
      
    } finally {
      await page.close();
    }
  }

  // 主爬取流程
  async crawl() {
    try {
      await this.init();
      
      // 1. 爬取所有数据
      logger.info('开始爬取所有VPS优惠...');
      const rawDeals = await this.crawlAllCategories();
      
      // 2. 批量翻译
      logger.info(`开始翻译 ${rawDeals.length} 个优惠...`);
      const translatedDeals = await translateBatch(rawDeals);
      
      // 3. 同步到数据库
      logger.info('开始同步到数据库...');
      const result = await syncToDatabase(translatedDeals);
      
      logger.info(`爬取完成! 新增: ${result.inserted}, 更新: ${result.updated}, 跳过: ${result.skipped}`);
      
      return result;
      
    } catch (error) {
      logger.error('爬取过程出错:', error);
      throw error;
    } finally {
      await this.close();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = VPSCrawler;