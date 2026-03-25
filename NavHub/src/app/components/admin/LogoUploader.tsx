import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoUploaderProps {
  currentLogo: string;
  onLogoUpdate: (logoPath: string) => void;
  onClose: () => void;
  showMessage: (type: 'success' | 'error', message: string) => void;
}

export function LogoUploader({ 
  currentLogo, 
  onLogoUpdate, 
  onClose, 
  showMessage 
}: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', '仅支持PNG、JPG、GIF、SVG格式的图片');
      return;
    }

    // 验证文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', '图片大小不能超过2MB');
      return;
    }

    setIsUploading(true);
    setImageError(false);

    try {
      // 读取文件为base64
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const base64Content = e.target?.result as string;
          if (base64Content && base64Content.startsWith('data:image/')) {
            setPreviewUrl(base64Content); // 设置预览
            showMessage('success', '图片加载成功，请点击"确定"保存');
          } else {
            showMessage('error', '图片格式不正确');
            setPreviewUrl(null);
          }
        } catch (error) {
          showMessage('error', `读取图片失败：${error instanceof Error ? error.message : '未知错误'}`);
          setPreviewUrl(null);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        showMessage('error', '读取文件失败，请重试');
        setPreviewUrl(null);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      showMessage('error', `读取文件失败：${error instanceof Error ? error.message : '未知错误'}`);
      setIsUploading(false);
    }

    // 清空input值，允许重复上传同一文件
    event.target.value = '';
  };

  // 确认保存
  const handleConfirm = () => {
    if (previewUrl) {
      onLogoUpdate(previewUrl);
      showMessage('success', '站点Logo更新成功！');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      showMessage('error', '请先选择图片');
    }
  };

  // 取消预览
  const handleCancelPreview = () => {
    setPreviewUrl(null);
    setImageError(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">更换站点Logo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {/* 当前Logo显示 */}
          <div className="mb-6 text-center">
            <div className="w-24 h-24 mx-auto mb-3 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              {previewUrl && !imageError ? (
                <img 
                  src={previewUrl} 
                  alt="预览Logo"
                  className="max-w-full max-h-full object-contain"
                  onError={() => {
                    setImageError(true);
                  }}
                  onLoad={() => {
                    setImageError(false);
                  }}
                />
              ) : currentLogo && currentLogo !== '/assets/logo.png' ? (
                <img 
                  src={currentLogo} 
                  alt="当前Logo"
                  className="max-w-full max-h-full object-contain"
                  onError={() => {
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <span className="text-white text-2xl font-bold">N</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {previewUrl && !imageError ? '预览新Logo' : '当前Logo'}
            </p>
            {previewUrl && (
              <button
                onClick={handleCancelPreview}
                className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
              >
                取消预览
              </button>
            )}
          </div>

          {/* 上传区域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="logo-upload"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="logo-upload"
              className={cn(
                'cursor-pointer block',
                isUploading && 'cursor-not-allowed opacity-50'
              )}
            >
              <div className="flex flex-col items-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mb-3" />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  {isUploading ? '正在上传...' : '点击选择新Logo'}
                </p>
                <p className="text-xs text-gray-500">
                  支持PNG、JPG、GIF、SVG格式，大小不超过2MB
                </p>
              </div>
            </label>
          </div>

          {/* 说明 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>注意：</strong>选择图片后请点击"确定"按钮保存，修改后还需要在系统设置中点击"保存配置"按钮。
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isUploading}
            className={cn(
              'px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition-colors',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={isUploading || !previewUrl}
            className={cn(
              'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors',
              (isUploading || !previewUrl) && 'opacity-50 cursor-not-allowed'
            )}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

