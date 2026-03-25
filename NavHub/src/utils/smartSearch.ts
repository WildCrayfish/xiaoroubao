import type { Tool } from '@/api/types';

/**
 * 同义词映射表
 * 用于智能搜索时匹配相关关键词
 */
const synonyms: Record<string, string[]> = {
  '设计': ['ui', 'design', '界面', '视觉', '美工', 'ux'],
  '开发': ['dev', 'coding', '编程', '代码', '程序', 'development'],
  '工具': ['tool', '软件', 'app', '应用', 'utility'],
  '学习': ['教程', 'tutorial', '课程', '教学', 'learn', 'study'],
  '图标': ['icon', 'svg', '矢量', '图形', 'symbol'],
  '配色': ['color', '颜色', '色彩', '调色', 'palette'],
  '素材': ['资源', 'resource', '模板', 'template', 'asset'],
  '社区': ['论坛', 'community', '交流', '讨论', 'forum'],
  '灵感': ['inspiration', '想法', '创意', 'idea', 'creative'],
  '前端': ['frontend', 'web', '网页', 'html', 'css', 'javascript'],
  '后端': ['backend', 'server', '服务器', 'api', 'database'],
  '数据库': ['database', 'db', 'sql', 'mysql', 'mongodb'],
  '框架': ['framework', 'library', '库', 'react', 'vue', 'angular'],
  '测试': ['test', 'testing', '单元测试', 'unit test', 'qa'],
  '部署': ['deploy', 'deployment', '发布', 'release', 'ci/cd'],
  '文档': ['doc', 'documentation', '说明', 'manual', 'guide'],
  '效率': ['efficiency', 'productivity', '生产力', 'performance'],
  '协作': ['collaboration', 'team', '团队', 'cooperation'],
  '安全': ['security', 'safe', '防护', 'protection'],
  '优化': ['optimize', 'optimization', '性能', 'performance'],
};

/**
 * 计算工具的相关性得分
 */
function calculateRelevanceScore(tool: Tool, searchTerms: string[]): number {
  let relevanceScore = 0;

  searchTerms.forEach((term) => {
    // 名称匹配（权重最高）
    if (tool.name.toLowerCase().includes(term)) {
      relevanceScore += 10;
    }

    // 描述匹配
    if (tool.description.toLowerCase().includes(term)) {
      relevanceScore += 8;
    }

    // URL 匹配
    if (tool.url.toLowerCase().includes(term)) {
      relevanceScore += 5;
    }

    // 同义词匹配
    Object.entries(synonyms).forEach(([key, values]) => {
      if (term.includes(key) || values.some((v) => term.includes(v))) {
        // 名称中包含同义词关键词
        if (tool.name.toLowerCase().includes(key)) {
          relevanceScore += 5;
        }
        if (tool.description.toLowerCase().includes(key)) {
          relevanceScore += 4;
        }

        // 匹配同义词列表
        values.forEach((synonym) => {
          if (tool.name.toLowerCase().includes(synonym)) {
            relevanceScore += 4;
          }
          if (tool.description.toLowerCase().includes(synonym)) {
            relevanceScore += 3;
          }
          if (tool.url.toLowerCase().includes(synonym)) {
            relevanceScore += 2;
          }
        });
      }
    });
  });

  return relevanceScore;
}

/**
 * 智能搜索函数
 * 支持多关键词搜索、同义词匹配、相关性排序
 * 
 * @param tools - 工具列表
 * @param query - 搜索关键词
 * @returns 按相关性排序的工具列表
 */
export function smartSearch(tools: Tool[], query: string): Tool[] {
  // 如果搜索词为空，返回所有工具
  if (!query.trim()) {
    return tools;
  }

  // 将搜索词分割成多个关键词（支持空格分隔）
  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  // 过滤并计算相关性得分
  const resultsWithScore = tools
    .map((tool) => ({
      tool,
      score: calculateRelevanceScore(tool, searchTerms),
    }))
    .filter((item) => item.score > 0);

  // 按相关性得分排序（得分高的排在前面）
  resultsWithScore.sort((a, b) => b.score - a.score);

  // 返回排序后的工具列表
  return resultsWithScore.map((item) => item.tool);
}

/**
 * 获取搜索建议
 * 根据输入的关键词，返回可能的同义词建议
 * 
 * @param query - 搜索关键词
 * @returns 同义词建议列表
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) {
    return [];
  }

  const term = query.toLowerCase().trim();
  const suggestions: string[] = [];

  Object.entries(synonyms).forEach(([key, values]) => {
    if (key.includes(term) || values.some((v) => v.includes(term))) {
      suggestions.push(key);
      suggestions.push(...values);
    }
  });

  // 去重并限制数量
  return Array.from(new Set(suggestions)).slice(0, 10);
}

