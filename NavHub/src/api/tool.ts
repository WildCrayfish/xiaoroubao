import request from './request';
import type { Tool } from './types';
import { mockApi, mockTools } from './mock';

// 是否使用 Mock 数据（后端未就绪时设为 true）
const USE_MOCK = false; // 切换到真实后端 API

/**
 * 工具相关 API
 */
export const toolApi = {
  /**
   * 获取所有工具
   * @param params.categoryId - 分类ID
   * @param params.search - 搜索关键词
   * @param params.includeUnpublished - 是否包含未发布的工具（管理员使用）
   */
  async getAll(params?: { categoryId?: string; search?: string; includeUnpublished?: boolean }): Promise<Tool[]> {
    if (USE_MOCK) {
      return mockApi.getTools(params);
    }

    const requestParams = {
      categoryId: params?.categoryId,
      search: params?.search,
      includeUnpublished: params?.includeUnpublished,
    };

    return request.get<Tool[]>('/tools', { params: requestParams });
  },

  /**
   * 根据 ID 获取工具
   */
  async getById(id: string): Promise<Tool> {
    const tool = await request.get<Tool>(`/tools/${id}`);
    return tool;
  },

  /**
   * 创建工具（管理员）
   */
  async create(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
    if (USE_MOCK) {
      const newTool: Tool = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockTools.push(newTool);
      return newTool;
    }

    const result = await request.post<Tool>('/tools', data);
    return result;
  },

  /**
   * 更新工具（管理员）
   */
  async update(id: string, data: Partial<Tool>): Promise<Tool> {
    if (USE_MOCK) {
      const index = mockTools.findIndex((t) => t.id === id);
      if (index >= 0) {
        mockTools[index] = { ...mockTools[index], ...data, updatedAt: new Date().toISOString() };
        return mockTools[index];
      }
      throw new Error('工具不存在');
    }

    const iconValue = data.icon !== undefined && data.icon !== null ? data.icon : '🔗';

    const requestData = {
      ...data,
      icon: iconValue,
    };

    const result = await request.put<Tool>(`/tools/${id}`, requestData);
    return result;
  },

  /**
   * 删除工具（管理员）
   */
  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockTools.findIndex((t) => t.id === id);
      if (index >= 0) {
        mockTools.splice(index, 1);
        return;
      }
      throw new Error('工具不存在');
    }
    return request.delete<void>(`/tools/${id}`);
  },

  /**
   * 切换收藏状态
   */
  async toggleFavorite(id: string): Promise<void> {
    if (USE_MOCK) {
      const tool = mockTools.find((t) => t.id === id);
      if (tool) {
        tool.isFavorite = !tool.isFavorite;
        return;
      }
      throw new Error('工具不存在');
    }
    await request.post<void>(`/tools/${id}/favorite`);
  },

  /**
   * 切换发布状态（管理员）
   */
  async togglePublish(id: string): Promise<Tool> {
    if (USE_MOCK) {
      const tool = mockTools.find((t) => t.id === id);
      if (tool) {
        tool.isPublished = !tool.isPublished;
        return tool;
      }
      throw new Error('工具不存在');
    }
    const tool = await request.post<Tool>(`/tools/${id}/publish`);
    return tool;
  },

  /**
   * 批量更新工具排序（管理员）
   */
  async reorder(orderedTools: Tool[]): Promise<void> {
    if (USE_MOCK) {
      return mockApi.reorderTools(orderedTools);
    }
    return request.put<void>('/tools/reorder', { tools: orderedTools });
  },
};
