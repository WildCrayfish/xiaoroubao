-- 修改 tool 和 category 表的 icon 字段类型，支持 URL 格式的图标
-- 用于支持自动获取的网站图标URL（长度可能超过10个字符）

USE navhub;

-- 修改 tool 表的 icon 字段类型，从 VARCHAR(10) 改为 VARCHAR(500)
ALTER TABLE `tool` 
MODIFY COLUMN `icon` VARCHAR(500) COMMENT '图标（Emoji 或 URL）';

-- 修改 category 表的 icon 字段类型，从 VARCHAR(10) 改为 VARCHAR(500)
ALTER TABLE `category` 
MODIFY COLUMN `icon` VARCHAR(500) COMMENT '图标（Emoji 或 URL）';

