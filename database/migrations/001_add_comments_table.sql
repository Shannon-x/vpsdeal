-- Migration: Add comments table
-- Date: 2025-09-03
-- Description: 创建评论表支持用户对VPS产品的评价

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `vps_id` INT(11) UNSIGNED NOT NULL,
  `author_name` VARCHAR(100) NOT NULL COMMENT '评论者名称',
  `author_email` VARCHAR(255) NOT NULL COMMENT '评论者邮箱',
  `author_ip` VARCHAR(45) NOT NULL COMMENT '评论者IP地址',
  `rating` TINYINT(1) UNSIGNED DEFAULT NULL COMMENT '评分 1-5',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '评论状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_vps_id` (`vps_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_author_email` (`author_email`),
  CONSTRAINT `fk_comment_vps` FOREIGN KEY (`vps_id`) REFERENCES `vps_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VPS产品评论表';