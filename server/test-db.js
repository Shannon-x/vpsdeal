// 测试数据库连接
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('测试数据库连接...');
    console.log('DB_HOST:', process.env.DB_HOST || '172.17.0.1');
    console.log('DB_PORT:', process.env.DB_PORT || 3306);
    console.log('DB_USER:', process.env.DB_USER || 'vps');
    console.log('DB_DATABASE:', process.env.DB_DATABASE || 'vps');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '172.17.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'vps',
      password: process.env.DB_PASSWORD || '2dFtjNzEFy7Skz6s',
      database: process.env.DB_DATABASE || 'vps'
    });
    
    console.log('✅ 数据库连接成功！');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('查询结果:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
}

testConnection();