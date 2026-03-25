/**
 * 图标工具函数
 * 用于从网站URL自动获取favicon图标
 */

/**
 * 提取主域名
 * @param hostname 完整域名，如 www.example.com
 * @returns 主域名，如 example.com
 */
export function getMainDomain(hostname: string): string {
  const parts = hostname.split('.');

  // 如果是IP地址或localhost，直接返回
  if (parts.length <= 2 || /^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === 'localhost') {
    return hostname;
  }

  // 对于常见的二级域名，返回主域名
  // 例如：space.bilibili.com → bilibili.com
  //      blog.nbvil.com → nbvil.com
  //      www.google.com → google.com
  return parts.slice(-2).join('.');
}

/**
 * 检测是否为默认图标（1x1像素占位符）
 */
function isDefaultIcon(img: HTMLImageElement, url: string): boolean {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  console.log(`🔍 检查图标: ${url} - 尺寸: ${width}x${height}`);

  // 检查是否是1x1像素的占位符
  if (width <= 1 || height <= 1) {
    console.log('❌ 检测到1x1像素占位符');
    return true;
  }

  // 对于自建API，不进行默认图标检测
  if (url.includes('icon.nbvil.com')) {
    console.log('✅ 自建API图标，跳过默认图标检测');
    return false;
  }

  console.log('✅ 图标看起来是真实的');
  return false;
}

/**
 * 测试图标URL是否有效且不是默认图标
 * @param url 图标URL
 * @returns Promise<boolean> 图标是否有效
 */
export function testIconUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`🔍 开始测试图标URL: ${url}`);

    const img = new Image();

    img.onload = () => {
      console.log(`📥 图标加载完成: ${url}`, {
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete,
      });

      // 检查是否为默认图标
      if (isDefaultIcon(img, url)) {
        console.log(`⚠️ 检测到默认图标: ${url} (${img.naturalWidth}x${img.naturalHeight})`);
        resolve(false);
      } else {
        console.log(`✅ 图标加载成功: ${url} (${img.naturalWidth}x${img.naturalHeight})`);
        resolve(true);
      }
    };

    img.onerror = (error) => {
      console.log(`❌ 图标加载失败: ${url}`, {
        error: error,
        type: (error as any).type,
        target: (error as any).target,
      });
      resolve(false);
    };

    // 设置crossOrigin为anonymous，尝试支持CORS
    img.crossOrigin = 'anonymous';
    img.src = url;

    // 5秒超时
    setTimeout(() => {
      console.log(`⏰ 图标加载超时: ${url}`);
      resolve(false);
    }, 5000);
  });
}

/**
 * 从网站URL自动获取图标
 * @param url 网站URL
 * @param forceRefresh 是否强制刷新
 * @returns Promise<string> 图标URL
 */
export async function getWebsiteIcon(
  url: string,
  forceRefresh = false
): Promise<string> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const mainDomain = getMainDomain(hostname);

    console.log('🎯 图标获取分析:', {
      originalUrl: url,
      hostname: hostname,
      mainDomain: mainDomain,
      forceRefresh: forceRefresh,
    });

    // 1. 使用自建图标API服务
    const faviconAPIs = [
      // 自建图标API - 使用完整域名
      `https://icon.nbvil.com/favicon?url=${hostname}`,
      // 如果完整域名和主域名不同，也尝试主域名
      ...(hostname !== mainDomain
        ? [`https://icon.nbvil.com/favicon?url=${mainDomain}`]
        : []),
    ];

    console.log('🔍 开始获取图标:', {
      originalUrl: url,
      hostname,
      mainDomain,
      forceRefresh,
      apiList: faviconAPIs,
    });

    // 尝试每个API
    for (const apiUrl of faviconAPIs) {
      console.log(`🔍 测试自建API: ${apiUrl}`);
      try {
        const isValid = await testIconUrl(apiUrl);
        if (isValid) {
          console.log(`✅ 自建API成功: ${apiUrl}`);
          return apiUrl;
        } else {
          console.log(`❌ 自建API失败: ${apiUrl}`);
        }
      } catch (error) {
        console.log(`❌ 自建API异常: ${apiUrl}`, error);
      }
    }

    // 2. 如果自建API都失败，使用默认图标
    console.log('⚠️ 自建API都失败，使用默认图标');
    return '/assets/logo.png';
  } catch (error) {
    console.warn('无法解析网站URL，使用默认图标:', error);
    return '/assets/logo.png';
  }
}

/**
 * 判断图标是否为URL（图片）还是emoji
 * @param icon 图标字符串
 * @returns true 如果是URL，false 如果是emoji
 */
export function isIconUrl(icon: string): boolean {
  if (!icon) return false;
  // 检查是否是URL格式
  try {
    new URL(icon);
    return true;
  } catch {
    // 检查是否是http://或https://开头
    return icon.startsWith('http://') || icon.startsWith('https://');
  }
}

