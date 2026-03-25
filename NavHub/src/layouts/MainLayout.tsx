import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/app/components/header';
import { Sidebar } from '@/app/components/sidebar';
import { AnimatedBackground } from '@/app/components/animated-background';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/api/types';

interface MainLayoutProps {
  children: React.ReactNode;
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function MainLayout({
  children,
  selectedCategory = 'all',
  onCategorySelect,
  searchQuery = '',
  onSearchChange
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();

  // 配置页面不显示侧边栏
  const showSidebar = location.pathname !== '/admin';

  // 首页侧边栏增加“个人收藏”虚拟分类
  const sidebarCategories: Category[] = [
    { id: 'all', name: '全部', isVisible: true },
    { id: 'favorites', name: '个人收藏', icon: '❤️', isVisible: true },
    ...categories.filter((c) => c.id !== 'all' && c.id !== 'favorites'),
  ];

  const handleLogin = () => {
    console.log('🔑 点击登录按钮');
    console.log('📍 当前路径:', location.pathname);
    console.log('🚀 准备跳转到 /login');
    navigate('/login');
    console.log('✅ navigate 调用完成');
  };

  const handleLogout = () => {
    logout();
    // 延迟跳转，确保 logout 完成
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  return (
    <div className="min-h-screen relative transition-colors duration-300">
      {/* 彩虹渐变动画背景 */}
      <div className="absolute inset-0 animate-rainbow-flow"></div>

      {/* 粒子特效层 */}
      <AnimatedBackground />

      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Header */}
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange || (() => {})}
        isLoggedIn={isLoggedIn}
        userName={user?.username || '用户'}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* Main Layout */}
      <div className="flex pt-16 relative z-10">
        {/* Sidebar - 配置页面不显示 */}
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect || (() => {})}
            categories={sidebarCategories}
          />
        )}

        {/* Main Content */}
        <main className={`${showSidebar ? 'flex-1' : 'w-full'} p-8 md:p-12 min-h-[calc(100vh-4rem)]`}>
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}