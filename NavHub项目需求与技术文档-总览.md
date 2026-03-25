# NavHub 项目需求与技术文档

> **版本**: v1.0.0  
> **更新日期**: 2025-02-21  
> **项目类型**: 网页工具导航系统（前后端分离架构）

---

## 📋 文档目录

本技术文档分为以下几个部分：

1. **总览文档**（本文档）- 项目概述、技术栈、架构设计
2. **前端技术文档** - NavHub 前端详细说明
3. **后端技术文档** - NavHub-Con 后端详细说明
4. **API 接口文档** - 完整的 RESTful API 规范
5. **数据库设计文档** - 数据模型与表结构
6. **部署运维文档** - 部署流程与运维指南

---

## 🎯 项目概述

### 项目定位

NavHub 是一个**现代化的网页工具导航系统**，采用前后端分离架构，为用户提供：

- 🔍 **智能搜索** - 快速找到需要的工具
- 📂 **分类管理** - 清晰的工具分类体系
- ⭐ **收藏功能** - 个性化工具收藏
- 🎨 **现代化 UI** - 液态玻璃效果、流畅动画
- 🔐 **权限管理** - 管理员后台、用户认证
- 📱 **响应式设计** - 完美适配各种设备

### 核心价值

1. **用户价值**
   - 快速访问常用工具
   - 个性化收藏管理
   - 优雅的视觉体验

2. **管理员价值**
   - 可视化管理后台
   - 工具发布/下架控制
   - 数据统计分析

3. **技术价值**
   - 前后端分离架构
   - TypeScript 类型安全
   - RESTful API 设计
   - 可扩展的系统架构

---

## 🏗️ 项目架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户层 (User Layer)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 浏览器    │  │ 移动端    │  │ 平板     │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────────┐
│                   前端层 (Frontend Layer)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NavHub (React + TypeScript + Vite)             │   │
│  │  - 页面路由 (React Router)                       │   │
│  │  - 状态管理 (React Hooks + Context)             │   │
│  │  - UI 组件 (Tailwind CSS 4)                     │   │
│  │  - HTTP 请求 (Axios)                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ RESTful API
┌─────────────────────────────────────────────────────────┐
│                   后端层 (Backend Layer)                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │  NavHub-Con (Spring Boot + MyBatis)             │   │
│  │  - 控制器层 (Controller)                         │   │
│  │  - 业务逻辑层 (Service)                          │   │
│  │  - 数据访问层 (Mapper)                           │   │
│  │  - JWT 认证 (Spring Security)                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓ JDBC
┌─────────────────────────────────────────────────────────┐
│                   数据层 (Data Layer)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  MySQL 8.0                                       │   │
│  │  - user (用户表)                                 │   │
│  │  - category (分类表)                             │   │
│  │  - tool (工具表)                                 │   │
│  │  - favorite (收藏表)                             │   │
│  │  - site_config (站点配置表)                      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技术架构

#### 前端架构 (NavHub)

```
src/
├── api/                    # API 接口层
│   ├── request.ts         # Axios 封装
│   ├── auth.ts            # 认证接口
│   ├── tool.ts            # 工具接口
│   ├── category.ts        # 分类接口
│   ├── siteConfig.ts      # 站点配置接口
│   └── types.ts           # TypeScript 类型定义
│
├── pages/                  # 页面层
│   ├── Home.tsx           # 首页
│   ├── Login.tsx          # 登录页
│   └── Admin.tsx          # 管理后台
│
├── app/components/         # 组件层
│   ├── header.tsx         # 头部组件
│   ├── sidebar.tsx        # 侧边栏组件
│   ├── tag-card.tsx       # 工具卡片组件
│   ├── edit-modal.tsx     # 编辑模态框
│   └── admin/             # 管理后台组件
│       ├── ToolManager.tsx
│       ├── CategoryManager.tsx
│       └── LogoUploader.tsx
│
├── hooks/                  # 业务逻辑层
│   ├── useAuth.ts         # 认证逻辑
│   ├── useTools.ts        # 工具管理逻辑
│   ├── useCategories.ts   # 分类管理逻辑
│   └── useSiteConfig.ts   # 站点配置逻辑
│
├── contexts/               # 全局状态管理
│   ├── AuthContext.tsx    # 认证上下文
│   ├── ConfigContext.tsx  # 配置上下文
│   └── ThemeContext.tsx   # 主题上下文
│
├── router/                 # 路由层
│   └── index.tsx          # 路由配置
│
└── utils/                  # 工具函数层
    ├── cn.ts              # 类名工具
    ├── iconUtils.ts       # 图标工具
    └── smartSearch.ts     # 智能搜索
```

#### 后端架构 (NavHub-Con)

