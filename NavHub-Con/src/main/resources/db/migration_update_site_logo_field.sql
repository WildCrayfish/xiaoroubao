-- 修改 site_logo 字段类型，支持更长的base64字符串
-- base64编码的图片可能很长，VARCHAR(500)不够用，改为TEXT类型

USE navhub;

-- 修改 site_logo 字段类型，从 VARCHAR(500) 改为 TEXT
ALTER TABLE `site_config` 
MODIFY COLUMN `site_logo` TEXT COMMENT '站点Logo（URL或base64）';

