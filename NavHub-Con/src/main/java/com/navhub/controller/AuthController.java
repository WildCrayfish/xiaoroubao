package com.navhub.controller;

import com.navhub.common.Result;
import com.navhub.entity.User;
import com.navhub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 处理用户登录、注销、获取用户信息等认证相关接口
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * 用户登录
     * 
     * 请求示例：
     * POST /api/auth/login
     * Content-Type: application/json
     * {
     *   "username": "admin",
     *   "password": "admin123"
     * }
     * 
     * 响应示例：
     * {
     *   "code": 0,
     *   "message": "ok",
     *   "data": {
     *     "token": "eyJhbGciOiJIUzUxMiJ9...",
     *     "user": {
     *       "id": "1",
     *       "username": "admin",
     *       "email": "admin@navhub.com",
     *       "isAdmin": true
     *     }
     *   }
     * }
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        // 参数验证
        String username = request.get("username");
        String password = request.get("password");
        
        if (!StringUtils.hasText(username)) {
            return Result.error("用户名不能为空");
        }
        
        if (!StringUtils.hasText(password)) {
            return Result.error("密码不能为空");
        }
        
        // 去除空格
        username = username.trim();
        password = password.trim();
        
        try {
            // 调用服务层进行登录验证
            String token = authService.login(username, password);
            
            // 根据 Token 获取用户信息（不包含密码）
            User user = authService.getUserByToken(token);

            // 构建返回数据
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            
            return Result.success(data);
        } catch (RuntimeException e) {
            // 业务异常（用户名或密码错误）

            return Result.error(e.getMessage());
            //return Result.error("登录失败，请稍后重试");

        } catch (Exception e) {
            // 系统异常
            return Result.error("登录失败，请稍后重试");
        }
    }
    
    /**
     * 用户注销
     * 
     * 请求示例：
     * POST /api/auth/logout
     * Authorization: Bearer <token>
     * 
     * 响应示例：
     * {
     *   "code": 0,
     *   "message": "ok",
     *   "data": null
     * }
     * 
     * 说明：JWT 是无状态的，注销主要是在客户端删除 Token。
     * 如果需要服务端注销，可以实现 Token 黑名单机制。
     */
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        // JWT 是无状态的，注销主要是在客户端删除 Token
        // 这里可以添加 Token 验证，确保 Token 有效
        if (authorization != null && authorization.startsWith("Bearer ")) {
            try {
                String token = authorization.substring(7);
                // 验证 Token 是否有效（可选）
                authService.validateToken(token);
                // 如果需要实现服务端注销，可以在这里将 Token 加入黑名单
            } catch (Exception e) {
                // Token 无效，但注销操作仍然返回成功
                // 因为客户端可能已经删除了 Token
            }
        }
        
        return Result.success();
    }
    
    /**
     * 获取当前用户信息
     * 
     * 请求示例：
     * GET /api/auth/me
     * Authorization: Bearer <token>
     * 
     * 响应示例：
     * {
     *   "code": 0,
     *   "message": "ok",
     *   "data": {
     *     "id": "1",
     *     "username": "admin",
     *     "email": "admin@navhub.com",
     *     "isAdmin": true,
     *     "avatar": null,
     *     "createdAt": "2024-01-01 00:00:00",
     *     "updatedAt": "2024-01-01 00:00:00"
     *   }
     * }
     */
    @GetMapping("/me")
    public Result<User> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authorization) {
        // 验证请求头
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error(401, "未登录或 Token 格式错误");
        }
        
        try {
            // 提取 Token
            String token = authorization.substring(7);
            
            // 验证并获取用户信息
            User user = authService.getUserByToken(token);
            
            if (user == null) {
                return Result.error(401, "用户不存在");
            }
            
            return Result.success(user);
        } catch (RuntimeException e) {
            // Token 无效或过期
            return Result.error(401, e.getMessage());
        } catch (Exception e) {
            // 系统异常
            return Result.error(500, "获取用户信息失败");
        }
    }
}
