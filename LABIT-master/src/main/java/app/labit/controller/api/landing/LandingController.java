package app.labit.controller.api.landing;

import app.labit.Exceptions.AlreadyData;
import app.labit.Exceptions.NoDataException;
import app.labit.Exceptions.NoMatchAccountException;
import app.labit.Exceptions.NothingWorkException;
import app.labit.common.CommonService;
import app.labit.common.SessionManager;
import app.labit.dto.CommonDto;
import app.labit.dto.oauth.OauthDto;
import app.labit.dto.param.ParamDto;
import app.labit.dto.session.SessionUser;
import app.labit.globalprops.GlobalProperties;
import app.labit.service.member.MemberService;
import app.labit.service.oauth.KakaoOauthService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value ="/api/landing")
public class LandingController {

    @Resource
    private MemberService memberService;

    @Resource
    private GlobalProperties globalProperties;

    @Resource
    private KakaoOauthService oauthKakaoService;

    @Resource
    private CommonService commonService;

    @RequestMapping(value="/check")
    public Object check(HttpSession session) throws NoDataException {
        List<CommonDto> list =  commonService.getCategoryList();
        SessionUser sessionUser = SessionManager.getLoginSession(session);
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("categoryList", list);
        if(sessionUser == null){
            hashMap.put("info", false);
        }
        return hashMap;
    }
    @RequestMapping(value ="/register")
    public String register(@RequestBody ParamDto paramDto ){

        SessionUser sessionUser = paramDto.getForm(SessionUser.class);
        String msg = null;
        try{
            msg = memberService.memberInsert(sessionUser);
            //oauthKakaoService.sendRegisterMessage(sessionUser);
        }finally {
            if(msg == null) msg ="Success";
            return msg;
        }
    }

    @RequestMapping(value ="/oauth")
    public Object oauth(@RequestBody OauthDto oauthDto) {
        SessionUser sessionUser = new SessionUser();
        switch (oauthDto.getPlatform()){
            case "KAKAO":
                sessionUser.setAuthData(oauthKakaoService.getUserInfo(oauthDto));
                break;
            case "GOOGLE":
                break;
            case "FACEBOOK":
                break;
        }
        return sessionUser;
    }

    @RequestMapping(value="/login")
    public Object login(HttpServletRequest request, HttpSession session, @RequestBody ParamDto paramDto){
        try {
            return memberService.memberLogin(session,request, paramDto.getForm(SessionUser.class));
        } catch (AlreadyData e) {
            return "NONE_USER";
        } catch (NoSuchAlgorithmException e) {
            return "ZERO";
        } catch (NoMatchAccountException e) {
            return "NOT_MATCH";
        }
    }

    @RequestMapping(value="/logout")
    public void logout(HttpSession session,  @RequestBody OauthDto oauthDto){
        try{
            SessionManager.logOut(session);
            switch (oauthDto.getAuthSns()){
                case "KAKAO":
                    memberService.memberLogout(session);
        }
        } catch (Exception e){
            e.getStackTrace();
            e.getMessage();
        }
    }

    @RequestMapping(value="/delete")
    public Object deleteUser(HttpSession session){
        SessionUser sessionUser = SessionManager.getLoginSession(session);
        switch (sessionUser.getAuthSns() ){
            case "KAKAO":
                if(oauthKakaoService.getUnLinkKakao(sessionUser) != null){
                    memberService.memberDelete(sessionUser);
                    return true;
                }
        }
        return false;
    }
}
