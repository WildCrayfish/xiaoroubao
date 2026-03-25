# NavHub Backend - 后端服务

基于 Spring Boot 2.7.18 + MyBatis + MySQL 的网页工具导航后端服务。

## 技术栈

- **Java**: 8
- **框架**: Spring Boot 2.7.18
- **ORM**: MyBatis 2.3.1
- **数据库**: MySQL 8
- **构建工具**: Maven 3.8.5
- **认证**: JWT (JSON Web Token)

## 项目结构

```
src/main/java/com/navhub/
├── NavHubApplication.java    # 应用入口
├── common/                   # 通用类
│   └── Result.java          # 统一响应格式
├── config/                   # 配置类
│   ├── CorsConfig.java      # 跨域配置
│   ├── JwtConfig.java       # JWT 配置
│   └── WebMvcConfig.java    # Web MVC 配置
├── controller/              # 控制器层（接口层）
│   ├── AuthController.java
│   ├── CategoryController.java
│   └── ToolController.java
├── service/                 # 业务逻辑层
│   ├── AuthService.java
│   ├── CategoryService.java
│   └── ToolService.java
├── mapper/                  # 数据访问层（MyBatis Mapper）
│   ├── UserMapper.java
│   ├── CategoryMapper.java
│   ├── ToolMapper.java
│   └── FavoriteMapper.java
└── entity/                  # 实体类（数据模型）
    ├── User.java
    ├── Category.java
    ├── Tool.java
    └── Favorite.java

src/main/resources/
├── application.yml          # 主配置文件
├── application-dev.yml      # 开发环境配置
├── application-prod.yml     # 生产环境配置
├── mapper/                  # MyBatis XML 映射文件
│   ├── UserMapper.xml
│   ├── CategoryMapper.xml
│   ├── ToolMapper.xml
│   └── FavoriteMapper.xml
└── db/                      # 数据库脚本
    ├── schema.sql          # 表结构
    └── data.sql            # 初始数据
```

## 快速开始

### 1. 环境要求

- JDK 8
- Maven 3.6+ (您当前使用 3.8.5，完全兼容)
- MySQL 8.0+

### 2. 验证环境

```bash
# 检查 Java 版本
java -version
# 应该显示：java version "1.8.x"

# 检查 Maven 版本
mvn -version
# 应该显示：Apache Maven 3.8.5
```

### 3. 数据库配置

#### 创建数据库

```sql
-- 执行 src/main/resources/db/schema.sql
-- 创建数据库和表结构
```

#### 修改数据库连接

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/navhub?...
    username: root
    password: your_password
```

### 4. 运行项目

#### 方式一：使用 Maven 命令行

```bash
# 进入项目目录
cd NavHub-Con

# 清理并编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run
```

#### 方式二：打包后运行

```bash
# 打包项目
mvn clean package

# 运行 JAR 文件
java -jar target/navhub-backend-1.0.0.jar
```

#### 方式三：使用 IDE

1. 使用 IntelliJ IDEA 或 Eclipse 打开项目
2. 等待 Maven 自动下载依赖
3. 运行 `NavHubApplication.java` 的 `main` 方法

### 5. 访问 API

项目启动后，API 基础地址为：`http://localhost:8080/api`

## API 接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 分类接口

- `GET /api/categories` - 获取所有分类
- `GET /api/categories/{id}` - 根据ID获取分类
- `POST /api/categories` - 创建分类（管理员）
- `PUT /api/categories/{id}` - 更新分类（管理员）
- `DELETE /api/categories/{id}` - 删除分类（管理员）

### 工具接口

- `GET /api/tools` - 获取所有工具（支持 categoryId 和 search 参数）
- `GET /api/tools/{id}` - 根据ID获取工具
- `POST /api/tools` - 创建工具（管理员）
- `PUT /api/tools/{id}` - 更新工具（管理员）
- `DELETE /api/tools/{id}` - 删除工具（管理员）
- `POST /api/tools/{id}/favorite` - 切换收藏状态
- `POST /api/tools/{id}/publish` - 切换发布状态（管理员）

## 统一响应格式

所有接口返回统一格式：

```json
{
  "code": 0,        // 0 表示成功，其他表示失败
  "message": "ok",  // 响应消息
  "data": {}        // 响应数据
}
```

## 认证方式

使用 JWT Token 进行认证：

1. 登录后获取 Token
2. 在请求头中携带：`Authorization: Bearer <token>`
3. Token 默认有效期为 24 小时

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## Maven 常用命令

```bash
# 清理项目
mvn clean

# 编译项目
mvn compile

# 运行测试
mvn test

# 打包项目
mvn package

# 跳过测试打包
mvn package -DskipTests

# 安装到本地仓库
mvn install

# 查看依赖树
mvn dependency:tree
```

## 开发建议

1. **权限校验**：所有管理员操作都应该在后端进行权限校验（当前版本简化处理）
2. **密码加密**：生产环境应使用 BCrypt 等安全加密方式，当前使用 MD5 仅用于演示
3. **异常处理**：建议添加全局异常处理器统一处理异常
4. **日志记录**：添加操作日志记录功能
5. **参数验证**：使用 `@Valid` 注解进行参数验证

## 连接前端

修改前端项目 `NavHub/src/api/` 目录下的文件，将 `USE_MOCK` 设置为 `false`，即可连接真实后端。

## 常见问题

### Maven 下载依赖慢

如果 Maven 下载依赖很慢，可以配置国内镜像。编辑 `~/.m2/settings.xml`：

```xml
<mirrors>
    <mirror>
        <id>aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Aliyun Maven</name>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

### 端口被占用

如果 8080 端口被占用，修改 `application.yml` 中的 `server.port` 配置。

### 数据库连接失败

检查：
1. MySQL 服务是否启动
2. 数据库用户名密码是否正确
3. 数据库 `navhub` 是否已创建

## 许可证

MIT
