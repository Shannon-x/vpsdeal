// 改进的VPS爬虫
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./simple-logger');

class ImprovedVPSCrawler {
  constructor() {
    this.baseUrl = 'https://serverdeals.cc';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
  }

  // 解析单个VPS卡片
  parseVPSCard($, card) {
    const $card = $(card);
    const vpsData = {
      provider: '',
      planName: '',
      specs: {
        cpu: { cores: 0, type: '' },
        ram: { size: 0, unit: 'MB' },
        storage: { size: 0, unit: 'GB', type: 'SSD' },
        bandwidth: { amount: 0, unit: 'TB', unlimited: false },
        network: { ipv4: 0, ipv6: false, port: '' },
        virtualization: 'KVM',
        location: ''
      },
      priceInfo: {
        amount: 0,
        period: 'monthly',
        currency: 'USD'
      },
      buyLink: ''
    };

    // 1. 提取提供商和计划名称
    const $header = $card.find('.card-header');
    if ($header.length) {
      const $title = $header.find('h5.card-title');
      const $subtitle = $header.find('h6.card-subtitle');
      
      vpsData.provider = $title.text().trim();
      vpsData.planName = $subtitle.text().trim();
    }

    // 2. 提取规格信息
    const $specs = $card.find('.card-body ul.specs li');
    $specs.each((i, el) => {
      const text = $(el).text();
      const [key, ...valueParts] = text.split(':');
      const value = valueParts.join(':').trim();

      switch (key.toLowerCase().trim()) {
        case 'vcpu':
          const cpuMatch = value.match(/(\d+)\s*(?:\(([^)]+)\))?/);
          if (cpuMatch) {
            vpsData.specs.cpu.cores = parseInt(cpuMatch[1]) || 0;
            vpsData.specs.cpu.type = cpuMatch[2] || '';
          }
          break;

        case 'ram':
          const ramMatch = value.match(/(\d+)\s*(GB|MB)?/i);
          if (ramMatch) {
            vpsData.specs.ram.size = parseInt(ramMatch[1]) || 0;
            vpsData.specs.ram.unit = ramMatch[2] || 'MB';
            // 转换为GB
            if (vpsData.specs.ram.unit.toUpperCase() === 'MB' && vpsData.specs.ram.size >= 1024) {
              vpsData.specs.ram.size = vpsData.specs.ram.size / 1024;
              vpsData.specs.ram.unit = 'GB';
            }
          }
          break;

        case 'storage':
          const storageMatch = value.match(/(\d+)\s*(GB|TB)?\s*(SSD|HDD|NVMe|NVME)?/i);
          if (storageMatch) {
            vpsData.specs.storage.size = parseInt(storageMatch[1]) || 0;
            vpsData.specs.storage.unit = storageMatch[2] || 'GB';
            vpsData.specs.storage.type = storageMatch[3] || 'SSD';
          }
          break;

        case 'bandwidth':
          if (value.toLowerCase().includes('unlimited') || value.toLowerCase().includes('unmetered')) {
            vpsData.specs.bandwidth.unlimited = true;
          } else {
            const bwMatch = value.match(/(\d+(?:\.\d+)?)\s*(TB|GB)?/i);
            if (bwMatch) {
              vpsData.specs.bandwidth.amount = parseFloat(bwMatch[1]) || 0;
              vpsData.specs.bandwidth.unit = bwMatch[2] || 'TB';
            }
          }
          break;

        case 'ipv4':
          const ipv4Match = value.match(/(\d+)/);
          if (ipv4Match) {
            vpsData.specs.network.ipv4 = parseInt(ipv4Match[1]) || 1;
          }
          break;

        case 'ipv6':
          vpsData.specs.network.ipv6 = value.includes('/') || value.toLowerCase().includes('yes');
          break;

        case 'port':
          vpsData.specs.network.port = value;
          break;

        case 'location':
          vpsData.specs.location = value;
          break;
      }
    });

