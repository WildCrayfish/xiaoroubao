# NavHub 认证接口测试脚本（PowerShell）
# 使用方法：在 PowerShell 中执行 .\测试脚本.ps1

$baseUrl = "http://localhost:8080/api"
$username = "admin"
$password = "admin123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NavHub 认证接口测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 测试登录
Write-Host "[1/3] 测试登录接口..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    if ($loginResponse.code -eq 0) {
        Write-Host "✓ 登录成功！" -ForegroundColor Green
        Write-Host "  用户名: $($loginResponse.data.user.username)" -ForegroundColor Gray
        Write-Host "  是否管理员: $($loginResponse.data.user.isAdmin)" -ForegroundColor Gray
        
        $token = $loginResponse.data.token
        Write-Host "  Token: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Gray
        Write-Host ""
        
        # 2. 测试获取用户信息
        Write-Host "[2/3] 测试获取用户信息接口..." -ForegroundColor Yellow
        try {
            $meResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" `
                -Method GET `
                -Headers @{"Authorization" = "Bearer $token"}
            
            if ($meResponse.code -eq 0) {
                Write-Host "✓ 获取用户信息成功！" -ForegroundColor Green
                Write-Host "  用户ID: $($meResponse.data.id)" -ForegroundColor Gray
                Write-Host "  用户名: $($meResponse.data.username)" -ForegroundColor Gray
                Write-Host "  邮箱: $($meResponse.data.email)" -ForegroundColor Gray
                Write-Host ""
            } else {
                Write-Host "✗ 获取用户信息失败: $($meResponse.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ 获取用户信息异常: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 3. 测试注销
        Write-Host "[3/3] 测试注销接口..." -ForegroundColor Yellow
        try {
            $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" `
                -Method POST `
                -Headers @{"Authorization" = "Bearer $token"}
            
            if ($logoutResponse.code -eq 0) {
                Write-Host "✓ 注销成功！" -ForegroundColor Green
                Write-Host ""
            } else {
                Write-Host "✗ 注销失败: $($logoutResponse.message)" -ForegroundColor Red
            }
        } catch {
            Write-Host "✗ 注销异常: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "✗ 登录失败: $($loginResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ 登录异常: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  请确保后端服务已启动（http://localhost:8080）" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
