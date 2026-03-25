@echo off
chcp 65001 >nul
echo ========================================
echo NavHub 数据库连接问题快速修复
echo ========================================
echo.

echo [步骤 1] 检查 MySQL 服务状态...
sc query MySQL80 | findstr "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✓ MySQL 服务正在运行
) else (
    echo ✗ MySQL 服务未运行，正在启动...
    net start MySQL80
    if %errorlevel% equ 0 (
        echo ✓ MySQL 服务已启动
    ) else (
        echo ✗ 无法启动 MySQL 服务，请检查 MySQL 是否已安装
        pause
        exit /b 1
    )
)

echo.
echo [步骤 2] 测试 MySQL 连接...
echo 请输入 MySQL root 密码进行测试：
mysql -u root -p -e "SELECT 'Connection successful!' AS message;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ MySQL 连接成功
) else (
    echo.
    echo ========================================
    echo 连接失败！可能的原因：
    echo ========================================
    echo 1. 密码不正确
    echo 2. MySQL 服务未启动
    echo 3. 用户不存在
    echo.
    echo 解决方案：
    echo 1. 重置 root 密码（参考：数据库连接问题解决.md）
    echo 2. 修改 application.yml 中的密码
    echo 3. 创建新的数据库用户
    echo.
    echo 详细说明请查看：数据库连接问题解决.md
    echo.
    pause
    exit /b 1
)

echo.
echo [步骤 3] 检查数据库是否存在...
mysql -u root -p -e "SHOW DATABASES LIKE 'navhub';" 2>nul | findstr "navhub" >nul
if %errorlevel% equ 0 (
    echo ✓ 数据库 navhub 已存在
) else (
    echo ✗ 数据库 navhub 不存在
    echo 正在创建数据库...
    mysql -u root -p < src\main\resources\db\init.sql
    if %errorlevel% equ 0 (
        echo ✓ 数据库已创建并初始化
    ) else (
        echo ✗ 数据库创建失败，请手动执行 init.sql
    )
)

echo.
echo ========================================
echo 修复完成！
echo ========================================
echo.
echo 请检查 application.yml 中的数据库配置：
echo   username: root
echo   password: （你的 MySQL root 密码）
echo.
echo 如果密码不正确，请修改 application.yml 后重启项目
echo.
pause
