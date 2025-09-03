// 检查分类表结构
const mysql = require('mysql2/promise');

async function checkCategoriesTable() {
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
    
    // 列出所有表
    const [tables] = await pool.execute("SHOW TABLES");
    console.log('数据库中的表:');
    tables.forEach(table => {
      console.log('- ' + Object.values(table)[0]);
    });
    
    // 检查是否有categories相关的表
    const categoryTables = tables.filter(table => {
      const tableName = Object.values(table)[0];
      return tableName.includes('categor');
    });
    
    if (categoryTables.length > 0) {
      console.log('\n找到分类相关表，检查结构...');
      for (const table of categoryTables) {
        const tableName = Object.values(table)[0];
        const [columns] = await pool.execute(`SHOW COLUMNS FROM ${tableName}`);
        console.log(`\n${tableName}表结构:`);
        columns.forEach(col => {
          console.log(`- ${col.Field} (${col.Type})`);
        });
      }
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    if (pool) await pool.end();
  }
}

checkCategoriesTable();