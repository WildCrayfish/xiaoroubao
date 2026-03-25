import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConfigContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

/**
 * 配置上下文 Provider
 * 用于在 Admin 页面和 Home 页面之间同步数据刷新
 */
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <ConfigContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * 使用配置上下文 Hook
 */
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

