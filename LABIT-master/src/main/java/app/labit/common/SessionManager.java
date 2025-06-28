package app.labit.common;

import app.labit.dto.session.SessionUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;

public class SessionManager {

    private static  final Logger logger = LoggerFactory.getLogger(SessionManager.class);

    public static final String LOGIN_INFO = "SESSION_USERINFO";

    public static HttpSession getSession(){
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return servletRequestAttributes.getRequest().getSession();
    }

    public static void logOut(HttpSession session){
        getSession().invalidate();
    }

    public static void setLoginSession( HttpSession session, SessionUser sessionUser){
        getSession().setAttribute(LOGIN_INFO, sessionUser);
    }


    public static boolean isLogin(){
        if(getSession().getAttribute(LOGIN_INFO) == null) {
            return false;
        }else {
            return true;
        }
    }

    public static SessionUser getLoginSession(HttpSession session){
        if(isLogin()){
            return (SessionUser)  getSession().getAttribute(LOGIN_INFO);
        }
        else{
            return null;
        }
    }


}
