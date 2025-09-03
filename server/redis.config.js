const redis = require('redis');

// Redis客户端配置
let redisClient;

/**
 * 初始化Redis连接
 * 使用细化的环境变量配置
 */
async function initRedis() {
  try {
    // 检查是否启用Redis
    if (process.env.REDIS_HOST) {
      redisClient = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',      // Redis主机地址
          port: parseInt(process.env.REDIS_PORT) || 6379,   // Redis端口
        },
        password: process.env.REDIS_PASSWORD || undefined,   // Redis密码（可选）
        database: parseInt(process.env.REDIS_DB) || 0,      // Redis数据库索引
      });

      // 连接错误处理
      redisClient.on('error', (err) => {
        console.error('❌ Redis连接错误:', err);
      });

      // 连接成功
      redisClient.on('connect', () => {
        console.log('✅ Redis连接成功');
      });

      // 连接Redis
      await redisClient.connect();
    } else {
      console.log('ℹ️ Redis未配置，跳过Redis连接');
    }
  } catch (error) {
    console.error('❌ Redis初始化失败:', error);
    // Redis连接失败不应该导致应用崩溃
  }
}

/**
 * 获取缓存数据
 * @param {string} key - 缓存键名
 * @returns {Promise<any>} 缓存的数据
 */
async function getCache(key) {
  if (!redisClient || !redisClient.isOpen) {
    return null;
  }

  try {
    const prefixedKey = `${process.env.REDIS_KEY_PREFIX || 'vps_'}${key}`;
    const data = await redisClient.get(prefixedKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis获取缓存错误:', error);
    return null;
  }
}

/**
 * 设置缓存数据
 * @param {string} key - 缓存键名
 * @param {any} value - 要缓存的数据
 * @param {number} ttl - 过期时间（秒），默认使用环境变量配置
 */
async function setCache(key, value, ttl) {
  if (!redisClient || !redisClient.isOpen) {
    return false;
  }

  try {
    const prefixedKey = `${process.env.REDIS_KEY_PREFIX || 'vps_'}${key}`;
    const expiry = ttl || parseInt(process.env.REDIS_TTL) || 3600;
    
    await redisClient.setEx(
      prefixedKey,
      expiry,
      JSON.stringify(value)
    );
    return true;
  } catch (error) {
    console.error('Redis设置缓存错误:', error);
    return false;
  }
}

/**
 * 删除缓存
 * @param {string} key - 缓存键名
 */
async function deleteCache(key) {
  if (!redisClient || !redisClient.isOpen) {
    return false;
  }

  try {
    const prefixedKey = `${process.env.REDIS_KEY_PREFIX || 'vps_'}${key}`;
    await redisClient.del(prefixedKey);
    return true;
  } catch (error) {
    console.error('Redis删除缓存错误:', error);
    return false;
  }
}

/**
 * 清空所有带前缀的缓存
 */
async function flushCache() {
  if (!redisClient || !redisClient.isOpen) {
    return false;
  }

  try {
    const prefix = process.env.REDIS_KEY_PREFIX || 'vps_';
    const keys = await redisClient.keys(`${prefix}*`);
    
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Redis清空缓存错误:', error);
    return false;
  }
}

/**
 * 关闭Redis连接
 */
async function closeRedis() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    console.log('ℹ️ Redis连接已关闭');
  }
}

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  flushCache,
  closeRedis
};