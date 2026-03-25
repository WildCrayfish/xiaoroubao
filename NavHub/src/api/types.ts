// 通用类型定义

// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  avatar?: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  icon?: string;
  sort?: number;
  isVisible?: boolean;
}

// 工具/标签类型
export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  categoryId: string;
  tags?: string[]; // 标签数组
  isFavorite?: boolean;
  isPublished: boolean;
  isOnline?: boolean;
  sort?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: User;
}
