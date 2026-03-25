import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/api/types';
import { CategoryModal } from '@/app/components/category-modal';

interface CategoryManagerProps {
  categories: Category[];
  isLoading: boolean;
  onAdd: (category: Omit<Category, 'id'>) => Promise<void>;
  onUpdate: (id: string, category: Partial<Category>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * 分类管理组件
 */
export function CategoryManager({
  categories,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
}: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (category: Category) => {
    try {
      if (category.id && categories.find(c => c.id === category.id)) {
        const { id, ...categoryData } = category;
        await onUpdate(id, categoryData);
      } else {
        const { id, ...categoryData } = category;
        await onAdd(categoryData);
      }
      await onRefresh();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      alert('保存失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个分类吗？删除后该分类下的工具将无法显示。')) {
      try {
        await onDelete(id);
        await onRefresh();
      } catch (error) {
        alert('删除失败：' + (error instanceof Error ? error.message : '未知错误'));
      }
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
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
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      {/* 分类列表 */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <span className="text-4xl">📁</span>
          </div>
          <p className="text-muted-foreground">还没有添加任何分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative p-6 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 border border-white/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {category.icon && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md">
                      {category.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.sort !== undefined && (
                      <p className="text-xs text-muted-foreground">排序: {category.sort}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/40">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/50 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 编辑模态框 */}
      <CategoryModal
        category={editingCategory}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

