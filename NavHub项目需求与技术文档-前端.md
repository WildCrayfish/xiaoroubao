# NavHub 前端技术文档

> **版本**: v1.0.0  
> **技术栈**: React 18 + TypeScript 5 + Vite 6 + Tailwind CSS 4

---

## 📋 目录

1. [项目结构](#项目结构)
2. [技术栈详解](#技术栈详解)
3. [核心功能实现](#核心功能实现)
4. [组件设计](#组件设计)
5. [状态管理](#状态管理)
6. [API 封装](#api-封装)
7. [样式设计](#样式设计)
8. [开发指南](#开发指南)

---

## 📁 项目结构

```
NavHub/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── request.ts         # Axios 封装、拦截器
│   │   ├── auth.ts            # 认证相关接口
│   │   ├── tool.ts            # 工具相关接口
│   │   ├── category.ts        # 分类相关接口
│   │   ├── siteConfig.ts      # 站点配置接口
│   │   ├── types.ts           # TypeScript 类型定义
│   │   └── mock.ts            # Mock 数据（开发用）
│   │
│   ├── pages/                  # 页面组件
│   │   ├── Home.tsx           # 首页 - 工具展示
│   │   ├── Login.tsx          # 登录页
│   │   └── Admin.tsx          # 管理后台
│   │
│   ├── app/
│   │   ├── App.tsx            # 根组件
│   │   └── components/        # 可复用组件
│   │       ├── header.tsx              # 头部导航
│   │       ├── sidebar.tsx             # 侧边栏
│   │       ├── tag-card.tsx            # 工具卡片
│   │       ├── sortable-tag-card.tsx   # 可拖拽工具卡片
│   │       ├── edit-modal.tsx          # 编辑模态框
│   │       ├── category-modal.tsx      # 分类模态框
│   │       ├── animated-background.tsx # 动画背景
│   │       ├── theme-toggle.tsx        # 主题切换
│   │       └── admin/                  # 管理后台组件
│   │           ├── ToolManager.tsx     # 工具管理器
│   │           ├── CategoryManager.tsx # 分类管理器
│   │           ├── LogoUploader.tsx    # Logo 上传器
│   │           └── VersionManager.tsx  # 版本管理器
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAuth.ts         # 认证逻辑
│   │   ├── useTools.ts        # 工具管理逻辑
│   │   ├── useCategories.ts   # 分类管理逻辑
│   │   └── useSiteConfig.ts   # 站点配置逻辑
│   │
│   ├── contexts/               # React Context
│   │   ├── AuthContext.tsx    # 认证上下文
│   │   ├── ConfigContext.tsx  # 配置上下文
│   │   └── ThemeContext.tsx   # 主题上下文
│   │
│   ├── layouts/                # 布局组件
│   │   └── MainLayout.tsx     # 主布局
│   │
│   ├── router/                 # 路由配置
│   │   └── index.tsx          # 路由定义
│   │
│   ├── utils/                  # 工具函数
│   │   ├── cn.ts              # 类名合并工具
│   │   ├── iconUtils.ts       # 图标处理工具
│   │   └── smartSearch.ts     # 智能搜索算法
│   │
│   ├── styles/                 # 样式文件
│   │   ├── index.css          # 全局样式
│   │   ├── tailwind.css       # Tailwind 配置
│   │   ├── theme.css          # 主题变量
│   │   └── fonts.css          # 字体定义
│   │
│   └── main.tsx               # 应用入口
│
├── public/                     # 静态资源
│   └── assets/
│       └── logo.png
│
├── index.html                  # HTML 模板
├── package.json               # 依赖配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
├── tailwind.config.js         # Tailwind 配置
└── postcss.config.mjs         # PostCSS 配置
```

---

## 🛠️ 技术栈详解

### 核心技术

#### 1. React 18.3.1
**用途**: UI 框架

**核心特性**:
- 组件化开发
- 虚拟 DOM
- Hooks API
- Concurrent Mode

**使用场景**:
- 所有 UI 组件
- 状态管理
- 生命周期管理

#### 2. TypeScript 5.6.3
**用途**: 编程语言

**核心特性**:
- 静态类型检查
- 接口定义
- 类型推断
- 代码提示

**类型定义示例**:
```typescript
// src/api/types.ts
export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  categoryId: string;
  tags?: string[];
  isPublished: boolean;
  isFavorite?: boolean;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort: number;
  isVisible: boolean;
}
```

#### 3. Vite 6.3.5
**用途**: 构建工具

**核心特性**:
- 极速冷启动
- 即时热更新 (HMR)
- 按需编译
- 优化的生产构建

**配置示例**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

#### 4. Tailwind CSS 4.1.12
**用途**: CSS 框架

**核心特性**:
- 原子化 CSS
- 响应式设计
- 暗色模式支持
- JIT 编译

**使用示例**:
```tsx
<div className="flex items-center gap-4 p-6 rounded-xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
  <h1 className="text-2xl font-bold text-gray-900">NavHub</h1>
</div>
```

### 辅助库

#### 1. React Router 6.26.0
**用途**: 路由管理

**路由配置**:
```typescript
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import MainLayout from '@/layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
]);
```

#### 2. Axios 1.7.7
**用途**: HTTP 客户端

**封装示例**:
```typescript
// src/api/request.ts
import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('navhub-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('navhub-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
```

#### 3. @dnd-kit 6.3.1
**用途**: 拖拽功能

**使用示例**:
```tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function ToolList({ tools, onReorder }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tools.findIndex(t => t.id === active.id);
      const newIndex = tools.findIndex(t => t.id === over.id);
      const newTools = arrayMove(tools, oldIndex, newIndex);
      onReorder(newTools);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tools} strategy={verticalListSortingStrategy}>
        {tools.map(tool => <SortableToolCard key={tool.id} tool={tool} />)}
      </SortableContext>
    </DndContext>
  );
}
```

---

## 🎯 核心功能实现

### 1. 用户认证

#### AuthContext 实现
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('navhub-token');
    if (token) {
      authApi.me().then(setUser).catch(() => {
        localStorage.removeItem('navhub-token');
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await authApi.login(username, password);
    localStorage.setItem('navhub-token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('navhub-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.isAdmin || false, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 2. 工具管理

#### useTools Hook
```typescript
// src/hooks/useTools.ts
import { useState, useEffect, useCallback } from 'react';
import { toolApi } from '@/api/tool';
import type { Tool } from '@/api/types';

export function useTools(params = {}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await toolApi.getAll(params);
      setTools(data.sort((a, b) => a.sort - b.sort));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const addTool = async (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTool = await toolApi.create(tool);
    setTools(prev => [...prev, newTool]);
    return newTool;
  };

  const updateTool = async (id: string, tool: Partial<Tool>) => {
    const updatedTool = await toolApi.update(id, tool);
    setTools(prev => prev.map(t => t.id === id ? updatedTool : t));
    return updatedTool;
  };

  const deleteTool = async (id: string) => {
    await toolApi.delete(id);
    setTools(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const updatedTool = await toolApi.toggleFavorite(id);
    setTools(prev => prev.map(t => t.id === id ? updatedTool : t));
  };

  const reorderTools = async (orderedTools: Tool[]) => {
    await toolApi.reorder(orderedTools);
    setTools(orderedTools);
  };

  return {
    tools,
    isLoading,
    error,
    fetchTools,
    addTool,
    updateTool,
    deleteTool,
    toggleFavorite,
    reorderTools,
  };
}
```

### 3. 智能搜索

#### 搜索算法实现
```typescript
// src/utils/smartSearch.ts
export function smartSearch(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return tools;

  const keywords = query.toLowerCase().split(/\s+/);
  
  return tools
    .map(tool => {
      let score = 0;
      const searchText = `${tool.name} ${tool.description} ${tool.tags?.join(' ')}`.toLowerCase();
      
      keywords.forEach(keyword => {
        // 名称完全匹配 +10分
        if (tool.name.toLowerCase() === keyword) score += 10;
        // 名称包含 +5分
        else if (tool.name.toLowerCase().includes(keyword)) score += 5;
        // 描述包含 +2分
        else if (tool.description?.toLowerCase().includes(keyword)) score += 2;
        // 标签匹配 +3分
        else if (tool.tags?.some(tag => tag.toLowerCase().includes(keyword))) score += 3;
      });
      
      return { tool, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ tool }) => tool);
}
```

---

## 🎨 组件设计

### 1. ToolCard 组件

**功能**: 展示单个工具卡片

**Props**:
```typescript
interface ToolCardProps {
  tool: Tool;
  onEdit?: (tool: Tool) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isAdmin?: boolean;
}
```

**实现**:
```tsx
// src/app/components/tag-card.tsx
export function ToolCard({ tool, onEdit, onDelete, onToggleFavorite, isAdmin }: ToolCardProps) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
      {/* 图标 */}
      <div className="text-4xl mb-4">{tool.icon}</div>
      
      {/* 标题 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
      
      {/* 描述 */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
      
      {/* 标签 */}
      {tool.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <a href={tool.url} target="_blank" className="flex-1 btn-primary">
          访问
        </a>
        
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(tool.id)} className="btn-icon">
            <Heart className={tool.isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        )}
        
        {isAdmin && (
          <>
            <button onClick={() => onEdit?.(tool)} className="btn-icon">
              <Edit />
            </button>
            <button onClick={() => onDelete?.(tool.id)} className="btn-icon">
              <Trash />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

### 2. EditModal 组件

**功能**: 工具编辑模态框

**实现要点**:
- 表单验证
- 图标选择
- 分类选择
- 标签输入

### 3. ToolManager 组件

**功能**: 管理后台工具管理器

**实现要点**:
- 工具列表展示
- 拖拽排序
- 批量操作
- 发布/下架

---

## 📱 响应式设计

### 断点配置

```css
/* Tailwind 默认断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏 */
```

### 响应式布局示例

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
</div>
```

---

## 🚀 性能优化

### 1. 代码分割
```typescript
// 路由懒加载
const Admin = lazy(() => import('@/pages/Admin'));
```

### 2. 图片优化
```tsx
<img src={tool.icon} loading="lazy" alt={tool.name} />
```

### 3. 防抖节流
```typescript
import { debounce } from 'lodash-es';

const handleSearch = debounce((query: string) => {
  setSearchQuery(query);
}, 300);
```

---

## 📝 开发指南

### 环境变量

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 启动开发服务器

```bash
npm install
npm run dev
```

### 构建生产版本

```bash
npm run build
npm run preview
```

---

**文档维护**: 前端团队  
**最后更新**: 2025-02-21
