# NavHub - 网页工具导航

一个前后端分离的网页工具导航系统，使用 React + TypeScript + Vite 构建。

## 技术栈

### 前端
- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: react-router-dom
- **HTTP 请求**: axios

## 项目结构

```
src/
├─ api/            # 所有后端接口封装
│   ├─ auth.ts
│   ├─ category.ts
│   ├─ tool.ts
│   ├─ request.ts
│   ├─ types.ts
│   └─ mock.ts     # Mock 数据（后端未就绪时使用）
│
├─ app/
│   └─ components/ # 可复用组件
│       ├─ header.tsx
│       ├─ sidebar.tsx
│       ├─ tag-card.tsx
│       ├─ edit-modal.tsx
│       └─ animated-background.tsx
│
├─ pages/          # 页面级组件
│   ├─ Login.tsx
│   ├─ Home.tsx
│   └─ Admin.tsx
│
├─ layouts/        # 页面布局
│   └─ MainLayout.tsx
│
├─ hooks/          # 业务逻辑 Hooks
│   ├─ useAuth.ts
│   ├─ useTools.ts
│   └─ useCategories.ts
│
├─ router/         # 路由配置
│   └─ index.tsx
│
├─ styles/         # 全局样式
│   ├─ index.css
│   ├─ tailwind.css
│   ├─ theme.css
│   └─ fonts.css
│
├─ utils/          # 工具函数
│   └─ cn.ts
│
└─ main.tsx        # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

项目将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 功能特性

- ✅ 工具分类导航
- ✅ 搜索功能
- ✅ 工具收藏
- ✅ 管理员工具管理（增删改查）
- ✅ 响应式设计
- ✅ 玻璃态 UI 效果
- ✅ 动画背景

## Mock 数据模式

目前项目使用 Mock 数据模式（后端未就绪）。要切换到真实 API：

1. 修改 `src/api/auth.ts`、`src/api/tool.ts`、`src/api/category.ts` 中的 `USE_MOCK` 为 `false`
2. 确保后端服务运行在 `http://localhost:8080/api`
3. 创建 `.env` 文件并设置 `VITE_API_BASE_URL`

## 开发建议

1. **业务逻辑与 UI 解耦**: 所有业务逻辑都在 `hooks/` 目录中
2. **API 调用统一**: 所有 API 调用都在 `api/` 目录中
3. **组件复用**: 可复用组件放在 `app/components/` 目录
4. **类型安全**: 使用 TypeScript 确保类型安全

## 下一步

- [ ] 连接真实后端 API
- [ ] 添加用户注册功能
- [ ] 添加更多工具分类
- [ ] 优化移动端体验
- [ ] 添加深色模式

## 许可证

MIT
