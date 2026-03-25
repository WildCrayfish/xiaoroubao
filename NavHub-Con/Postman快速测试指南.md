# Postman 快速测试指南

## ❌ 错误：Required request body is missing

这个错误是因为 Postman 请求配置不正确。

## ✅ 正确的 Postman 配置（3 步搞定）

### 步骤 1：设置请求方法和 URL

```
方法：POST
URL：http://localhost:8080/api/auth/login
```

### 步骤 2：添加 Headers（重要！）

点击 **Headers** 标签，添加：

| Key | Value |
|-----|-------|
| Content-Type | application/json |

⚠️ **必须添加这个 Header！**

### 步骤 3：设置 Body

1. 点击 **Body** 标签
2. 选择 **raw**（不是 form-data！）
3. 右侧下拉菜单选择 **JSON**（不是 Text！）
4. 输入以下内容：

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 步骤 4：发送请求

点击 **Send** 按钮

---

## 📸 配置截图说明

```
┌─────────────────────────────────────────────┐
│ POST  http://localhost:8080/api/auth/login  │
├─────────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │   │
├─────────────────────────────────────────────┤
│ [Headers 标签]                              │
│                                             │
│ Key              Value                      │
│ Content-Type     application/json  ← 添加   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [Body 标签]                                 │
│                                             │
│ ○ none                                     │
│ ○ form-data                                │
│ ○ x-www-form-urlencoded                    │
│ ● raw  ← 选择这个                          │
│ ○ binary                                   │
│                                             │
│ [下拉菜单] JSON  ← 选择这个（不是 Text！）   │
│                                             │
│ {                                          │
│   "username": "admin",                     │
│   "password": "admin123"                   │
│ }                                          │
└─────────────────────────────────────────────┘
```

---

## ✅ 成功响应示例

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwNjAwMDAwMCwiZXhwIjoxNzA2MDg2NDAwfQ...",
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

---

## ❌ 常见错误

### 错误 1：Required request body is missing

**原因：**
- ❌ 没有添加 `Content-Type: application/json` Header
- ❌ Body 选择了 `none` 或 `form-data`
- ❌ Body 选择了 `raw` 但类型是 `Text` 而不是 `JSON`

**解决：**
1. ✅ 添加 Header：`Content-Type: application/json`
2. ✅ Body 选择 `raw` + `JSON`

### 错误 2：400 Bad Request

**原因：**
- JSON 格式错误（缺少引号、逗号等）

**解决：**
- 检查 JSON 格式，确保：
  - 字段名用双引号：`"username"` 不是 `username`
  - 字符串值用双引号：`"admin"` 不是 `admin`
  - 最后一个字段后不要有逗号

---

## 🚀 快速测试（如果 Postman 有问题）

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

---

## 📋 检查清单

测试前请确认：

- [ ] 后端服务已启动（看到 "Tomcat started on port(s): 8080"）
- [ ] 请求方法：**POST**
- [ ] URL：`http://localhost:8080/api/auth/login`
- [ ] Headers 中有：`Content-Type: application/json`
- [ ] Body 选择了：**raw** + **JSON**
- [ ] JSON 格式正确（有引号、逗号等）

---

## 🔑 默认测试账号

- **用户名：** `admin`
- **密码：** `admin123`
