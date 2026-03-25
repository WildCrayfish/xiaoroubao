import { Music, Tv, Download, Wrench, ChevronDown, X, Heart } from 'lucide-react';
import { useState } from 'react';
import type { Category } from '@/api/types';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  categories: Category[];
}

// 分类图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  all: <Wrench className="w-5 h-5" />,
  favorites: <Heart className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
  video: <Tv className="w-5 h-5" />,
  download: <Download className="w-5 h-5" />,
  tools: <Wrench className="w-5 h-5" />,
};

export function Sidebar({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  onCategorySelect,
  categories 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getCategoryIcon = (category: Category) => {
    // 优先使用分类自带的图标（Emoji）
    if (category.icon) {
      return <span className="text-xl">{category.icon}</span>;
    }
    // 否则使用默认图标映射
    return categoryIcons[category.id] || <Wrench className="w-6 h-6" />;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isCollapsed ? 'md:w-20' : 'md:w-72',
          'w-72'
        )}
      >
        <div className="h-full backdrop-blur-2xl bg-white/40 dark:bg-slate-900/40 border-r border-white/30 dark:border-slate-700/30 shadow-lg transition-colors duration-300">
          <div className="p-6 flex flex-col h-full">
            {/* Header with Collapse Toggle */}
            <div className="flex items-center justify-between mb-6">
              {!isCollapsed && <h2 className="text-base font-semibold text-foreground">分类导航</h2>}
              <button
                onClick={onClose}
                className="md:hidden p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  'hidden md:block p-1 rounded-lg hover:bg-black/5 transition-all',
                  isCollapsed && 'rotate-180'
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Categories */}
            <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl',
                    'transition-all duration-200',
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'hover:bg-white/40 dark:hover:bg-slate-800/60 hover:backdrop-blur-sm hover:scale-102 text-foreground',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? category.name : undefined}
                >
                  <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {getCategoryIcon(category)}
                  </span>
                  {!isCollapsed && <span className="text-base font-medium">{category.name}</span>}
                </button>
              ))}
            </nav>

            {/* Footer Info */}
            {!isCollapsed && (
              <div className="mt-auto pt-6 border-t border-white/30 dark:border-slate-700/30">
                <div className="px-4 py-3 rounded-xl bg-white/30 dark:bg-indigo-900/20 backdrop-blur-sm border border-white/30 dark:border-indigo-800/30">
                  <p className="text-sm text-muted-foreground">共 {categories.length} 个分类</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
