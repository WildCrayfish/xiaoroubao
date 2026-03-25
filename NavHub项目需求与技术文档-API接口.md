# NavHub API 接口文档

> **版本**: v1.0.0  
> **基础路径**: `http://localhost:8080/api`  
> **认证方式**: JWT Bearer Token

---

## 📋 目录

1. [接口规范](#接口规范)
2. [认证接口](#认证接口)
3. [工具接口](#工具接口)
4. [分类接口](#分类接口)
5. [站点配置接口](#站点配置接口)
6. [错误码说明](#错误码说明)

---

## 📐 接口规范

### 统一响应格式

所有接口返回统一的 JSON 格式：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

**字段说明**:
- `code`: 状态码，0 表示成功，其他表示失败
- `message`: 响应消息
- `data`: 响应数据

### 认证方式

需要认证的接口，请求头需携带 JWT Token：

```
Authorization: Bearer <token>
```

### 分页参数

支持分页的接口，使用以下参数：

- `page`: 页码（从 1 开始）
- `pageSize`: 每页数量（默认 20）

---

## 🔐 认证接口

### 1. 用户登录

**接口**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "isAdmin": true,
      "avatar": null,
      "createdAt": "2025-01-01 00:00:00",
      "updatedAt": "2025-01-01 00:00:00"
    }
  }
}
```

**错误响应**:
```json
{
  "code": 1,
  "message": "用户名或密码错误",
  "data": null
}
```

---

### 2. 获取当前用户信息

**接口**: `GET /auth/me`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "isAdmin": true,
    "avatar": null,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}
```

---

### 3. 用户登出

**接口**: `POST /auth/logout`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": null
}
```

**说明**: JWT 无状态，前端删除 Token 即可

---

## 🛠️ 工具接口

### 1. 获取工具列表

**接口**: `GET /tools`

**查询参数**:
- `categoryId` (可选): 分类ID
- `search` (可选): 搜索关键词
- `onlyPublished` (可选): 是否只返回已发布的工具，默认 `true`

**请求示例**:
```
GET /tools?categoryId=1&search=设计&onlyPublished=true
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "1",
      "name": "Figma",
      "description": "在线协作设计工具",
      "url": "https://figma.com",
      "icon": "🎨",
      "categoryId": "1",
      "tags": "[\"设计\",\"协作\"]",
      "isPublished": true,
      "isOnline": true,
      "isFavorite": false,
      "sort": 0,
      "createdAt": "2025-01-01 00:00:00",
      "updatedAt": "2025-01-01 00:00:00"
    }
  ]
}
```

---

### 2. 获取单个工具

**接口**: `GET /tools/{id}`

**路径参数**:
- `id`: 工具ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "Figma",
    "description": "在线协作设计工具",
    "url": "https://figma.com",
    "icon": "🎨",
    "categoryId": "1",
    "tags": "[\"设计\",\"协作\"]",
    "isPublished": true,
    "isOnline": true,
    "sort": 0,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}
```

---

### 3. 创建工具（管理员）

**接口**: `POST /tools`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
```json
{
  "name": "Figma",
  "description": "在线协作设计工具",
  "url": "https://figma.com",
  "icon": "🎨",
  "categoryId": "1",
  "tags": "[\"设计\",\"协作\"]",
  "isPublished": true,
  "sort": 0
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "generated-uuid",
    "name": "Figma",
    "description": "在线协作设计工具",
    "url": "https://figma.com",
    "icon": "🎨",
    "categoryId": "1",
    "tags": "[\"设计\",\"协作\"]",
    "isPublished": true,
    "isOnline": true,
    "sort": 0,
    "createdAt": "2025-02-21 12:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 4. 更新工具（管理员）

**接口**: `PUT /tools/{id}`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 工具ID

**请求参数**:
```json
{
  "name": "Figma",
  "description": "更新后的描述",
  "url": "https://figma.com",
  "icon": "🎨",
  "categoryId": "1",
  "tags": "[\"设计\",\"协作\",\"原型\"]",
  "isPublished": true,
  "sort": 0
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "Figma",
    "description": "更新后的描述",
    "url": "https://figma.com",
    "icon": "🎨",
    "categoryId": "1",
    "tags": "[\"设计\",\"协作\",\"原型\"]",
    "isPublished": true,
    "isOnline": true,
    "sort": 0,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 5. 删除工具（管理员）

**接口**: `DELETE /tools/{id}`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 工具ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": null
}
```

---

### 6. 切换收藏状态

**接口**: `POST /tools/{id}/favorite`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 工具ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "Figma",
    "description": "在线协作设计工具",
    "url": "https://figma.com",
    "icon": "🎨",
    "categoryId": "1",
    "tags": "[\"设计\",\"协作\"]",
    "isPublished": true,
    "isOnline": true,
    "isFavorite": true,
    "sort": 0,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}
```

---

### 7. 切换发布状态（管理员）

