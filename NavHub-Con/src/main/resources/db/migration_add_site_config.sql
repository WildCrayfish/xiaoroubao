-- 创建站点配置表
-- 用于存储系统设置信息（站点名称、标题、Logo、描述、备案信息等）

USE navhub;

-- 站点配置表（单条记录，使用固定ID）
CREATE TABLE IF NOT EXISTS `site_config` (
    `id` VARCHAR(64) PRIMARY KEY DEFAULT 'site_config_001' COMMENT '配置ID（固定值）',
    `site_name` VARCHAR(100) DEFAULT 'NavHub' COMMENT '站点名称',
    `site_title` VARCHAR(200) DEFAULT 'NavHub - 精选网站导航' COMMENT '站点标题',
    `site_logo` VARCHAR(500) DEFAULT '/assets/logo.png' COMMENT '站点Logo（URL或base64）',
    `site_description` TEXT COMMENT '站点描述',
    `icp_record` VARCHAR(100) DEFAULT '' COMMENT 'ICP备案号',
    `public_security_record` VARCHAR(100) DEFAULT '' COMMENT '公安备案号',
    `public_security_record_url` VARCHAR(500) DEFAULT '' COMMENT '公安备案链接',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点配置表';

-- 插入默认配置（如果不存在）
INSERT INTO `site_config` (`id`, `site_name`, `site_title`, `site_logo`, `site_description`, `icp_record`, `public_security_record`, `public_security_record_url`)
VALUES (
    'site_config_001',
    'NavHub',
    'NavHub - 精选网站导航',
    '/assets/logo.png',
    '发现优质网站，提升工作效率。汇聚设计、开发、工具等各类精选网站资源。',
    '',
    '',
    ''
)
ON DUPLICATE KEY UPDATE `id` = `id`;

