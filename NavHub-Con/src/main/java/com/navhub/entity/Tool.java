package com.navhub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 工具实体
 */
@Data
public class Tool {
    /**
     * 工具ID
     */
    private String id;

    /**
     * 是否收藏（仅用于前端展示，不持久化到 tool 表）
     */
    private Boolean isFavorite;

    /**
     * 工具名称
     */
    private String name;

    /**
     * 描述
     */
    private String description;

    /**
     * 链接URL
     */
    private String url;

    /**
     * 图标（Emoji）
     */
    private String icon;

    /**
     * 分类ID
     */
    private String categoryId;

    /**
     * 标签数组（数据库中以JSON格式存储）
     * 这个字段用于数据库读写，不直接暴露给前端
     */
    @JsonIgnore
    private String tagsJson;

    /**
     * 标签数组（前端使用）
     * 这个字段会自动转换为JSON数组返回给前端
     */
    @JsonProperty("tags")
    public List<String> getTags() {
        if (tagsJson == null || tagsJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(tagsJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    /**
     * 设置标签数组（前端传入）
     * 自动转换为JSON字符串存储到数据库
     */
    @JsonProperty("tags")
    public void setTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            this.tagsJson = null;
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.tagsJson = mapper.writeValueAsString(tags);
        } catch (JsonProcessingException e) {
            this.tagsJson = null;
        }
    }

    /**
     * 是否已发布
     */
    private Boolean isPublished;

    /**
     * 是否在线（状态检测）
     */
    private Boolean isOnline;

    /**
     * 排序序号
     */
    private Integer sort;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    /**
     * 设置标签数组（前端传入）
     * 自动转换为JSON字符串存储到数据库
     */
    @JsonProperty("tags")
    public void setTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            this.tagsJson = null;
            return;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.tagsJson = mapper.writeValueAsString(tags);
        } catch (JsonProcessingException e) {
            this.tagsJson = null;
        }
    }

    /**
     * 是否已发布
     */
    private Boolean isPublished;

    /**
     * 是否在线（状态检测）
     */
    private Boolean isOnline;

    /**
     * 排序序号
     */
    private Integer sort;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}