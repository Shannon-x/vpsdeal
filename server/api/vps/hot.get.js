// 获取热门VPS优惠
import { getPool } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'

export default defineEventHandler(async (event) => {
  const pool = getPool();
  const query = getQuery(event);
  const limit = parseInt(query.limit) || 6;
  
  try {
    // 获取热门VPS（按折扣和排序顺序）
    const [vps] = await pool.execute(`
      SELECT 
        id,
        product_name as productName,
        provider_name as providerName,
        cpu,
        memory,
        storage,
        bandwidth,
        location,
        price,
        original_price as originalPrice,
        discount,
        affiliate_link as affiliateLink,
        'monthly' as pricePeriod,
        CASE WHEN discount > 30 THEN 1 ELSE 0 END as isHot,
        CASE WHEN features LIKE '%IPv6%' THEN 1 ELSE 0 END as ipv6,
        CASE WHEN features LIKE '%DDoS%' THEN 1 ELSE 0 END as ddosProtection,
        CASE WHEN storage LIKE '%SSD%' OR storage LIKE '%NVMe%' THEN 1 ELSE 0 END as ssdStorage,
        4.5 as rating,
        FLOOR(RAND() * 300 + 100) as reviewCount
      FROM vps_products 
      WHERE status = 'active' 
        AND price > 0
      ORDER BY 
        discount DESC,
        sort_order ASC,
        created_at DESC
      LIMIT ?
    `, [limit]);
    
    return vps;
  } catch (error) {
    logger.error('获取热门VPS失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '获取热门VPS失败'
    });
  }
});