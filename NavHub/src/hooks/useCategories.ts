import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '@/api/category';
import type { Category } from '@/api/types';

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

/**
 * 分类相关的业务逻辑 Hook
 * 管理分类列表的增删改查
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 获取分类列表
   */
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoryApi.getAll();
      // 确保有"全部"和"个人收藏"分类（前端虚拟分类，不在后端）
      const allCategory: Category = { id: 'all', name: '全部', isVisible: true };
      const favoritesCategory: Category = { id: 'favorites', name: '个人收藏', icon: '❤️', isVisible: true };
      // 合并虚拟分类和从后端获取的分类（过滤同 id，避免重复）
      const serverCategories = data.filter((c) => c.id !== 'all' && c.id !== 'favorites');
      setCategories([allCategory, favoritesCategory, ...serverCategories]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取分类列表失败');
      setError(error);
      console.error('Failed to fetch categories:', error);
      // 如果 API 失败，使用默认分类
      const defaultCategories: Category[] = [
        { id: 'all', name: '全部', isVisible: true },
        { id: 'favorites', name: '个人收藏', icon: '❤️', isVisible: true },
        { id: 'music', name: '免费听歌', isVisible: true },
        { id: 'video', name: '免费看剧', isVisible: true },
        { id: 'download', name: '下载工具', isVisible: true },
        { id: 'tools', name: '在线工具', isVisible: true },
      ];
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 自动获取数据
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * 添加分类
   */
  const addCategory = useCallback(async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const newCategory = await categoryApi.create(category);

      // 添加新分类，保持虚拟分类在前两位
      setCategories((prev) => {
        const allCategory = prev.find((c) => c.id === 'all');
        const favoritesCategory = prev.find((c) => c.id === 'favorites');
        const otherCategories = prev.filter((c) => c.id !== 'all' && c.id !== 'favorites');

        const head = [allCategory, favoritesCategory].filter(Boolean) as Category[];
        return [...head, ...otherCategories, newCategory];
      });

      return newCategory;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('添加分类失败');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * 更新分类
   */
  const updateCategory = useCallback(async (id: string, category: Partial<Category>) => {
    try {
      const updatedCategory = await categoryApi.update(id, category);
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
      // 刷新分类列表以确保数据同步
      await fetchCategories();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('更新分类失败');
      setError(error);
      throw error;
    }
  }, [fetchCategories]);

  /**
   * 删除分类
   */
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('删除分类失败');
      setError(error);
      throw error;
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
