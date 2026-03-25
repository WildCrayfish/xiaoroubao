# Deploy 使用说明（单仓库：GitHub 拉代码后在 NAS 本地构建）

## 目录要求
请保持仓库结构：
- `NavHub/`（前端）
- `NavHub-Con/`（后端）
- `deploy/`（部署文件）

## 1) 准备配置与目录
1. 复制环境变量文件：
```bash
cp env.example .env
```
2. 复制后端配置模板并放到 NAS：
```bash
cp application-prod.yml.example /nas/app/config/application-prod.yml
```
3. 确保 NAS 目录存在：
```bash
mkdir -p /nas/mysql/data /nas/app/config
```

## 2) 首次部署（在 deploy 目录）
```bash
docker compose --env-file .env up -d --build
```

## 3) 日常更新（GitHub 拉取后重建）
```bash
git pull
docker compose --env-file .env up -d --build nginx backend
```

## 4) 查看状态
```bash
docker compose ps
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f mysql
```

## 注意事项
- 不要执行：`docker compose down -v`
- 不要对 mysql 配置公网端口映射
- mysql 数据在 `/nas/mysql/data`，更新容器不会丢失
