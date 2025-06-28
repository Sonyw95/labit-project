package app.labit.globalprops;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Properties;
import java.util.regex.Pattern;

/**
 * @author LABIT-SON 2022. 06. 27
 */
@Service
public class GlobalProperties extends Properties {
    private Logger logger = LoggerFactory.getLogger(GlobalProperties.class);

    private static Pattern SYSTEM_PROPETRY_NAME_PATTER = Pattern.compile("\\$\\{([\\w\\.]+)\\}");

    public static final String REAL = "real";
    public static final String DEV = "dev";
    public static final String LOCAL = "local";

    public GlobalProperties(Properties properties){

        super(properties);
        Assert.notNull(properties, "props not be null !!");
        procSystemProps();
        logProperties();

    }
    private void procSystemProps(){

        for(String key : stringPropertyNames()){
            String value = getProperty(key);

            if(System.getProperty(key) == null) {
                System.setProperty(key, value);
            }

            else{
                logger.warn("System Props Key PK!! {}={}", key, System.getProperty(key));
            }

        }
    }

    public boolean getBoolean(String key){
        return Boolean.valueOf(getProperty(key));
    }

    public void logProperties() {
        if(logger.isDebugEnabled()){
            StringWriter stringWriter = new StringWriter();
            PrintWriter printWriter = new PrintWriter(stringWriter);

            this.list(printWriter);

            logger.debug("Props Loaded !! : {} ", stringWriter.toString());
            printWriter.close();
        }
    }
}




