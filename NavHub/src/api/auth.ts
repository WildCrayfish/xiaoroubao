import request from './request';
import type { LoginRequest, LoginResponse } from './types';
import { mockApi } from './mock';

// 是否使用 Mock 数据（后端未就绪时设为 true）
const USE_MOCK = false; // 切换到真实后端 API

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK) {
      return mockApi.login(data.username, data.password);
    }
    return request.post('/auth/login', data);
  },

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    if (USE_MOCK) {
      return Promise.resolve();
    }
    return request.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<LoginResponse['user']> {
    if (USE_MOCK) {
      const savedUser = localStorage.getItem('navhub-user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      throw new Error('未登录');
    }
    return request.get('/auth/me');
  },
};
