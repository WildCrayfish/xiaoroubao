package com.navhub.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 站点配置实体
 */
@Data
public class SiteConfig {
    /**
     * 配置ID（固定值：site_config_001）
     */
    private String id;
    
    /**
     * 站点名称
     */
    private String siteName;
    
    /**
     * 站点标题
     */
    private String siteTitle;
    
    /**
     * 站点Logo（URL或base64）
     */
    private String siteLogo;
    
    /**
     * 站点描述
     */
    private String siteDescription;
    
    /**
     * ICP备案号
     */
    private String icpRecord;
    
    /**
     * 公安备案号
     */
    private String publicSecurityRecord;
    
    /**
     * 公安备案链接
     */
    private String publicSecurityRecordUrl;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}

