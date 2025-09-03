/**
 * 数据库模型导出
 */

const Comment = require('./comments');
const PriceHistory = require('./price-history');
const Translation = require('./translations');

module.exports = {
  Comment,
  PriceHistory,
  Translation
};