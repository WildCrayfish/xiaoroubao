# NavHub 项目完整技术文档

## 📚 文档列表

本项目包含以下完整的技术文档：

### 1. 📋 总览文档
**文件**: `NavHub项目需求与技术文档-总览.md`

**内容**:
- 项目概述与定位
- 整体架构设计
- 技术栈对比
- 核心功能模块
- 数据模型设计
- 安全设计
- 性能优化
- 部署架构

**适合人群**: 项目经理、架构师、新成员

---

### 2. 💻 前端技术文档
**文件**: `NavHub项目需求与技术文档-前端.md`

**内容**:
- 前端项目结构
- React + TypeScript 技术栈详解
- 核心功能实现（认证、工具管理、搜索）
- 组件设计（ToolCard、EditModal 等）
- 状态管理（Hooks、Context）
- API 封装
- 响应式设计
- 性能优化

**适合人群**: 前端开发者

---

### 3. 🔧 后端技术文档
**文件**: `NavHub项目需求与技术文档-后端.md`

**内容**:
- 后端项目结构
- Spring Boot + MyBatis 技术栈详解
- 核心模块（认证、工具管理）
- 数据访问层（Mapper）
- 业务逻辑层（Service）
- 控制器层（Controller）
- 配置说明
- 开发指南

**适合人群**: 后端开发者

---

### 4. 🌐 API 接口文档
**文件**: `NavHub项目需求与技术文档-API接口.md`

**内容**:
- 接口规范（统一响应格式、认证方式）
- 认证接口（登录、登出、获取用户信息）
- 工具接口（增删改查、收藏、发布、排序）
- 分类接口（增删改查）
- 站点配置接口
- 错误码说明
- Postman 测试集合

**适合人群**: 前后端开发者、测试人员

---

### 5. 📊 差异化需求分析
**文件**: `BinNav_Public与NavHub差异化需求分析.md`

**内容**:
- BinNav_Public 与 NavHub 功能对比
- 技术架构差异
- 功能特性对比表
- 整合建议与优先级
- 迁移清单

**适合人群**: 产品经理、架构师

---

## 🎯 快速导航

### 我是新成员，从哪里开始？
1. 先阅读 **总览文档**，了解项目整体架构
2. 根据角色阅读对应文档：
   - 前端开发 → **前端技术文档**
   - 后端开发 → **后端技术文档**
3. 查看 **API 接口文档**，了解前后端交互

### 我要开发新功能
1. 查看 **总览文档** 中的核心功能模块
2. 参考 **前端/后端技术文档** 中的实现示例
3. 遵循 **API 接口文档** 中的接口规范

### 我要进行接口联调
1. 阅读 **API 接口文档**
2. 使用 Postman 测试接口
3. 参考前后端文档中的 API 封装示例

### 我要了解项目差异
1. 阅读 **差异化需求分析文档**
2. 了解 BinNav_Public 与 NavHub 的区别
3. 查看整合建议

---

## 📁 项目结构概览

```
NavHub 项目/
├── NavHub/                          # 前端项目
│   ├── src/
│   │   ├── api/                    # API 接口层
│   │   ├── pages/                  # 页面组件
│   │   ├── app/components/         # 可复用组件
│   │   ├── hooks/                  # 自定义 Hooks
│   │   ├── contexts/               # React Context
│   │   ├── router/                 # 路由配置
│   │   └── utils/                  # 工具函数
│   └── package.json
│
├── NavHub-Con/                      # 后端项目
│   ├── src/main/java/com/navhub/
│   │   ├── controller/             # 控制器层
│   │   ├── service/                # 业务逻辑层
│   │   ├── mapper/                 # 数据访问层
│   │   ├── entity/                 # 实体类
│   │   ├── common/                 # 通用类
│   │   └── config/                 # 配置类
│   └── pom.xml
│
└── 文档/
    ├── NavHub项目需求与技术文档-总览.md
    ├── NavHub项目需求与技术文档-前端.md
    ├── NavHub项目需求与技术文档-后端.md
    ├── NavHub项目需求与技术文档-API接口.md
    └── BinNav_Public与NavHub差异化需求分析.md
```

---

## 🚀 快速启动

### 前端启动
```bash
cd NavHub
npm install
npm run dev
# 访问 http://localhost:5173
```

### 后端启动
```bash
cd NavHub-Con

# 1. 创建数据库
mysql -u root -p
CREATE DATABASE navhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 执行初始化脚本
mysql -u root -p navhub < src/main/resources/db/schema.sql
mysql -u root -p navhub < src/main/resources/db/data.sql

# 3. 启动应用
mvn spring-boot:run
# 访问 http://localhost:8080/api
```

### 默认账号
- **用户名**: admin
- **密码**: admin123

---

## 🔧 技术栈总览

### 前端
- React 18.3.1
- TypeScript 5.6.3
- Vite 6.3.5
- Tailwind CSS 4.1.12
- React Router 6.26.0
- Axios 1.7.7
- @dnd-kit 6.3.1

### 后端
- Java 8
- Spring Boot 2.7.18
- MyBatis 2.3.1
- MySQL 8.0.33
- JWT 0.11.5
- Lombok

---

## 📝 开发规范

### Git 提交规范
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

### 代码规范
- 组件命名: PascalCase
- 函数命名: camelCase
- 常量命名: UPPER_SNAKE_CASE
- 文件注释: JSDoc / JavaDoc

---

## 📞 联系方式

- **项目负责人**: [待填写]
- **前端负责人**: [待填写]
- **后端负责人**: [待填写]

---

## 📅 更新日志

### v1.0.0 (2025-02-21)
- ✅ 完成项目总览文档
- ✅ 完成前端技术文档
- ✅ 完成后端技术文档
- ✅ 完成 API 接口文档
- ✅ 完成差异化需求分析

---

**文档维护**: 开发团队  
**最后更新**: 2025-02-21
