// 简化版爬虫API路由
const express = require('express');
const router = express.Router();
const { SimpleCrawler } = require('../simple-crawler');
const logger = require('../simple-logger');

// 中间件：简单的认证检查
const checkAuth = (req, res, next) => {
  // 暂时简化认证，实际应该使用JWT
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权' });
  }
  next();
};

// 获取爬虫状态
router.get('/status', checkAuth, (req, res) => {
  res.json({
    status: 'ready',
    stats: {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      isRunning: false,
      lastRun: null
    }
  });
});

// 手动运行爬虫
router.post('/run', checkAuth, async (req, res) => {
  try {
    const crawler = new SimpleCrawler();
    
    // 立即返回响应
    res.json({
      message: '爬虫任务已启动，请稍后查看结果'
    });
    
    // 异步运行爬虫
    crawler.crawlAll()
      .then(results => {
        logger.info(`爬虫完成，获取 ${results.length} 个VPS优惠`);
        // 这里可以添加数据库保存逻辑
      })
      .catch(error => {
        logger.error('爬虫运行失败:', error);
      });
    
  } catch (error) {
    res.status(500).json({
      error: '启动爬虫失败',
      message: error.message
    });
  }
});

// 测试爬虫连接
router.get('/test', checkAuth, async (req, res) => {
  try {
    const crawler = new SimpleCrawler();
    const html = await crawler.fetchPage('https://serverdeals.cc');
    
    res.json({
      success: true,
      message: '成功连接到目标网站',
      htmlLength: html.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '连接测试失败',
      message: error.message
    });
  }
});

module.exports = router;