// 获取分类下的VPS列表API
import { getPool } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'

export default defineEventHandler(async (event) => {
  const pool = getPool();
  const method = event.node.req.method;
  
  if (method !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: '只支持GET请求'
    });
  }

  // 从URL中提取分类ID
  const url = event.node.req.url;
  const matches = url.match(/\/api\/categories\/([^\/]+)\/vps/);
  
  if (!matches) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的请求路径'
    });
  }

  const categoryId = matches[1];
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const offset = (page - 1) * limit;
  const sort = query.sort || 'price_asc';

  // 构建排序条件
  let orderBy = 'vd.monthly_price ASC';
  switch (sort) {
    case 'price_desc':
      orderBy = 'vd.monthly_price DESC';
      break;
    case 'date_desc':
      orderBy = 'vd.last_updated DESC';
      break;
    case 'cpu_desc':
      orderBy = 'vd.cpu_cores DESC, vd.monthly_price ASC';
      break;
    case 'ram_desc':
      orderBy = 'vd.ram_gb DESC, vd.monthly_price ASC';
      break;
  }

  try {
    // 获取VPS列表
    const [vpsData] = await pool.execute(`
      SELECT 
        vd.*,
        GROUP_CONCAT(DISTINCT c.name) as category_names,
        GROUP_CONCAT(DISTINCT c.id) as category_ids
      FROM vps_deals vd
      INNER JOIN vps_category_mapping vcm ON vd.id = vcm.vps_id
      INNER JOIN vps_categories c ON vcm.category_id = c.id
      WHERE vcm.category_id = ? AND vd.is_active = 1
      GROUP BY vd.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [categoryId, limit, offset]);

    // 获取总数
    const [countResult] = await pool.execute(`
      SELECT COUNT(DISTINCT vd.id) as total
      FROM vps_deals vd
      INNER JOIN vps_category_mapping vcm ON vd.id = vcm.vps_id
      WHERE vcm.category_id = ? AND vd.is_active = 1
    `, [categoryId]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // 获取分类信息
    const [categoryInfo] = await pool.execute(
      'SELECT * FROM vps_categories WHERE id = ? OR slug = ?',
      [categoryId, categoryId]
    );

    if (categoryInfo.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '分类不存在'
      });
    }

    return {
      category: categoryInfo[0],
      vps: vpsData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    if (error.statusCode === 404) throw error;
    logger.error('获取分类VPS列表失败:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '获取VPS列表失败'
    });
  }
});