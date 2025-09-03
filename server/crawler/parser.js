// VPS数据解析器
const logger = require('./logger');

// 解析价格字符串
function parsePrice(priceStr) {
  if (!priceStr) return null;
  
  // 匹配价格模式，如 "USD 6.9 / month" 或 "$15/year"
  const match = priceStr.match(/(?:USD\s*)?(\$?\d+(?:\.\d+)?)\s*\/\s*(month|year|mo|yr)/i);
  
  if (match) {
    const amount = parseFloat(match[1].replace('$', ''));
    const period = match[2].toLowerCase();
    
    // 统一计算月付价格用于排序
    const monthlyPrice = period.includes('year') || period === 'yr' 
      ? amount / 12 
      : amount;
    
    return {
      amount,
      period: period.includes('year') || period === 'yr' ? 'yearly' : 'monthly',
      display: priceStr.trim(),
      monthlyPrice
    };
  }
  
  return null;
}

// 解析规格信息
function parseSpecs(specsList) {
  const specs = {
    cpu: '',
    ram: '',
    storage: '',
    bandwidth: '',
    ipv4: '',
    ipv6: '',
    port: '',
    location: '',
    virtualization: 'KVM' // 默认虚拟化
  };

  specsList.forEach(spec => {
    const text = spec.trim();
    
    // CPU
    if (text.match(/vCPU|Core/i)) {
      specs.cpu = text;
    }
    // RAM
    else if (text.match(/RAM|Memory|GB\s*RAM|MB\s*RAM/i)) {
      specs.ram = text;
    }
    // Storage
    else if (text.match(/Storage|Disk|SSD|HDD|NVMe/i)) {
      specs.storage = text;
    }
    // Bandwidth
    else if (text.match(/Bandwidth|Traffic|TB|GB\s*(?:Bandwidth|Traffic)/i)) {
      specs.bandwidth = text;
    }
    // IPv4
    else if (text.match(/IPv4/i)) {
      specs.ipv4 = text;
    }
    // IPv6
    else if (text.match(/IPv6/i)) {
      specs.ipv6 = text;
    }
    // Port Speed
    else if (text.match(/Port|Mbps|Gbps/i) && !text.match(/IPv/i)) {
      specs.port = text;
    }
    // Location
    else if (text.match(/Location|US|EU|Asia|Singapore|Japan|Germany|Netherlands/i)) {
      specs.location = text.replace('Location:', '').trim();
    }
    // Virtualization
    else if (text.match(/KVM|OpenVZ|LXC|NAT|Xen/i)) {
      specs.virtualization = text.match(/KVM|OpenVZ|LXC|NAT|Xen/i)[0];
    }
  });

  return specs;
}

// 解析单个VPS数据
function parseVPSData($, element) {
  try {
    const $card = $(element);
    
    // 提取基本信息
    const providerName = $card.find('.card-header, .provider-name').text().trim();
    const productName = $card.find('.card-title, .product-name').text().trim();
    const priceText = $card.find('.price, .card-price').text().trim();
    const buyLink = $card.find('a:contains("Buy"), a:contains("Order")').attr('href');
    
    // 提取规格列表
    const specsArray = [];
    $card.find('ul li, .specs li').each((i, el) => {
      specsArray.push($(el).text().trim());
    });
    
    // 如果没有找到列表项，尝试其他选择器
    if (specsArray.length === 0) {
      $card.find('.card-body p, .specs-text').each((i, el) => {
        const text = $(el).text().trim();
        if (text && !text.includes('Buy Now')) {
          specsArray.push(...text.split('\n').map(s => s.trim()).filter(s => s));
        }
      });
    }
    
    // 解析价格和规格
    const price = parsePrice(priceText);
    const specs = parseSpecs(specsArray);
    
    // 生成唯一标识
    const uniqueId = `${providerName}-${productName}-${specs.location}`.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    
    return {
      uniqueId,
      provider: providerName,
      productName,
      price,
      ...specs,
      buyLink,
      originalSpecs: specsArray,
      crawledAt: new Date()
    };
    
  } catch (error) {
    logger.error('解析VPS数据出错:', error);
    return null;
  }
}

// 批量解析页面中的所有VPS
function parseVPSList($, selector = '.card') {
  const vpsList = [];
  
  $(selector).each((index, element) => {
    const vpsData = parseVPSData($, element);
    if (vpsData) {
      vpsList.push(vpsData);
    }
  });
  
  return vpsList;
}

module.exports = {
  parseVPSData,
  parseVPSList,
  parsePrice,
  parseSpecs
};