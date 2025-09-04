-- Migration: Add translation support
-- Date: 2025-09-03
-- Description: 添加多语言翻译支持

-- 为vps_products表添加翻译字段
ALTER TABLE `vps_products` 
ADD COLUMN `translated_fields` JSON DEFAULT NULL COMMENT '翻译后的字段内容' AFTER `updated_at`;

-- 为categories表添加翻译字段
ALTER TABLE `categories` 
ADD COLUMN `translated_fields` JSON DEFAULT NULL COMMENT '翻译后的字段内容' AFTER `updated_at`;

-- 创建翻译缓存表（可选，用于存储翻译API结果）
CREATE TABLE IF NOT EXISTS `translation_cache` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `source_text` TEXT NOT NULL COMMENT '原文',
  `source_language` VARCHAR(10) NOT NULL DEFAULT 'en' COMMENT '源语言',
  `target_language` VARCHAR(10) NOT NULL COMMENT '目标语言',
  `translated_text` TEXT NOT NULL COMMENT '译文',
  `provider` VARCHAR(50) DEFAULT 'baidu' COMMENT '翻译提供商',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `used_count` INT(11) DEFAULT 1 COMMENT '使用次数',
  `last_used_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后使用时间',
  PRIMARY KEY (`id`),
  INDEX `idx_source_hash` (`source_language`, `target_language`, `source_text`(255)),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_used_count` (`used_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='翻译缓存表';

-- 添加索引以提高翻译字段查询性能
ALTER TABLE `vps_products` ADD INDEX `idx_has_translation` ((CAST(translated_fields AS CHAR(1))));
ALTER TABLE `categories` ADD INDEX `idx_has_translation` ((CAST(translated_fields AS CHAR(1))));