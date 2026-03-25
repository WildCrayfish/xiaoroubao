import { X, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Tool } from '@/api/types';
import type { Category } from '@/api/types';
import { getWebsiteIcon, isIconUrl } from '@/utils/iconUtils';

// 默认图标库 - 按类别分组
const DEFAULT_ICONS = [
  // 常用工具
  '🔗', '🌐', '🚀', '⚡', '🎨', '📱',
  '💻', '🛠️', '📊', '📈', '🎯', '💡',
  
  // 办公与文档
  '📝', '📚', '📄', '📋', '📌', '📎',
  '✏️', '🖊️', '📓', '📖', '📰', '🗂️',
  
  // 设计与创意
  '🎭', '🎪', '🎨', '🖼️', '🖌️', '✨',
  '💫', '🌈', '🎬', '📷', '📸', '🎥',
  
  // 社交与通讯
  '✉️', '💬', '💭', '📧', '📮', '📬',
  '📞', '📱', '☎️', '📲', '💌', '🔔',
  
  // 音乐与娱乐
  '🎵', '🎶', '🎤', '🎧', '🎸', '🎹',
  '🎮', '🎯', '🎲', '🎰', '🎳', '🎪',
  
  // 商务与金融
  '💰', '💳', '💵', '💴', '💶', '💷',
  '📈', '📉', '💹', '💱', '🏦', '🏪',
  
  // 科技与开发
  '⚙️', '🔧', '🔨', '⚡', '🔌', '💾',
  '💿', '📀', '🖥️', '⌨️', '🖱️', '🖨️',
  
  // 搜索与导航
  '🔍', '🔎', '🗺️', '🧭', '📍', '📌',
  '🚩', '⭐', '🌟', '✨', '💫', '🔆',
  
  // 安全与隐私
  '🔒', '🔓', '🔐', '🔑', '🛡️', '🔰',
  '⚠️', '🚨', '🚦', '🚥', '⛔', '🔞',
  
  // 其他常用
  '📦', '📮', '🏠', '🏢', '🏪', '🏬',
  '❤️', '💙', '💚', '💛', '🧡', '💜',
  '🔥', '💧', '🌊', '🌙', '☀️', '⭐',
  '🎉', '🎊', '🎈', '🎁', '🏆', '🥇'
];

interface EditToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onSave: (tool: Tool) => void;
}

/**
 * 编辑工具模态框
 */
export function EditToolModal({
  tool,
  isOpen,
  categories,
  onClose,
  onSave,
}: EditToolModalProps) {
  const [formData, setFormData] = useState<Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    url: '',
    icon: '🔗',
    categoryId: categories[0]?.id || '',
    tags: [],
    isFavorite: false,
    isPublished: true,
  });
  const [tagsInput, setTagsInput] = useState('');
  const [isFetchingIcon, setIsFetchingIcon] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        description: tool.description,
        url: tool.url,
        icon: tool.icon,
        categoryId: tool.categoryId,
        tags: tool.tags || [],
        isFavorite: tool.isFavorite || false,
        isPublished: tool.isPublished,
      });
      setTagsInput(tool.tags ? tool.tags.join(', ') : '');
    } else {
      setFormData({
        name: '',
        description: '',
        url: '',
        icon: '🔗',
        categoryId: categories[0]?.id || '',
        tags: [],
        isFavorite: false,
        isPublished: true,
      });
      setTagsInput('');
    }
  }, [tool, categories]);

  // 自动获取图标
  const handleFetchIcon = async () => {
    if (!formData.url) {
      alert('请先输入网站链接');
      return;
    }

    setIsFetchingIcon(true);
    try {
      const iconUrl = await getWebsiteIcon(formData.url);
      setFormData({ ...formData, icon: iconUrl });
    } catch (error) {
      console.error('获取图标失败:', error);
      alert('获取图标失败，请手动输入图标');
    } finally {
      setIsFetchingIcon(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理标签：将逗号分隔的字符串转换为数组
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // 确保 icon 字段始终存在（即使是空字符串也要传递）
    const iconValue = formData.icon || '🔗';
    
    const toolToSave: Tool = {
      ...formData,
      icon: iconValue, // 确保 icon 字段总是有值
      tags: tags.length > 0 ? tags : undefined,
      id: tool?.id || Date.now().toString(),
      createdAt: tool?.createdAt,
      updatedAt: new Date().toISOString(),
    };
    
    console.log('💾 EditToolModal: 保存工具:', {
      name: toolToSave.name,
      icon: toolToSave.icon,
      iconType: typeof toolToSave.icon,
      iconLength: toolToSave.icon ? toolToSave.icon.length : 0,
      allFields: Object.keys(toolToSave),
      toolToSave
    });
    
    onSave(toolToSave);
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
          <h2 className="text-xl font-semibold">{tool ? '编辑工具' : '新增工具'}</h2>
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
            <label className="block mb-2 text-sm font-medium">工具名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">链接</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">图标</label>
            
            {/* 当前选中的图标预览和自动获取 */}
            <div className="mb-3 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md overflow-hidden">
                {isIconUrl(formData.icon) ? (
                  <img
                    src={formData.icon}
                    alt="图标预览"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-3xl">{formData.icon || '🔗'}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="Emoji 或图标URL"
                  required
                />
                <button
                  type="button"
                  onClick={handleFetchIcon}
                  disabled={!formData.url || isFetchingIcon}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title="从网站URL自动获取图标"
                >
                  {isFetchingIcon ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>获取中...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>自动获取网站图标</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 预设图标选择器 - 默认显示 */}
            <div className="p-3 rounded-lg bg-white/30 border border-white/40">
              <p className="text-xs text-gray-600 mb-2">选择预设图标：</p>
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                {DEFAULT_ICONS.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center text-xl
                      transition-all hover:scale-110
                      ${formData.icon === icon 
                        ? 'bg-indigo-500 shadow-lg ring-2 ring-indigo-500 ring-offset-2' 
                        : 'bg-white/50 hover:bg-white/80'
                      }
                    `}
                    title={icon}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">分类</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">标签 (用逗号分隔)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder="设计, 工具, 免费"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              多个标签用逗号分隔，例如：设计, 工具, 免费
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded border-white/40"
              />
              <span>发布</span>
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

