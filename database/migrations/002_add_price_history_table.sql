-- Migration: Add price history table
-- Date: 2025-09-03
-- Description: 创建价格历史表追踪VPS产品价格变化

CREATE TABLE IF NOT EXISTS `price_history` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vps_id` INT(11) UNSIGNED NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL COMMENT '价格',
  `original_price` DECIMAL(10, 2) DEFAULT NULL COMMENT '原始价格（未折扣）',
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD' COMMENT '货币代码',
  `billing_cycle` VARCHAR(20) NOT NULL COMMENT '计费周期（monthly/yearly等）',
  `discount_percentage` DECIMAL(5, 2) DEFAULT NULL COMMENT '折扣百分比',
  `recorded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  `source` VARCHAR(50) DEFAULT 'crawler' COMMENT '数据来源',
  PRIMARY KEY (`id`),
  INDEX `idx_vps_date` (`vps_id`, `recorded_at` DESC),
  INDEX `idx_recorded_at` (`recorded_at`),
  INDEX `idx_price_change` (`vps_id`, `price`),
  CONSTRAINT `fk_price_history_vps` FOREIGN KEY (`vps_id`) REFERENCES `vps_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VPS产品价格历史表';