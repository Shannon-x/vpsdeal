// 简单的爬虫测试API
const express = require('express');
const router = express.Router();
const { SimpleCrawler } = require('../simple-crawler');

// 测试爬虫
router.get('/test', async (req, res) => {
  try {
    const crawler = new SimpleCrawler();
    const results = await crawler.crawlAll();
    
    res.json({
      success: true,
      count: results.length,
      sample: results.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;