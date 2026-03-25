import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Category } from '@/api/types';

interface CategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

// 预设的分类图标
const DEFAULT_ICONS = [
  { emoji: '💻', label: '开发' },
  { emoji: '🎨', label: '设计' },
  { emoji: '📱', label: '移动' },
  { emoji: '🔧', label: '工具' },
  { emoji: '📊', label: '数据' },
  { emoji: '🎮', label: '游戏' },
  { emoji: '📚', label: '学习' },
  { emoji: '🎵', label: '音乐' },
  { emoji: '🎬', label: '视频' },
  { emoji: '📷', label: '摄影' },
  { emoji: '✍️', label: '写作' },
  { emoji: '🌐', label: '网络' },
  { emoji: '🔒', label: '安全' },
  { emoji: '☁️', label: '云服务' },
  { emoji: '🤖', label: 'AI' },
  { emoji: '📈', label: '商业' },
  { emoji: '💰', label: '金融' },
  { emoji: '🏠', label: '生活' },
  { emoji: '🍔', label: '美食' },
  { emoji: '✈️', label: '旅行' },
  { emoji: '🏃', label: '运动' },
  { emoji: '🎓', label: '教育' },
  { emoji: '💼', label: '办公' },
  { emoji: '🛒', label: '购物' },
];

export function CategoryModal({ category, isOpen, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    icon: '',
    sort: 0,
    isVisible: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon || '',
        sort: category.sort || 0,
        isVisible: category.isVisible !== undefined ? category.isVisible : true,
      });
    } else {
      setFormData({
        name: '',
        icon: '',
        sort: 0,
        isVisible: true,
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryToSave: Category = {
      ...formData,
      id: category?.id || Date.now().toString(),
    };
    onSave(categoryToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/40">
          <h2 className="text-xl font-semibold">{category ? '编辑分类' : '新增分类'}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">分类名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
              placeholder="例如：开发工具"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">图标 (Emoji)</label>
            
            {/* 当前选中的图标 */}
            <div className="mb-3 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-md">
                {formData.icon || '❓'}
              </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              maxLength={2}
                placeholder="或手动输入 Emoji"
              />
            </div>

            {/* 预设图标选择器 */}
            <div className="p-3 rounded-lg bg-white/30 border border-white/40">
              <p className="text-xs text-gray-600 mb-2">选择预设图标：</p>
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                {DEFAULT_ICONS.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: item.emoji })}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-xl
                      transition-all hover:scale-110
                      ${formData.icon === item.emoji 
                        ? 'bg-indigo-500 shadow-lg ring-2 ring-indigo-500 ring-offset-2' 
                        : 'bg-white/50 hover:bg-white/80'
                      }
                    `}
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">排序序号</label>
            <input
              type="number"
              value={formData.sort}
              onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              min="0"
              placeholder="数字越小越靠前"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isVisible" className="text-sm font-medium">
              是否可见
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
