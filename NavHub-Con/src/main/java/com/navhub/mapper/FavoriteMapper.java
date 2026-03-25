package com.navhub.mapper;

import com.navhub.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 收藏 Mapper
 */
@Mapper
public interface FavoriteMapper {
    
    /**
     * 查询用户的所有收藏
     */
    List<Favorite> findByUserId(@Param("userId") String userId);

    /**
     * 查询用户收藏的所有工具ID
     */
    List<String> findToolIdsByUserId(@Param("userId") String userId);
    
    /**
     * 查询用户是否收藏了某个工具
     */
    Favorite findByUserIdAndToolId(@Param("userId") String userId, 
                                    @Param("toolId") String toolId);
    
    /**
     * 添加收藏
     */
    int insert(Favorite favorite);
    
    /**
     * 取消收藏
     */
    int delete(@Param("userId") String userId, @Param("toolId") String toolId);
}