**接口**: `POST /tools/{id}/publish`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 工具ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "Figma",
    "description": "在线协作设计工具",
    "url": "https://figma.com",
    "icon": "🎨",
    "categoryId": "1",
    "tags": "[\"设计\",\"协作\"]",
    "isPublished": false,
    "isOnline": true,
    "sort": 0,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 8. 批量更新排序（管理员）

**接口**: `PUT /tools/reorder`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
```json
{
  "tools": [
    { "id": "1", "sort": 0 },
    { "id": "2", "sort": 1 },
    { "id": "3", "sort": 2 }
  ]
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": null
}
```

---

## 📂 分类接口

### 1. 获取分类列表

**接口**: `GET /categories`

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": "1",
      "name": "设计工具",
      "icon": "🎨",
      "sort": 0,
      "isVisible": true,
      "createdAt": "2025-01-01 00:00:00",
      "updatedAt": "2025-01-01 00:00:00"
    },
    {
      "id": "2",
      "name": "开发工具",
      "icon": "💻",
      "sort": 1,
      "isVisible": true,
      "createdAt": "2025-01-01 00:00:00",
      "updatedAt": "2025-01-01 00:00:00"
    }
  ]
}
```

---

### 2. 获取单个分类

**接口**: `GET /categories/{id}`

**路径参数**:
- `id`: 分类ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "设计工具",
    "icon": "🎨",
    "sort": 0,
    "isVisible": true,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-01-01 00:00:00"
  }
}
```

---

### 3. 创建分类（管理员）

**接口**: `POST /categories`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
```json
{
  "name": "AI工具",
  "icon": "🤖",
  "sort": 3,
  "isVisible": true
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "generated-uuid",
    "name": "AI工具",
    "icon": "🤖",
    "sort": 3,
    "isVisible": true,
    "createdAt": "2025-02-21 12:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 4. 更新分类（管理员）

**接口**: `PUT /categories/{id}`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 分类ID

**请求参数**:
```json
{
  "name": "AI工具",
  "icon": "🤖",
  "sort": 3,
  "isVisible": true
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "name": "AI工具",
    "icon": "🤖",
    "sort": 3,
    "isVisible": true,
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 5. 删除分类（管理员）

**接口**: `DELETE /categories/{id}`

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 分类ID

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": null
}
```

---

## ⚙️ 站点配置接口

### 1. 获取站点配置

**接口**: `GET /site-config`

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "siteName": "NavHub",
    "siteTitle": "NavHub - 精选工具导航",
    "siteDescription": "发现优质工具，提升工作效率",
    "siteLogo": "data:image/png;base64,...",
    "icpRecord": "京ICP备12345678号",
    "publicSecurityRecord": "京公网安备11010802012345号",
    "publicSecurityRecordUrl": "http://www.beian.gov.cn/...",
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

### 2. 更新站点配置（管理员）

**接口**: `PUT /site-config`

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**:
```json
{
  "siteName": "NavHub",
  "siteTitle": "NavHub - 精选工具导航",
  "siteDescription": "发现优质工具，提升工作效率",
  "siteLogo": "data:image/png;base64,...",
  "icpRecord": "京ICP备12345678号",
  "publicSecurityRecord": "京公网安备11010802012345号",
  "publicSecurityRecordUrl": "http://www.beian.gov.cn/..."
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "siteName": "NavHub",
    "siteTitle": "NavHub - 精选工具导航",
    "siteDescription": "发现优质工具，提升工作效率",
    "siteLogo": "data:image/png;base64,...",
    "icpRecord": "京ICP备12345678号",
    "publicSecurityRecord": "京公网安备11010802012345号",
    "publicSecurityRecordUrl": "http://www.beian.gov.cn/...",
    "createdAt": "2025-01-01 00:00:00",
    "updatedAt": "2025-02-21 12:00:00"
  }
}
```

---

## ❌ 错误码说明

| 错误码 | 说明 | 示例 |
|-------|------|------|
| 0 | 成功 | - |
| 1 | 业务错误 | 用户名或密码错误 |
| 400 | 请求参数错误 | 缺少必填参数 |
| 401 | 未授权 | Token 无效或过期 |
| 403 | 无权限 | 非管理员操作 |
| 404 | 资源不存在 | 工具不存在 |
| 500 | 服务器错误 | 数据库连接失败 |

**错误响应示例**:
```json
{
  "code": 401,
  "message": "Token 无效或过期",
  "data": null
}
```

---

## 📝 Postman 测试集合

### 环境变量
```json
{
  "base_url": "http://localhost:8080/api",
  "token": ""
}
```

### 测试流程

1. **登录获取 Token**
   ```
   POST {{base_url}}/auth/login
   Body: {"username":"admin","password":"admin123"}
   ```

2. **保存 Token 到环境变量**
   ```javascript
   pm.environment.set("token", pm.response.json().data.token);
   ```

3. **使用 Token 访问受保护接口**
   ```
   GET {{base_url}}/tools
   Headers: Authorization: Bearer {{token}}
   ```

---

**文档维护**: API 团队  
**最后更新**: 2025-02-21
