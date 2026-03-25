package com.navhub.controller;

import com.navhub.common.Result;
import com.navhub.entity.SiteConfig;
import com.navhub.service.AuthService;
import com.navhub.service.SiteConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 站点配置控制器
 */
@RestController
@RequestMapping("/site-config")
public class SiteConfigController {

    @Autowired
    private SiteConfigService siteConfigService;

    @Autowired
    private AuthService authService;

    /**
     * 获取站点配置
     */
    @GetMapping
    public Result<SiteConfig> getConfig() {
        try {
            SiteConfig config = siteConfigService.getConfig();
            return Result.success(config);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新站点配置（管理员）
     */
    @PutMapping
    public Result<SiteConfig> updateConfig(
            @RequestBody SiteConfig siteConfig,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            authService.requireAdmin(authorization);
            SiteConfig updatedConfig = siteConfigService.updateConfig(siteConfig);
            return Result.success(updatedConfig);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }
}