```
src/main/java/com/navhub/
├── NavHubApplication.java  # 应用入口
│
├── controller/             # 控制器层 (REST API)
│   ├── AuthController.java
│   ├── ToolController.java
│   ├── CategoryController.java
│   └── SiteConfigController.java
│
├── service/                # 业务逻辑层
│   ├── AuthService.java
│   ├── ToolService.java
│   ├── CategoryService.java
│   └── SiteConfigService.java
│
├── mapper/                 # 数据访问层 (MyBatis)
│   ├── UserMapper.java
│   ├── ToolMapper.java
│   ├── CategoryMapper.java
│   ├── FavoriteMapper.java
│   └── SiteConfigMapper.java
│
├── entity/                 # 实体类
│   ├── User.java
│   ├── Tool.java
│   ├── Category.java
│   ├── Favorite.java
│   └── SiteConfig.java
│
├── common/                 # 通用类
│   ├── Result.java        # 统一响应格式
│   └── GlobalExceptionHandler.java
│
└── config/                 # 配置类
    ├── CorsConfig.java    # 跨域配置
    ├── JwtConfig.java     # JWT 配置
    └── WebMvcConfig.java  # Web MVC 配置
```

---

## 💻 技术栈详解

### 前端技术栈

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **React** | 18.3.1 | UI 框架 | 组件化开发、虚拟 DOM |
| **TypeScript** | 5.6.3 | 编程语言 | 类型安全、代码提示 |
| **Vite** | 6.3.5 | 构建工具 | 快速开发、HMR |
| **React Router** | 6.26.0 | 路由管理 | SPA 路由 |
| **Tailwind CSS** | 4.1.12 | CSS 框架 | 原子化 CSS、响应式 |
| **Axios** | 1.7.7 | HTTP 客户端 | API 请求、拦截器 |
| **Lucide React** | 0.487.0 | 图标库 | 现代化图标 |
| **@dnd-kit** | 6.3.1 | 拖拽库 | 工具排序 |
| **clsx** | 2.1.1 | 类名工具 | 条件类名 |
| **tailwind-merge** | 3.2.0 | 类名合并 | Tailwind 类优化 |

### 后端技术栈

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Java** | 1.8 | 编程语言 | 稳定、成熟 |
| **Spring Boot** | 2.7.18 | 应用框架 | 快速开发、自动配置 |
| **MyBatis** | 2.3.1 | ORM 框架 | SQL 映射、灵活查询 |
| **MySQL** | 8.0.33 | 数据库 | 关系型数据库 |
| **JWT** | 0.11.5 | 认证方案 | 无状态认证 |
| **Lombok** | - | 代码简化 | 注解生成代码 |
| **Maven** | - | 构建工具 | 依赖管理 |

### 开发工具

- **IDE**: VS Code (前端) / IntelliJ IDEA (后端)
- **版本控制**: Git
- **API 测试**: Postman
- **数据库管理**: MySQL Workbench / Navicat

---

## 🎨 核心功能模块

### 1. 用户认证模块

**功能描述**: 用户登录、登出、权限验证

**技术实现**:
- JWT Token 认证
- Token 存储在 localStorage
- 请求拦截器自动添加 Token
- Token 过期自动跳转登录

**涉及文件**:
- 前端: `src/api/auth.ts`, `src/hooks/useAuth.ts`, `src/contexts/AuthContext.tsx`
- 后端: `AuthController.java`, `AuthService.java`, `JwtConfig.java`

### 2. 工具管理模块

**功能描述**: 工具的增删改查、发布/下架、排序

**技术实现**:
- RESTful API 设计
- 拖拽排序 (@dnd-kit)
- 发布状态控制
- 图标自动获取

**涉及文件**:
- 前端: `src/api/tool.ts`, `src/hooks/useTools.ts`, `src/pages/Admin.tsx`
- 后端: `ToolController.java`, `ToolService.java`, `ToolMapper.java`

### 3. 分类管理模块

**功能描述**: 分类的增删改查、排序

**技术实现**:
- 分类树形结构
- 分类图标管理
- 分类可见性控制

**涉及文件**:
- 前端: `src/api/category.ts`, `src/hooks/useCategories.ts`
- 后端: `CategoryController.java`, `CategoryService.java`, `CategoryMapper.java`

### 4. 收藏功能模块

**功能描述**: 用户收藏工具、取消收藏

**技术实现**:
- 用户-工具关联表
- 收藏状态实时更新
- 收藏列表展示

**涉及文件**:
- 前端: `src/api/tool.ts` (toggleFavorite)
- 后端: `ToolController.java`, `FavoriteMapper.java`

### 5. 搜索功能模块

**功能描述**: 工具搜索、分类筛选

**技术实现**:
- 前端智能搜索算法
- 后端模糊查询
- 搜索结果高亮

**涉及文件**:
- 前端: `src/utils/smartSearch.ts`, `src/pages/Home.tsx`
- 后端: `ToolService.java` (搜索逻辑)

### 6. 站点配置模块

**功能描述**: 站点信息、Logo、备案信息配置

**技术实现**:
- 站点配置表
- Logo 上传（Base64）
- 配置实时更新

**涉及文件**:
- 前端: `src/api/siteConfig.ts`, `src/hooks/useSiteConfig.ts`
- 后端: `SiteConfigController.java`, `SiteConfigService.java`

---

## 📊 数据模型

### ER 图

