const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'vps',
  password: process.env.DB_PASSWORD || '2dFtjNzEFy7Skz6s',
  database: process.env.DB_DATABASE || 'vps',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

module.exports = pool;