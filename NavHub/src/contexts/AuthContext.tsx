import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi } from '@/api/auth';
import type { User, LoginRequest } from '@/api/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 初始化用户信息，并验证 Token 有效性
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 AuthProvider 初始化开始');
      const token = localStorage.getItem('navhub-token');
      const savedUser = localStorage.getItem('navhub-user');
      
      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log('👤 解析本地用户信息:', user);
          setUser(user);
          
          try {
            console.log('🔄 验证 Token 有效性...');
            const currentUser = await authApi.getCurrentUser();
            console.log('✅ Token 验证成功:', currentUser);
            setUser(currentUser);
            localStorage.setItem('navhub-user', JSON.stringify(currentUser));
          } catch (error) {
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
      }
      
      setIsLoading(false);
      console.log('🔐 AuthProvider 初始化完成');
    };
    
    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      localStorage.setItem('navhub-token', response.token);
      localStorage.setItem('navhub-user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('navhub-token');
    localStorage.removeItem('navhub-user');
    setUser(null);
    authApi.logout().catch(console.error);
  }, []);

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
      localStorage.removeItem('navhub-token');
      localStorage.removeItem('navhub-user');
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
