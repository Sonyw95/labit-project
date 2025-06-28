package app.labit.dao;

import app.labit.common.SessionManager;
import app.labit.dto.session.SessionUser;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Component
public class DatabaseDaoImpl implements DatabaseDao{

    @Resource
    private SqlSessionTemplate sqlSessionTemplate;

    private Logger logger= LoggerFactory.getLogger(this.getClass().getName());

    public DatabaseDaoImpl(){}
    public DatabaseDaoImpl(SqlSessionTemplate sqlSessionTemplate) {this.sqlSessionTemplate= sqlSessionTemplate;}

    @Override
    public Object execSelect(String nameSpace, String id, Object obj) {
        return sqlSessionTemplate.selectOne(nameSpace + "." + id, obj);
    }

    @Override
    public Object execSelectList(String nameSpace, String id, Object obj) {
        return sqlSessionTemplate.selectList( nameSpace + "." + id, obj);
    }

    @Override
    public int execInsert(String nameSpace, String id, Object obj) {
        return  execQuery(nameSpace, id, obj, "insert");
    }

    @Override
    public int execUpdate(String nameSpace, String id, Object obj) {
        return execQuery(nameSpace, id, obj, "update");
    }

    @Override
    public int execDelete(String nameSpace, String id, Object obj) {
        return execQuery(nameSpace, id, obj, "delete");
    }


    public int execQuery(String nameSpace, String id, Object obj, String key){

        int result = 0;

        try{

            switch (key){
                case "insert":
                    result = sqlSessionTemplate.insert(nameSpace + "." + id , obj);
                    break;
                case "update":
                    result = sqlSessionTemplate.update( nameSpace + "." + id, obj);
                    break;
                case "delete":
                    result = sqlSessionTemplate.delete( nameSpace + "." + id, obj);
                    break;
            }

        }catch (Exception e){
            HttpServletRequest request = ( (ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpSession session =  request.getSession();
            SessionUser sessionUser = SessionManager.getLoginSession(session);

            if(sessionUser == null){
                System.out.println("::::::::::::::::::::::::::   NAMEPACE :: " +nameSpace + "\t\t\t\t\tID :: " + id);
            }
            logger.error(e.getMessage());
            return Integer.parseInt(e.getMessage());
        }
        return result;
    }

}
