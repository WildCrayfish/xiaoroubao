-- NavHub 数据库完整初始化脚本
-- 使用方法：mysql -u root -p < init.sql

-- 创建数据库
CREATE DATABASE IF NOT EXISTS navhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE navhub;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` VARCHAR(64) PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码（加密后）',
    `email` VARCHAR(100) COMMENT '邮箱',
    `is_admin` TINYINT(1) DEFAULT 0 COMMENT '是否为管理员（0-否，1-是）',
    `avatar` VARCHAR(255) COMMENT '头像URL',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 分类表
CREATE TABLE IF NOT EXISTS `category` (
    `id` VARCHAR(64) PRIMARY KEY COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `icon` VARCHAR(10) COMMENT '图标（Emoji）',
    `sort` INT DEFAULT 0 COMMENT '排序序号',
    `is_visible` TINYINT(1) DEFAULT 1 COMMENT '是否可见（0-否，1-是）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 工具表
CREATE TABLE IF NOT EXISTS `tool` (
    `id` VARCHAR(64) PRIMARY KEY COMMENT '工具ID',
    `name` VARCHAR(100) NOT NULL COMMENT '工具名称',
    `description` TEXT COMMENT '描述',
    `url` VARCHAR(500) NOT NULL COMMENT '链接URL',
    `icon` VARCHAR(10) COMMENT '图标（Emoji）',
    `category_id` VARCHAR(64) NOT NULL COMMENT '分类ID',
    `is_published` TINYINT(1) DEFAULT 1 COMMENT '是否已发布（0-否，1-是）',
    `is_online` TINYINT(1) DEFAULT 1 COMMENT '是否在线（0-否，1-是）',
    `sort` INT DEFAULT 0 COMMENT '排序序号',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_is_published` (`is_published`),
    INDEX `idx_sort` (`sort`),
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具表';

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorite` (
    `id` VARCHAR(64) PRIMARY KEY COMMENT '收藏ID',
    `user_id` VARCHAR(64) NOT NULL COMMENT '用户ID',
    `tool_id` VARCHAR(64) NOT NULL COMMENT '工具ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_user_tool` (`user_id`, `tool_id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_tool_id` (`tool_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tool_id`) REFERENCES `tool`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 插入默认管理员用户（密码：admin123，MD5：0192023a7bbd73250516f069df18b500）
INSERT INTO `user` (`id`, `username`, `password`, `email`, `is_admin`, `created_at`, `updated_at`) VALUES
('1', 'admin', '0192023a7bbd73250516f069df18b500', 'admin@navhub.com', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `username` = `username`;

-- 插入默认分类
INSERT INTO `category` (`id`, `name`, `icon`, `sort`, `is_visible`, `created_at`, `updated_at`) VALUES
('music', '免费听歌', '🎵', 1, 1, NOW(), NOW()),
('video', '免费看剧', '🎬', 2, 1, NOW(), NOW()),
('download', '下载工具', '💾', 3, 1, NOW(), NOW()),
('tools', '在线工具', '🔧', 4, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = `name`;

-- 插入示例工具数据
INSERT INTO `tool` (`id`, `name`, `description`, `url`, `icon`, `category_id`, `is_published`, `is_online`, `sort`, `created_at`, `updated_at`) VALUES
('1', 'Spotify', '全球最大的音乐流媒体平台，海量正版音乐随心听', 'https://spotify.com', '🎵', 'music', 1, 1, 1, NOW(), NOW()),
('2', 'YouTube Music', 'YouTube官方音乐服务，MV和音频自由切换', 'https://music.youtube.com', '🎶', 'music', 1, 1, 2, NOW(), NOW()),
('3', 'Netflix', '全球领先的流媒体视频平台，海量影视作品', 'https://netflix.com', '🎬', 'video', 1, 1, 1, NOW(), NOW()),
('4', 'Disney+', '迪士尼官方流媒体服务，漫威、星战全收录', 'https://disneyplus.com', '🏰', 'video', 1, 1, 2, NOW(), NOW()),
('5', 'VS Code', '微软出品的强大代码编辑器，开发者必备工具', 'https://code.visualstudio.com', '💻', 'download', 1, 1, 1, NOW(), NOW()),
('6', 'Figma', '在线协作设计工具，UI/UX设计师首选', 'https://figma.com', '🎨', 'tools', 1, 1, 1, NOW(), NOW()),
('7', 'Notion', '强大的笔记和协作工具，个人和团队都适用', 'https://notion.so', '📝', 'tools', 1, 1, 2, NOW(), NOW()),
('8', 'Canva', '在线图形设计平台，海量模板一键生成', 'https://canva.com', '🖼️', 'tools', 1, 1, 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = `name`;

-- 显示创建结果
SELECT 'Database initialized successfully!' AS message;
SELECT COUNT(*) AS user_count FROM user;
SELECT COUNT(*) AS category_count FROM category;
SELECT COUNT(*) AS tool_count FROM tool;