    // 3. 提取价格信息
    const $footer = $card.find('.card-footer');
    const priceText = $footer.find('.price').text();
    const priceMatch = priceText.match(/USD\s*(\d+(?:\.\d+)?)\s*\/\s*(\w+)/);
    if (priceMatch) {
      vpsData.priceInfo.amount = parseFloat(priceMatch[1]);
      vpsData.priceInfo.period = priceMatch[2].toLowerCase();
      
      // 标准化周期名称
      if (vpsData.priceInfo.period === 'month') {
        vpsData.priceInfo.period = 'monthly';
      } else if (vpsData.priceInfo.period === 'year') {
        vpsData.priceInfo.period = 'yearly';
      }
    }

    // 4. 提取购买链接
    const $buyBtn = $footer.find('a.btn');
    if ($buyBtn.length) {
      vpsData.buyLink = $buyBtn.attr('href') || '';
    }

    // 5. 生成唯一ID
    vpsData.uniqueId = `${vpsData.provider}-${vpsData.planName}-${vpsData.specs.cpu.cores}cpu-${vpsData.specs.ram.size}ram-${vpsData.priceInfo.amount}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    return vpsData;
  }

  // 爬取页面
  async crawlPage(url) {
    try {
      logger.info(`开始爬取页面: ${url}`);
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      
      const vpsDeals = [];
      
      // 查找所有VPS卡片
      const $cards = $('.card').filter((i, el) => {
        // 过滤出包含VPS信息的卡片
        return $(el).find('.specs').length > 0;
      });

      logger.info(`找到 ${$cards.length} 个VPS卡片`);

      $cards.each((i, card) => {
        try {
          const vpsData = this.parseVPSCard($, card);
          
          // 验证数据完整性
          if (vpsData.provider && vpsData.priceInfo.amount > 0) {
            vpsDeals.push(vpsData);
          } else {
            logger.warn(`跳过无效数据: ${JSON.stringify(vpsData)}`);
          }
        } catch (error) {
          logger.error(`解析卡片失败: ${error.message}`);
        }
      });

      logger.info(`成功解析 ${vpsDeals.length} 个VPS优惠`);
      return vpsDeals;
    } catch (error) {
      logger.error(`爬取页面失败 ${url}: ${error.message}`);
      throw error;
    }
  }

  // 爬取所有分类
  async crawlAllCategories() {
    const categories = [
      { url: '/', name: 'Homepage' },
      { url: '/category/exclusive', name: 'Exclusive Deals' },
      { url: '/category/kvm-15', name: 'KVM under $15/year' },
      { url: '/category/kvm-25', name: 'KVM under $25/year' },
      { url: '/category/vps-2m', name: 'Monthly under $2' },
      { url: '/category/ovz', name: 'NAT/OpenVZ/LXC' },
      { url: '/category/vps-high-spec', name: 'High Spec VPS' },
      { url: '/category/storage', name: 'Storage VPS' },
      { url: '/category/vds', name: 'VDS Deals' },
      { url: '/category/free', name: 'Free VPS' }
    ];

    const allDeals = [];
    const uniqueIds = new Set();

    for (const category of categories) {
      try {
        const url = category.url === '/' ? this.baseUrl : `${this.baseUrl}${category.url}`;
        const deals = await this.crawlPage(url);
        
        // 添加分类信息并去重
        for (const deal of deals) {
          if (!uniqueIds.has(deal.uniqueId)) {
            deal.sourceCategory = category.name;
            allDeals.push(deal);
            uniqueIds.add(deal.uniqueId);
          }
        }

        // 延迟避免被封
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(`爬取分类 ${category.name} 失败: ${error.message}`);
      }
    }

    logger.info(`总共爬取到 ${allDeals.length} 个独特的VPS优惠`);
    return allDeals;
  }
}

module.exports = ImprovedVPSCrawler;