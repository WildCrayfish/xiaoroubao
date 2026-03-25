import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Tool } from '@/api/types';
import type { Category } from '@/api/types';
import { cn } from '@/utils/cn';
import { isIconUrl } from '@/utils/iconUtils';

interface SortableToolItemProps {
  tool: Tool;
  categories: Category[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void | Promise<void>;
}

/**
 * 可拖拽排序的工具项组件
 */
export function SortableToolItem({
  tool,
  categories,
  onEdit,
  onDelete,
  onTogglePublish,
}: SortableToolItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const category = categories.find(c => c.id === tool.categoryId);

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className={cn(
          'relative p-4 rounded-2xl overflow-hidden',
          'backdrop-blur-xl',
          'bg-gradient-to-br from-white/70 via-white/50 to-white/30',
          'border border-white/60 shadow-lg',
          'transition-all duration-300',
          'hover:shadow-xl hover:scale-[1.02]',
          !tool.isPublished && 'opacity-60'
        )}
      >
        {/* 拖拽手柄 */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute left-2 top-2 z-10',
            'w-6 h-6 rounded-lg flex items-center justify-center',
            'cursor-grab active:cursor-grabbing',
            'bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm',
            'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600',
            'text-gray-400 transition-all duration-200'
          )}
          title="拖拽排序"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* 内容 */}
        <div className="pl-8">
          {/* 图标和标题 */}
          <div className="flex items-start gap-3 mb-3">
            {isIconUrl(tool.icon || '') ? (
              <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-md overflow-hidden border border-white/40 flex-shrink-0">
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
                      parent.innerHTML = '<span class="text-xl">🔗</span>';
                      parent.className = 'w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md flex-shrink-0';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md flex-shrink-0">
                {tool.icon || '🔗'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate mb-1">{tool.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
            </div>
          </div>

          {/* 分类和标签 */}
          <div className="mb-3 space-y-2">
            {category && (
              <div className="text-xs text-muted-foreground">
                分类: {category.name}
              </div>
            )}
            {tool.tags && tool.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tool.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-lg bg-gradient-to-r from-indigo-100/80 to-purple-100/80 text-indigo-700 border border-indigo-200/50"
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs rounded-lg bg-gray-100/80 text-gray-600">
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/40">
            <button
              onClick={() => onEdit(tool)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/50 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-xs font-medium flex items-center justify-center gap-1"
            >
              <Edit className="w-3 h-3" />
              编辑
            </button>
            <button
              onClick={() => onTogglePublish(tool.id)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                tool.isPublished
                  ? 'bg-white/50 hover:bg-amber-50 hover:text-amber-600'
                  : 'bg-white/50 hover:bg-green-50 hover:text-green-600'
              )}
              title={tool.isPublished ? '下架' : '上架'}
            >
              {tool.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onDelete(tool.id)}
              className="p-1.5 rounded-lg bg-white/50 hover:bg-red-50 hover:text-red-600 transition-all"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

