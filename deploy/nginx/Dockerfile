# 前端构建阶段
FROM node:20-alpine AS frontend-builder
WORKDIR /web

COPY NavHub/package*.json ./
RUN npm ci
COPY NavHub/ ./
RUN npm run build

# Nginx 运行阶段
FROM nginx:1.27-alpine
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /web/dist /usr/share/nginx/html
