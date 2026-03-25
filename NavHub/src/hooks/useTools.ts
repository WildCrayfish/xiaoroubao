import { useState, useEffect, useCallback } from 'react';
import { toolApi } from '@/api/tool';
import type { Tool } from '@/api/types';

interface UseToolsParams {
  categoryId?: string;
  search?: string;
  autoFetch?: boolean;
  includeUnpublished?: boolean; // 是否包含未发布的工具（管理员使用）
}

interface UseToolsReturn {
  tools: Tool[];
  isLoading: boolean;
  error: Error | null;
  fetchTools: (params?: { categoryId?: string; search?: string; includeUnpublished?: boolean }) => Promise<void>;
  addTool: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Tool>;
  updateTool: (id: string, tool: Partial<Tool>) => Promise<Tool>;
  deleteTool: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  togglePublish: (id: string) => Promise<void>;
  reorderTools: (orderedTools: Tool[]) => Promise<void>;
}

/**
 * 工具相关的业务逻辑 Hook
 * 管理工具列表的增删改查
 */
export function useTools(params: UseToolsParams = {}): UseToolsReturn {
  const { categoryId, search, autoFetch = true, includeUnpublished = false } = params;
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 获取工具列表
   */
  const fetchTools = useCallback(async (fetchParams?: { categoryId?: string; search?: string; includeUnpublished?: boolean }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用传入的参数，如果没有则使用 hook 的默认参数
      const params = fetchParams || { categoryId, search, includeUnpublished };
      const data = await toolApi.getAll(params);
      // 按照 sort 字段排序，确保排序正确
      const sortedData = [...data].sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
      setTools(sortedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取工具列表失败');
      setError(error);
      console.error('Failed to fetch tools:', error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, search, includeUnpublished]);

  // 自动获取数据
  useEffect(() => {
    if (autoFetch) {
      fetchTools({ categoryId, search, includeUnpublished });
    }
  }, [autoFetch, categoryId, search, includeUnpublished, fetchTools]);

  /**
   * 添加工具
   */
  const addTool = useCallback(async (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> => {
    try {
      const newTool = await toolApi.create(tool);
      setTools((prev) => [...prev, newTool]);
      return newTool;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('添加工具失败');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * 更新工具
   */
  const updateTool = useCallback(async (id: string, tool: Partial<Tool>): Promise<Tool> => {
    try {
      const updatedTool = await toolApi.update(id, tool);
      setTools((prev) => prev.map((t) => (t.id === id ? updatedTool : t)));
      return updatedTool;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('更新工具失败');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * 删除工具
   */
  const deleteTool = useCallback(async (id: string) => {
    try {
      await toolApi.delete(id);
      setTools((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('删除工具失败');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * 切换收藏状态
   */
  const toggleFavorite = useCallback(async (id: string) => {
    // 先做前端乐观更新，立即反馈按钮状态
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));

    try {
      await toolApi.toggleFavorite(id);
      // 成功后轻量刷新一次，确保和后端最终状态一致
      await fetchTools();
    } catch (err) {
      // 失败时回滚
      setTools((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));
      const error = err instanceof Error ? err : new Error('切换收藏状态失败');
      setError(error);
      throw error;
    }
  }, [fetchTools]);

  /**
   * 切换发布状态
   */
  const togglePublish = useCallback(async (id: string) => {
    try {
      const updatedTool = await toolApi.togglePublish(id);
      setTools((prev) => prev.map((t) => (t.id === id ? updatedTool : t)));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('切换发布状态失败');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * 批量更新工具排序
   */
  const reorderTools = useCallback(async (orderedTools: Tool[]) => {
    try {
      await toolApi.reorder(orderedTools);
      // 更新本地状态，使用传入的排序后的工具列表
      setTools(orderedTools);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('排序更新失败');
      setError(error);
      throw error;
    }
  }, []);

  return {
    tools,
    isLoading,
    error,
    fetchTools,
    addTool,
    updateTool,
    deleteTool,
    toggleFavorite,
    togglePublish,
    reorderTools,
  };
}
