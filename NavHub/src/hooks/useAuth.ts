import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';
import type { User, LoginRequest } from '@/api/types';

interface UseAuthReturn {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

/**
 * 认证相关的业务逻辑 Hook
 * 管理用户登录状态、权限等
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 初始化用户信息，并验证 Token 有效性
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 useAuth 初始化开始');
      const token = localStorage.getItem('navhub-token');
      const savedUser = localStorage.getItem('navhub-user');
      
      console.log('📦 localStorage 数据:', { 
        hasToken: !!token, 
        hasSavedUser: !!savedUser,
        token: token?.substring(0, 20) + '...',
        savedUser: savedUser?.substring(0, 50) + '...'
      });
      
      if (token && savedUser) {
        try {
          // 先使用本地保存的用户信息（快速显示）
          const user = JSON.parse(savedUser);
          console.log('👤 解析本地用户信息:', user);
          setUser(user);
          
          // 然后验证 Token 有效性（从后端获取最新用户信息）
          try {
            console.log('🔄 验证 Token 有效性...');
            const currentUser = await authApi.getCurrentUser();
            console.log('✅ Token 验证成功:', currentUser);
            setUser(currentUser);
            localStorage.setItem('navhub-user', JSON.stringify(currentUser));
          } catch (error) {
            // Token 无效，清除本地数据
            console.warn('❌ Token 验证失败:', error);
            localStorage.removeItem('navhub-token');
            localStorage.removeItem('navhub-user');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ 解析用户数据失败:', error);
          localStorage.removeItem('navhub-user');
          localStorage.removeItem('navhub-token');
          setUser(null);
        }
      } else {
        console.log('⚠️ 没有 token 或用户信息');
      }
      
      setIsLoading(false);
      console.log('🔐 useAuth 初始化完成');
    };
    
    initAuth();
  }, []);

  /**
   * 登录
   */
  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      
      // 保存 token 和用户信息
      localStorage.setItem('navhub-token', response.token);
      localStorage.setItem('navhub-user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  /**
   * 登出
   */
  const logout = useCallback(() => {
    localStorage.removeItem('navhub-token');
    localStorage.removeItem('navhub-user');
    setUser(null);
    
    // 调用后端登出接口（可选）
    authApi.logout().catch(console.error);
  }, []);

  /**
   * 检查认证状态（从后端获取最新用户信息）
   */
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('navhub-token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('navhub-user', JSON.stringify(currentUser));
    } catch (error) {
      // 认证失败，清除本地数据
      localStorage.removeItem('navhub-token');
      localStorage.removeItem('navhub-user');
      setUser(null);
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
