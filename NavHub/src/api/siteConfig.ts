import request from './request';
import type { SiteConfig } from '@/hooks/useSiteConfig';

const USE_MOCK = false;

// Mock数据
const mockSiteConfig: SiteConfig = {
  siteName: 'NavHub',
  siteTitle: 'NavHub - 精选网站导航',
  siteLogo: '/assets/logo.png',
  siteDescription: '发现优质网站，提升工作效率。汇聚设计、开发、工具等各类精选网站资源。',
  icpRecord: '',
  publicSecurityRecord: '',
  publicSecurityRecordUrl: '',
};

/**
 * 站点配置API
 */
export const siteConfigApi = {
  /**
   * 获取站点配置
   */
  async get(): Promise<SiteConfig> {
    if (USE_MOCK) {
      return mockSiteConfig;
    }
    const result = await request.get<SiteConfig>('/site-config');
    return result;
  },

  /**
   * 更新站点配置（管理员）
   */
  async update(config: Partial<SiteConfig>): Promise<SiteConfig> {
    if (USE_MOCK) {
      return { ...mockSiteConfig, ...config };
    }
    
    // 确保 siteLogo 字段被包含在请求中
    // 如果 siteLogo 是 undefined，不包含该字段；如果是 null 或空字符串，也要传递
    const requestData: any = {
      ...config,
    };
    
    // 明确设置 siteLogo 字段，确保它被包含在请求中
    if (config.siteLogo !== undefined) {
      requestData.siteLogo = config.siteLogo;
    }
    
    const result = await request.put<SiteConfig>('/site-config', requestData);
    return result;
  },
};

