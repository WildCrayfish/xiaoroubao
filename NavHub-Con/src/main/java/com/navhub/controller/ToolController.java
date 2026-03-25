package com.navhub.controller;

import com.navhub.common.Result;
import com.navhub.entity.Tool;
import com.navhub.service.AuthService;
import com.navhub.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 工具控制器
 */
@RestController
@RequestMapping("/tools")
public class ToolController {

    @Autowired
    private ToolService toolService;

    @Autowired
    private AuthService authService;

    /**
     * 获取所有工具（支持分类和搜索）
     */
    @GetMapping
    public Result<List<Tool>> getAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean includeUnpublished,
            @RequestParam(required = false, defaultValue = "true") Boolean onlyPublished,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String userId = null;
        if (authorization != null && authorization.startsWith("Bearer ")) {
            try {
                String token = authorization.substring(7);
                userId = authService.getUserByToken(token).getId();
            } catch (Exception ignored) {
                userId = null;
            }
        }

        Boolean resolvedOnlyPublished = includeUnpublished != null ? !includeUnpublished : onlyPublished;
        if (Boolean.FALSE.equals(resolvedOnlyPublished)) {
            try {
                authService.requireAdmin(authorization);
            } catch (Exception e) {
                return Result.error(401, e.getMessage());
            }
        }

        List<Tool> tools = toolService.getAll(categoryId, search, resolvedOnlyPublished, userId);
        return Result.success(tools);
    }

    /**
     * 根据ID获取工具
     */
    @GetMapping("/{id}")
    public Result<Tool> getById(@PathVariable String id) {
        Tool tool = toolService.getById(id);
        if (tool == null) {
            return Result.error("工具不存在");
        }
        return Result.success(tool);
    }

    /**
     * 创建工具（管理员）
     */
    @PostMapping
    public Result<Tool> create(
            @RequestBody Tool tool,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            Tool newTool = toolService.create(tool);
            return Result.success(newTool);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 更新工具（管理员）
     */
    @PutMapping("/{id}")
    public Result<Tool> update(
            @PathVariable String id,
            @RequestBody Tool tool,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            Tool updatedTool = toolService.update(id, tool);
            return Result.success(updatedTool);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 删除工具（管理员）
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            toolService.delete(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 切换收藏状态
     */
    @PostMapping("/{id}/favorite")
    public Result<Tool> toggleFavorite(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error(401, "未登录");
        }

        try {
            String token = authorization.substring(7);
            String userId = authService.getUserByToken(token).getId();
            Tool tool = toolService.toggleFavorite(id, userId);
            return Result.success(tool);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 切换发布状态（管理员）
     */
    @PostMapping("/{id}/publish")
    public Result<Tool> togglePublish(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            Tool tool = toolService.togglePublish(id);
            return Result.success(tool);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    /**
     * 批量更新工具排序（管理员）
     * 请求格式：{ "tools": [...] }
     */
    @PutMapping("/reorder")
    public Result<Void> reorder(
            @RequestBody Map<String, Object> requestBody,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            if (!requestBody.containsKey("tools")) {
                return Result.error("请求格式错误，请使用 { \"tools\": [...] } 格式");
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> toolsList = (List<Map<String, Object>>) requestBody.get("tools");
            List<Tool> tools = convertToToolList(toolsList);
            toolService.batchUpdateSort(tools);
            return Result.success();
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }

    private List<Tool> convertToToolList(List<Map<String, Object>> toolsList) {
        return toolsList.stream().map(map -> {
            Tool tool = new Tool();
            if (map.containsKey("id")) {
                tool.setId(map.get("id").toString());
            }
            if (map.containsKey("sort")) {
                Object sortObj = map.get("sort");
                if (sortObj instanceof Number) {
                    tool.setSort(((Number) sortObj).intValue());
                }
            }
            return tool;
        }).collect(java.util.stream.Collectors.toList());
    }
}
