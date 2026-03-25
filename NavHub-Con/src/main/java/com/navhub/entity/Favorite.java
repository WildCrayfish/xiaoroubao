package com.navhub.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 收藏实体
 */
@Data
public class Favorite {
    /**
     * 收藏ID
     */
    private String id;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 工具ID
     */
    private String toolId;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}
