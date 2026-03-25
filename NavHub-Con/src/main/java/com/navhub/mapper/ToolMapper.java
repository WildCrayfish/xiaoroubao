package com.navhub.mapper;

import com.navhub.entity.Tool;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 工具 Mapper
 */
@Mapper
public interface ToolMapper {
    
    /**
     * 查询所有工具（支持分类和搜索）
     */
    List<Tool> findAll(@Param("categoryId") String categoryId, 
                       @Param("search") String search,
                       @Param("onlyPublished") Boolean onlyPublished);
    
    /**
     * 根据ID查询工具
     */
    Tool findById(@Param("id") String id);
    
    /**
     * 插入工具
     */
    int insert(Tool tool);
    
    /**
     * 更新工具
     */
    int update(Tool tool);
    
    /**
     * 删除工具
     */
    int deleteById(@Param("id") String id);
    
    /**
     * 切换发布状态
     */
    int togglePublish(@Param("id") String id, @Param("isPublished") Boolean isPublished);
    
    /**
     * 批量更新工具排序
     */
    int batchUpdateSort(@Param("tools") List<Tool> tools);
}
