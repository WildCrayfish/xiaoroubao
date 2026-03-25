# JWT 密钥配置说明

## 问题说明

JWT 签名算法对密钥长度有要求：
- **HS256**：需要至少 **256 位**（32 个字符）
- **HS512**：需要至少 **512 位**（64 个字符）

如果密钥长度不够，会报错：
```
The signing key's size is 400 bits which is not secure enough for the HS512 algorithm.
```

## 解决方案

### 方案 1：使用足够长的密钥（推荐）

在 `application.yml` 中配置一个至少 64 个字符的密钥：

```yaml
jwt:
  secret: NavHubSecretKeyForJWTTokenGenerationMustBeAtLeast64CharactersLongForHS512Algorithm
  expiration: 86400000
```

### 方案 2：使用 HS256 算法

如果密钥长度在 32-63 个字符之间，系统会自动使用 HS256 算法。

### 方案 3：生成随机密钥

可以使用以下方法生成安全的随机密钥：

**Java 代码生成：**
```java
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

// 生成 HS512 密钥（64 字节 = 512 位）
SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
String secret = new String(key.getEncoded(), StandardCharsets.UTF_8);
System.out.println("Secret: " + secret);
```

**在线工具生成：**
- 访问：https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- 选择 512-bit 或 256-bit
- 复制生成的密钥

## 当前配置

项目已配置默认密钥（64 个字符），支持 HS512 算法：

```yaml
jwt:
  secret: NavHubSecretKeyForJWTTokenGenerationMustBeAtLeast64CharactersLongForHS512Algorithm
```

## 生产环境建议

⚠️ **重要**：生产环境必须修改密钥！

1. 生成一个强随机密钥（至少 64 个字符）
2. 将密钥存储在环境变量或配置中心
3. 不要将密钥提交到代码仓库

**示例（使用环境变量）：**

```yaml
jwt:
  secret: ${JWT_SECRET:NavHubSecretKeyForJWTTokenGenerationMustBeAtLeast64CharactersLongForHS512Algorithm}
  expiration: ${JWT_EXPIRATION:86400000}
```

然后在系统环境变量中设置：
```bash
JWT_SECRET=your-very-long-and-secure-secret-key-at-least-64-characters-long
```

## 密钥长度对照表

| 算法 | 最小密钥长度 | 字符数（UTF-8） | 安全性 |
|------|------------|---------------|--------|
| HS256 | 256 位 | 32 字符 | 中等 |
| HS384 | 384 位 | 48 字符 | 较高 |
| HS512 | 512 位 | 64 字符 | 高 |

## 验证密钥长度

可以使用以下代码验证：

```java
String secret = "your-secret-key";
int bitLength = secret.getBytes(StandardCharsets.UTF_8).length * 8;
System.out.println("密钥长度: " + bitLength + " 位");
System.out.println("字符数: " + secret.length());
```

## 修复后的行为

修复后的代码会：
1. 自动检测密钥长度
2. 如果密钥 >= 64 字符，使用 HS512
3. 如果密钥 >= 32 字符但 < 64 字符，使用 HS256
4. 如果密钥 < 32 字符，抛出异常提示
