// 获取VPS列表
import { getPool } from '../utils/db.js'
import { logger } from '../utils/logger.js'

export default defineEventHandler(async (event) => {
  const pool = getPool();
  const query = getQuery(event);
  
  // 分页参数
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const offset = (page - 1) * limit;
  
  // 过滤参数
  const category = query.category;
  const minPrice = parseFloat(query.minPrice) || 0;
  const maxPrice = parseFloat(query.maxPrice) || 9999;
  const location = query.location;
  const provider = query.provider;
  
  try {
    let whereConditions = ['vd.is_active = 1'];
    let params = [];
    
    // 添加分类过滤
    if (category && category !== 'all') {
      whereConditions.push('vcm.category_id = ?');
      params.push(category);
    }
    
    // 价格范围过滤
    whereConditions.push('vd.price >= ? AND vd.price <= ?');
    params.push(minPrice, maxPrice);
    
    // 位置过滤
    if (location) {
      whereConditions.push('vd.location LIKE ?');
      params.push(`%${location}%`);
    }
    
    // 提供商过滤
    if (provider) {
      whereConditions.push('vd.provider = ?');
      params.push(provider);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // 获取总数
    const countQuery = category && category !== 'all' 
      ? `SELECT COUNT(DISTINCT vd.id) as total 
         FROM vps_deals vd 
         LEFT JOIN vps_category_mapping vcm ON vd.id = vcm.vps_id 
         WHERE ${whereClause}`
      : `SELECT COUNT(*) as total 
         FROM vps_deals vd 
         WHERE ${whereClause}`;
    
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;
    
    // 获取VPS数据
    params.push(limit, offset);
    
    const dataQuery = category && category !== 'all'
      ? `SELECT DISTINCT
           vd.id,
           vd.plan_name,
           vd.provider,
           vd.location,
           vd.cpu_cores,
           vd.cpu_type,
           vd.ram_gb,
           vd.storage_gb,
           vd.storage_type,
           vd.bandwidth_tb,
           vd.bandwidth_unlimited,
           vd.network_speed,
           vd.ipv4_count,
           vd.ipv6_available,
           vd.virtualization,
           vd.price,
           vd.original_price,
           vd.discount_percent,
           vd.price_period,
           vd.monthly_price,
           vd.buy_link,
           vd.features,
           vd.is_hot,
           vd.stock_status,
           vd.view_count,
           vd.click_count,
           vd.updated_at
         FROM vps_deals vd
         LEFT JOIN vps_category_mapping vcm ON vd.id = vcm.vps_id
         WHERE ${whereClause}
         ORDER BY vd.discount_percent DESC, vd.created_at DESC
         LIMIT ? OFFSET ?`
      : `SELECT 
           vd.*
         FROM vps_deals vd
         WHERE ${whereClause}
         ORDER BY vd.discount_percent DESC, vd.created_at DESC
         LIMIT ? OFFSET ?`;
    
    const [vps] = await pool.execute(dataQuery, params);
    
    return {
      data: vps,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('获取VPS列表失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '获取VPS列表失败'
    });
  }
});