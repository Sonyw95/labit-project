package kr.labit.blog.controller;

import kr.labit.blog.dto.*;
import kr.labit.blog.service.AuthService;
import kr.labit.blog.util.jwt.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    /**
     * 카카오 로그인
     */
    @PostMapping("/kakao/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> kakaoLogin(
            @RequestBody LoginRequestDto request) {

        try {
            LoginResponseDto response = authService.kakaoLogin(request.getCode());
            return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
        } catch (Exception e) {
            log.error("Kakao login failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("로그인에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        try {
            authService.logout(userPrincipal.getKakaoId());
            return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("로그아웃에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        try {
            UserDto user = authService.getUserInfo(userPrincipal.getKakaoId());
            return ResponseEntity.ok(ApiResponse.success("사용자 정보 조회 성공", user));
        } catch (Exception e) {
            log.error("Get current user failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("사용자 정보 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    /**
     * 토큰 검증
     */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
            @RequestBody TokenValidationRequestDto request) {

        try {
            boolean isValid = authService.validateToken(request.getToken());
            return ResponseEntity.ok(ApiResponse.success("토큰 검증 완료", isValid));
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("토큰 검증에 실패했습니다: " + e.getMessage()));
        }
    }
}