import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { Plus, Search } from 'lucide-react';
import type { Tool } from '@/api/types';
import type { Category } from '@/api/types';
import { SortableToolItem } from './SortableToolItem';
import { EditToolModal } from './EditToolModal';

interface ToolManagerProps {
  tools: Tool[];
  isLoading: boolean;
  categories: Category[];
  onAdd: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, tool: Partial<Tool>) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void | Promise<void>;
  onReorder: (orderedTools: Tool[]) => void;
}

/**
 * 工具管理组件
 * 支持拖拽排序、增删改查
 */
export function ToolManager({
  tools,
  isLoading,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onTogglePublish,
  onReorder,
}: ToolManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 拖拽传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 过滤工具
  const filteredTools = tools.filter((tool) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(searchLower) ||
      tool.description.toLowerCase().includes(searchLower) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  // 按 sort 字段排序
  const sortedTools = [...filteredTools].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));

  // 处理拖拽结束
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedTools.findIndex((t) => t.id === active.id);
    const newIndex = sortedTools.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // 重新排序过滤后的工具
    const newFilteredOrder = arrayMove(sortedTools, oldIndex, newIndex);
    
    // 获取所有工具（包括未显示的）
    const allTools = [...tools];
    
    // 找出未显示的工具，保持它们的原始 sort 值
    const hiddenTools = allTools.filter(t => !filteredTools.some(ft => ft.id === t.id));
    
    // 找出未显示工具的最大 sort 值
    const maxSortOfHidden = hiddenTools.length > 0 
      ? Math.max(...hiddenTools.map(t => t.sort ?? 999))
      : -1;
    
    // 为重新排序后的工具分配新的 sort 值
    // 从 maxSortOfHidden + 1 开始，确保不会与未显示的工具冲突
    const updatedFilteredTools = newFilteredOrder.map((tool, index) => ({
      ...tool,
      sort: maxSortOfHidden + 1 + index,
    }));
    
    // 合并所有工具：更新的过滤工具 + 未显示的工具
    const updatedTools = [
      ...updatedFilteredTools,
      ...hiddenTools,
    ];
    
    // 按 sort 字段排序，确保所有工具都有正确的排序
    updatedTools.sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
    
    // 重新分配连续的 sort 值，确保排序正确
    const finalTools = updatedTools.map((tool, index) => ({
      ...tool,
      sort: index,
    }));
    
    // 更新排序（只更新本地状态，不立即保存到后端）
    onReorder(finalTools);
  };

  // 处理编辑
  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  // 处理保存（只更新本地状态，不立即保存到后端）
  const handleSave = (tool: Tool) => {
    try {
      if (tool.id && tools.find(t => t.id === tool.id)) {
        // 更新现有工具
        const { id, createdAt, updatedAt, ...toolData } = tool;
        console.log(`💾 ToolManager: 保存工具更新 ${tool.name} (${id}):`, {
          icon: toolData.icon,
          iconType: typeof toolData.icon,
          allFields: Object.keys(toolData),
          toolData
        });
        onUpdate(id, toolData);
      } else {
        // 添加新工具
        const { id, createdAt, updatedAt, ...toolData } = tool;
        console.log(`➕ ToolManager: 添加新工具 ${tool.name}:`, {
          icon: toolData.icon,
          iconType: typeof toolData.icon,
          allFields: Object.keys(toolData),
          toolData
        });
        onAdd(toolData);
      }
      setIsModalOpen(false);
      setEditingTool(null);
    } catch (error) {
      alert('保存失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理删除（只更新本地状态，不立即保存到后端）
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个工具吗？删除后需要点击"保存配置"才会真正删除。')) {
      onDelete(id);
    }
  };

  // 处理新增
  const handleAdd = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索工具..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          新增工具
        </button>
      </div>

      {/* 工具列表 */}
      {sortedTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <p className="text-muted-foreground">
            {searchQuery ? '未找到匹配的工具' : '还没有添加任何工具'}
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedTools.map((t) => t.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedTools.map((tool) => (
                <SortableToolItem
                  key={tool.id}
                  tool={tool}
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePublish={onTogglePublish}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 编辑模态框 */}
      <EditToolModal
        tool={editingTool}
        isOpen={isModalOpen}
        categories={categories.filter(c => c.id !== 'all')}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTool(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

