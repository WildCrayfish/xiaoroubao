package com.navhub.service;

import com.navhub.entity.Category;
import com.navhub.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * 分类服务
 */
@Service
public class CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    /**
     * 获取所有分类
     */
    public List<Category> getAll() {
        return categoryMapper.findAll();
    }
    
    /**
     * 根据ID获取分类
     */
    public Category getById(String id) {
        return categoryMapper.findById(id);
    }
    
    /**
     * 创建分类
     */
    public Category create(Category category) {
        category.setId(UUID.randomUUID().toString());
        category.setCreatedAt(java.time.LocalDateTime.now());
        category.setUpdatedAt(java.time.LocalDateTime.now());
        if (category.getIsVisible() == null) {
            category.setIsVisible(true);
        }
        if (category.getSort() == null) {
            category.setSort(0);
        }
        categoryMapper.insert(category);
        return category;
    }
    
    /**
     * 更新分类
     */
    public Category update(String id, Category category) {
        category.setId(id);
        category.setUpdatedAt(java.time.LocalDateTime.now());
        categoryMapper.update(category);
        return categoryMapper.findById(id);
    }
    
    /**
     * 删除分类
     */
    public void delete(String id) {
        categoryMapper.deleteById(id);
    }
}
