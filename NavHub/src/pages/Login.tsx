import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { cn } from '@/utils/cn';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { siteConfig } = useSiteConfig();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* 无缝彩虹渐变动画背景 */}
      <div className="absolute inset-0 animate-rainbow-flow"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl border border-white/40 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            {/* Logo图片或Fallback */}
            {siteConfig.siteLogo && siteConfig.siteLogo !== '/assets/logo.png' ? (
              <img 
                src={siteConfig.siteLogo} 
                alt="Logo"
                className="w-16 h-16 rounded-2xl object-contain mx-auto mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // 显示fallback
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4"
              style={{ display: (siteConfig.siteLogo && siteConfig.siteLogo !== '/assets/logo.png') ? 'none' : 'flex' }}
            >
              <span className="text-white text-2xl font-bold">{siteConfig.siteName?.charAt(0) || 'N'}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{siteConfig.siteName || 'NavHub'}</h1>
            <p className="text-muted-foreground">{siteConfig.siteTitle || '网页工具导航'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
                'hover:shadow-lg transition-all',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
