package com.flightbooking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源处理
        registry.addResourceHandler("/**")
                .addResourceLocations("file:/app/static/")
                .setCachePeriod(3600) // 设置缓存时间为1小时
                .resourceChain(true);
        
        // 为API路径设置更高的优先级，避免与静态资源冲突
        registry.addResourceHandler("/api/**")
                .addResourceLocations("classpath:/api/") // 这个位置不存在，会被API控制器处理
                .setCachePeriod(0)
                .resourceChain(false);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 对于前端路由，都返回index.html，让前端路由处理
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/{path:[^\\.]*}/{path2:[^\\.]*}").setViewName("forward:/index.html");
    }
} 