# Postman 测试 NavHub 登录接口指南

## 问题：Required request body is missing

这个错误通常是因为 Postman 请求配置不正确导致的。

## 正确的 Postman 配置步骤

### 1. 创建新请求

1. 打开 Postman
2. 点击 "New" → "HTTP Request"
3. 设置请求方法为 **POST**
4. 输入 URL：`http://localhost:8080/api/auth/login`

### 2. 配置 Headers（重要！）

1. 点击 "Headers" 标签
2. 添加以下 Header：
   - **Key**: `Content-Type`
   - **Value**: `application/json`
   
   ⚠️ **注意**：必须添加这个 Header，否则 Spring Boot 无法解析 JSON 请求体

### 3. 配置 Body

1. 点击 "Body" 标签
2. 选择 **raw** 选项
3. 在右侧下拉菜单中选择 **JSON**（不是 Text！）
4. 在文本框中输入：
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

### 4. 发送请求

点击 "Send" 按钮

## 完整的请求配置截图说明

```
┌─────────────────────────────────────────┐
│ POST  http://localhost:8080/api/auth/login │
├─────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │
├─────────────────────────────────────────┤
│ Headers:                                │
│ Content-Type: application/json          │
├─────────────────────────────────────────┤
│ Body:                                   │
│ ○ none                                 │
│ ○ form-data                            │
│ ○ x-www-form-urlencoded                │
│ ○ raw  ← 选择这个                      │
│   JSON  ← 选择这个（不是 Text！）       │
│ ○ binary                               │
│ ○ GraphQL                              │
│                                        │
│ {                                      │
│   "username": "admin",                │
│   "password": "admin123"              │
│ }                                      │
└─────────────────────────────────────────┘
```

## 常见错误和解决方案

### 错误 1：Required request body is missing

**原因：**
- 没有设置 `Content-Type: application/json` Header
- Body 选择了 `none` 或 `form-data`
- Body 选择了 `raw` 但类型是 `Text` 而不是 `JSON`

**解决方案：**
1. 确保 Headers 中有 `Content-Type: application/json`
2. 确保 Body 选择 `raw` 和 `JSON`

### 错误 2：400 Bad Request

**原因：**
- JSON 格式错误（缺少引号、逗号等）
- 字段名拼写错误

**解决方案：**
- 检查 JSON 格式是否正确
- 确保字段名是 `username` 和 `password`（小写）

### 错误 3：连接被拒绝

**原因：**
- 后端服务未启动
- 端口号错误

**解决方案：**
- 确保后端服务正在运行
- 检查 URL 是否为 `http://localhost:8080/api/auth/login`

## 测试步骤检查清单

- [ ] 请求方法设置为 POST
- [ ] URL 正确：`http://localhost:8080/api/auth/login`
- [ ] Headers 中添加了 `Content-Type: application/json`
- [ ] Body 选择了 `raw`
- [ ] Body 类型选择了 `JSON`（不是 Text）
- [ ] JSON 格式正确（有引号、逗号等）
- [ ] 后端服务已启动

## 预期响应

### 成功响应（200 OK）

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
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

### 失败响应（用户名或密码错误）

```json
{
  "code": 1,
  "message": "用户名或密码错误",
  "data": null
}
```

## 快速测试命令（如果 Postman 有问题）

### 使用 PowerShell

```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### 使用 curl

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```
