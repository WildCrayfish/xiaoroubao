-- 为 tool 表添加 tags 字段
-- 用于存储工具的标签数组（JSON 格式）

USE navhub;

-- 添加 tags 字段（JSON 类型，MySQL 5.7+ 支持）
ALTER TABLE `tool` 
ADD COLUMN `tags` JSON COMMENT '标签数组（JSON格式）' AFTER `category_id`;

-- 为 tags 字段添加索引（MySQL 5.7+ 支持 JSON 索引）
-- 注意：如果 MySQL 版本低于 5.7，可以使用 TEXT 类型替代
-- ALTER TABLE `tool` ADD COLUMN `tags` TEXT COMMENT '标签数组（JSON格式）' AFTER `category_id`;

