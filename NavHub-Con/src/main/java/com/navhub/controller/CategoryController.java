package com.navhub.controller;

import com.navhub.common.Result;
import com.navhub.entity.Category;
import com.navhub.service.AuthService;
import com.navhub.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AuthService authService;

    /**
     * 获取所有分类
     */
    @GetMapping
    public Result<List<Category>> getAll() {
        List<Category> categories = categoryService.getAll();
        return Result.success(categories);
    }

    /**
     * 根据ID获取分类
     */
    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable String id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }
        return Result.success(category);
    }

    /**
     * 创建分类（管理员）
     */
    @PostMapping
    public Result<Category> create(
            @RequestBody Category category,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            Category newCategory = categoryService.create(category);
            return Result.success(newCategory);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 更新分类（管理员）
     */
    @PutMapping("/{id}")
    public Result<Category> update(
            @PathVariable String id,
            @RequestBody Category category,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            Category updatedCategory = categoryService.update(id, category);
            return Result.success(updatedCategory);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 删除分类（管理员）
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            categoryService.delete(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }
}