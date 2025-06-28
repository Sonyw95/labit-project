package config.spring;

import app.labit.common.LabSessionListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.*;
import java.util.EnumSet;

/**
 * /WEB-INF/Web.xml 세팅
 * @author LABIT-SON 2022. 06. 27
 */
public class WebXml implements WebApplicationInitializer {

    private static Logger logger= LoggerFactory.getLogger(WebApplicationInitializer.class);

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();
        rootContext.register(ApplicationContext.class);
        rootContext.refresh();

        /*
         * Encoding
         */
        CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding("UTF-8");
        characterEncodingFilter.setForceEncoding(true);
        FilterRegistration.Dynamic characterEncoding = servletContext.addFilter("characterEncodingFilter", characterEncodingFilter);
        characterEncoding.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");

        /*
         * Spring core
         */
        servletContext.addListener(new ContextLoaderListener(rootContext));

        /*
         * Sevlet
         */
        XmlWebApplicationContext xmlWebApplicationContext = new XmlWebApplicationContext();
        xmlWebApplicationContext.setConfigLocation("classpath:config/spring/servlet-context.xml");
        ServletRegistration.Dynamic dispatcher = servletContext.addServlet("dispatcher", new DispatcherServlet(xmlWebApplicationContext));
        dispatcher.setLoadOnStartup(1);
        dispatcher.addMapping("/");

        // 스프링 RestFull 설정
        HiddenHttpMethodFilter hiddenHttpMethodFilter = new HiddenHttpMethodFilter();
        FilterRegistration.Dynamic hiddenHttpMethod = servletContext.addFilter("hiddenHttpMethodFilter", hiddenHttpMethodFilter);
        hiddenHttpMethod.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");

        RequestContextListener requestContextListener = new RequestContextListener();
        servletContext.addListener(requestContextListener);

        /*
         * HttpSession Listener 등록 
         */
        LabSessionListener labSessionListener = new LabSessionListener();
        servletContext.addListener(labSessionListener);

    }
}
