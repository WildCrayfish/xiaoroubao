import { useState, useEffect } from 'react';
import { Github, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';

export function VersionManager() {
  const [versionInfo, setVersionInfo] = useState<{
    currentVersion?: string;
    latestVersion?: string;
    hasNewVersion?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  const checkVersion = async () => {
    setIsLoading(true);
    try {
      // TODO: 如果后端有版本检查接口，可以调用
      // const response = await fetch('/api/get-version');
      // const result = await response.json();
      
      // 临时方案：使用固定版本号
      const currentVersion = '1.0.0';
      
      setVersionInfo({
        currentVersion,
        latestVersion: currentVersion,
        hasNewVersion: false,
      });
      
      setUpdateStatus('🟢 当前已是最新版本');
    } catch (error) {
      console.error('检查版本失败:', error);
      setUpdateStatus('❌ 检查失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkVersion();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
      <h4 className="text-base font-medium text-gray-900 mb-4">版本信息</h4>

      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>v{versionInfo?.currentVersion || '1.0.0'}</span>
          </a>

          <div className="flex items-center gap-3">
            {updateStatus && (
              <span className="text-sm text-gray-600">{updateStatus}</span>
            )}
            <button
              onClick={checkVersion}
              disabled={isLoading}
              className={cn(
                'inline-flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
              <span>检查更新</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

