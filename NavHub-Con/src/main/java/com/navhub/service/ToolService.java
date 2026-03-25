package com.navhub.service;

import com.navhub.entity.Tool;
import com.navhub.mapper.ToolMapper;
import com.navhub.mapper.FavoriteMapper;
import com.navhub.entity.Favorite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * 工具服务
 */
@Service
public class ToolService {
    
    @Autowired
    private ToolMapper toolMapper;
    
    @Autowired
    private FavoriteMapper favoriteMapper;
    
    /**
     * 获取所有工具（支持分类和搜索）
     */
    public List<Tool> getAll(String categoryId, String search, Boolean onlyPublished, String userId) {
        List<Tool> tools = toolMapper.findAll(categoryId, search, onlyPublished);
        
        // 转换 tags 字段：从 JSON 字符串转换为 List
        for (Tool tool : tools) {
            convertTagsFromJson(tool);
        }

        // 标记收藏状态
        if (userId != null && !userId.isEmpty()) {
            List<String> favoriteToolIds = favoriteMapper.findToolIdsByUserId(userId);
            java.util.Set<String> favoriteSet = new java.util.HashSet<>(favoriteToolIds);
            for (Tool tool : tools) {
                tool.setIsFavorite(favoriteSet.contains(tool.getId()));
            }
        } else {
            for (Tool tool : tools) {
                tool.setIsFavorite(false);
            }
        }

        return tools;
    }
    
    /**
     * 根据ID获取工具
     */
    public Tool getById(String id) {
        return toolMapper.findById(id);
    }
    
    /**
     * 创建工具
     */
    public Tool create(Tool tool) {
        tool.setId(UUID.randomUUID().toString());
        tool.setCreatedAt(java.time.LocalDateTime.now());
        tool.setUpdatedAt(java.time.LocalDateTime.now());
        if (tool.getIsPublished() == null) {
            tool.setIsPublished(true);
        }
        if (tool.getIsOnline() == null) {
            tool.setIsOnline(true);
        }
        if (tool.getSort() == null) {
            tool.setSort(0);
        }
        // 处理 tags 字段：如果是 List，转换为 JSON 字符串
        tool = convertTagsToJson(tool);
        toolMapper.insert(tool);
        return convertTagsFromJson(tool);
    }
    
    /**
     * 更新工具
     */
    public Tool update(String id, Tool tool) {
        tool.setId(id);
        tool.setUpdatedAt(java.time.LocalDateTime.now());
        
        // 处理 tags 字段：如果是 List，转换为 JSON 字符串
        tool = convertTagsToJson(tool);
        toolMapper.update(tool);
        
        // 查询更新后的工具
        Tool updatedTool = toolMapper.findById(id);
        
        return convertTagsFromJson(updatedTool);
    }
    
    /**
     * 删除工具
     */
    public void delete(String id) {
        toolMapper.deleteById(id);
    }
    
    /**
     * 切换发布状态
     */
    public Tool togglePublish(String id) {
        Tool tool = toolMapper.findById(id);
        if (tool == null) {
            throw new RuntimeException("工具不存在");
        }
        Boolean newStatus = !tool.getIsPublished();
        toolMapper.togglePublish(id, newStatus);
        return toolMapper.findById(id);
    }
    
    /**
     * 切换收藏状态
     */
    public Tool toggleFavorite(String toolId, String userId) {
        Favorite favorite = favoriteMapper.findByUserIdAndToolId(userId, toolId);
        Tool tool = toolMapper.findById(toolId);

        if (tool == null) {
            throw new RuntimeException("工具不存在");
        }
        
        if (favorite == null) {
            // 添加收藏
            Favorite newFavorite = new Favorite();
            newFavorite.setId(UUID.randomUUID().toString());
            newFavorite.setUserId(userId);
            newFavorite.setToolId(toolId);
            newFavorite.setCreatedAt(java.time.LocalDateTime.now());
            favoriteMapper.insert(newFavorite);
            tool.setIsFavorite(true);
        } else {
            // 取消收藏
            favoriteMapper.delete(userId, toolId);
            tool.setIsFavorite(false);
        }

        return convertTagsFromJson(tool);
    }
    
    /**
     * 批量更新工具排序
     */
    @Transactional
    public void batchUpdateSort(List<Tool> tools) {
        if (tools == null || tools.isEmpty()) {
            return;
        }
        toolMapper.batchUpdateSort(tools);
    }
    
    /**
     * 将 tags 从 List 转换为 JSON 字符串（用于存储到数据库）
     */
    private Tool convertTagsToJson(Tool tool) {
        // 如果 tags 字段已经是 JSON 字符串，直接返回
        // 这里假设前端传入的 tags 可能是 JSON 字符串或需要转换
        // 实际使用时，前端应该传入 JSON 字符串格式的 tags
        return tool;
    }
    
    /**
     * 将 tags 从 JSON 字符串转换为 List（用于返回给前端）
     * 注意：这里不实际转换，因为前端期望的是 JSON 字符串，可以直接解析
     * 如果需要，可以在这里添加转换逻辑
     */
    private Tool convertTagsFromJson(Tool tool) {
        // tags 字段在数据库中存储为 JSON 字符串
        // 前端可以直接使用 JSON.parse() 解析
        // 如果需要在这里转换为 List，可以使用 objectMapper
        return tool;
    }
}
