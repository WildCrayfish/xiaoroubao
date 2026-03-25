# NavHub

> 仓库地址：`https://github.com/WildCrayfish/xiaoroubao`

一个前后端分离的导航站项目，包含：
- 前端：`NavHub`（Vue/Vite）
- 后端：`NavHub-Con`（Spring Boot + MyBatis）
- 数据库：MySQL

当前仓库已支持：
- GitHub Actions 自动构建并推送镜像到 GHCR
- 飞牛 NAS 通过单个 `docker-compose.yml` 一键拉取并运行

---

## 目录结构

```text
.
├─ NavHub/                # 前端项目
├─ NavHub-Con/            # 后端项目
├─ deploy/
│  ├─ docker-compose.yml  # NAS 部署入口（单文件）
│  ├─ nginx/              # 前端 nginx 镜像构建文件
│  └─ backend/            # 后端镜像构建文件
└─ .github/workflows/
   └─ build-and-push-images.yml  # 自动构建推送镜像
```

---

## 运行架构

- `nginx`：对外提供前端页面，并反向代理后端接口
- `backend`：Spring Boot 服务（仅容器内暴露 8080）
- `mysql`：数据库服务（不对外暴露端口）

默认对外访问端口（NAS）：
- `9090`（因为 NAS 的 `80` 端口通常被系统占用）

访问地址：
- `http://192.168.0.106:9090`（局域网）
- `http://<NAS-IP>:9090`（通用写法）

---

## 自动化镜像发布（GitHub Actions）

工作流文件：`.github/workflows/build-and-push-images.yml`

触发条件：
- push 到 `main`
- 手动触发（workflow_dispatch）

推送镜像：
- `ghcr.io/wildcrayfish/navhub-nginx:v1`
- `ghcr.io/wildcrayfish/navhub-backend:v1`

---

## NAS 部署（飞牛）

使用文件：`deploy/docker-compose.yml`

### 1) 准备目录（只需一次）

```bash
mkdir -p /vol2/1000/biaoqian/mysql/data
```

### 2) 修改配置

编辑 `deploy/docker-compose.yml`，至少替换以下默认密码：
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `SPRING_DATASOURCE_PASSWORD`

### 3) 启动

```bash
docker compose -f deploy/docker-compose.yml pull
docker compose -f deploy/docker-compose.yml up -d
```

### 4) 验证

```bash
docker compose -f deploy/docker-compose.yml ps
docker compose -f deploy/docker-compose.yml logs -f backend
docker compose -f deploy/docker-compose.yml logs -f mysql
```

---

## 日常更新流程

1. 本地开发并提交：

```bash
git add .
git commit -m "feat: your change"
git push
```

2. 等待 GitHub Actions 构建并推送新镜像
3. NAS 更新：

```bash
docker compose -f deploy/docker-compose.yml pull
docker compose -f deploy/docker-compose.yml up -d
```

---

## 注意事项

- 不要执行 `docker compose down -v`（会删除卷数据）
- MySQL 建议仅容器内访问，不要暴露公网端口
- 建议后续将固定标签 `v1` 升级为版本标签（如 `v1.0.1`）以便回滚

---

## 许可

本仓库当前未单独声明 License。
如需开源发布，建议补充 `LICENSE` 文件（例如 MIT）。

