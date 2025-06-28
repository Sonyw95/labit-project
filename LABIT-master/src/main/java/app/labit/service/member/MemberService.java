package app.labit.service.member;

import app.labit.Exceptions.AlreadyData;
import app.labit.Exceptions.NoMatchAccountException;
import app.labit.Exceptions.NothingWorkException;
import app.labit.common.PrivateTokenProvider;
import app.labit.common.SessionManager;
import app.labit.dao.DatabaseDao;
import app.labit.dto.session.SessionUser;
import app.labit.dto.trace.InfoTraceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;

@Service
public class MemberService {

    @Resource
    private DatabaseDao databaseDao;
    @Resource
    private PrivateTokenProvider privateTokenProvider;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional
    public String memberInsert(SessionUser sessionUser) throws AlreadyData, NothingWorkException, NoSuchAlgorithmException {
        SessionUser userData = (SessionUser) databaseDao.execSelect("MemberServiceMapper", "selectUserInfo",sessionUser );

        if(userData != null){
            throw new AlreadyData("이미 등록된 사용자 ID 입니다.");
        }
        else{
            int result = 0;
            String encPassword =  privateTokenProvider.encSHA256(sessionUser.getPassword());
            sessionUser.setPassword(encPassword);

            result = databaseDao.execInsert("MemberServiceMapper", "insertMemberInfo",  sessionUser);
            System.out.println(sessionUser.getEmail() + " : " + sessionUser.getUsername() + " : " + sessionUser.getPassword() );

            if(result <= 0){
                throw new NothingWorkException();
            }
            return "Success";
        }
    }

    public SessionUser memberLogin(HttpSession session, HttpServletRequest request, SessionUser sessionUser) throws AlreadyData, NoSuchAlgorithmException, NoMatchAccountException {
        SessionUser userData = (SessionUser) databaseDao.execSelect("MemberServiceMapper", "selectUserInfo",sessionUser );
        if(userData == null){
            throw new AlreadyData("존재하지 않는 소셜인증 계정입니다.");
        }else{
            if(sessionUser.getAuthData() != null){
                userData.setAuthData(sessionUser.getAuthData());
            }else{
                String encPassword = privateTokenProvider.encSHA256(sessionUser.getPassword());
                sessionUser.setPassword(encPassword);
                if(!userData.getPassword().equals( sessionUser.getPassword() ) ){
                    throw new NoMatchAccountException("패스워드가 다릅니다.");
                }sessionUser.setPassword(null);
            }
        }
        SessionManager.setLoginSession(session, userData);
        return userData;
    }

    public String memberLogout(HttpSession session){
        SessionManager.logOut(session);
        return "SUCCESS";
    }

    @Transactional
    public Boolean memberDelete(SessionUser sessionUser){
        int result = databaseDao.execDelete("MemberServiceMapper", "deleteMember", sessionUser);
        if(result > 0){
            return true;
        }
        return false;
    }

    @Transactional
    public int insertInfoTrace(InfoTraceDto infoTraceDto){
        return databaseDao.execInsert("MemberServiceMapper" ,"insertInfoTrace", infoTraceDto);
    }
}
