const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'vps_deals',
    multipleStatements: true
  });

  try {
    console.log('正在初始化数据库...');
    
    // 读取SQL文件
    const sqlPath = path.join(__dirname, '../database/schema.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // 执行SQL
    await connection.query(sql);
    
    console.log('✅ 数据库表创建成功！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// 运行初始化
initDatabase();