-- VPS Deals 数据库表结构
-- 注意：请确保数据库已经创建并选择

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
INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES
('香港VPS', 'hongkong', '香港地区的VPS服务器，适合中国大陆访问', 1),
('美国VPS', 'usa', '美国地区的VPS服务器，适合全球访问', 2),
('日本VPS', 'japan', '日本地区的VPS服务器，亚洲访问速度快', 3),
('新加坡VPS', 'singapore', '新加坡地区的VPS服务器，东南亚枢纽', 4),
('欧洲VPS', 'europe', '欧洲地区的VPS服务器', 5);

-- 插入示例VPS数据
INSERT IGNORE INTO vps_products (category_id, provider_name, product_name, cpu, memory, storage, bandwidth, location, price, original_price, discount, features, affiliate_link) VALUES
(1, 'CloudProvider Pro', 'KVM VPS - 2GB RAM 特惠版', '2 vCPU', '2GB', '40GB SSD', '2TB', '香港', 4.99, 9.99, 50, '免费备份,DDoS防护,99.9%在线率', 'https://example.com/deal1'),
(2, 'SpeedHost USA', 'Premium VPS - 4GB 高性能', '4 vCPU', '4GB', '80GB NVMe', '5TB', '洛杉矶', 12.99, 19.99, 35, 'NVMe存储,免费SSL证书,24/7支持', 'https://example.com/deal2'),
(3, 'AsiaServers', 'Budget VPS 入门方案', '1 vCPU', '1GB', '20GB SSD', '1TB', '东京', 2.99, 4.99, 40, '即时开通,支持IPv6,免费快照', 'https://example.com/deal3');

-- 创建索引以提高查询性能
-- 注意：这些索引在某些MySQL版本中可能需要手动创建
-- CREATE INDEX idx_vps_location ON vps_products(location);
-- CREATE INDEX idx_vps_sort ON vps_products(sort_order, id);

-- 网站设置表
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 导航菜单表
CREATE TABLE IF NOT EXISTS nav_menus (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  url VARCHAR(255),
  category_id INT,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  target VARCHAR(20) DEFAULT '_self',
  parent_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES nav_menus(id) ON DELETE CASCADE,
  INDEX idx_sort (sort_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员角色表
CREATE TABLE IF NOT EXISTS admin_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_key VARCHAR(50) UNIQUE NOT NULL,
  permissions JSON,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员-角色关联表
CREATE TABLE IF NOT EXISTS admin_role_assignments (
  admin_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (admin_id, role_id),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,
  action VARCHAR(100) NOT NULL,
  action_type VARCHAR(50),
  target_type VARCHAR(50),
  target_id INT,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_admin (admin_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 向categories表添加新字段
ALTER TABLE categories 
  ADD COLUMN icon VARCHAR(100) AFTER description,
  ADD COLUMN color VARCHAR(20) AFTER icon,
  ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER color,
  ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER is_featured;

-- 向vps_products表添加新字段
ALTER TABLE vps_products
  ADD COLUMN port_speed VARCHAR(50) AFTER bandwidth,
  ADD COLUMN virtualization VARCHAR(50) AFTER port_speed,
  ADD COLUMN ipv6_support BOOLEAN DEFAULT FALSE AFTER virtualization,
  ADD COLUMN ddos_protection BOOLEAN DEFAULT FALSE AFTER ipv6_support,
  ADD COLUMN ssd_storage BOOLEAN DEFAULT TRUE AFTER ddos_protection,
  ADD COLUMN is_hot BOOLEAN DEFAULT FALSE AFTER ssd_storage,
  ADD COLUMN view_count INT DEFAULT 0 AFTER is_hot,
  ADD COLUMN sold_out BOOLEAN DEFAULT FALSE AFTER view_count,
  ADD COLUMN meta_title VARCHAR(200) AFTER sold_out,
  ADD COLUMN meta_description TEXT AFTER meta_title,
  ADD INDEX idx_view_count (view_count),
  ADD INDEX idx_is_hot (is_hot),
  ADD INDEX idx_sold_out (sold_out);

-- 向admins表添加新字段
ALTER TABLE admins
  ADD COLUMN full_name VARCHAR(100) AFTER email,
  ADD COLUMN avatar VARCHAR(255) AFTER full_name,
  ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER avatar,
  ADD COLUMN is_super_admin BOOLEAN DEFAULT FALSE AFTER is_active,
  ADD COLUMN two_factor_secret VARCHAR(255) AFTER is_super_admin,
  ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE AFTER two_factor_secret,
  ADD COLUMN login_attempts INT DEFAULT 0 AFTER two_factor_enabled,
  ADD COLUMN locked_until TIMESTAMP NULL AFTER login_attempts;

-- 插入默认网站设置
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'VPS Deals', 'text', '网站名称'),
('site_logo', '/logo.svg', 'image', '网站Logo'),
('site_favicon', '/favicon.ico', 'image', '网站Favicon'),
('site_description', '最优惠的VPS服务器推荐平台', 'textarea', '网站描述'),
('site_keywords', 'VPS,服务器,优惠,促销', 'text', '网站关键词'),
('contact_email', 'admin@vpsdeals.com', 'email', '联系邮箱'),
('contact_phone', '', 'text', '联系电话'),
('footer_text', '© 2024 VPS Deals. All rights reserved.', 'textarea', '页脚文本'),
('google_analytics', '', 'text', 'Google Analytics ID'),
('enable_registration', 'false', 'boolean', '是否开放注册'),
('maintenance_mode', 'false', 'boolean', '维护模式'),
('maintenance_message', '网站正在维护中，请稍后访问', 'textarea', '维护提示信息');

-- 插入默认管理员角色
INSERT INTO admin_roles (role_name, role_key, permissions, description) VALUES
('超级管理员', 'super_admin', '["*"]', '拥有所有权限'),
('管理员', 'admin', '["vps.*", "categories.*", "settings.read"]', '可以管理VPS和分类'),
('编辑员', 'editor', '["vps.read", "vps.create", "vps.update", "categories.read"]', '可以编辑VPS信息'),
('查看员', 'viewer', '["*.read"]', '只能查看信息');

-- 插入默认导航菜单
INSERT INTO nav_menus (title, url, sort_order, is_active) VALUES
('首页', '/', 1, TRUE),
('分类', '/categories', 2, TRUE),
('优惠推荐', '/deals', 3, TRUE),
('关于我们', '/about', 4, TRUE);