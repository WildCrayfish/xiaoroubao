package com.navhub.service;

import com.navhub.entity.SiteConfig;
import com.navhub.mapper.SiteConfigMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

/**
 * 站点配置服务
 */
@Service
public class SiteConfigService {
    
    private static final String CONFIG_ID = "site_config_001";
    
    @Autowired
    private SiteConfigMapper siteConfigMapper;
    
    /**
     * 获取站点配置
     */
    public SiteConfig getConfig() {
        System.out.println("🔍 SiteConfigService.getConfig() 被调用，CONFIG_ID: " + CONFIG_ID);
        try {
            SiteConfig config = siteConfigMapper.findById(CONFIG_ID);
            System.out.println("📋 从数据库查询结果: " + (config != null ? config.getSiteName() : "null"));
            if (config == null) {
                // 如果不存在，创建默认配置
                System.out.println("⚠️ 配置不存在，创建默认配置");
                config = createDefaultConfig();
            }
            return config;
        } catch (Exception e) {
            System.err.println("❌ 获取站点配置异常: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 更新站点配置
     */
    public SiteConfig updateConfig(SiteConfig siteConfig) {
        siteConfig.setId(CONFIG_ID);
        siteConfig.setUpdatedAt(LocalDateTime.now());
        
        SiteConfig existing = siteConfigMapper.findById(CONFIG_ID);
        if (existing == null) {
            // 如果不存在，先创建
            siteConfig.setCreatedAt(LocalDateTime.now());
            siteConfigMapper.insert(siteConfig);
            System.out.println("✅ 创建新站点配置: " + siteConfig.getSiteName());
        } else {
            // 更新现有配置 - 确保所有字段都被设置
            // 如果前端只传递了部分字段，需要合并现有配置
            // 但是，如果前端明确传递了某个字段（即使是空字符串），也要使用前端传递的值
            
            System.out.println("🔍 检查接收到的配置字段:");
            System.out.println("  - 接收到的siteName: " + (siteConfig.getSiteName() != null ? siteConfig.getSiteName() : "null"));
            System.out.println("  - 接收到的siteTitle: " + (siteConfig.getSiteTitle() != null ? siteConfig.getSiteTitle() : "null"));
            System.out.println("  - 接收到的siteLogo: " + (siteConfig.getSiteLogo() != null ? 
                (siteConfig.getSiteLogo().length() > 100 ? siteConfig.getSiteLogo().substring(0, 100) + "..." : siteConfig.getSiteLogo()) : "null"));
            System.out.println("  - 接收到的siteLogo长度: " + (siteConfig.getSiteLogo() != null ? siteConfig.getSiteLogo().length() : 0));
            
            // 使用反射检查字段是否被设置（通过检查是否在JSON中存在）
            // 如果前端传递了字段，即使值为null，也应该更新
            // 这里我们假设如果字段不为null，就是前端传递的
            
            if (siteConfig.getSiteName() == null) {
                siteConfig.setSiteName(existing.getSiteName());
            }
            if (siteConfig.getSiteTitle() == null) {
                siteConfig.setSiteTitle(existing.getSiteTitle());
            }
            // siteLogo 特殊处理：如果为null，使用现有值；否则使用新值（包括空字符串）
            if (siteConfig.getSiteLogo() == null) {
                System.out.println("⚠️ siteLogo为null，使用现有值: " + existing.getSiteLogo());
                siteConfig.setSiteLogo(existing.getSiteLogo());
            } else {
                System.out.println("✅ siteLogo不为null，使用新值，长度: " + siteConfig.getSiteLogo().length());
            }
            if (siteConfig.getSiteDescription() == null) {
                siteConfig.setSiteDescription(existing.getSiteDescription());
            }
            if (siteConfig.getIcpRecord() == null) {
                siteConfig.setIcpRecord(existing.getIcpRecord());
            }
            if (siteConfig.getPublicSecurityRecord() == null) {
                siteConfig.setPublicSecurityRecord(existing.getPublicSecurityRecord());
            }
            if (siteConfig.getPublicSecurityRecordUrl() == null) {
                siteConfig.setPublicSecurityRecordUrl(existing.getPublicSecurityRecordUrl());
            }
            
            System.out.println("🔄 更新站点配置（合并后）:");
            System.out.println("  - 站点名称: " + siteConfig.getSiteName());
            System.out.println("  - 站点标题: " + siteConfig.getSiteTitle());
            System.out.println("  - 站点Logo: " + (siteConfig.getSiteLogo() != null ? 
                (siteConfig.getSiteLogo().length() > 50 ? siteConfig.getSiteLogo().substring(0, 50) + "..." : siteConfig.getSiteLogo()) : "null"));
            System.out.println("  - 站点Logo长度: " + (siteConfig.getSiteLogo() != null ? siteConfig.getSiteLogo().length() : 0));
            System.out.println("  - 站点Logo类型: " + (siteConfig.getSiteLogo() != null && siteConfig.getSiteLogo().startsWith("data:image/") ? "base64" : "URL"));
            
            siteConfigMapper.update(siteConfig);
            System.out.println("✅ 站点配置更新完成");
        }
        
        SiteConfig updated = siteConfigMapper.findById(CONFIG_ID);
        System.out.println("📋 查询更新后的配置:");
        System.out.println("  - 站点名称: " + (updated != null ? updated.getSiteName() : "null"));
        System.out.println("  - 站点Logo: " + (updated != null && updated.getSiteLogo() != null ? 
            (updated.getSiteLogo().length() > 50 ? updated.getSiteLogo().substring(0, 50) + "..." : updated.getSiteLogo()) : "null"));
        System.out.println("  - 站点Logo长度: " + (updated != null && updated.getSiteLogo() != null ? updated.getSiteLogo().length() : 0));
        return updated;
    }
    
    /**
     * 创建默认配置
     */
    private SiteConfig createDefaultConfig() {
        SiteConfig config = new SiteConfig();
        config.setId(CONFIG_ID);
        config.setSiteName("NavHub");
        config.setSiteTitle("NavHub - 精选网站导航");
        config.setSiteLogo("/assets/logo.png");
        config.setSiteDescription("发现优质网站，提升工作效率。汇聚设计、开发、工具等各类精选网站资源。");
        config.setIcpRecord("");
        config.setPublicSecurityRecord("");
        config.setPublicSecurityRecordUrl("");
        config.setCreatedAt(LocalDateTime.now());
        config.setUpdatedAt(LocalDateTime.now());
        
        siteConfigMapper.insert(config);
        return config;
    }
}

