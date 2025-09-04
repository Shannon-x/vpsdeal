/**
 * 价格对比API端点
 * GET /api/compare?ids=1,2,3,4,5
 */

const db = require('../db');

// 内存缓存热门对比
const compareCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

// 会话存储（实际生产环境应使用Redis）
const compareSessions = new Map();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const method = event.node.req.method;

  // 路由分发
  if (method === 'GET' && query.ids) {
    return handleCompare(query.ids);
  } else if (method === 'POST' && event.node.req.url.includes('/session')) {
    return handleSession(event);
  }

  return {
    error: 'Invalid request',
    usage: 'GET /api/compare?ids=1,2,3'
  };
});

/**
 * 处理对比请求
 */
async function handleCompare(idsParam) {
  try {
    // 解析和验证ID
    const ids = String(idsParam).split(',')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id) && id > 0)
      .slice(0, 5); // 最多5个

    if (ids.length === 0) {
      return {
        success: false,
        error: 'No valid IDs provided'
      };
    }

    // 检查缓存
    const cacheKey = ids.sort().join(',');
    const cached = compareCache.get(cacheKey);
    
    if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
      return {
        success: true,
        data: cached.data,
        cached: true
      };
    }

    // 获取VPS数据
    const vpsData = await getVPSByIds(ids);
    
    if (vpsData.length === 0) {
      return {
        success: false,
        error: 'No VPS found with provided IDs'
      };
    }

    // 处理对比数据
    const comparisonData = processComparisonData(vpsData);

    // 缓存结果
    compareCache.set(cacheKey, {
      data: comparisonData,
      timestamp: Date.now()
    });

    return {
      success: true,
      data: comparisonData,
      cached: false
    };
  } catch (error) {
    console.error('Compare API error:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

/**
 * 从数据库获取VPS数据
 */
async function getVPSByIds(ids) {
  const placeholders = ids.map(() => '?').join(',');
  const query = `
    SELECT 
      v.*,
      c.name as category_name,
      c.slug as category_slug,
      JSON_EXTRACT(v.translated_fields, '$."zh"') as chinese_fields
    FROM vps_products v
    LEFT JOIN categories c ON v.category_id = c.id
    WHERE v.id IN (${placeholders})
    ORDER BY FIELD(v.id, ${placeholders})
  `;
  
  const [rows] = await db.query(query, [...ids, ...ids]);
  
  // 解析JSON数据
  return rows.map(row => {
    try {
      // 解析data字段
      if (row.data && typeof row.data === 'string') {
        row.data = JSON.parse(row.data);
      }
      
      // 解析中文字段
      if (row.chinese_fields && typeof row.chinese_fields === 'string') {
        row.chinese_fields = JSON.parse(row.chinese_fields);
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }
    
    return row;
  });
}

/**
 * 处理对比数据
 */
function processComparisonData(vpsData) {
  // 提取所有规格进行对比
  const comparison = {
    products: vpsData.map(vps => ({
      id: vps.id,
      name: vps.chinese_fields?.name || vps.name || 'VPS Plan',
      provider: vps.chinese_fields?.provider || vps.data?.provider || 'Unknown',
      image: vps.image,
      link: vps.link,
      
      // 价格信息
      price: {
        current: vps.price || 0,
        original: vps.original_price,
        currency: vps.currency || 'USD',
        billing: vps.billing || 'monthly',
        discount: calculateDiscount(vps.original_price, vps.price),
        monthly: normalizeToMonthly(vps.price, vps.billing)
      },
      
      // 规格信息
      specs: {
        cpu: vps.data?.cpu || vps.cpu || '1 vCPU',
        ram: vps.data?.ram || vps.ram || '1 GB',
        storage: vps.data?.storage || vps.storage || '20 GB SSD',
        bandwidth: vps.data?.bandwidth || vps.bandwidth || '1 TB',
        location: vps.chinese_fields?.location || vps.data?.location || vps.location || 'Unknown'
      },
      
      // 特性
      features: extractFeatures(vps),
      
      // 评分
      rating: vps.rating || 0,
      reviews: vps.review_count || 0
    })),
    
    // 对比洞察
    insights: generateInsights(vpsData),
    
    // 关键差异
    differences: findKeyDifferences(vpsData),
    
    // 生成时间
    generatedAt: new Date().toISOString()
  };

  return comparison;
}

/**
 * 计算折扣
 */
function calculateDiscount(original, current) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * 标准化为月付价格
 */
function normalizeToMonthly(price, billing) {
  if (!price) return 0;
  
  switch (billing) {
    case 'monthly':
      return price;
    case 'quarterly':
      return price / 3;
    case 'semi-annually':
      return price / 6;
    case 'yearly':
    case 'annually':
      return price / 12;
    default:
      return price;
  }
}

/**
 * 提取特性列表
 */
function extractFeatures(vps) {
  const features = [];
  
  // 从data字段提取
  if (vps.data?.features && Array.isArray(vps.data.features)) {
    features.push(...vps.data.features);
  }
  
  // 检查特殊特性
  if (vps.data?.network?.ipv6) features.push('IPv6 Support');
  if (vps.data?.network?.ipv4 > 1) features.push(`${vps.data.network.ipv4} IPv4`);
  if (vps.data?.virtualization) features.push(vps.data.virtualization);
  
  return features;
}

/**
 * 生成对比洞察
 */
function generateInsights(vpsData) {
  const insights = {
    cheapest: null,
    bestValue: null,
    mostRAM: null,
    mostStorage: null,
    bestLocation: {}
  };

  let cheapestPrice = Infinity;
  let bestValueScore = 0;
  let maxRAM = 0;
  let maxStorage = 0;

  vpsData.forEach(vps => {
    const monthlyPrice = normalizeToMonthly(vps.price, vps.billing);
    
    // 最便宜
    if (monthlyPrice < cheapestPrice) {
      cheapestPrice = monthlyPrice;
      insights.cheapest = {
        id: vps.id,
        name: vps.name,
        price: monthlyPrice
      };
    }
    
    // 最佳性价比（简单算法：资源/价格）
    const ram = parseFloat(vps.ram) || 1;
    const storage = parseFloat(vps.storage) || 20;
    const valueScore = (ram + storage) / monthlyPrice;
    
    if (valueScore > bestValueScore) {
      bestValueScore = valueScore;
      insights.bestValue = {
        id: vps.id,
        name: vps.name,
        score: valueScore
      };
    }
    
    // 最大RAM
    if (ram > maxRAM) {
      maxRAM = ram;
      insights.mostRAM = {
        id: vps.id,
        name: vps.name,
        ram: vps.ram
      };
    }
    
    // 最大存储
    if (storage > maxStorage) {
      maxStorage = storage;
      insights.mostStorage = {
        id: vps.id,
        name: vps.name,
        storage: vps.storage
      };
    }
    
    // 按位置统计
    const location = vps.location || 'Unknown';
    if (!insights.bestLocation[location]) {
      insights.bestLocation[location] = [];
    }
    insights.bestLocation[location].push(vps.id);
  });

  return insights;
}

/**
 * 找出关键差异
 */
function findKeyDifferences(vpsData) {
  if (vpsData.length < 2) return [];
  
  const differences = [];
  const specs = ['cpu', 'ram', 'storage', 'bandwidth', 'price'];
  
  specs.forEach(spec => {
    const values = vpsData.map(vps => {
      switch (spec) {
        case 'price':
          return normalizeToMonthly(vps.price, vps.billing);
        case 'cpu':
          return parseInt(vps.cpu) || 1;
        case 'ram':
          return parseFloat(vps.ram) || 1;
        case 'storage':
          return parseFloat(vps.storage) || 20;
        case 'bandwidth':
          return vps.bandwidth?.toLowerCase().includes('unlimited') ? 999999 : parseFloat(vps.bandwidth) || 1;
        default:
          return 0;
      }
    });
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const variance = max - min;
    const variancePercent = min > 0 ? (variance / min) * 100 : 0;
    
    if (variancePercent > 20) {
      differences.push({
        spec,
        min,
        max,
        variance,
        variancePercent: Math.round(variancePercent)
      });
    }
  });
  
  return differences.sort((a, b) => b.variancePercent - a.variancePercent);
}

/**
 * 处理会话相关请求
 */
async function handleSession(event) {
  const url = event.node.req.url;
  const body = await readBody(event);
  
  // 创建新会话
  if (url.includes('/session') && !url.includes('/session/')) {
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      items: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时
    };
    
    compareSessions.set(sessionId, session);
    
    return {
      success: true,
      sessionId,
      session
    };
  }
  
  // 处理会话操作
  const sessionMatch = url.match(/\/session\/([^/]+)/);
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    const session = compareSessions.get(sessionId);
    
    if (!session || session.expiresAt < Date.now()) {
      return {
        success: false,
        error: 'Session expired or not found'
      };
    }
    
    // 添加项目
    if (url.includes('/add')) {
      const { vpsId } = body;
      if (vpsId && !session.items.includes(vpsId) && session.items.length < 5) {
        session.items.push(vpsId);
      }
    }
    
    // 移除项目
    else if (url.includes('/remove')) {
      const { vpsId } = body;
      session.items = session.items.filter(id => id !== vpsId);
    }
    
    // 清空会话
    else if (url.includes('/clear')) {
      session.items = [];
    }
    
    return {
      success: true,
      session
    };
  }
  
  return {
    success: false,
    error: 'Invalid session operation'
  };
}

/**
 * 生成会话ID
 */
function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 定期清理过期缓存和会话
setInterval(() => {
  // 清理缓存
  for (const [key, value] of compareCache.entries()) {
    if (value.timestamp < Date.now() - CACHE_TTL) {
      compareCache.delete(key);
    }
  }
  
  // 清理会话
  for (const [id, session] of compareSessions.entries()) {
    if (session.expiresAt < Date.now()) {
      compareSessions.delete(id);
    }
  }
}, 60 * 1000); // 每分钟清理一次