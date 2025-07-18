-- 创建数据库
CREATE DATABASE IF NOT EXISTS vps_deals CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vps_deals;

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- VPS产品表
CREATE TABLE IF NOT EXISTS vps_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  provider_name VARCHAR(100) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  cpu VARCHAR(50),
  memory VARCHAR(50),
  storage VARCHAR(50),
  bandwidth VARCHAR(50),
  location VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INT DEFAULT 0,
  features TEXT,
  affiliate_link TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_status (status),
  INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 消息/留言表
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 统计表
CREATE TABLE IF NOT EXISTS stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE UNIQUE NOT NULL,
  page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认分类
INSERT INTO categories (name, slug, description, sort_order) VALUES
('香港VPS', 'hongkong', '香港地区的VPS服务器，适合中国大陆访问', 1),
('美国VPS', 'usa', '美国地区的VPS服务器，适合全球访问', 2),
('日本VPS', 'japan', '日本地区的VPS服务器，亚洲访问速度快', 3),
('新加坡VPS', 'singapore', '新加坡地区的VPS服务器，东南亚枢纽', 4),
('欧洲VPS', 'europe', '欧洲地区的VPS服务器', 5);

-- 插入示例VPS数据
INSERT INTO vps_products (category_id, provider_name, product_name, cpu, memory, storage, bandwidth, location, price, original_price, discount, features, affiliate_link) VALUES
(1, 'CloudProvider Pro', 'KVM VPS - 2GB RAM 特惠版', '2 vCPU', '2GB', '40GB SSD', '2TB', '香港', 4.99, 9.99, 50, '免费备份,DDoS防护,99.9%在线率', 'https://example.com/deal1'),
(2, 'SpeedHost USA', 'Premium VPS - 4GB 高性能', '4 vCPU', '4GB', '80GB NVMe', '5TB', '洛杉矶', 12.99, 19.99, 35, 'NVMe存储,免费SSL证书,24/7支持', 'https://example.com/deal2'),
(3, 'AsiaServers', 'Budget VPS 入门方案', '1 vCPU', '1GB', '20GB SSD', '1TB', '东京', 2.99, 4.99, 40, '即时开通,支持IPv6,免费快照', 'https://example.com/deal3');

-- 创建索引以提高查询性能
CREATE INDEX idx_vps_location ON vps_products(location);
CREATE INDEX idx_vps_sort ON vps_products(sort_order, id);

-- 创建视图：活跃的VPS产品
CREATE VIEW active_vps_view AS
SELECT 
  v.*,
  c.name as category_name,
  c.slug as category_slug
FROM vps_products v
LEFT JOIN categories c ON v.category_id = c.id
WHERE v.status = 'active'
ORDER BY v.sort_order, v.id DESC;