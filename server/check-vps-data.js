// 检查VPS数据
const mysql = require('mysql2/promise');

async function checkVpsData() {
  let pool;
  try {
    console.log('连接数据库...');
    pool = mysql.createPool({
      host: process.env.DB_HOST || '172.18.0.2',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'vps',
      password: process.env.DB_PASSWORD || '2dFtjNzEFy7Skz6s',
      database: process.env.DB_DATABASE || 'vps',
      waitForConnections: true,
      connectionLimit: 10
    });
    
    // 检查vps_products表数据
    const [vpsCount] = await pool.execute('SELECT COUNT(*) as count FROM vps_products WHERE is_active = 1 AND price > 0');
    console.log('✅ VPS产品数量:', vpsCount[0].count);
    
    // 获取一些示例数据
    const [vpsData] = await pool.execute(`
      SELECT 
        id, 
        provider, 
        plan_name, 
        price,
        price_period,
        cpu_cores,
        ram_gb,
        storage_gb,
        storage_type
      FROM vps_products 
      WHERE is_active = 1 AND price > 0
      LIMIT 5
    `);
    console.log('\n示例VPS数据:');
    vpsData.forEach(vps => {
      console.log(`- ${vps.provider} ${vps.plan_name}: $${vps.price}/${vps.price_period} (${vps.cpu_cores}CPU, ${vps.ram_gb}GB RAM, ${vps.storage_gb}GB ${vps.storage_type})`);
    });
    
    if (vpsCount[0].count === 0) {
      console.log('\n⚠️  数据库中没有VPS数据，需要运行爬虫获取数据');
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    if (pool) await pool.end();
  }
}

checkVpsData();