import { Search, Menu, Settings, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSiteConfig } from '@/hooks/useSiteConfig';

interface HeaderProps {
  onMenuToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogin: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
}

export function Header({ 
  onMenuToggle, 
  searchQuery, 
  onSearchChange, 
  isLoggedIn, 
  userName,
  onLogin,
  onLogout,
  isAdmin = false
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { siteConfig } = useSiteConfig();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 配置页面不显示菜单切换按钮和搜索条
  const showMenuToggle = location.pathname !== '/admin';
  const showSearchBar = location.pathname !== '/admin';

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate('/admin');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/40 dark:bg-slate-900/40 border-b border-white/30 dark:border-slate-700/30 shadow-lg transition-colors duration-300">
      <div className="h-16 px-6 md:px-8 flex items-center justify-between gap-6">
        {/* Logo & Menu Toggle */}
        <div className="flex items-center gap-3 min-w-[200px]">
          {showMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Logo图片或Fallback */}
            {siteConfig.siteLogo && siteConfig.siteLogo !== '/assets/logo.png' ? (
              <img 
                src={siteConfig.siteLogo} 
                alt="Logo"
                className="w-8 h-8 rounded-lg object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // 显示fallback
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm">{siteConfig.siteName?.charAt(0) || 'N'}</span>
            </div>
            )}
            <span className="text-lg hidden sm:block">{siteConfig.siteName || 'NavHub'}</span>
          </button>
        </div>

        {/* Search Bar - 配置页面不显示 */}
        {showSearchBar && (
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="🔍 智能搜索 - 试试输入'设计工具'或'前端开发'..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 回车时触发搜索（实际上已经通过 onChange 实时搜索了）
                  // 这里可以添加额外的逻辑，比如失焦输入框
                  e.currentTarget.blur();
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-white/40 dark:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-purple-500/50 focus:border-indigo-500 dark:focus:border-purple-500 transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        )}

        {/* User Section */}
        <div className="flex items-center gap-2 min-w-[150px] justify-end">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-800/80 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs">{userName?.charAt(0) || 'U'}</span>
                </div>
                <span className="text-sm hidden sm:block">{userName || '用户'}</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl backdrop-blur-2xl bg-white/80 dark:bg-slate-800/90 border border-white/40 dark:border-slate-700/50 shadow-xl overflow-hidden z-[70]">
                  {isAdmin && (
                    <button
                      onClick={handleSettingsClick}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-indigo-50/50 dark:hover:bg-slate-700/70 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">设置</span>
                    </button>
                  )}
                  {isAdmin && <div className="border-t border-white/40 dark:border-slate-700/60" />}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout?.();
                      }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">退出登录</span>
                    </button>
                  </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
