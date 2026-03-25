# NavHub 后端技术文档

> **版本**: v1.0.0  
> **技术栈**: Spring Boot 2.7.18 + MyBatis 2.3.1 + MySQL 8.0

---

## 📋 目录

1. [项目结构](#项目结构)
2. [技术栈详解](#技术栈详解)
3. [核心模块](#核心模块)
4. [数据访问层](#数据访问层)
5. [业务逻辑层](#业务逻辑层)
6. [控制器层](#控制器层)
7. [配置说明](#配置说明)
8. [开发指南](#开发指南)

---

## 📁 项目结构

```
NavHub-Con/
├── src/
│   ├── main/
│   │   ├── java/com/navhub/
│   │   │   ├── NavHubApplication.java      # 应用入口
│   │   │   │
│   │   │   ├── controller/                 # 控制器层
│   │   │   │   ├── AuthController.java     # 认证控制器
│   │   │   │   ├── ToolController.java     # 工具控制器
│   │   │   │   ├── CategoryController.java # 分类控制器
│   │   │   │   └── SiteConfigController.java # 站点配置控制器
│   │   │   │
│   │   │   ├── service/                    # 业务逻辑层
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── ToolService.java
│   │   │   │   ├── CategoryService.java
│   │   │   │   └── SiteConfigService.java
│   │   │   │
│   │   │   ├── mapper/                     # 数据访问层
│   │   │   │   ├── UserMapper.java
│   │   │   │   ├── ToolMapper.java
│   │   │   │   ├── CategoryMapper.java
│   │   │   │   ├── FavoriteMapper.java
│   │   │   │   └── SiteConfigMapper.java
│   │   │   │
│   │   │   ├── entity/                     # 实体类
│   │   │   │   ├── User.java
│   │   │   │   ├── Tool.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Favorite.java
│   │   │   │   └── SiteConfig.java
│   │   │   │
│   │   │   ├── common/                     # 通用类
│   │   │   │   ├── Result.java            # 统一响应格式
│   │   │   │   └── GlobalExceptionHandler.java # 全局异常处理
│   │   │   │
│   │   │   └── config/                     # 配置类
│   │   │       ├── CorsConfig.java         # 跨域配置
│   │   │       ├── JwtConfig.java          # JWT 配置
│   │   │       └── WebMvcConfig.java       # Web MVC 配置
│   │   │
│   │   └── resources/
│   │       ├── mapper/                     # MyBatis XML 映射文件
│   │       │   ├── UserMapper.xml
│   │       │   ├── ToolMapper.xml
│   │       │   ├── CategoryMapper.xml
│   │       │   ├── FavoriteMapper.xml
│   │       │   └── SiteConfigMapper.xml
│   │       │
│   │       ├── db/                         # 数据库脚本
│   │       │   ├── schema.sql              # 表结构
│   │       │   ├── data.sql                # 初始数据
│   │       │   └── migration_*.sql         # 迁移脚本
│   │       │
│   │       ├── application.yml             # 主配置文件
│   │       ├── application-dev.yml         # 开发环境配置
│   │       └── application-prod.yml        # 生产环境配置
│   │
│   └── test/                               # 测试代码
│
├── pom.xml                                 # Maven 配置
└── README.md                               # 项目说明
```

---

## 🛠️ 技术栈详解

### 核心框架

#### 1. Spring Boot 2.7.18

**用途**: 应用框架

**核心特性**:
- 自动配置
- 内嵌服务器 (Tomcat)
- 依赖管理
- 生产就绪特性

**主要依赖**:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

#### 2. MyBatis 2.3.1

**用途**: ORM 框架

**核心特性**:
- SQL 映射
- 动态 SQL
- 结果映射
- 缓存机制

**配置示例**:
```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.navhub.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

#### 3. MySQL 8.0.33

**用途**: 关系型数据库

**核心特性**:
- ACID 事务
- 索引优化
- 外键约束
- JSON 支持

**连接配置**:
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/navhub?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

#### 4. JWT (io.jsonwebtoken 0.11.5)

**用途**: 认证方案

**核心特性**:
- 无状态认证
- Token 生成
- Token 验证
- 过期控制

**JWT 配置**:
```java
@Configuration
public class JwtConfig {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS512)
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}
```

---

## 🎯 核心模块

### 1. 认证模块

#### AuthController
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request.getUsername(), request.getPassword());
            User user = authService.getUserByUsername(request.getUsername());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);
            
            return Result.success(data);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public Result<User> me(@RequestHeader("Authorization") String authorization) {
        try {
            String token = authorization.substring(7); // 移除 "Bearer "
            User user = authService.getUserByToken(token);
            return Result.success(user);
        } catch (Exception e) {
            return Result.error(401, "未登录");
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public Result<Void> logout() {
        // JWT 无状态，前端删除 token 即可
        return Result.success();
    }
}
```

#### AuthService
```java
@Service
public class AuthService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    /**
     * 用户登录
     */
    public String login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 验证密码 (使用 BCrypt)
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 生成 JWT Token
        return jwtConfig.generateToken(username);
    }
    
    /**
     * 根据 Token 获取用户
     */
    public User getUserByToken(String token) {
        String username = jwtConfig.getUsernameFromToken(token);
        return userMapper.findByUsername(username);
    }
}
```

### 2. 工具管理模块

#### ToolController
```java
@RestController
@RequestMapping("/tools")
public class ToolController {
    
    @Autowired
    private ToolService toolService;
    
    /**
     * 获取所有工具
     * @param categoryId 分类ID（可选）
     * @param search 搜索关键词（可选）
     * @param onlyPublished 是否只返回已发布的工具（默认true）
     */
    @GetMapping
    public Result<List<Tool>> getAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "true") Boolean onlyPublished) {
        List<Tool> tools = toolService.getAll(categoryId, search, onlyPublished);
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
    public Result<Tool> create(@RequestBody Tool tool) {
        try {
            Tool newTool = toolService.create(tool);
            return Result.success(newTool);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 更新工具（管理员）
     */
    @PutMapping("/{id}")
    public Result<Tool> update(@PathVariable String id, @RequestBody Tool tool) {
        try {
            Tool updatedTool = toolService.update(id, tool);
            return Result.success(updatedTool);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 删除工具（管理员）
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable String id) {
        try {
            toolService.delete(id);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 切换收藏状态
     */
    @PostMapping("/{id}/favorite")
    public Result<Tool> toggleFavorite(
            @PathVariable String id,
            @RequestHeader("Authorization") String authorization) {
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
    public Result<Tool> togglePublish(@PathVariable String id) {
        try {
            Tool tool = toolService.togglePublish(id);
            return Result.success(tool);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    /**
     * 批量更新工具排序（管理员）
     */
    @PutMapping("/reorder")
    public Result<Void> reorder(@RequestBody Map<String, Object> requestBody) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> toolsList = (List<Map<String, Object>>) requestBody.get("tools");
            List<Tool> tools = convertToToolList(toolsList);
            toolService.batchUpdateSort(tools);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
```

#### ToolService
```java
@Service
public class ToolService {
    
    @Autowired
    private ToolMapper toolMapper;
    
    @Autowired
    private FavoriteMapper favoriteMapper;
    
    /**
     * 获取所有工具
     */
    public List<Tool> getAll(String categoryId, String search, Boolean onlyPublished) {
        return toolMapper.findAll(categoryId, search, onlyPublished);
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
        tool.setCreatedAt(LocalDateTime.now());
        tool.setUpdatedAt(LocalDateTime.now());
        toolMapper.insert(tool);
        return tool;
    }
    
    /**
     * 更新工具
     */
    public Tool update(String id, Tool tool) {
        Tool existingTool = toolMapper.findById(id);
        if (existingTool == null) {
            throw new RuntimeException("工具不存在");
        }
        
        tool.setId(id);
        tool.setUpdatedAt(LocalDateTime.now());
        toolMapper.update(tool);
        
        return toolMapper.findById(id);
    }
    
    /**
     * 删除工具
     */
    public void delete(String id) {
        toolMapper.delete(id);
    }
    
    /**
     * 切换收藏状态
     */
    public Tool toggleFavorite(String toolId, String userId) {
        Favorite favorite = favoriteMapper.findByUserAndTool(userId, toolId);
        
        if (favorite == null) {
            // 添加收藏
            favorite = new Favorite();
            favorite.setId(UUID.randomUUID().toString());
            favorite.setUserId(userId);
            favorite.setToolId(toolId);
            favorite.setCreatedAt(LocalDateTime.now());
            favoriteMapper.insert(favorite);
        } else {
            // 取消收藏
            favoriteMapper.delete(favorite.getId());
        }
        
        return toolMapper.findById(toolId);
    }
    
    /**
     * 切换发布状态
     */
    public Tool togglePublish(String id) {
        Tool tool = toolMapper.findById(id);
        if (tool == null) {
            throw new RuntimeException("工具不存在");
        }
        
        tool.setIsPublished(!tool.getIsPublished());
        tool.setUpdatedAt(LocalDateTime.now());
        toolMapper.update(tool);
        
        return tool;
    }
    
    /**
     * 批量更新排序
     */
    public void batchUpdateSort(List<Tool> tools) {
        for (int i = 0; i < tools.size(); i++) {
            Tool tool = tools.get(i);
            tool.setSort(i);
            tool.setUpdatedAt(LocalDateTime.now());
            toolMapper.updateSort(tool.getId(), i);
        }
    }
}
```

---

## 💾 数据访问层

### ToolMapper 接口
```java
@Mapper
public interface ToolMapper {
    
    /**
     * 查询所有工具
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
    void insert(Tool tool);
    
    /**
     * 更新工具
     */
    void update(Tool tool);
    
    /**
     * 删除工具
     */
    void delete(@Param("id") String id);
    
    /**
     * 更新排序
     */
    void updateSort(@Param("id") String id, @Param("sort") Integer sort);
}
```

### ToolMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.navhub.mapper.ToolMapper">
    
    <!-- 结果映射 -->
    <resultMap id="ToolResultMap" type="com.navhub.entity.Tool">
        <id property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="description" column="description"/>
        <result property="url" column="url"/>
        <result property="icon" column="icon"/>
        <result property="categoryId" column="category_id"/>
        <result property="tags" column="tags"/>
        <result property="isPublished" column="is_published"/>
        <result property="isOnline" column="is_online"/>
        <result property="sort" column="sort"/>
        <result property="createdAt" column="created_at"/>
        <result property="updatedAt" column="updated_at"/>
    </resultMap>
    
    <!-- 查询所有工具 -->
    <select id="findAll" resultMap="ToolResultMap">
        SELECT * FROM tool
        <where>
            <if test="categoryId != null and categoryId != ''">
                AND category_id = #{categoryId}
            </if>
            <if test="search != null and search != ''">
                AND (name LIKE CONCAT('%', #{search}, '%') 
                     OR description LIKE CONCAT('%', #{search}, '%'))
            </if>
            <if test="onlyPublished != null and onlyPublished == true">
                AND is_published = 1
            </if>
        </where>
        ORDER BY sort ASC, created_at DESC
    </select>
    
    <!-- 根据ID查询工具 -->
    <select id="findById" resultMap="ToolResultMap">
        SELECT * FROM tool WHERE id = #{id}
    </select>
    
    <!-- 插入工具 -->
    <insert id="insert">
        INSERT INTO tool (id, name, description, url, icon, category_id, tags, 
                         is_published, is_online, sort, created_at, updated_at)
        VALUES (#{id}, #{name}, #{description}, #{url}, #{icon}, #{categoryId}, #{tags},
                #{isPublished}, #{isOnline}, #{sort}, #{createdAt}, #{updatedAt})
    </insert>
    
    <!-- 更新工具 -->
    <update id="update">
        UPDATE tool
        <set>
            <if test="name != null">name = #{name},</if>
            <if test="description != null">description = #{description},</if>
            <if test="url != null">url = #{url},</if>
            <if test="icon != null">icon = #{icon},</if>
            <if test="categoryId != null">category_id = #{categoryId},</if>
            <if test="tags != null">tags = #{tags},</if>
            <if test="isPublished != null">is_published = #{isPublished},</if>
            <if test="isOnline != null">is_online = #{isOnline},</if>
            <if test="sort != null">sort = #{sort},</if>
            updated_at = #{updatedAt}
        </set>
        WHERE id = #{id}
    </update>
    
    <!-- 删除工具 -->
    <delete id="delete">
        DELETE FROM tool WHERE id = #{id}
    </delete>
    
    <!-- 更新排序 -->
    <update id="updateSort">
        UPDATE tool SET sort = #{sort}, updated_at = NOW() WHERE id = #{id}
    </update>
    
</mapper>
```

---

## ⚙️ 配置说明

### application.yml
```yaml
spring:
  application:
    name: navhub-backend
  
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/navhub?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 12345678
  
  # Jackson 配置
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
    default-property-inclusion: non_null

# MyBatis 配置
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.navhub.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# JWT 配置
jwt:
  secret: NavHubSecretKeyForJWTTokenGenerationMustBeAtLeast64CharactersLong
  expiration: 86400000  # 24 小时

# 日志配置
logging:
  level:
    com.navhub: debug
    org.springframework.web: info
```

---

## 🚀 开发指南

### 启动项目

```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE navhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 执行初始化脚本
mysql -u root -p navhub < src/main/resources/db/schema.sql
mysql -u root -p navhub < src/main/resources/db/data.sql

# 3. 启动应用
mvn spring-boot:run
```

### API 测试

```bash
# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取工具列表
curl http://localhost:8080/api/tools

# 创建工具（需要 Token）
curl -X POST http://localhost:8080/api/tools \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"测试工具","url":"https://example.com","categoryId":"1"}'
```

---

**文档维护**: 后端团队  
**最后更新**: 2025-02-21
