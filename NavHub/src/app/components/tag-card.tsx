import { Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Tool } from '@/api/types';
import { cn } from '@/utils/cn';
import { isIconUrl } from '@/utils/iconUtils';

interface TagCardProps {
  tool: Tool;
  onFavoriteToggle: (id: string) => void;
}

export function TagCard({ 
  tool,
  onFavoriteToggle,
}: TagCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 液态玻璃效果容器 */}
      <div className="relative h-full">
        {/* 外层光晕 */}
        <div className={cn(
          'absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30',
          'dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20',
          'opacity-0 blur-lg transition-all duration-500',
          isHovered && 'opacity-100'
        )} />
        
        {/* 主卡片 */}
        <div className={cn(
          'relative h-full p-6 rounded-2xl overflow-hidden',
          'flex flex-col', // 添加 flex 布局
          'backdrop-blur-2xl',
          'bg-gradient-to-br from-white/80 via-white/70 to-white/60',
          'dark:from-slate-800/85 dark:via-slate-800/75 dark:to-slate-900/85',
          'border border-white/50 dark:border-slate-700/70 shadow-xl',
          'transition-all duration-500',
          isHovered && 'shadow-2xl scale-[1.03] border-white/70 dark:border-slate-600/80',
          !tool.isPublished && 'opacity-60'
        )}>
          {/* 液态流光效果 */}
          <div className={cn(
            'absolute top-0 left-0 right-0 h-px',
            'bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent',
            'dark:via-purple-400/60',
            'transition-all duration-700',
            isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
          )} />
          
          {/* 玻璃反光效果 */}
          <div className={cn(
            'absolute inset-0 rounded-2xl',
            'bg-gradient-to-br from-white/40 via-transparent to-transparent',
            'dark:from-white/10',
            'opacity-0 transition-opacity duration-500',
            isHovered && 'opacity-100'
          )} />

          {/* 动态光斑效果 */}
          <div className={cn(
            'absolute w-32 h-32 -top-16 -right-16 rounded-full',
            'bg-gradient-to-br from-indigo-400/20 to-purple-400/20',
            'blur-2xl transition-all duration-700',
            isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
          )} />

          {/* Icon with Status Indicator */}
          <div className="mb-4 relative z-10">
            <div className="relative inline-block">
              {isIconUrl(tool.icon || '') ? (
                <div className={cn(
                  'w-12 h-12 rounded-xl bg-white/80 dark:bg-slate-700/70 backdrop-blur-sm',
                  'flex items-center justify-center shadow-lg overflow-hidden',
                  'transition-all duration-300 border border-white/50 dark:border-slate-600/50',
                  isHovered && 'shadow-xl scale-110'
                )}>
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 如果图片加载失败，回退到emoji显示
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-2xl">🔗</span>';
                        parent.className = cn(
                          'w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600',
                          'flex items-center justify-center text-2xl shadow-lg',
                          'transition-all duration-300',
                          isHovered && 'shadow-xl scale-110'
                        );
                      }
                    }}
                  />
                </div>
              ) : (
              <div className={cn(
                'w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600',
                'flex items-center justify-center text-2xl shadow-lg',
                'transition-all duration-300',
                isHovered && 'shadow-xl scale-110'
              )}>
                  {tool.icon || '🔗'}
              </div>
              )}
              
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1">
                <div className={cn(
                  'relative w-3.5 h-3.5 rounded-full',
                  tool.isOnline ? 'bg-green-400' : 'bg-gray-400',
                  'border-2 border-white',
                  'transition-all duration-300'
                )}>
                  {/* 呼吸灯效果 */}
                  {tool.isOnline && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4 relative z-10 flex-1"> {/* 添加 flex-1 让内容区域自动填充 */}
            <h3 className="mb-2 text-lg font-medium text-foreground">{tool.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2">
              {tool.description}
            </p>
            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-lg bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-800/90 dark:to-purple-800/90 text-indigo-700 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-600/60 backdrop-blur-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs rounded-lg bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-slate-700/90 dark:to-slate-600/90 text-gray-600 dark:text-gray-200 border border-gray-200/50 dark:border-slate-600/60 backdrop-blur-sm font-medium">
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/40 dark:border-slate-600/50 relative z-10 mt-auto"> {/* 添加 mt-auto 让按钮始终在底部 */}
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <span>访问</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Favorite Button */}
            <button
              onClick={() => onFavoriteToggle(tool.id)}
              className={cn(
                'p-2 rounded-lg transition-all duration-300',
                tool.isFavorite 
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110'
              )}
              title={tool.isFavorite ? '取消收藏' : '收藏'}
            >
              <Heart className={cn('w-6 h-6 transition-all', tool.isFavorite && 'fill-current')} />
            </button>
          </div>

          {/* 底部液态效果 */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 h-20',
            'bg-gradient-to-t from-indigo-50/30 to-transparent',
            'dark:from-indigo-950/30',
            'opacity-0 transition-opacity duration-500',
            isHovered && 'opacity-100'
          )} />
        </div>
      </div>
    </div>
  );
}
