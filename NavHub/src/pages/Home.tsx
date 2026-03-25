import { useEffect } from 'react';
import { useTools } from '@/hooks/useTools';
import { useCategories } from '@/hooks/useCategories';
import { useConfig } from '@/contexts/ConfigContext';
import { TagCard } from '@/app/components/tag-card';
import { smartSearch } from '@/utils/smartSearch';

interface HomeProps {
  selectedCategory?: string;
  searchQuery?: string;
}

export function Home({ selectedCategory = 'all', searchQuery = '' }: HomeProps) {
  const { refreshTrigger } = useConfig();
  const { categories, fetchCategories } = useCategories();

  const {
    tools,
    isLoading,
    toggleFavorite,
    fetchTools,
  } = useTools({
    categoryId: selectedCategory === 'all' || selectedCategory === 'favorites' ? undefined : selectedCategory,
    search: searchQuery || undefined,
    autoFetch: true,
  });

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchTools({});
      fetchCategories();
    }
  }, [refreshTrigger, fetchTools, fetchCategories]);

  const filteredTools = (() => {
    const publishedTools = tools.filter((tool) => tool.isPublished);

    let categoryFilteredTools = publishedTools;
    if (selectedCategory === 'favorites') {
      categoryFilteredTools = publishedTools.filter((tool) => Boolean(tool.isFavorite));
    } else if (selectedCategory !== 'all') {
      categoryFilteredTools = publishedTools.filter((tool) => tool.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      return smartSearch(categoryFilteredTools, searchQuery);
    }

    return categoryFilteredTools.sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
  })();

  return (
    <div className="min-h-screen">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === 'all'
              ? '全部工具'
              : selectedCategory === 'favorites'
                ? '个人收藏'
                : categories.find((c) => c.id === selectedCategory)?.name || '全部工具'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? (
              <>找到 {filteredTools.length} 个相关工具 · 搜索 "{searchQuery}"</>
            ) : (
              <>共 {filteredTools.length} 个工具</>
            )}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      )}

      {!isLoading && filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {filteredTools.map((tool) => (
            <TagCard
              key={tool.id}
              tool={tool}
              onFavoriteToggle={async (id) => {
                try {
                  await toggleFavorite(id);
                } catch (error) {
                  console.error('Toggle favorite failed:', error);
                }
              }}
            />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <p className="text-muted-foreground">暂无相关工具</p>
        </div>
      ) : null}
    </div>
  );
}
