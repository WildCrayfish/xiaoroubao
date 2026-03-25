-- NavHub 初始数据

USE navhub;

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
