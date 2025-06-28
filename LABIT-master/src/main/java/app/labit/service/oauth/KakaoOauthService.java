package app.labit.service.oauth;

import app.labit.controller.api.oauth.OauthConnectionManager;
import app.labit.dto.kakao.KakaoDto;
import app.labit.dto.oauth.OauthDto;
import app.labit.dto.session.SessionUser;
import app.labit.globalprops.GlobalProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.LinkedHashMap;

@Service
public class KakaoOauthService {

    @Resource
    private GlobalProperties globalProperties;

    @Resource
    private OauthConnectionManager oauthConnectionManager;

    public Object getUserInfo(OauthDto oauthDto){

        SessionUser sessionUser = new SessionUser();

        switch (oauthDto.getPlatform()){
            case "KAKAO":
                sessionUser = getKakaoToken(oauthDto) ;
                break;
        }
        return sessionUser;
    }

    public SessionUser getKakaoToken(OauthDto oauthDto) {

        StringBuilder stringBuffer = new StringBuilder();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        UriComponents uri = UriComponentsBuilder.fromHttpUrl(stringBuffer.append(globalProperties.getProperty("kakao.token.url")).append(globalProperties.getProperty("kakao.token.path")).toString())
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", globalProperties.getProperty("kakao.key"))
                .queryParam("redirect_uri",globalProperties.getProperty("kakao.redirect"))
                .queryParam("code", oauthDto.getCode()).encode().build();

        return getKakaoUserInfo( oauthConnectionManager.getOauthPost( uri, headers) );
    }

    public String requestKakaoLogout(){

        StringBuilder stringBuffer = new StringBuilder();

        UriComponents uri = UriComponentsBuilder.fromHttpUrl(stringBuffer.append(globalProperties.getProperty("kakao.token.url")).append(globalProperties.getProperty("kakao.logout.path")).toString())
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", globalProperties.getProperty("kakao.key"))
                .queryParam("logout_redirect_uri",globalProperties.getProperty("kakao.logout.redirect"))
                .queryParam("state","1004").encode().build();
        return uri.toString();
    }

    public SessionUser getKakaoUserInfo(OauthDto oauthDto){
        String token = oauthDto.getAccess_token();
        StringBuilder stringBuffer = new StringBuilder();

        UriComponents uri = UriComponentsBuilder.fromHttpUrl(stringBuffer
                                                                .append(globalProperties.getProperty("kakao.info.url"))
                                                                .append(globalProperties.getProperty("kakao.info.path")).toString())
                            .encode().build();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer "+token);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ObjectMapper objectMapper = new ObjectMapper();
        KakaoDto kakaoDto = null;
        try {
            kakaoDto = objectMapper.readValue(oauthConnectionManager.getOauthGet(uri, headers), KakaoDto.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        SessionUser sessionUser = new SessionUser();
        String mail = kakaoDto.getKakao_account().getEmail();
        sessionUser.setAuthSns("KAKAO");
        sessionUser.setEmail(mail);
        sessionUser.setId(kakaoDto.getId());
            sessionUser.setKtoken(token);
        sessionUser.setIsAuth("Y");
        sessionUser.setLogoutUrl(requestKakaoLogout());

        String userName = kakaoDto.getKakao_account().getProfile().getNickname();

        sessionUser.setUsername(userName);
        sessionUser.setThumbnail(kakaoDto.getKakao_account().getProfile().getThumbnail_image_url());

        return  sessionUser;
    }

    public OauthDto getUnLinkKakao(SessionUser sessionUser){
        StringBuilder stringBuffer = new StringBuilder();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Authorization", "KakaoAK "+globalProperties.getProperty("kakao.admin.key"));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ObjectMapper objectMapper = new ObjectMapper();
        LinkedHashMap<String, Object> map = objectMapper.convertValue(sessionUser.getAuthData(), LinkedHashMap.class);

        UriComponents uri = UriComponentsBuilder.fromHttpUrl(stringBuffer.append(globalProperties.getProperty("kakao.action.url")).append(globalProperties.getProperty("kakao.unlink.path")).toString())
                .queryParam("target_id_type","user_id")
                .queryParam("target_id",map.get("id")).encode().build();
        return oauthConnectionManager.getOauthPost( uri, headers);
    }

    public Object sendRegisterMessage(SessionUser sessionUser){
        StringBuilder stringBuffer = new StringBuilder();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        headers.set("Authorization", "Bearer "+sessionUser.getKtoken());
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        UriComponents uri = UriComponentsBuilder.fromHttpUrl(stringBuffer.append(globalProperties.getProperty("kakao.action.url")).append(globalProperties.getProperty("kakao.message.path")).toString())
                .queryParam("template_id","87161").encode().build();
        return oauthConnectionManager.getOauthPost( uri, headers);
    }
}
