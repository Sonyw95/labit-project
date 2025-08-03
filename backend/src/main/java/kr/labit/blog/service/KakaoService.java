package kr.labit.blog.service;

import kr.labit.blog.dto.user.KakaoTokenDto;
import kr.labit.blog.dto.user.KakaoUserInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoService {

    private final RestTemplate restTemplate;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.security.code}")
    private String kakaoSecurityCode;

    /**
     * 카카오 인증 주소
     */
    public String getKakaoAuthPath() {
        return  String.format(
                "https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code",
                kakaoClientId, kakaoRedirectUri
        );
    }

    /**
     * 카카오 액세스 토큰 발급
     */
    public KakaoTokenDto getAccessToken(String authorizationCode) {
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", authorizationCode);
        params.add("client_secret", kakaoSecurityCode);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<KakaoTokenDto> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, KakaoTokenDto.class
            );

            log.info("카카오 액세스 토큰 발급 성공");
            return response.getBody();

        } catch (Exception e) {
            log.error("카카오 액세스 토큰 발급 실패", e);
            throw new RuntimeException("카카오 액세스 토큰 발급에 실패했습니다.", e);
        }
    }

    /**
     * 카카오 사용자 정보 조회
     */
    public KakaoUserInfoDto getUserInfo(String accessToken) {
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoUserInfoDto> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, KakaoUserInfoDto.class
            );

            log.info("카카오 사용자 정보 조회 성공: ID = {}", response.getBody().getId());
            return response.getBody();

        } catch (Exception e) {
            log.error("카카오 사용자 정보 조회 실패", e);
            throw new RuntimeException("카카오 사용자 정보 조회에 실패했습니다.", e);
        }
    }

    /**
     * 카카오 로그아웃
     */
    public void logout(String accessToken) {
        String url = "https://kapi.kakao.com/v1/user/logout";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            log.info("카카오 로그아웃 성공");
        } catch (Exception e) {
            log.warn("카카오 로그아웃 실패", e);
            // 로그아웃 실패해도 서비스 로그아웃은 진행
        }
    }


    /**
     * 카카오 회원탈퇴( 연결끊기 )
     */
    public void withdrawal(String token){
        String url = "https://kapi.kakao.com/v1/user/unlink";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            log.info("카카오 회원탈퇴 성공");
        } catch (Exception e) {
            log.warn("카카오 회원탈퇴 실패", e);
            throw new RuntimeException("카카오 회원 탈퇴에 실패했습니다.", e);

        }
    }
}