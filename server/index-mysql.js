const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MySQL连接池配置
let pool;

async function initDatabase() {
  try {
    // 使用细化的数据库配置参数
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',                    // 数据库主机
      port: parseInt(process.env.DB_PORT) || 3306,                 // 数据库端口
      user: process.env.DB_USER,                                   // 数据库用户名
      password: process.env.DB_PASSWORD,                            // 数据库密码
      database: process.env.DB_DATABASE || 'vps_deals',            // 数据库名称
      waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false', // 等待连接
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,     // 连接池大小
      queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,               // 队列限制
      charset: process.env.DB_CHARSET || 'utf8mb4',                        // 字符集
      multipleStatements: true                                              // 允许执行多条SQL语句
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL连接成功');
    
    // Initialize database tables if schema.sql exists
    await initializeTables(connection);
    
    // Initialize admin user if not exists
    await initializeAdmin(connection);
    
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

// Initialize database tables
async function initializeTables(connection) {
  try {
    // Check if schema.sql exists
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    try {
      const sql = await fs.readFile(schemaPath, 'utf8');
      console.log('正在初始化数据库表...');
      
      // Split SQL statements and execute them one by one
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
          } catch (err) {
            // Ignore duplicate key errors for indexes
            if (err.code === 'ER_DUP_KEYNAME') {
              console.log(`索引已存在，跳过: ${err.message}`);
            } else if (err.code === 'ER_DUP_ENTRY') {
              console.log(`数据已存在，跳过: ${err.message}`);
            } else {
              throw err;
            }
          }
        }
      }
      
      console.log('✅ 数据库表初始化成功');
      
      // Create indexes separately
      await createIndexes(connection);
      
    } catch (fileError) {
      if (fileError.code === 'ENOENT') {
        console.log('schema.sql文件不存在，跳过表初始化');
      } else {
        throw fileError;
      }
    }
  } catch (error) {
    console.error('数据库表初始化错误:', error);
    throw error;
  }
}

// Create indexes separately
async function createIndexes(connection) {
  const indexes = [
    { table: 'vps_products', name: 'idx_vps_location', column: 'location' },
    { table: 'vps_products', name: 'idx_vps_sort', columns: 'sort_order, id' }
  ];
  
  for (const index of indexes) {
    try {
      const columnDef = index.columns || index.column;
      await connection.query(`CREATE INDEX ${index.name} ON ${index.table}(${columnDef})`);
      console.log(`✅ 创建索引: ${index.name}`);
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log(`索引已存在: ${index.name}`);
      } else {
        console.error(`创建索引失败 ${index.name}:`, err.message);
      }
    }
  }
}

