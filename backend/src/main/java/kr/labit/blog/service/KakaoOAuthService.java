package kr.labit.blog.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.labit.blog.dto.KakaoTokenDto;
import kr.labit.blog.dto.KakaoUserInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    public KakaoTokenDto getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(KAKAO_TOKEN_URL, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseTokenResponse(response.getBody());
            }

            throw new RuntimeException("Failed to get access token from Kakao");
        } catch (Exception e) {
            log.error("Error getting access token from Kakao: {}", e.getMessage());
            throw new RuntimeException("Kakao OAuth authentication failed", e);
        }
    }

    public KakaoUserInfoDto getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    KAKAO_USER_INFO_URL,
                    HttpMethod.GET,
                    request,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseUserInfoResponse(response.getBody());
            }

            throw new RuntimeException("Failed to get user info from Kakao");
        } catch (Exception e) {
            log.error("Error getting user info from Kakao: {}", e.getMessage());
            throw new RuntimeException("Failed to get user info from Kakao", e);
        }
    }

    private KakaoTokenDto parseTokenResponse(String response) throws JsonProcessingException {
        JsonNode jsonNode = objectMapper.readTree(response);

        return KakaoTokenDto.builder()
                .accessToken(jsonNode.get("access_token").asText())
                .refreshToken(jsonNode.get("refresh_token") != null ? jsonNode.get("refresh_token").asText() : null)
                .expiresIn(jsonNode.get("expires_in").asInt())
                .scope(jsonNode.get("scope") != null ? jsonNode.get("scope").asText() : null)
                .tokenType(jsonNode.get("token_type").asText())
                .build();
    }

    private KakaoUserInfoDto parseUserInfoResponse(String response) throws JsonProcessingException {
        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode kakaoAccount = jsonNode.get("kakao_account");
        JsonNode profile = kakaoAccount.get("profile");

        return KakaoUserInfoDto.builder()
                .id(jsonNode.get("id").asText())
                .connectedAt(jsonNode.get("connected_at").asText())
                .email(kakaoAccount.get("email") != null ? kakaoAccount.get("email").asText() : null)
                .nickname(profile.get("nickname").asText())
                .profileImageUrl(profile.get("profile_image_url") != null ? profile.get("profile_image_url").asText() : null)
                .thumbnailImageUrl(profile.get("thumbnail_image_url") != null ? profile.get("thumbnail_image_url").asText() : null)
                .build();
    }
}