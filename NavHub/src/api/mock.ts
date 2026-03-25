/**
 * Mock 数据
 * 用于后端未就绪时的演示
 */
import type { Tool, Category, User, LoginResponse } from './types';

// Mock 工具数据
export const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Spotify',
    description: '全球最大的音乐流媒体平台，海量正版音乐随心听',
    url: 'https://spotify.com',
    icon: '🎵',
    categoryId: 'music',
    tags: ['音乐', '流媒体', '免费'],
    sort: 0,
    isFavorite: false,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'YouTube Music',
    description: 'YouTube官方音乐服务，MV和音频自由切换',
    url: 'https://music.youtube.com',
    icon: '🎶',
    categoryId: 'music',
    tags: ['音乐', '视频', 'YouTube'],
    sort: 1,
    isFavorite: true,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Netflix',
    description: '全球领先的流媒体视频平台，海量影视作品',
    url: 'https://netflix.com',
    icon: '🎬',
    categoryId: 'video',
    tags: ['视频', '流媒体', '影视'],
    sort: 2,
    isFavorite: false,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Disney+',
    description: '迪士尼官方流媒体服务，漫威、星战全收录',
    url: 'https://disneyplus.com',
    icon: '🏰',
    categoryId: 'video',
    tags: ['视频', '迪士尼', '漫威'],
    sort: 3,
    isFavorite: true,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '5',
    name: 'VS Code',
    description: '微软出品的强大代码编辑器，开发者必备工具',
    url: 'https://code.visualstudio.com',
    icon: '💻',
    categoryId: 'download',
    tags: ['开发工具', '编辑器', '免费'],
    sort: 4,
    isFavorite: false,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '6',
    name: 'Figma',
    description: '在线协作设计工具，UI/UX设计师首选',
    url: 'https://figma.com',
    icon: '🎨',
    categoryId: 'tools',
    tags: ['设计工具', 'UI设计', '协作'],
    sort: 5,
    isFavorite: true,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '7',
    name: 'Notion',
    description: '强大的笔记和协作工具，个人和团队都适用',
    url: 'https://notion.so',
    icon: '📝',
    categoryId: 'tools',
    tags: ['笔记', '协作', '工具'],
    sort: 6,
    isFavorite: false,
    isPublished: true,
    isOnline: true,
  },
  {
    id: '8',
    name: 'Canva',
    description: '在线图形设计平台，海量模板一键生成',
    url: 'https://canva.com',
    icon: '🖼️',
    categoryId: 'tools',
    tags: ['设计工具', '模板', '图形设计'],
    sort: 7,
    isFavorite: false,
    isPublished: true,
    isOnline: true,
  },
];

// Mock 分类数据
export const mockCategories: Category[] = [
  { id: 'all', name: '全部', isVisible: true },
  { id: 'music', name: '免费听歌', isVisible: true },
  { id: 'video', name: '免费看剧', isVisible: true },
  { id: 'download', name: '下载工具', isVisible: true },
  { id: 'tools', name: '在线工具', isVisible: true },
];

// Mock 用户数据
export const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@navhub.com',
  isAdmin: true,
};

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API 函数
export const mockApi = {
  async login(username: string, _password: string): Promise<LoginResponse> {
    await delay(500);
    return {
      token: 'mock-token-' + Date.now(),
      user: { ...mockUser, username },
    };
  },

  async getTools(params?: { categoryId?: string; search?: string }): Promise<Tool[]> {
    await delay(300);
    let filtered = [...mockTools];
    
    if (params?.categoryId && params.categoryId !== 'all') {
      filtered = filtered.filter(t => t.categoryId === params.categoryId);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // 按 sort 字段排序
    return filtered.sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
  },

  async getCategories(): Promise<Category[]> {
    await delay(200);
    return mockCategories.filter(c => c.id !== 'all');
  },

  /**
   * 批量更新工具排序
   */
  async reorderTools(orderedTools: Tool[]): Promise<void> {
    await delay(200);
    // 更新所有工具的 sort 值
    orderedTools.forEach((tool) => {
      const mockTool = mockTools.find(t => t.id === tool.id);
      if (mockTool) {
        mockTool.sort = tool.sort ?? 999;
      }
    });
  },
};
