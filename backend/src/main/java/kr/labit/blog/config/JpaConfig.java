package kr.labit.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "kr.labit.blog.repository")
public class JpaConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}