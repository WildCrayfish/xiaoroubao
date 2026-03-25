package com.navhub.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 分类实体
 */
@Data
public class Category {
    /**
     * 分类ID
     */
    private String id;
    
    /**
     * 分类名称
     */
    private String name;
    
    /**
     * 图标（可选）
     */
    private String icon;
    
    /**
     * 排序序号
     */
    private Integer sort;
    
    /**
     * 是否可见
     */
    private Boolean isVisible;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