// Initialize admin user
async function initializeAdmin(connection) {
  try {
    const [admins] = await connection.execute(
      'SELECT * FROM admins WHERE username = ?',
      [process.env.ADMIN_USERNAME]
    );

    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await connection.execute(
        'INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)',
        [process.env.ADMIN_USERNAME, hashedPassword, 'admin@example.com']
      );
      console.log('✅ 管理员账户已创建');
      console.log('Username:', process.env.ADMIN_USERNAME);
      console.log('Password (hashed):', hashedPassword.substring(0, 20) + '...');
    } else {
      console.log('管理员账户已存在:', process.env.ADMIN_USERNAME);
      // 可选：更新密码（用于测试）
      if (process.env.UPDATE_ADMIN_PASSWORD === 'true') {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await connection.execute(
          'UPDATE admins SET password_hash = ? WHERE username = ?',
          [hashedPassword, process.env.ADMIN_USERNAME]
        );
        console.log('✅ 管理员密码已更新');
      }
    }
  } catch (error) {
    console.error('管理员初始化错误:', error);
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Public routes
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories ORDER BY sort_order, id'
    );
    res.json(categories);
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/vps', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location } = req.query;
    
    let query = `
      SELECT v.*, c.name as category_name, c.slug as category_slug
      FROM vps_products v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.status = 'active'
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (minPrice) {
      query += ' AND v.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND v.price <= ?';
      params.push(maxPrice);
    }

    if (location) {
      query += ' AND v.location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' ORDER BY v.sort_order, v.id DESC';

    const [products] = await pool.execute(query, params);
    res.json(products);
  } catch (error) {
    console.error('获取VPS产品错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/vps/:id', async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT v.*, c.name as category_name, c.slug as category_slug
       FROM vps_products v
       LEFT JOIN categories c ON v.category_id = c.id
       WHERE v.id = ? AND v.status = 'active'`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('获取VPS详情错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const [admins] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const admin = admins[0];
    console.log('Found admin:', admin.username);
    
    const isValid = await bcrypt.compare(password, admin.password_hash);
    console.log('Password validation result:', isValid);

    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // Update last login
    await pool.execute(
      'UPDATE admins SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [[{ total_products }]] = await pool.execute(
      'SELECT COUNT(*) as total_products FROM vps_products WHERE status = "active"'
    );

    const [[{ total_categories }]] = await pool.execute(
      'SELECT COUNT(*) as total_categories FROM categories'
    );

    const [[{ avg_price }]] = await pool.execute(
      'SELECT AVG(price) as avg_price FROM vps_products WHERE status = "active"'
    );

    const [[{ total_messages }]] = await pool.execute(
      'SELECT COUNT(*) as total_messages FROM messages WHERE status = "unread"'
    );

    res.json({
      total_products,
      total_categories,
      avg_price: parseFloat(avg_price) || 0,
      total_messages
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/admin/vps', authenticateToken, async (req, res) => {
  try {
    const {
      category_id,
      provider_name,
      product_name,
      cpu,
      memory,
      storage,
      bandwidth,
      location,
      price,
      original_price,
      discount,
      features,
      affiliate_link
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO vps_products 
       (category_id, provider_name, product_name, cpu, memory, storage, bandwidth, location, price, original_price, discount, features, affiliate_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, provider_name, product_name, cpu, memory, storage, bandwidth, location, price, original_price, discount, features, affiliate_link]
    );

    res.json({ id: result.insertId, message: 'VPS产品创建成功' });
  } catch (error) {
    console.error('创建VPS产品错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/admin/vps/:id', authenticateToken, async (req, res) => {
  try {
    const {
      category_id,
      provider_name,
      product_name,
      cpu,
      memory,
      storage,
      bandwidth,
      location,
      price,
      original_price,
      discount,
      features,
      affiliate_link,
      status
    } = req.body;

    await pool.execute(
      `UPDATE vps_products SET
       category_id = ?, provider_name = ?, product_name = ?, cpu = ?, memory = ?, 
       storage = ?, bandwidth = ?, location = ?, price = ?, original_price = ?, 
       discount = ?, features = ?, affiliate_link = ?, status = ?
       WHERE id = ?`,
      [category_id, provider_name, product_name, cpu, memory, storage, bandwidth, 
       location, price, original_price, discount, features, affiliate_link, status, req.params.id]
    );

    res.json({ message: 'VPS产品更新成功' });
  } catch (error) {
    console.error('更新VPS产品错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/admin/vps/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE vps_products SET status = "inactive" WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'VPS产品删除成功' });
  } catch (error) {
    console.error('删除VPS产品错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 简化版爬虫管理API（暂时禁用）
// const simpleCrawlerRouter = require('./api/simple-crawler');
// app.use('/api/admin/crawler', simpleCrawlerRouter);

// Start server
async function startServer() {
  await initDatabase();
  
  // 暂时禁用爬虫服务自动启动，需要时手动启动
  // const { startCrawlerService } = require('./crawler');
  // try {
  //   await startCrawlerService();
  //   console.log('✅ 爬虫服务已启动');
  // } catch (error) {
  //   console.error('❌ 爬虫服务启动失败:', error);
  //   // 爬虫服务失败不影响主服务运行
  // }
  
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📡 API地址: http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);