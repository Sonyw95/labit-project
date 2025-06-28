package kr.labit.blog.controller;

import kr.labit.blog.dto.ApiResponse;
import kr.labit.blog.dto.LoginResponse;
import kr.labit.blog.service.KakaoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend-url}")
@Slf4j
public class AuthController {
    private final KakaoService kakaoService;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    /**
     * 카카오 로그인 URL 생성
     */
    @GetMapping("/kakao/url")
    public ResponseEntity<ApiResponse<String>> getKakaoLoginUrl() {
        try {
            String encodedRedirectUri = URLEncoder.encode(kakaoRedirectUri, StandardCharsets.UTF_8);

            String kakaoLoginUrl = String.format(
                    "https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=profile_nickname,profile_image,account_email",
                    kakaoClientId, encodedRedirectUri
            );

            log.info("Generated Kakao login URL: {}", kakaoLoginUrl);

            return ResponseEntity.ok(ApiResponse.success(kakaoLoginUrl));
        } catch (Exception e) {
            log.error("Failed to generate Kakao login URL", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("카카오 로그인 URL 생성에 실패했습니다.", "URL_GENERATION_FAILED"));
        }
    }

    /**
     * 카카오 인증 코드로 로그인 처리
     */
    @PostMapping("/kakao/login")
    public ResponseEntity<ApiResponse<LoginResponse>> kakaoLogin(@RequestParam String code) {
        try {
            log.info("Processing Kakao login with code: {}", code);

            LoginResponse loginResponse = kakaoService.processKakaoLogin(code);

            log.info("Kakao login successful for user: {}", loginResponse.getUser().getEmail());

            return ResponseEntity.ok(ApiResponse.success(loginResponse, "카카오 로그인에 성공했습니다."));

        } catch (Exception e) {
            log.error("Kakao login failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("카카오 로그인에 실패했습니다: " + e.getMessage(), "KAKAO_LOGIN_FAILED"));
        }
    }

    /**
     * 로그아웃 처리
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        try {
            log.info("User logout requested");

            // 클라이언트에서 토큰 삭제하도록 지시
            // 추후 Redis나 DB를 사용한 토큰 블랙리스트 구현 가능

            return ResponseEntity.ok(ApiResponse.success("로그아웃되었습니다.", "로그아웃이 완료되었습니다."));

        } catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("로그아웃 처리 중 오류가 발생했습니다.", "LOGOUT_FAILED"));
        }
    }

    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse.UserInfo>> getCurrentUser() {
        try {
            // JWT 토큰에서 사용자 정보 추출하여 반환
            // 실제 구현에서는 SecurityContext나 JWT 필터에서 사용자 정보를 가져와야 함

            return ResponseEntity.ok(ApiResponse.success(null, "사용자 정보 조회 성공"));

        } catch (Exception e) {
            log.error("Failed to get current user info", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("사용자 정보 조회에 실패했습니다.", "USER_INFO_FAILED"));
        }
    }

    /**
     * Health Check
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("OK", "서버가 정상 작동 중입니다."));
    }
}
