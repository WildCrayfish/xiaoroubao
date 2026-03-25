@echo off
chcp 65001 >nul
echo ========================================
echo NavHub 认证接口测试
echo ========================================
echo.

REM 测试登录接口
echo [1/3] 测试登录接口...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo 请复制上面返回的 token，然后手动测试以下接口：
echo.
echo [2/3] 获取用户信息：
echo curl -X GET http://localhost:8080/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
echo.
echo [3/3] 注销：
echo curl -X POST http://localhost:8080/api/auth/logout -H "Authorization: Bearer YOUR_TOKEN"
echo.
echo ========================================
echo 测试完成
echo ========================================
pause
