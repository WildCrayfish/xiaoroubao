package com.navhub.mapper;

import com.navhub.entity.SiteConfig;
import org.apache.ibatis.annotations.Mapper;

/**
 * 站点配置Mapper
 */
@Mapper
public interface SiteConfigMapper {
    /**
     * 获取站点配置（固定ID）
     */
    SiteConfig findById(String id);
    
    /**
     * 更新站点配置
     */
    int update(SiteConfig siteConfig);
    
    /**
     * 插入站点配置
     */
    int insert(SiteConfig siteConfig);
}

