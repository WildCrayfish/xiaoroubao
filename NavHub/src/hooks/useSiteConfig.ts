import { useState, useEffect } from 'react';
import { siteConfigApi } from '@/api/siteConfig';

export interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteLogo: string;
  siteDescription: string;
  icpRecord?: string;
  publicSecurityRecord?: string;
  publicSecurityRecordUrl?: string;
}

// 默认站点配置
const defaultSiteConfig: SiteConfig = {
  siteName: 'NavHub',
  siteTitle: 'NavHub - 精选网站导航',
  siteLogo: '/assets/logo.png',
  siteDescription: '发现优质网站，提升工作效率。汇聚设计、开发、工具等各类精选网站资源。',
  icpRecord: '',
  publicSecurityRecord: '',
  publicSecurityRecordUrl: '',
};

// 全局站点配置管理
let globalSiteConfig: SiteConfig = defaultSiteConfig;
let isLoaded = false;
const subscribers = new Set<(config: SiteConfig) => void>();

const notifySubscribers = () => {
  subscribers.forEach(callback => callback(globalSiteConfig));
};

// 更新页面元数据
const updatePageMetadata = (config: Partial<SiteConfig>, skipLogo = false) => {
  // 更新页面标题 - 如果提供了siteTitle（包括空字符串），就更新
  if (config.siteTitle !== undefined) {
    document.title = config.siteTitle || defaultSiteConfig.siteTitle;
  }
  
  // 更新meta描述 - 如果提供了siteDescription（包括空字符串），就更新
  if (config.siteDescription !== undefined) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.siteDescription || defaultSiteConfig.siteDescription);
    }
  }
  
  // 更新favicon - 只在logo真正改变时才更新，避免重复更新导致闪烁
  if (!skipLogo && config.siteLogo && config.siteLogo !== globalSiteConfig.siteLogo) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      // 对于base64，直接使用；对于URL，添加时间戳防止缓存
      const logoUrl = config.siteLogo.startsWith('data:')
        ? config.siteLogo
        : config.siteLogo.includes('?')
        ? `${config.siteLogo}&t=${Date.now()}`
        : `${config.siteLogo}?t=${Date.now()}`;
      
      favicon.setAttribute('href', logoUrl);
    }
  }
};

// 从后端加载配置
export const loadSiteConfig = async (): Promise<SiteConfig> => {
  try {
    const config = await siteConfigApi.get();
    const oldLogo = globalSiteConfig.siteLogo;
    globalSiteConfig = config;
    isLoaded = true;
    // 只在首次加载或logo改变时更新favicon
    if (config.siteLogo !== oldLogo) {
      updatePageMetadata(config);
    } else {
      updatePageMetadata({ siteTitle: config.siteTitle, siteDescription: config.siteDescription }, true);
    }
    notifySubscribers();
    return config;
  } catch (error) {
    console.warn('加载站点配置失败，使用默认配置:', error);
    globalSiteConfig = defaultSiteConfig;
    isLoaded = true;
    updatePageMetadata(defaultSiteConfig);
    notifySubscribers();
    return defaultSiteConfig;
  }
};

// 更新站点配置（同步到后端）
export const updateSiteConfig = async (newConfig: Partial<SiteConfig>): Promise<SiteConfig> => {
  try {
    // 先更新本地状态（但不更新favicon，避免闪烁）
    const oldLogo = globalSiteConfig.siteLogo;
    globalSiteConfig = { ...globalSiteConfig, ...newConfig };
    notifySubscribers();
    
    // 更新页面元数据（标题、描述）
    updatePageMetadata({ 
      siteTitle: newConfig.siteTitle !== undefined ? newConfig.siteTitle : globalSiteConfig.siteTitle,
      siteDescription: newConfig.siteDescription !== undefined ? newConfig.siteDescription : globalSiteConfig.siteDescription
    }, true);
    
    // 只在logo真正改变时才更新favicon
    if (newConfig.siteLogo && newConfig.siteLogo !== oldLogo) {
      updatePageMetadata({ siteLogo: newConfig.siteLogo });
    }
    
    // 同步到后端 - 确保传递完整的配置对象，而不是 Partial
    console.log('🔄 准备保存站点配置到后端:', {
      siteName: globalSiteConfig.siteName,
      siteTitle: globalSiteConfig.siteTitle,
      siteLogo: globalSiteConfig.siteLogo ? globalSiteConfig.siteLogo.substring(0, 50) + '...' : 'null',
      siteDescription: globalSiteConfig.siteDescription
    });
    const updatedConfig = await siteConfigApi.update(globalSiteConfig);
    console.log('✅ 站点配置保存成功，后端返回:', {
      siteName: updatedConfig.siteName,
      siteTitle: updatedConfig.siteTitle,
      siteLogo: updatedConfig.siteLogo ? updatedConfig.siteLogo.substring(0, 50) + '...' : 'null',
      siteDescription: updatedConfig.siteDescription
    });
    
    // 后端返回后，更新全局配置和页面元数据
    globalSiteConfig = updatedConfig;
    updatePageMetadata({ 
      siteTitle: updatedConfig.siteTitle,
      siteDescription: updatedConfig.siteDescription 
    }, true);
    
    // 如果logo改变了，更新favicon
    if (updatedConfig.siteLogo !== oldLogo) {
      updatePageMetadata({ siteLogo: updatedConfig.siteLogo });
    }
    
    notifySubscribers();
    
    return updatedConfig;
  } catch (error) {
    console.error('❌ 保存站点配置失败:', error);
    // 即使后端保存失败，也保持本地更新
    return globalSiteConfig;
  }
};

export const useSiteConfig = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(globalSiteConfig);
  const [isLoading, setIsLoading] = useState(!isLoaded);

  useEffect(() => {
    const updateConfig = (newConfig: SiteConfig) => {
      setSiteConfig(newConfig);
    };
    
    subscribers.add(updateConfig);
    
    // 如果还没有加载，则从后端加载
    if (!isLoaded) {
      loadSiteConfig().then(() => {
        setIsLoading(false);
      });
    }
    
    return () => {
      subscribers.delete(updateConfig);
    };
  }, []);

  return {
    siteConfig,
    updateSiteConfig,
    isLoading,
    refresh: loadSiteConfig,
  };
};

