import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { TagCard } from './tag-card';
import type { Tool } from '@/api/types';
import { cn } from '@/utils/cn';

interface SortableTagCardProps {
  tool: Tool;
  isAdmin: boolean;
  onFavoriteToggle: (id: string) => void;
}

/**
 * 可拖拽排序的工具卡片
 * 管理员模式下显示拖拽手柄
 */
export function SortableTagCard({
  tool,
  isAdmin,
  onFavoriteToggle,
}: SortableTagCardProps) {
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

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* 拖拽手柄 - 仅管理员可见，位于卡片左上角 */}
      {isAdmin && (
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute left-3 top-3 z-20',
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'cursor-grab active:cursor-grabbing',
            'bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm',
            'hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600',
            'text-gray-400 transition-all duration-200'
          )}
          title="拖拽排序"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      <div>
        <TagCard
          tool={tool}
          onFavoriteToggle={onFavoriteToggle}
        />
      </div>
    </div>
  );
}