```
┌─────────────┐         ┌─────────────┐
│    User     │         │  Category   │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ username    │         │ name        │
│ password    │         │ icon        │
│ email       │         │ sort        │
│ is_admin    │         │ is_visible  │
│ avatar      │         └─────────────┘
└─────────────┘                │
       │                       │
       │ 1                     │ 1
       │                       │
       │ N                     │ N
       ↓                       ↓
┌─────────────┐         ┌─────────────┐
│  Favorite   │         │    Tool     │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ user_id(FK) │←───N:1──│ category_id │
│ tool_id(FK) │         │ name        │
└─────────────┘         │ description │
                        │ url         │
                        │ icon        │
                        │ tags        │
                        │ is_published│
                        │ sort        │
                        └─────────────┘

┌─────────────┐
│ SiteConfig  │
├─────────────┤
│ id (PK)     │
│ site_name   │
│ site_title  │
│ site_logo   │
│ icp_record  │
└─────────────┘
```

### 核心表结构

#### 1. user (用户表)
- `id`: 用户ID (主键)
- `username`: 用户名 (唯一)
- `password`: 密码 (加密)
- `email`: 邮箱
- `is_admin`: 是否管理员
- `avatar`: 头像URL
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 2. category (分类表)
- `id`: 分类ID (主键)
- `name`: 分类名称
- `icon`: 图标 (Emoji)
- `sort`: 排序序号
- `is_visible`: 是否可见
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 3. tool (工具表)
- `id`: 工具ID (主键)
- `name`: 工具名称
- `description`: 描述
- `url`: 链接URL
- `icon`: 图标 (URL/Emoji)
- `category_id`: 分类ID (外键)
- `tags`: 标签 (JSON)
- `is_published`: 是否发布
- `is_online`: 是否在线
- `sort`: 排序序号
- `created_at`: 创建时间
- `updated_at`: 更新时间

#### 4. favorite (收藏表)
- `id`: 收藏ID (主键)
- `user_id`: 用户ID (外键)
- `tool_id`: 工具ID (外键)
- `created_at`: 创建时间

#### 5. site_config (站点配置表)
- `id`: 配置ID (主键)
- `site_name`: 站点名称
- `site_title`: 站点标题
- `site_description`: 站点描述
- `site_logo`: 站点Logo (Base64)
- `icp_record`: ICP备案号
- `public_security_record`: 公安备案号
- `public_security_record_url`: 公安备案链接
- `created_at`: 创建时间
- `updated_at`: 更新时间

---

## 🔐 安全设计

### 认证机制

1. **JWT Token 认证**
   - Token 有效期: 24小时
   - Token 存储: localStorage
   - Token 格式: `Bearer <token>`

2. **密码加密**
   - 算法: BCrypt
   - 盐值: 自动生成

3. **权限控制**
   - 管理员权限: `is_admin = 1`
   - 普通用户权限: `is_admin = 0`

### 安全措施

1. **跨域配置 (CORS)**
   - 允许的源: 配置文件指定
   - 允许的方法: GET, POST, PUT, DELETE
   - 允许的头: Authorization, Content-Type

2. **SQL 注入防护**
   - MyBatis 参数化查询
   - 输入验证

3. **XSS 防护**
   - 前端输入过滤
   - 后端输出转义

---

## 📈 性能优化

### 前端优化

1. **代码分割**
   - 路由懒加载
   - 组件按需加载

2. **资源优化**
   - 图片懒加载
   - CSS/JS 压缩
   - Gzip 压缩

3. **缓存策略**
   - localStorage 缓存
   - HTTP 缓存

### 后端优化

1. **数据库优化**
   - 索引优化
   - 查询优化
   - 连接池配置

2. **API 优化**
   - 分页查询
   - 字段筛选
   - 响应压缩

---

## 🚀 部署架构

### 开发环境
- 前端: `http://localhost:5173`
- 后端: `http://localhost:8080`
- 数据库: `localhost:3306`

### 生产环境
- 前端: 静态托管 (Vercel/Netlify)
- 后端: 服务器部署 (Docker/K8s)
- 数据库: 云数据库 (阿里云RDS/腾讯云)

---

## 📝 开发规范

### 代码规范

1. **命名规范**
   - 组件: PascalCase (如 `ToolCard.tsx`)
   - 函数: camelCase (如 `getUserInfo`)
   - 常量: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

2. **注释规范**
   - 文件头注释
   - 函数注释 (JSDoc)
   - 复杂逻辑注释

3. **Git 提交规范**
   - feat: 新功能
   - fix: 修复bug
   - docs: 文档更新
   - style: 代码格式
   - refactor: 重构
   - test: 测试
   - chore: 构建/工具

---

## 📚 相关文档

- [前端技术文档](./NavHub项目需求与技术文档-前端.md)
- [后端技术文档](./NavHub项目需求与技术文档-后端.md)
- [API 接口文档](./NavHub项目需求与技术文档-API.md)
- [数据库设计文档](./NavHub项目需求与技术文档-数据库.md)
- [部署运维文档](./NavHub项目需求与技术文档-部署.md)

---

**文档维护**: 开发团队  
**最后更新**: 2025-02-21

