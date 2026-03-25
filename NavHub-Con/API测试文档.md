# NavHub 认证接口测试文档

## 接口列表

### 1. 用户登录

**接口地址：** `POST /api/auth/login`

**请求头：**
```
Content-Type: application/json
```

**请求体：**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应：**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwNDAwMDAwMCwiZXhwIjoxNzA0MDg2NDAwfQ...",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@navhub.com",
      "isAdmin": true,
      "avatar": null,
      "createdAt": "2024-01-01 00:00:00",
      "updatedAt": "2024-01-01 00:00:00"
    }
  }
}
```

**失败响应：**
```json
{
  "code": 1,
  "message": "用户名或密码错误",
  "data": null
}
```

**测试命令（使用 curl）：**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**测试命令（使用 PowerShell）：**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'
```

---

### 2. 用户注销

**接口地址：** `POST /api/auth/logout`

**请求头：**
```
Authorization: Bearer <token>
```

**成功响应：**
```json
{
  "code": 0,
  "message": "ok",
  "data": null
}
```

**测试命令（使用 curl）：**
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**测试命令（使用 PowerShell）：**
```powershell
$token = "YOUR_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/logout" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"}
```

---

### 3. 获取当前用户信息

**接口地址：** `GET /api/auth/me`

**请求头：**
```
Authorization: Bearer <token>
```

**成功响应：**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@navhub.com",
    "isAdmin": true,
    "avatar": null,
    "createdAt": "2024-01-01 00:00:00",
    "updatedAt": "2024-01-01 00:00:00"
  }
}
```

**失败响应（未登录）：**
```json
{
  "code": 401,
  "message": "未登录或 Token 格式错误",
  "data": null
}
```

**失败响应（Token 无效）：**
```json
{
  "code": 401,
  "message": "Token 无效或已过期",
  "data": null
}
```

**测试命令（使用 curl）：**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**测试命令（使用 PowerShell）：**
```powershell
$token = "YOUR_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

---

## 完整测试流程

### 步骤 1：登录获取 Token

```bash
# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# 保存返回的 token（示例）
TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

### 步骤 2：使用 Token 获取用户信息

```bash
# 获取当前用户信息
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 步骤 3：注销

```bash
# 注销
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## 使用 Postman 测试

### 1. 登录接口

1. 创建新请求：`POST http://localhost:8080/api/auth/login`
2. Headers 添加：`Content-Type: application/json`
3. Body 选择 `raw` 和 `JSON`，输入：
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. 发送请求，复制返回的 `token`

### 2. 获取用户信息接口

1. 创建新请求：`GET http://localhost:8080/api/auth/me`
2. Headers 添加：`Authorization: Bearer <粘贴刚才复制的token>`
3. 发送请求

### 3. 注销接口

1. 创建新请求：`POST http://localhost:8080/api/auth/logout`
2. Headers 添加：`Authorization: Bearer <token>`
3. 发送请求

---

## 错误码说明

- `0` - 成功
- `1` - 业务错误（如用户名密码错误）
- `401` - 未授权（未登录或 Token 无效）
- `500` - 服务器内部错误

---

## 注意事项

1. **Token 有效期**：默认 24 小时，可在 `application.yml` 中配置 `jwt.expiration`
2. **密码加密**：当前使用 MD5，生产环境建议使用 BCrypt
3. **Token 存储**：客户端应安全存储 Token（如 localStorage 或 httpOnly Cookie）
4. **HTTPS**：生产环境建议使用 HTTPS 传输 Token

---

## 默认测试账号

- **用户名：** `admin`
- **密码：** `admin123`
