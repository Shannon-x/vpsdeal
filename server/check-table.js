// 检查表结构
const mysql = require('mysql2/promise');

async function checkTableStructure() {
  let pool;
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '172.18.0.2',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'vps',
      password: process.env.DB_PASSWORD || '2dFtjNzEFy7Skz6s',
      database: process.env.DB_DATABASE || 'vps',
      waitForConnections: true,
      connectionLimit: 10
    });
    
    // 显示vps_products表结构
    const [columns] = await pool.execute('SHOW COLUMNS FROM vps_products');
    console.log('vps_products表结构:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // 检查数据数量
    const [count] = await pool.execute('SELECT COUNT(*) as count FROM vps_products');
    console.log(`\n表中数据总数: ${count[0].count}`);
    
    // 获取一条示例数据
    const [sample] = await pool.execute('SELECT * FROM vps_products LIMIT 1');
    if (sample.length > 0) {
      console.log('\n示例数据:');
      console.log(JSON.stringify(sample[0], null, 2));
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    if (pool) await pool.end();
  }
}

checkTableStructure();