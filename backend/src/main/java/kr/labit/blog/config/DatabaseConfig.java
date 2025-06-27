package kr.labit.blog.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "kr.labit.blog.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // 오라클 전자지갑 추가 구현
}
