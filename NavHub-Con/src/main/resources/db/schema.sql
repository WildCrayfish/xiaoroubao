-- NavHub 数据库表结构

-- 创建数据库（如果不存在）
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
