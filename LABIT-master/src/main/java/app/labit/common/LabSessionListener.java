package app.labit.common;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class LabSessionListener implements HttpSessionListener {

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
        /* Client Request Login -> Session get */

    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {

    }
}
