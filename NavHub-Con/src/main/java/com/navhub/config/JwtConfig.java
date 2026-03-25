package com.navhub.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具类
 * 用于生成和解析 Token
 */
@Component
public class JwtConfig {
    
    // 默认密钥：至少 64 个字符（512 位）用于 HS512，或 32 个字符（256 位）用于 HS256
    @Value("${jwt.secret:NavHubSecretKeyForJWTTokenGenerationMustBeAtLeast64CharactersLongForHS512Algorithm}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}") // 默认 24 小时
    private Long expiration;
    
    /**
     * 获取签名密钥
     * 确保密钥长度符合算法要求
     */
    private SecretKey getSigningKey() {
        // 如果密钥长度不够，使用 HS256（需要 256 位 = 32 字符）
        // 如果密钥长度足够，使用 HS512（需要 512 位 = 64 字符）
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        
        // 如果密钥长度 >= 64 字符，使用 HS512
        if (keyBytes.length >= 64) {
            return Keys.hmacShaKeyFor(keyBytes);
        } else if (keyBytes.length >= 32) {
            // 如果密钥长度 >= 32 字符但 < 64 字符，使用 HS256
            return Keys.hmacShaKeyFor(keyBytes);
        } else {
            // 如果密钥太短，抛出异常
            throw new IllegalArgumentException("JWT 密钥长度不足，HS256 需要至少 32 个字符，HS512 需要至少 64 个字符");
        }
    }
    
    /**
     * 获取签名算法
     */
    private SignatureAlgorithm getSignatureAlgorithm() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        // 如果密钥长度 >= 64 字符，使用 HS512，否则使用 HS256
        return keyBytes.length >= 64 ? SignatureAlgorithm.HS512 : SignatureAlgorithm.HS256;
    }
    
    /**
     * 生成 Token
     */
    public String generateToken(String userId, String username, Boolean isAdmin) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        SecretKey key = getSigningKey();
        SignatureAlgorithm algorithm = getSignatureAlgorithm();
        
        return Jwts.builder()
                .setSubject(userId)
                .claim("username", username)
                .claim("isAdmin", isAdmin)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, algorithm)
                .compact();
    }
    
    /**
     * 解析 Token
     */
    public Claims parseToken(String token) {
        SecretKey key = getSigningKey();
        
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * 从 Token 中获取用户ID
     */
    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }
    
    /**
     * 验证 Token 是否有效
     */
    public Boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
