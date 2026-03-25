package com.navhub.mapper;

import com.navhub.entity.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 分类 Mapper
 */
@Mapper
public interface CategoryMapper {
    
    /**
     * 查询所有分类（按排序）
     */
    List<Category> findAll();
    
    /**
     * 根据ID查询分类
     */
    Category findById(String id);
    
    /**
     * 插入分类
     */
    int insert(Category category);
    
    /**
     * 更新分类
     */
    int update(Category category);
    
    /**
     * 删除分类
     */
    int deleteById(String id);
}
