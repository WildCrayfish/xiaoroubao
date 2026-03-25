# Deploy 使用说明（单文件 + GitHub Actions 自动推镜像）

本项目当前使用：
- **单文件 compose 部署**（NAS 只导入 `docker-compose.yml`）
- **GitHub Actions 自动构建并推送 GHCR 镜像**

## 一、已启用的自动化
仓库包含工作流：`.github/workflows/build-and-push-images.yml`

触发条件：
- push 到 `main`
- 手动触发（workflow_dispatch）

自动推送镜像：
- `ghcr.io/wildcrayfish/navhub-nginx:v1`
- `ghcr.io/wildcrayfish/navhub-backend:v1`

## 二、上线前必做
1. 在 `docker-compose.yml` 里替换真实密码：
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
   - `SPRING_DATASOURCE_PASSWORD`
2. NAS 创建数据目录：
```bash
mkdir -p /nas/mysql/data
```
3. 若 GHCR 包是私有，先在 NAS 登录：
```bash
docker login ghcr.io -u <github-username>
```

## 三、首次部署
在 NAS 的 Docker/Compose 导入 `docker-compose.yml` 并启动；或命令行：
```bash
docker compose pull
docker compose up -d
```

## 四、后续更新
由于 compose 中 `nginx`/`backend` 配置了 `pull_policy: always`，每次重启会尝试拉取最新同标签镜像。

推荐发布动作：
1. 本地提交并 push 到 `main`
2. 等待 GitHub Actions 构建完成
3. 在 NAS 执行：
```bash
docker compose up -d
```

## 五、验收命令
```bash
docker compose ps
docker compose logs -f mysql
docker compose logs -f backend
docker compose logs -f nginx
curl -I http://127.0.0.1
```

## 注意事项
- 不要执行：`docker compose down -v`（会删卷数据）
- mysql 不要暴露公网端口
- `v1` 为固定标签，如需可回滚发布，建议后续改为版本标签（如 `v1.0.1`）
