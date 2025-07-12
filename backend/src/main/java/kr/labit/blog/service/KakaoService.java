package kr.labit.blog.service;


import com.fasterxml.jackson.databind.JsonNode;
import kr.labit.blog.dto.LoginResponse;
import kr.labit.blog.entity.User;
import kr.labit.blog.repository.UserRepository;
import kr.labit.blog.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoService {
    private final UserRepository userRepository;
    private final JwtUtils jwtUtil;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    /**
     * 카카오 인증 코드로 액세스 토큰 획득
     */
    public String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        String body = String.format(
                "grant_type=authorization_code&client_id=%s&client_secret=%s&redirect_uri=%s&code=%s",
                kakaoClientId, kakaoClientSecret, kakaoRedirectUri, code
        );

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    tokenUrl, HttpMethod.POST, request, JsonNode.class
            );

            if (response.getBody() != null && response.getBody().has("access_token")) {
                return response.getBody().get("access_token").asText();
            }
        } catch (Exception e) {
            log.error("Failed to get Kakao access token", e);
            throw new RuntimeException("카카오 액세스 토큰 획득에 실패했습니다.");
        }

        throw new RuntimeException("카카오 액세스 토큰을 획득할 수 없습니다.");
    }

    /**
     * 카카오 액세스 토큰으로 사용자 정보 조회
     */
    public JsonNode getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    userInfoUrl, HttpMethod.GET, request, JsonNode.class
            );

            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to get Kakao user info", e);
            throw new RuntimeException("카카오 사용자 정보 조회에 실패했습니다.");
        }
    }

    /**
     * 카카오 로그인 처리 (전체 플로우)
     */
    public LoginResponse processKakaoLogin(String code) {
        try {
            // 1. 카카오 액세스 토큰 획득
            String kakaoAccessToken = getKakaoAccessToken(code);
            log.info("Successfully obtained Kakao access token");

            // 2. 사용자 정보 획득
            JsonNode userInfo = getKakaoUserInfo(kakaoAccessToken);
            log.info("Successfully obtained Kakao user info: {}", userInfo);

            // 3. 사용자 정보 추출
            String kakaoId = userInfo.get("id").asText();
            JsonNode kakaoAccount = userInfo.get("kakao_account");
            JsonNode profile = kakaoAccount.get("profile");

            String email = kakaoAccount.has("email") ? kakaoAccount.get("email").asText() : null;
            String nickname = profile.get("nickname").asText();
            String profileImage = profile.has("profile_image_url") ?
                    profile.get("profile_image_url").asText() : null;

            // 4. 사용자 등록 또는 업데이트
            User user = userRepository.findByKakaoId(kakaoId)
                    .orElseGet(() -> {
                        log.info("Creating new user with kakaoId: {}", kakaoId);
                        User newUser = User.builder()
                                .kakaoId(kakaoId)
                                .email(email != null ? email : kakaoId + "@kakao.temp")
                                .nickname(nickname)
                                .profileImage(profileImage)
                                .provider(User.Provider.KAKAO)
                                .roles(Arrays.asList(User.Role.USER))
                                .build();
                        return userRepository.save(newUser);
                    });

            // 기존 사용자 정보 업데이트
            user.setNickname(nickname);
//            user.setProfileImage(profileImage);
            if (email != null && !email.isEmpty()) {
                user.setEmail(email);
            }
            user = userRepository.save(user);

            // 5. JWT 토큰 생성
            List<String> roles = user.getRoles().stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());

            String accessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), roles);
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            log.info("Successfully created JWT tokens for user: {}", user.getEmail());
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(LoginResponse.UserInfo.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .nickname(user.getNickname())
                            .profileImage(user.getProfileImage())
                            .roles(roles)
                            .build())
                    .build();

        } catch (Exception e) {
            log.error("Error processing Kakao login", e);
            throw new RuntimeException("카카오 로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

}
