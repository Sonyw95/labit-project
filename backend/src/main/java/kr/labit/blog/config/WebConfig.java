package kr.labit.blog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(86400);
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 디렉토리의 절대 경로 구하기
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String uploadLocation = "file:" + uploadPath.toString() + "/";
        // /api/files/** 요청을 실제 파일 시스템으로 매핑
        registry.addResourceHandler("/api/files/**")
                .addResourceLocations(uploadLocation)
                .setCachePeriod(3600) // 1시간 캐시
                .resourceChain(true);
    }


}