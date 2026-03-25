package com.navhub.service;

import com.navhub.config.JwtConfig;
import com.navhub.entity.User;
import com.navhub.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * 认证服务
 */
@Service
public class AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtConfig jwtConfig;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 用户登录
     */
    public String login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        String storedPassword = user.getPassword();
        if (storedPassword == null || storedPassword.trim().isEmpty()) {
            throw new RuntimeException("用户名或密码错误");
        }

        boolean passwordMatched;
        if (isBcryptHash(storedPassword)) {
            passwordMatched = passwordEncoder.matches(password, storedPassword);
        } else {
            String md5Password = DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8));
            passwordMatched = md5Password.equals(storedPassword);

            // 兼容旧 MD5 数据：登录成功后自动升级为 BCrypt
            if (passwordMatched) {
                user.setPassword(passwordEncoder.encode(password));
                userMapper.update(user);
            }
        }

        if (!passwordMatched) {
            throw new RuntimeException("用户名或密码错误");
        }

        return jwtConfig.generateToken(user.getId(), user.getUsername(), user.getIsAdmin());
    }

    /**
     * 根据 Token 获取用户信息
     */
    public User getUserByToken(String token) {
        try {
            if (!jwtConfig.validateToken(token)) {
                throw new RuntimeException("Token 无效或已过期");
            }

            String userId = jwtConfig.getUserIdFromToken(token);
            User user = userMapper.findById(userId);
            if (user == null) {
                throw new RuntimeException("用户不存在");
            }

            user.setPassword(null);
            return user;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Token 无效或已过期");
        }
    }

    /**
     * 验证 Token 是否有效
     */
    public boolean validateToken(String token) {
        return jwtConfig.validateToken(token);
    }

    /**
     * 要求管理员权限
     */
    public User requireAdmin(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("未登录");
        }
        String token = authorization.substring(7);
        User user = getUserByToken(token);
        if (!Boolean.TRUE.equals(user.getIsAdmin())) {
            throw new RuntimeException("无管理员权限");
        }
        return user;
    }

    /**
     * 注册用户（可选功能）
     */
    public User register(String username, String password, String email) {
        if (userMapper.findByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setIsAdmin(false);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(java.time.LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }

    private boolean isBcryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}