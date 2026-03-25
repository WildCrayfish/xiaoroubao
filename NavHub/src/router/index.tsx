import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { Admin } from '@/pages/Admin';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

/**
 * 路由配置
 */
export function AppRouter() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 调试信息
  console.log('🔍 路由状态:', { isLoggedIn, isAdmin, isLoading });

  // 加载中显示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 登录页 */}
      <Route 
        path="/login" 
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Login />
        } 
      />

      {/* 主页 */}
      <Route
        path="/"
        element={
          <MainLayout
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          >
            <Home selectedCategory={selectedCategory} searchQuery={searchQuery} />
          </MainLayout>
        }
      />

      {/* 管理员配置页面 - 需要登录 */}
      <Route
        path="/admin"
        element={
          (() => {
            console.log('🚀 访问 /admin 路径', { isLoggedIn, isAdmin, isLoading });
            
            // 如果正在加载，显示加载状态而不是跳转
            if (isLoading) {
              return (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-muted-foreground">验证登录状态...</div>
                </div>
              );
            }
            
            return isLoggedIn ? (
            <MainLayout
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            >
                <Admin />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
            );
          })()
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
