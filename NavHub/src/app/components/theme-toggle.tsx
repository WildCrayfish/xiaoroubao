import { Lightbulb } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'fixed bottom-8 right-8 z-50',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'backdrop-blur-xl shadow-lg',
        'transition-all duration-300 ease-in-out',
        'hover:scale-110 active:scale-95',
        'group',
        theme === 'light'
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:shadow-yellow-500/50'
          : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white hover:shadow-purple-500/50'
      )}
      aria-label="切换主题"
      title={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
    >
      <Lightbulb
        className={cn(
          'w-6 h-6 transition-all duration-300',
          theme === 'light' ? 'rotate-0' : 'rotate-180'
        )}
      />
      
      {/* 光晕效果 */}
      <div
        className={cn(
          'absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity',
          theme === 'light'
            ? 'bg-yellow-400 group-hover:opacity-70'
            : 'bg-purple-600 group-hover:opacity-70'
        )}
      />
    </button>
  );
}

