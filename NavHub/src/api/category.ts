import request from './request';
import type { Category } from './types';
import { mockApi, mockCategories } from './mock';

// 是否使用 Mock 数据（后端未就绪时设为 true）
const USE_MOCK = false; // 切换到真实后端 API

/**
 * 分类相关 API
 */
export const categoryApi = {
  /**
   * 获取所有分类
   */
  async getAll(): Promise<Category[]> {
    if (USE_MOCK) {
      return mockApi.getCategories();
    }
    return request.get<Category[]>('/categories');
  },

  /**
   * 根据 ID 获取分类
   */
  getById(id: string): Promise<Category> {
    return request.get<Category>(`/categories/${id}`);
  },

  /**
   * 创建分类（管理员）
   */
  async create(data: Omit<Category, 'id'>): Promise<Category> {
    if (USE_MOCK) {
      const newCategory: Category = {
        ...data,
        id: Date.now().toString(),
      };
      // 过滤掉 'all' 分类后添加
      const filteredCategories = mockCategories.filter(c => c.id !== 'all');
      filteredCategories.push(newCategory);
      // 重新构建 mockCategories（保持 'all' 在第一位）
      mockCategories.length = 0;
      mockCategories.push(
        { id: 'all', name: '全部', isVisible: true },
        ...filteredCategories
      );
      return newCategory;
    }
    const result = await request.post<Category>('/categories', data);
    return result;
  },

  /**
   * 更新分类（管理员）
   */
  async update(id: string, data: Partial<Category>): Promise<Category> {
    if (USE_MOCK) {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index >= 0) {
        mockCategories[index] = { ...mockCategories[index], ...data };
        return mockCategories[index];
      }
      throw new Error('分类不存在');
    }
    return request.put<Category>(`/categories/${id}`, data);
  },

  /**
   * 删除分类（管理员）
   */
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index >= 0) {
        mockCategories.splice(index, 1);
        return;
      }
      throw new Error('分类不存在');
    }
    return request.delete<void>(`/categories/${id}`);
  },
};
