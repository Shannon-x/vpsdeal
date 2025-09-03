// 爬虫管理API路由
const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { runCrawlerManually, getScheduler } = require('../crawler');
const logger = require('../crawler/logger');

// 获取爬虫状态
router.get('/status', authenticateToken, requireAdmin, (req, res) => {
  const scheduler = getScheduler();
  
  if (!scheduler) {
    return res.json({
      status: 'stopped',
      message: '爬虫服务未启动'
    });
  }
  
  const stats = scheduler.getStats();
  res.json({
    status: 'running',
    stats
  });
});

// 手动触发爬虫
router.post('/run', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 检查是否已在运行
    const scheduler = getScheduler();
    if (scheduler && scheduler.isRunning) {
      return res.status(400).json({
        error: '爬虫正在运行中，请稍后再试'
      });
    }
    
    // 异步运行爬虫，立即返回响应
    res.json({
      message: '爬虫任务已启动，请稍后查看状态'
    });
    
    // 在后台运行爬虫
    runCrawlerManually().catch(error => {
      logger.error('手动运行爬虫失败:', error);
    });
    
  } catch (error) {
    logger.error('触发爬虫失败:', error);
    res.status(500).json({
      error: '触发爬虫失败',
      message: error.message
    });
  }
});

// 获取爬虫日志
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const logFile = path.join(__dirname, '../logs/crawler/combined.log');
    const logs = await fs.readFile(logFile, 'utf8');
    
    // 获取最后100行
    const lines = logs.split('\n').filter(line => line.trim());
    const recentLogs = lines.slice(-100).reverse();
    
    res.json({
      logs: recentLogs
    });
  } catch (error) {
    res.status(500).json({
      error: '获取日志失败',
      message: error.message
    });
  }
});

// 获取爬虫配置
router.get('/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const configFile = path.join(__dirname, '../crawler/config.json');
    const config = await fs.readFile(configFile, 'utf8');
    
    res.json(JSON.parse(config));
  } catch (error) {
    res.status(500).json({
      error: '获取配置失败',
      message: error.message
    });
  }
});

// 更新爬虫配置
router.put('/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const configFile = path.join(__dirname, '../crawler/config.json');
    await fs.writeFile(configFile, JSON.stringify(req.body, null, 2));
    
    res.json({
      message: '配置更新成功，重启爬虫服务后生效'
    });
  } catch (error) {
    res.status(500).json({
      error: '更新配置失败',
      message: error.message
    });
  }
});

module.exports = router;