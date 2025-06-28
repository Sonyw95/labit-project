package config.spring;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;

@ImportResource("classpath:config/spring/context-*.xml")
@Configuration
@MapperScan(basePackages="app.labit",annotationClass = Mapper.class, sqlSessionFactoryRef="sqlSessionFactoryBean")
public class ApplicationContext {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationContext.class);

    @Bean
    @Resource(name="jdbc/oraDB")
    public DataSource dataSource() {
        DataSource dataSource = null;

        JndiDataSourceLookup dsLookup = new JndiDataSourceLookup();
        dsLookup.setResourceRef(true);
        try {
            dataSource = dsLookup.getDataSource("java:comp/env/jdbc/oraDB");
            logger.debug("dataSource: " + dataSource);
        } catch(Exception e){
            logger.debug("Create Bean dataSource: " + e);
        }

        if (dataSource == null) {
            logger.debug("========== DATASOURCE NULL ==========");
        } else {
            // Local 일 경우 Log4Jdbc 및 정렬 Result Table 보기(log4jdbcRemi) 설정
                /*logger.debug("========== Log4Jdbc & log4jdbcRemi 설정 ==========");
                try {
                    Log4JdbcCustomFormatter log4JdbcCustomFormatter = new Log4JdbcCustomFormatter();
                    log4JdbcCustomFormatter.setLoggingType(LoggingType.MULTI_LINE);
                    log4JdbcCustomFormatter.setSqlPrefix("SQL     :\n\t\t");

                    Log4jdbcProxyDataSource log4jdbcProxyDataSource = new Log4jdbcProxyDataSource(dataSource);
                    log4jdbcProxyDataSource.setLogFormatter(log4JdbcCustomFormatter);

                    dataSource = log4jdbcProxyDataSource;
                } catch(Exception e){
                    logger.error(e.toString());
                }*/
        }

        return dataSource;
    }



    /**
     * 마이베티스 설정
     * dev일때는 RefreshableSqlSessionFactoryBean으로 생성하여서 xml설정시 서버 리로드 없이 새로고침이 가능함.
     * @param dataSource
     * @param applicationContext
     * @return
     * @throws IOException
     */
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean(
            DataSource dataSource, org.springframework.context.ApplicationContext applicationContext) throws IOException {

        SqlSessionFactoryBean sqlSessionFactoryBean = null;

        sqlSessionFactoryBean = new SqlSessionFactoryBean();

        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setConfigLocation(applicationContext.getResource("classpath:/config/spring/mybatis-config.xml"));
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:/mybatis/sql/**/*.xml"));

        return sqlSessionFactoryBean;
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setCookiePath("/");
        serializer.setSameSite("None");
        serializer.setUseSecureCookie(true);
        serializer.setDomainNamePattern("[^\\.]+\\.[a-z]+$");
        return serializer;
    }

    @Bean
    public RestTemplate restTemplate(){

        /* TCP Connect Setting */
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setReadTimeout(5000); // read Time 5s
        factory.setConnectTimeout(5000);  // connect time 5s

        HttpClient httpClient = HttpClientBuilder.create()
                .setMaxConnTotal(50) // Maxi Connect Pool
                .setMaxConnPerRoute(20).build(); // Maxi Pool
        factory.setHttpClient(httpClient);

        /* Create RestTemplate in factory Settings */
        RestTemplate restTemplate = new RestTemplate(factory);

        /* Convert Request or Response Body content-type */
        MappingJackson2HttpMessageConverter messageConverter
                    = new MappingJackson2HttpMessageConverter();

        messageConverter.setSupportedMediaTypes(Arrays.asList( MediaType.TEXT_HTML ));
        restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        return new RestTemplate();
    }

    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
        return commonsMultipartResolver;
    }
}
