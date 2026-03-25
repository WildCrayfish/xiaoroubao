package com.navhub;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * NavHub 后端应用入口
 */
@SpringBootApplication
@MapperScan("com.navhub.mapper")
public class NavHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(NavHubApplication.class, args);
    }
}
