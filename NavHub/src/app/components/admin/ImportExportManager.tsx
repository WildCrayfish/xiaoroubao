import { useState } from 'react';
import { Download, Upload, FileJson, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Tool, Category } from '@/api/types';

interface ImportExportManagerProps {
  tools: Tool[];
  categories: Category[];
  onImport: (data: { tools: Tool[]; categories: Category[] }) => Promise<void>;
}

interface ExportData {
  version: string;
  exportTime: string;
  data: {
    tools: Tool[];
    categories: Category[];
  };
}

/**
 * 导入导出管理组件
 * 支持配置数据的导入和导出（JSON格式）
 */
export function ImportExportManager({ tools, categories, onImport }: ImportExportManagerProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // 显示消息
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // 导出配置
  const handleExport = () => {
    try {
      const exportData: ExportData = {
        version: '1.0.0',
        exportTime: new Date().toISOString(),
        data: {
          tools: tools.map(tool => ({
            ...tool,
            // 移除临时ID
            id: tool.id.startsWith('temp_') ? '' : tool.id,
          })),
          categories: categories.filter(c => c.id !== 'all'), // 排除"全部"分类
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `navhub-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showMessage('success', '✅ 配置已导出成功！');
    } catch (error) {
      console.error('导出配置失败:', error);
      showMessage('error', `❌ 导出失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showMessage('error', '❌ 请选择JSON格式的配置文件');
      return;
    }

    setImportFile(file);
    
    // 读取并预览文件内容
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;
        
        // 验证数据格式
        if (!data.version || !data.data || !Array.isArray(data.data.tools) || !Array.isArray(data.data.categories)) {
          throw new Error('配置文件格式不正确');
        }

        setImportPreview(data);
        showMessage('info', `📄 已加载配置文件：${data.data.tools.length} 个工具，${data.data.categories.length} 个分类`);
      } catch (error) {
        console.error('解析配置文件失败:', error);
        showMessage('error', `❌ 解析失败：${error instanceof Error ? error.message : '文件格式错误'}`);
        setImportFile(null);
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  // 执行导入
  const handleImport = async () => {
    if (!importPreview) {
      showMessage('error', '❌ 请先选择要导入的配置文件');
      return;
    }

    if (!confirm(`⚠️ 确定要导入配置吗？\n\n将导入：\n- ${importPreview.data.tools.length} 个工具\n- ${importPreview.data.categories.length} 个分类\n\n⚠️ 重要提示：\n1. 导入会清空所有现有的工具和分类\n2. 导入的数据会生成新的ID，避免冲突\n3. 导入后需要点击右上角"保存配置"按钮才会真正保存到数据库\n\n是否继续？`)) {
      return;
    }

    setIsImporting(true);
    try {
      await onImport(importPreview.data);
      showMessage('success', '✅ 配置已加载到本地！请点击右上角"保存配置"按钮保存到数据库。');
      setImportFile(null);
      setImportPreview(null);
      // 清空文件选择
      const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('导入配置失败:', error);
      showMessage('error', `❌ 导入失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsImporting(false);
    }
  };

  // 取消导入
  const handleCancelImport = () => {
    setImportFile(null);
    setImportPreview(null);
    const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    showMessage('info', '已取消导入');
  };

  return (
    <div className="space-y-6">
      {/* 消息提示 */}
      {message && (
        <div className={cn(
          'px-4 py-3 rounded-lg text-sm flex items-center gap-2',
          message.type === 'success' && 'bg-green-50 text-green-700 border border-green-200',
          message.type === 'error' && 'bg-red-50 text-red-700 border border-red-200',
          message.type === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200'
        )}>
          {message.type === 'success' && <Check className="w-4 h-4" />}
          {message.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {message.type === 'info' && <FileJson className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* 导出配置 */}
      <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">导出配置</h3>
            <p className="text-sm text-gray-600">将当前的工具和分类配置导出为JSON文件</p>
          </div>
          <FileJson className="w-8 h-8 text-indigo-500" />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">工具数量：</span>
              <span className="font-semibold text-gray-900">{tools.length} 个</span>
            </div>
            <div>
              <span className="text-gray-600">分类数量：</span>
              <span className="font-semibold text-gray-900">{categories.filter(c => c.id !== 'all').length} 个</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
            'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
            'hover:shadow-lg transition-all'
          )}
        >
          <Download className="w-5 h-5" />
          <span>导出配置文件</span>
        </button>
      </div>

      {/* 导入配置 */}
      <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">导入配置</h3>
            <p className="text-sm text-gray-600">从JSON文件导入工具和分类配置</p>
          </div>
          <Upload className="w-8 h-8 text-green-500" />
        </div>

        {/* 文件选择 */}
        <div className="mb-4">
          <label
            htmlFor="import-file-input"
            className={cn(
              'block w-full px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer',
              'hover:border-indigo-400 hover:bg-indigo-50/50 transition-all',
              importFile ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-300 bg-gray-50'
            )}
          >
            <div className="text-center">
              <FileJson className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {importFile ? `已选择：${importFile.name}` : '点击选择或拖拽JSON文件到此处'}
              </p>
              <p className="text-xs text-gray-500">支持 .json 格式</p>
            </div>
          </label>
          <input
            id="import-file-input"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* 导入预览 */}
        {importPreview && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">配置预览</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">版本：</span>
                <span className="font-medium text-gray-900">{importPreview.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">导出时间：</span>
                <span className="font-medium text-gray-900">
                  {new Date(importPreview.exportTime).toLocaleString('zh-CN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">工具数量：</span>
                <span className="font-medium text-gray-900">{importPreview.data.tools.length} 个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">分类数量：</span>
                <span className="font-medium text-gray-900">{importPreview.data.categories.length} 个</span>
              </div>
            </div>
          </div>
        )}

        {/* 导入按钮 */}
        <div className="flex gap-3">
          {importPreview && (
            <button
              onClick={handleCancelImport}
              className={cn(
                'flex-1 px-6 py-3 rounded-lg',
                'bg-white/50 hover:bg-white/70 transition-colors',
                'border border-gray-300 text-gray-700'
              )}
            >
              取消
            </button>
          )}
          <button
            onClick={handleImport}
            disabled={!importPreview || isImporting}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
              'hover:shadow-lg transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isImporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>导入中...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>确认导入</span>
              </>
            )}
          </button>
        </div>

        {/* 警告提示 */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">注意事项：</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>导入操作会清空所有现有的工具和分类配置</li>
                <li>导入的数据会自动生成新的ID，避免与现有数据冲突</li>
                <li>导入后数据仅加载到本地，需要点击右上角"保存配置"按钮才会保存到数据库</li>
                <li>建议在导入前先导出当前配置作为备份</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

