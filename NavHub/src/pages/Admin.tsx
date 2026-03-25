import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTools } from '@/hooks/useTools';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { ToolManager } from '@/app/components/admin/ToolManager';
import { CategoryManager } from '@/app/components/admin/CategoryManager';
import { LogoUploader } from '@/app/components/admin/LogoUploader';
import { VersionManager } from '@/app/components/admin/VersionManager';
import { ImportExportManager } from '@/app/components/admin/ImportExportManager';
import { Settings, Save, Check, LogOut, RefreshCw, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Tool } from '@/api/types';
import { getWebsiteIcon } from '@/utils/iconUtils';

type TabType = 'tools' | 'categories' | 'settings' | 'import-export';

/**
 * 管理员配置页面
 * 包含工具管理、分类管理等功能
 */
export function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { triggerRefresh } = useConfig();
  const { siteConfig, updateSiteConfig, refresh: refreshSiteConfig } = useSiteConfig();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingIcons, setIsUpdatingIcons] = useState(false);
  const [iconUpdateProgress, setIconUpdateProgress] = useState<{ current: number; total: number; success: number; fail: number } | null>(null);
  
  // 系统设置相关状态
  const [siteSettings, setSiteSettings] = useState(siteConfig);
  const [showLogoManager, setShowLogoManager] = useState(false);
  const [hasSiteConfigChanges, setHasSiteConfigChanges] = useState(false);
  
  // 当siteConfig变化时，更新siteSettings
  useEffect(() => {
    setSiteSettings(siteConfig);
    setHasSiteConfigChanges(false);
  }, [siteConfig]);
  
  // 检查系统设置是否有变更
  useEffect(() => {
    const hasChanges = JSON.stringify(siteSettings) !== JSON.stringify(siteConfig);
    setHasSiteConfigChanges(hasChanges);
  }, [siteSettings, siteConfig]);



  const { 
    tools: originalTools, 
    isLoading: toolsLoading, 
    addTool: apiAddTool, 
    updateTool: apiUpdateTool, 
    deleteTool: apiDeleteTool, 
    reorderTools: apiReorderTools,
    fetchTools,
  } = useTools({
    autoFetch: true,
    includeUnpublished: true, // 管理页面需要获取所有工具（包括未发布的）
  });

  // 本地工具列表（用于批量保存）
  const [localTools, setLocalTools] = useState<Tool[]>([]);
  const [pendingOperations, setPendingOperations] = useState<{
    added: Tool[];
    updated: Tool[];
    deleted: string[];
    reordered: Tool[];
  }>({
    added: [],
    updated: [],
    deleted: [],
    reordered: [],
  });

  const hasPendingChanges =
    pendingOperations.added.length > 0 ||
    pendingOperations.updated.length > 0 ||
    pendingOperations.deleted.length > 0 ||
    pendingOperations.reordered.length > 0 ||
    hasSiteConfigChanges;

  // 阻止在有未保存更改时直接关闭/刷新页面
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasPendingChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasPendingChanges]);

  // 退出配置页面，返回首页
  const handleExit = () => {
    if (hasPendingChanges) {
      const shouldLeave = window.confirm('你有未保存的更改，确定要退出管理后台吗？');
      if (!shouldLeave) return;
    }
    navigate('/');
  };

  // 同步原始工具列表到本地（只在初始化时同步）
  useEffect(() => {
    console.log('同步工具列表:', {
      localToolsLength: localTools.length,
      originalToolsLength: originalTools.length,
      originalTools: originalTools,
    });
    // 只在本地列表为空时同步，避免覆盖本地的未发布工具
    if (localTools.length === 0 && originalTools.length > 0) {
      console.log('设置本地工具列表');
      setLocalTools([...originalTools]);
    } else if (originalTools.length > 0 && localTools.length > 0) {
      // 如果本地已有工具，合并更新（保留本地的未发布工具）
      const mergedTools = [...localTools];
      
      // 更新已存在的工具
      originalTools.forEach(originalTool => {
        const index = mergedTools.findIndex(t => t.id === originalTool.id);
        if (index >= 0) {
          // 如果工具已存在，更新它（但保留本地的 isPublished 状态）
          mergedTools[index] = {
            ...originalTool,
            isPublished: mergedTools[index].isPublished, // 保留本地的发布状态
          };
        } else {
          // 检查是否已存在相同的工具（通过 name + url 判断，避免重复添加）
          const isDuplicate = mergedTools.some(t => 
            t.name === originalTool.name && t.url === originalTool.url
          );
          
          if (!isDuplicate) {
            // 如果是新工具且不重复，添加到列表
            mergedTools.push(originalTool);
          } else {
            console.log('⚠️ 跳过重复工具:', {
              name: originalTool.name,
              url: originalTool.url,
              newId: originalTool.id
            });
          }
        }
      });
      
      console.log('合并工具列表:', {
        originalLength: originalTools.length,
        localLength: localTools.length,
        mergedLength: mergedTools.length
      });
      
      setLocalTools(mergedTools);
    }
  }, [originalTools.length]);

  // 本地添加工具（不立即保存到后端）
  const handleAddTool = (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTool: Tool = {
      ...tool,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalTools(prev => [...prev, newTool]);
    setPendingOperations(prev => ({
      ...prev,
      added: [...prev.added, newTool],
    }));
  };

  // 本地更新工具（不立即保存到后端）
  const handleUpdateTool = (id: string, tool: Partial<Tool>) => {
    console.log(`🔄 handleUpdateTool 调用:`, { id, tool, toolKeys: Object.keys(tool) });
    
    const originalTool = localTools.find(t => t.id === id);
    if (!originalTool) {
      console.warn(`工具 ${id} 不存在`);
      return;
    }
    
    // 合并更新，确保所有字段都被正确更新（包括 icon）
    const updatedTool = { ...originalTool, ...tool };
    console.log(`🔄 更新工具 ${id}:`, {
      originalIcon: originalTool.icon,
      newIcon: tool.icon,
      finalIcon: updatedTool.icon,
      toolData: tool,
      updatedTool: {
        id: updatedTool.id,
        name: updatedTool.name,
        hasId: !!updatedTool.id
      }
    });
    
    setLocalTools(prev => prev.map(t => t.id === id ? updatedTool : t));
    
    // 如果是临时 ID，更新待添加列表；否则更新待更新列表
    if (id.startsWith('temp_')) {
      setPendingOperations(prev => ({
        ...prev,
        added: prev.added.map(t => (t && t.id === id) ? updatedTool : t).filter(t => t && typeof t === 'object' && t.id),
      }));
    } else {
      setPendingOperations(prev => {
        // 先过滤掉所有无效的工具
        const validPrevUpdated = prev.updated.filter(t => t && typeof t === 'object' && t.id);
        
        // 检查是否已经在待更新列表中
        const existingIndex = validPrevUpdated.findIndex(t => t.id === id);
        const newUpdated = existingIndex >= 0
          ? validPrevUpdated.map(t => t.id === id ? updatedTool : t)
          : [...validPrevUpdated, updatedTool];
        
        console.log(`📝 更新待处理列表:`, {
          id,
          existingIndex,
          prevLength: prev.updated.length,
          validPrevLength: validPrevUpdated.length,
          newLength: newUpdated.length,
          updatedTool: {
            id: updatedTool.id,
            name: updatedTool.name,
            hasId: !!updatedTool.id
          }
        });
        
        return {
          ...prev,
          updated: newUpdated,
        };
      });
    }
  };

  // 本地删除工具（不立即保存到后端）
  const handleDeleteTool = (id: string) => {
    setLocalTools(prev => prev.filter(t => t.id !== id));
    
    if (id.startsWith('temp_')) {
      // 如果是临时工具，从待添加列表中移除
      setPendingOperations(prev => ({
        ...prev,
        added: prev.added.filter(t => t && t.id !== id),
      }));
    } else {
      // 如果是已存在的工具，添加到待删除列表
      setPendingOperations(prev => ({
        ...prev,
        deleted: [...prev.deleted.filter(d => d !== id), id],
        updated: prev.updated.filter(t => t && t.id !== id),
      }));
    }
  };

  // 本地切换发布状态（不立即保存到后端）
  const handleTogglePublish = (id: string) => {
    const tool = localTools.find(t => t.id === id);
    if (!tool) {
      console.warn(`工具 ${id} 不存在，无法切换发布状态`);
      return;
    }
    
    // 只更新 isPublished 字段，保留其他所有字段
    handleUpdateTool(id, { isPublished: !tool.isPublished });
  };

  // 本地排序（不立即保存到后端）
  const handleReorderTools = (orderedTools: Tool[]) => {
    // 确保所有工具都有正确的 sort 值（连续排序）
    const toolsWithSort = orderedTools.map((tool, index) => ({
      ...tool,
      sort: index,
    }));
    setLocalTools(toolsWithSort);
    setPendingOperations(prev => ({
      ...prev,
      reordered: toolsWithSort, // 保存带有正确 sort 值的工具列表
    }));
  };

  const { 
    categories, 
    isLoading: categoriesLoading,
    addCategory, 
    updateCategory, 
    deleteCategory, 
    fetchCategories 
  } = useCategories();

  // 批量更新图标
  const handleUpdateAllIcons = async () => {
    if (localTools.length === 0) {
      alert('没有工具需要更新图标');
      return;
    }

    if (!confirm(`确定要更新所有 ${localTools.length} 个工具的图标吗？`)) {
      return;
    }

    setIsUpdatingIcons(true);
    setIconUpdateProgress({ current: 0, total: localTools.length, success: 0, fail: 0 });
    setSaveMessage(null);

    let updatedTools = [...localTools];
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < localTools.length; i++) {
        const tool = localTools[i];

        try {
          console.log(`🔄 更新图标 ${i + 1}/${localTools.length}: ${tool.name}`);

          // 获取最新的图标URL
          const iconUrl = await getWebsiteIcon(tool.url, true);

          if (iconUrl && iconUrl !== '/assets/logo.png') {
            // 更新工具的图标
            updatedTools = updatedTools.map(t =>
              t.id === tool.id
                ? { ...t, icon: iconUrl }
                : t
            );
            successCount++;
          } else {
            failCount++;
          }

          // 更新进度
          setIconUpdateProgress({
            current: i + 1,
            total: localTools.length,
            success: successCount,
            fail: failCount,
          });

          // 添加延迟避免请求过快
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`更新 ${tool.name} 图标失败:`, error);
          failCount++;
          setIconUpdateProgress({
            current: i + 1,
            total: localTools.length,
            success: successCount,
            fail: failCount,
          });
        }
      }

      // 更新本地工具列表
      setLocalTools(updatedTools);

      // 将更新的工具添加到待更新列表
      const updatedToolsForPending = updatedTools.filter(t => {
        const original = localTools.find(ot => ot.id === t.id);
        const iconChanged = original && original.icon !== t.icon;
        if (iconChanged) {
          console.log(`工具 ${t.name} 图标已更新:`, {
            oldIcon: original?.icon,
            newIcon: t.icon,
          });
        }
        return iconChanged;
      });

      if (updatedToolsForPending.length > 0) {
        console.log(`准备保存 ${updatedToolsForPending.length} 个工具的图标更新到数据库`);
        setPendingOperations(prev => ({
          ...prev,
          updated: [
            ...prev.updated.filter(t => !updatedToolsForPending.some(ut => ut.id === t.id)),
            ...updatedToolsForPending,
          ],
        }));
      }

      setSaveMessage({
        type: 'success',
        text: `✅ 图标更新完成！成功: ${successCount}, 失败: ${failCount}`,
      });

      // 3秒后清除消息
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } catch (error) {
      console.error('批量更新图标失败:', error);
      setSaveMessage({
        type: 'error',
        text: `❌ 批量更新失败：${error instanceof Error ? error.message : '未知错误'}`,
      });
    } finally {
      setIsUpdatingIcons(false);
      setIconUpdateProgress(null);
    }
  };

  // 保存配置 - 批量同步所有更改到后端
  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const errors: string[] = [];
      
      // 🔄 先刷新工具列表,确保 originalTools 是最新的
      console.log('🔄 刷新工具列表以确保数据同步...');
      await fetchTools({ includeUnpublished: true });
      
      // 🔧 预处理：清理所有无效的工具对象
      const validAddedTools = (pendingOperations.added || []).filter((t): t is Tool => {
        const isValid = t !== null && t !== undefined && typeof t === 'object' && 'id' in t && !!t.id;
        if (!isValid && t) {
          console.warn('⚠️ 过滤掉无效的添加工具:', t);
        }
        return isValid;
      });
      
      const validUpdatedTools = (pendingOperations.updated || []).filter((t): t is Tool => {
        const isValid = t !== null && t !== undefined && typeof t === 'object' && 'id' in t && !!t.id;
        if (!isValid) {
          console.warn('⚠️ 过滤掉无效的更新工具:', t);
        }
        return isValid;
      });
      
      const validReorderedTools = (pendingOperations.reordered || []).filter((t): t is Tool => {
        const isValid = t !== null && t !== undefined && typeof t === 'object' && 'id' in t && !!t.id;
        if (!isValid && t) {
          console.warn('⚠️ 过滤掉无效的排序工具:', t);
        }
        return isValid;
      });
      
      // 打印待处理操作的详细信息
      console.log('📋 待处理操作:', {
        added: validAddedTools.length,
        updated: validUpdatedTools.length,
        deleted: pendingOperations.deleted.length,
        reordered: validReorderedTools.length,
        updatedTools: validUpdatedTools.map(t => {
          if (!t || !t.id) {
            console.error('❌ 日志输出时发现无效工具:', t);
            return { id: 'ERROR', name: 'ERROR', hasId: false, type: typeof t, keys: [] };
          }
          return {
            id: t.id,
            name: t.name,
            hasId: true,
            type: typeof t,
            keys: Object.keys(t)
          };
        })
      });
      
      // 先保存站点设置到后端
      if (hasSiteConfigChanges) {
        try {
          await updateSiteConfig(siteSettings);
          // 保存成功后，刷新配置以确保数据同步
          await refreshSiteConfig();
        } catch (error) {
          console.error('保存站点配置失败:', error);
          errors.push(`保存站点配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      }

      // 1. 批量删除工具
      for (const id of pendingOperations.deleted) {
        try {
          await apiDeleteTool(id);
        } catch (error) {
          errors.push(`删除工具失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      }

      // 2. 批量添加新工具 - 过滤掉已存在的工具
      const addedToolsMap = new Map<string, Tool>(); // 临时id -> 新工具的映射
      
      // 过滤掉已经存在于数据库中的工具(通过 name + url 判断)
      const toolsToAdd = validAddedTools.filter(tool => {
        const existsInDb = originalTools.some(ot => 
          ot.name === tool.name && ot.url === tool.url
        );
        
        if (existsInDb) {
          console.log('⚠️ 跳过已存在的工具:', {
            name: tool.name,
            url: tool.url,
            tempId: tool.id
          });
          
          // 找到数据库中对应的工具,更新本地工具列表的id
          const dbTool = originalTools.find(ot => 
            ot.name === tool.name && ot.url === tool.url
          );
          if (dbTool) {
            addedToolsMap.set(tool.id, dbTool);
          }
        }
        
        return !existsInDb;
      });
      
      console.log(`📊 添加工具统计:`, {
        total: validAddedTools.length,
        toAdd: toolsToAdd.length,
        skipped: validAddedTools.length - toolsToAdd.length
      });
      
      for (const tool of toolsToAdd) {
        try {
          const { id, createdAt, updatedAt, ...toolData } = tool;
          const newTool = await apiAddTool(toolData);
          if (newTool && newTool.id) {
            addedToolsMap.set(id, newTool); // 记录临时id和新工具的映射
            console.log(`✅ 工具 ${tool.name} 添加成功:`, { 
              tempId: id,
              newId: newTool.id 
            });
          }
        } catch (error) {
          // 检查是否是唯一约束冲突错误
          const errorMessage = error instanceof Error ? error.message : '';
          const isDuplicateError = errorMessage.includes('SQLIntegrityConstraintViolationException') || 
                                   errorMessage.includes('Duplicate entry');
          
          if (isDuplicateError) {
            console.warn('⚠️ 工具已存在,尝试从数据库获取:', tool.name);
            // 工具已存在,尝试从最新的 originalTools 中查找
            const existingTool = originalTools.find(ot => 
              ot.name === tool.name && ot.url === tool.url
            );
            if (existingTool) {
              addedToolsMap.set(tool.id, existingTool);
              console.log(`✅ 找到已存在的工具:`, { 
                tempId: tool.id,
                existingId: existingTool.id,
                name: tool.name
              });
            } else {
              // 如果还是找不到,记录警告但不算错误
              console.warn(`⚠️ 无法找到已存在的工具: ${tool.name}`);
            }
          } else {
            // 其他错误才记录到错误列表
            console.error('❌ 添加工具异常:', { 
              toolId: tool.id,
              toolName: tool.name,
              error 
            });
            errors.push(`添加工具失败 (${tool.name}): ${errorMessage}`);
          }
        }
      }
      
      // 更新本地工具列表,将临时id替换为真实id
      if (addedToolsMap.size > 0) {
        setLocalTools(prev => prev.map(tool => {
          const newTool = addedToolsMap.get(tool.id);
          return newTool || tool;
        }));
      }

      // 3. 批量更新工具
      for (const tool of validUpdatedTools) {
        try {
          const { id, createdAt, updatedAt, ...toolData } = tool;
          
          // 确保 icon 字段始终存在（不能是 undefined）
          // 如果 icon 是 undefined，使用原始值或默认值
          if (toolData.icon === undefined) {
            console.warn(`⚠️ 工具 ${tool.name} 的 icon 字段为 undefined，使用原始值: ${tool.icon}`);
            toolData.icon = tool.icon || '🔗';
          }
          // 如果 icon 是 null，转换为空字符串或默认值
          if (toolData.icon === null) {
            console.warn(`⚠️ 工具 ${tool.name} 的 icon 字段为 null，使用默认值`);
            toolData.icon = '🔗';
          }
          
          console.log(`📤 更新工具 ${tool.name} (${id}):`, { 
            id, 
            icon: toolData.icon,
            iconType: typeof toolData.icon,
            iconLength: toolData.icon ? toolData.icon.length : 0,
            allFields: Object.keys(toolData),
            toolData 
          });
          
          const updatedTool = await apiUpdateTool(id, toolData);
          
          if (updatedTool && updatedTool.id) {
            console.log(`✅ 工具 ${tool.name} 更新成功:`, { 
              id: updatedTool.id,
              icon: updatedTool.icon,
              iconType: typeof updatedTool.icon
            });
          } else {
            console.warn(`⚠️ 工具 ${tool.name} 更新返回值异常:`, updatedTool);
          }
        } catch (error) {
          console.error(`❌ 更新工具失败:`, {
            toolId: tool.id,
            toolName: tool.name,
            error,
            errorMessage: error instanceof Error ? error.message : '未知错误',
            errorStack: error instanceof Error ? error.stack : undefined
          });
          errors.push(`更新工具失败 (${tool.name}): ${error instanceof Error ? error.message : '未知错误'}`);
        }
      }

      // 4. 批量更新排序（如果有排序变更）
      if (validReorderedTools.length > 0) {
        try {
          await apiReorderTools(validReorderedTools);
        } catch (error) {
          errors.push(`更新排序失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
      }

      // 5. 不刷新数据，完全依赖前端状态
      // 前端已经有最新的数据（localTools），不需要从后端重新获取
      
      // 6. 清空待处理操作
      setPendingOperations({
        added: [],
        updated: [],
        deleted: [],
        reordered: [],
      });
      
      // 7. 清空系统设置变更标记
      setHasSiteConfigChanges(false);

      // 8. 触发全局刷新事件，通知首页更新（首页会重新获取数据）
      triggerRefresh();

      if (errors.length > 0) {
        setSaveMessage({ 
          type: 'error', 
          text: `❌ 部分操作失败：${errors.join('; ')}` 
        });
      } else {
        setSaveMessage({ type: 'success', text: '✅ 配置已保存并同步到首页！' });
      }
      
      // 3秒后清除消息
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('保存配置失败:', error);
      setSaveMessage({ 
        type: 'error', 
        text: '❌ 保存失败：' + (error instanceof Error ? error.message : '未知错误') 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 调试信息
  useEffect(() => {
    console.log('Admin组件状态:', {
      isAdmin,
      authLoading,
      toolsLoading,
      localToolsLength: localTools.length,
      originalToolsLength: originalTools.length,
      activeTab,
      categoriesLength: categories.length,
    });
  }, [isAdmin, authLoading, toolsLoading, localTools.length, originalTools.length, activeTab, categories.length]);

  // 权限检查
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">无权限访问</h2>
          <p className="text-muted-foreground">您需要管理员权限才能访问此页面</p>
          <p className="text-xs text-muted-foreground mt-2">isAdmin: {String(isAdmin)}, authLoading: {String(authLoading)}</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">管理后台</h1>
            <p className="text-sm text-muted-foreground">管理工具、分类和系统设置</p>
          </div>
        
        {/* 保存配置按钮和退出按钮 */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            {/* 显示待保存操作数量 */}
            {(pendingOperations.added.length > 0 || 
              pendingOperations.updated.length > 0 || 
              pendingOperations.deleted.length > 0 || 
              pendingOperations.reordered.length > 0 ||
              hasSiteConfigChanges) && (
              <span className="text-sm text-orange-600 font-medium">
                待保存: {pendingOperations.added.length + 
                        pendingOperations.updated.length + 
                        pendingOperations.deleted.length + 
                        (pendingOperations.reordered.length > 0 ? 1 : 0) +
                        (hasSiteConfigChanges ? 1 : 0)} 项
              </span>
            )}
            {/* 更新图标按钮 */}
            {activeTab === 'tools' && (
              <button
                onClick={handleUpdateAllIcons}
                disabled={isUpdatingIcons || localTools.length === 0}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg',
                  'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
                  'hover:shadow-lg transition-all',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="批量更新所有工具的图标"
              >
                {isUpdatingIcons ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">
                      {iconUpdateProgress ? `${iconUpdateProgress.current}/${iconUpdateProgress.total}` : '更新中...'}
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">更新图标</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleSaveConfig}
              disabled={isSaving || (
                pendingOperations.added.length === 0 && 
                pendingOperations.updated.length === 0 && 
                pendingOperations.deleted.length === 0 && 
                pendingOperations.reordered.length === 0 &&
                !hasSiteConfigChanges
              )}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg',
                'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
                'hover:shadow-lg transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>保存配置</span>
                </>
              )}
            </button>
            <button
              onClick={handleExit}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg',
                'bg-white/50 backdrop-blur-sm border border-white/40',
                'text-foreground hover:bg-white/70 transition-all'
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>退出</span>
            </button>
          </div>
          
          {/* 图标更新进度 */}
          {iconUpdateProgress && (
            <div className="text-xs text-muted-foreground">
              进度: {iconUpdateProgress.current}/{iconUpdateProgress.total} | 
              成功: {iconUpdateProgress.success} | 
              失败: {iconUpdateProgress.fail}
            </div>
          )}
          
          {/* 保存消息提示 */}
          {saveMessage && (
            <div className={cn(
              'px-4 py-2 rounded-lg text-sm flex items-center gap-2',
              saveMessage.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}>
              {saveMessage.type === 'success' && <Check className="w-4 h-4" />}
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-white/20">
          <button
            onClick={() => setActiveTab('tools')}
            className={cn(
              'px-6 py-3.5 text-base font-semibold transition-all relative',
              activeTab === 'tools'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            工具管理
            {activeTab === 'tools' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              'px-6 py-3.5 text-base font-semibold transition-all relative',
              activeTab === 'categories'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            分类管理
            {activeTab === 'categories' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              'px-6 py-3.5 text-base font-semibold transition-all relative',
              activeTab === 'settings'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            系统设置
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={cn(
              'px-6 py-3.5 text-base font-semibold transition-all relative',
              activeTab === 'import-export'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Download className="w-4 h-4 inline mr-2" />
            导入导出
            {activeTab === 'import-export' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'tools' && (
          <ToolManager
            tools={localTools}
            isLoading={toolsLoading}
            categories={categories}
            onAdd={handleAddTool}
            onUpdate={handleUpdateTool}
            onDelete={handleDeleteTool}
            onTogglePublish={handleTogglePublish}
            onReorder={handleReorderTools}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories.filter(c => c.id !== 'all' && c.id !== 'favorites')}
            isLoading={categoriesLoading}
            onAdd={async (category) => {
              try {
                await addCategory(category);
                setSaveMessage({ type: 'success', text: '✅ 分类已添加！' });
                setTimeout(() => setSaveMessage(null), 3000);
              } catch (error) {
                setSaveMessage({ 
                  type: 'error', 
                  text: `❌ 添加分类失败：${error instanceof Error ? error.message : '未知错误'}` 
                });
                setTimeout(() => setSaveMessage(null), 3000);
              }
            }}
            onUpdate={async (id, category) => {
              try {
                await updateCategory(id, category);
                setSaveMessage({ type: 'success', text: '✅ 分类已更新！' });
                setTimeout(() => setSaveMessage(null), 3000);
              } catch (error) {
                setSaveMessage({ 
                  type: 'error', 
                  text: `❌ 更新分类失败：${error instanceof Error ? error.message : '未知错误'}` 
                });
                setTimeout(() => setSaveMessage(null), 3000);
              }
            }}
            onDelete={async (id) => {
              try {
                await deleteCategory(id);
                setSaveMessage({ type: 'success', text: '✅ 分类已删除！' });
                setTimeout(() => setSaveMessage(null), 3000);
              } catch (error) {
                setSaveMessage({ 
                  type: 'error', 
                  text: `❌ 删除分类失败：${error instanceof Error ? error.message : '未知错误'}` 
                });
                setTimeout(() => setSaveMessage(null), 3000);
              }
            }}
            onRefresh={fetchCategories}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/60">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">系统设置</h3>
              
              {/* 站点基本信息 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">站点基本信息</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点名称</label>
                    <input
                      type="text"
                      value={siteSettings.siteName || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NavHub"
                    />
                    <p className="text-xs text-gray-500 mt-1">显示在网站头部的品牌名称</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点标题</label>
                    <input
                      type="text"
                      value={siteSettings.siteTitle || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, siteTitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="NavHub - 精选网站导航"
                    />
                    <p className="text-xs text-gray-500 mt-1">显示在浏览器标签页和搜索引擎中的标题</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点Logo</label>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
                        <img 
                          src={siteSettings.siteLogo || '/assets/logo.png'} 
                          alt="站点Logo"
                          className="w-10 h-10 rounded border border-gray-200 bg-white p-1"
                          onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/logo.png';
                          }}
                        />
                        <span className="text-sm text-gray-600 flex-1 truncate">
                          {siteSettings.siteLogo?.split('/').pop() || '未选择Logo'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLogoManager(true)}
                        className="flex items-center space-x-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                      >
                        <ImageIcon size={16} />
                        <span>更换</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">建议使用32x32像素或64x64像素的PNG格式图片</p>
                  </div>
                
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点描述</label>
                    <textarea
                      value={siteSettings.siteDescription || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="发现优质网站，提升工作效率。汇聚设计、开发、工具等各类精选网站资源。"
                    />
                    <p className="text-xs text-gray-500 mt-1">网站的简介描述，用于SEO和页面介绍，建议控制在100字以内</p>
                  </div>
                </div>
              </div>

              {/* 备案信息设置 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">备案信息</h4>
                <p className="text-sm text-gray-600 mb-4">配置网站备案信息，留空则不显示在页脚中</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ICP备案号</label>
                    <input
                      type="text"
                      value={siteSettings.icpRecord || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, icpRecord: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="如：京ICP备12345678号"
                    />
                    <p className="text-xs text-gray-500 mt-1">ICP备案号，自动链接到工信部备案查询网站，留空则不显示</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公安备案号</label>
                    <input
                      type="text"
                      value={siteSettings.publicSecurityRecord || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, publicSecurityRecord: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="如：京公网安备11010802012345号"
                    />
                    <p className="text-xs text-gray-500 mt-1">公安备案号，留空则不显示</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">公安备案链接</label>
                    <input
                      type="url"
                      value={siteSettings.publicSecurityRecordUrl || ''}
                      onChange={(e) => setSiteSettings({...siteSettings, publicSecurityRecordUrl: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="如：http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802012345"
                    />
                    <p className="text-xs text-gray-500 mt-1">公安备案查询链接，配合公安备案号使用</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  💡 提示：修改后点击右上角的"保存配置"按钮统一保存所有配置
                </p>
              </div>
            </div>
            
            {/* 版本管理 */}
            <VersionManager />
          </div>
        )}

        {activeTab === 'import-export' && (
          <ImportExportManager
            tools={localTools}
            categories={categories}
            onImport={async (data) => {
              try {
                console.log('🚀 开始导入配置...');
                setIsSaving(true);
                setSaveMessage({ type: 'success', text: '⏳ 正在导入配置，请稍候...' });
                
                // 第一步：删除所有现有工具
                console.log('🗑️ 删除现有工具，数量:', originalTools.length);
                for (const tool of originalTools) {
                  try {
                    await apiDeleteTool(tool.id);
                    console.log(`✅ 已删除工具: ${tool.name}`);
                  } catch (error) {
                    console.error(`❌ 删除工具失败 (${tool.name}):`, error);
                  }
                }
                
                // 第二步：导入分类并建立ID映射
                const categoryIdMap = new Map<string, string>(); // 旧ID -> 新ID
                
                // 删除所有现有分类（除了"全部"）
                console.log('🗑️ 删除现有分类...');
                const existingCategories = categories.filter(c => c.id !== 'all' && c.id !== 'favorites');
                for (const cat of existingCategories) {
                  try {
                    await deleteCategory(cat.id);
                    console.log(`✅ 已删除分类: ${cat.name}`);
                  } catch (error) {
                    console.error(`❌ 删除分类失败 (${cat.name}):`, error);
                  }
                }
                
                // 添加导入的分类，并记录新旧ID映射
                console.log('📁 导入新分类...');
                setSaveMessage({ type: 'success', text: '⏳ 正在导入分类...' });
                
                // 过滤掉前端虚拟分类
                const categoriesToImport = data.categories.filter(c => c.id !== 'all' && c.id !== 'favorites');

                // 导入前校验：禁止重名分类（会导致名称匹配映射不稳定）
                const nameCount = new Map<string, number>();
                for (const category of categoriesToImport) {
                  const key = category.name.trim();
                  nameCount.set(key, (nameCount.get(key) || 0) + 1);
                }
                const duplicateNames = Array.from(nameCount.entries())
                  .filter(([, count]) => count > 1)
                  .map(([name]) => name);
                if (duplicateNames.length > 0) {
                  throw new Error(`导入失败：存在重名分类（${duplicateNames.join('、')}），请先修正后重试`);
                }
                
                for (const category of categoriesToImport) {
                  try {
                    const oldCategoryId = category.id;
                    const { id, ...categoryData } = category;
                    
                    console.log(`📁 正在导入分类: ${category.name} (旧ID: ${oldCategoryId})`);
                    console.log(`📝 分类数据:`, categoryData);
                    
                    const newCategory = await addCategory(categoryData);
                    
                    console.log(`🔍 addCategory 返回值:`, newCategory);
                    console.log(`🔍 返回值类型:`, typeof newCategory);
                    console.log(`🔍 返回值是否有id:`, newCategory?.id);
                    console.log(`🔍 返回值的所有键:`, newCategory ? Object.keys(newCategory) : 'null');
                    console.log(`🔍 返回值的JSON:`, JSON.stringify(newCategory));
                    
                    // 记录旧ID到新ID的映射
                    if (newCategory && newCategory.id) {
                      categoryIdMap.set(oldCategoryId, newCategory.id);
                      console.log(`✅ 分类ID映射: ${oldCategoryId} -> ${newCategory.id} (${category.name})`);
                    } else {
                      console.error(`❌ 分类导入失败，未返回新ID: ${category.name}`, {
                        返回值: newCategory,
                        返回值类型: typeof newCategory,
                        有id: !!newCategory?.id,
                        所有键: newCategory ? Object.keys(newCategory) : 'null'
                      });
                    }
                  } catch (error) {
                    console.error(`❌ 导入分类失败 (${category.name}):`, error);
                    console.error(`❌ 错误详情:`, {
                      message: error instanceof Error ? error.message : String(error),
                      stack: error instanceof Error ? error.stack : undefined
                    });
                  }
                }
                
                console.log(`📊 分类ID映射表:`, Array.from(categoryIdMap.entries()));
                
                // 刷新分类列表
                await fetchCategories();
                
                // 如果映射表为空,说明POST返回值有问题,通过名称匹配建立映射
                if (categoryIdMap.size === 0) {
                  console.log('⚠️ 分类ID映射表为空,尝试通过名称匹配建立映射...');
                  const currentCategories = categories.filter(c => c.id !== 'all' && c.id !== 'favorites');
                  console.log('📋 当前分类列表:', currentCategories);

                  for (const oldCategory of categoriesToImport) {
                    const matchedCategory = currentCategories.find(c => c.name === oldCategory.name);
                    if (matchedCategory) {
                      categoryIdMap.set(oldCategory.id, matchedCategory.id);
                      console.log(`✅ 通过名称匹配建立映射: ${oldCategory.id} -> ${matchedCategory.id} (${oldCategory.name})`);
                    } else {
                      console.warn(`⚠️ 未找到匹配的分类: ${oldCategory.name}`);
                    }
                  }

                  console.log(`📊 更新后的分类ID映射表:`, Array.from(categoryIdMap.entries()));
                }

                // 导入前校验：确保所有工具的分类ID都有映射
                const missingCategoryTools = data.tools.filter((tool) => !categoryIdMap.get(tool.categoryId));
                if (missingCategoryTools.length > 0) {
                  const previewNames = missingCategoryTools.slice(0, 5).map((t) => t.name).join('、');
                  throw new Error(`导入失败：有 ${missingCategoryTools.length} 个工具找不到对应分类（如：${previewNames}）`);
                }
                // 第三步：直接导入工具到数据库，使用新的分类ID
                console.log('🔧 开始导入工具到数据库...');
                setSaveMessage({ type: 'success', text: `⏳ 正在导入 ${data.tools.length} 个工具...` });
                
                let successCount = 0;
                let failCount = 0;
                
                for (let index = 0; index < data.tools.length; index++) {
                  const tool = data.tools[index];
                  try {
                    // 查找新的分类ID
                    const newCategoryId = categoryIdMap.get(tool.categoryId);
                    
                    if (!newCategoryId) {
                      console.warn(`⚠️ 工具 ${tool.name} 的分类ID ${tool.categoryId} 未找到映射，跳过导入`);
                      failCount++;
                      continue;
                    }
                    
                    // 准备工具数据
                    const { id, createdAt, updatedAt, ...toolData } = tool;
                    const toolToAdd = {
                      ...toolData,
                      categoryId: newCategoryId,
                      isPublished: true, // 导入的工具默认设置为已发布
                    };
                    
                    console.log(`🔧 准备导入工具: ${tool.name}, 分类ID: ${tool.categoryId} -> ${newCategoryId}`);
                    
                    // 直接添加到数据库
                    await apiAddTool(toolToAdd);
                    successCount++;
                    console.log(`✅ [${successCount}/${data.tools.length}] 导入工具成功: ${tool.name}`);
                    
                    // 更新进度提示
                    if (index % 10 === 0 || index === data.tools.length - 1) {
                      setSaveMessage({ 
                        type: 'success', 
                        text: `⏳ 正在导入工具 ${successCount}/${data.tools.length}...` 
                      });
                    }
                  } catch (error) {
                    failCount++;
                    console.error(`❌ 导入工具失败 (${tool.name}):`, error);
                  }
                }
                
                console.log(`✅ 导入完成！成功: ${successCount}, 失败: ${failCount}`);
                
                // 刷新工具列表
                await fetchTools({ includeUnpublished: true });
                
                // 清空本地工具列表,强制重新从数据库加载
                setLocalTools([]);
                
                // 清空待处理操作
                setPendingOperations({
                  added: [],
                  updated: [],
                  deleted: [],
                  reordered: [],
                });
                
                // 触发全局刷新
                triggerRefresh();
                
                setSaveMessage({ 
                  type: 'success', 
                  text: `✅ 导入完成！成功导入 ${successCount} 个工具，${failCount} 个失败。请查看控制台日志了解详情。` 
                });
                
                console.log('📊 导入统计:', {
                  总工具数: data.tools.length,
                  成功: successCount,
                  失败: failCount,
                  成功率: `${((successCount / data.tools.length) * 100).toFixed(1)}%`
                });
              } catch (error) {
                console.error('❌ 导入过程失败:', error);
                setSaveMessage({ 
                  type: 'error', 
                  text: `❌ 导入失败：${error instanceof Error ? error.message : '未知错误'}` 
                });
                setTimeout(() => {
                  setSaveMessage(null);
                }, 5000);
                throw error;
              } finally {
                setIsSaving(false);
              }
            }}
          />
        )}
      </div>

      {/* Logo上传器 */}
      {showLogoManager && (
        <LogoUploader
          currentLogo={siteSettings.siteLogo || '/assets/logo.png'}
          onLogoUpdate={(logoPath) => {
            const newSettings = { ...siteSettings, siteLogo: logoPath };
            setSiteSettings(newSettings);
          }}
          onClose={() => setShowLogoManager(false)}
          showMessage={(type, message) => {
            setSaveMessage({ type, text: message });
            setTimeout(() => setSaveMessage(null), 3000);
          }}
        />
      )}
    </div>
    );
  } catch (error) {
    console.error('Admin组件渲染错误:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">渲染错误</h2>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : '未知错误'}</p>
          <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto max-w-2xl">
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}
