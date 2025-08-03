package kr.labit.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import kr.labit.blog.dto.user.LoginResponseDto;
import kr.labit.blog.dto.user.UserInfoDto;
import kr.labit.blog.dto.user.UserUpdateRequestDto;
import kr.labit.blog.dto.user.UserUpdateResponseDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.security.jwt.JwtBlacklistService;
import kr.labit.blog.security.jwt.JwtTokenProvider;
import kr.labit.blog.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "인증 관련 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtBlacklistService jwtBlacklistService;

    @GetMapping("/kakao/path")
    @Operation(summary = "카카오 인증 주소", description = "카카오 계정 인증 주소 가져오기")
    public ResponseEntity<String> getKakaoPath(){
        log.info("카카오 인증 주소 요청");
        try{
            return ResponseEntity.ok(authService.kakaoAuthPath());
        }catch (Exception e){
            log.error("카카오 인증 주소 가져오기 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/kakao/login")
    @Operation(summary = "카카오 로그인", description = "카카오 인증 코드로 로그인하고 JWT 토큰을 발급받습니다.")
    public ResponseEntity<LoginResponseDto> kakaoLogin(
            @Parameter(description = "카카오 인증 코드", required = true)
            @RequestParam(name = "code") String code,
            HttpServletRequest request) {

        log.info("카카오 로그인 요청: code = {}", code);

        try {
            LoginResponseDto response = authService.kakaoLogin(code, request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "현재 사용자를 로그아웃시킵니다.")
    public ResponseEntity<String> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            @Parameter(description = "카카오 액세스 토큰 (선택사항)")
            @RequestParam(required = false) String kakaoAccessToken) {

        log.info("로그아웃 요청");

        try {
            String jwtToken = getTokenFromRequest(request);
            Long userId = null;

            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof LabUsers) {
                LabUsers user = (LabUsers) authentication.getPrincipal();
                userId = user.getId();
            }

            authService.logout(jwtToken, kakaoAccessToken, userId);

            SecurityContextHolder.clearContext();
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            response.setHeader("Clear-Site-Data", "\"cookies\", \"storage\"");

            return ResponseEntity.ok("로그아웃이 완료되었습니다.");

        } catch (Exception e) {
            log.error("로그아웃 실패", e);
            // 로그아웃은 실패해도 SecurityContext는 비워야 함
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok("로그아웃이 완료되었습니다."); // 로그아웃은 항상 성공으로 처리
        }
    }

    @PutMapping("/me")
    @Operation(summary = "내 정보 수정", description = "현재 로그인한 사용자의 정보를 수정하고 새로운 토큰을 발급합니다.")
    public ResponseEntity<UserUpdateResponseDto> updateUserInfo(
            @Parameter(description = "수정할 사용자 정보", required = true)
            @Valid @RequestBody UserUpdateRequestDto updateRequest,
            HttpServletRequest request) {

        log.info("사용자 정보 수정 요청: nickname={}, email={}",
                updateRequest.getNickname(), updateRequest.getEmail());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                !(authentication.getPrincipal() instanceof LabUsers)) {
            log.warn("인증되지 않은 사용자의 정보 수정 시도");
            return ResponseEntity.status(401).build();
        }

        LabUsers currentUser = (LabUsers) authentication.getPrincipal();
        String oldToken = getTokenFromRequest(request);

        try {
            // 1. 사용자 정보 수정
            LabUsers updatedUser = authService.updateUserInfo(currentUser.getId(), updateRequest);

            log.info("사용자 정보 수정 완료: userId={}, nickname={}",
                    updatedUser.getId(), updatedUser.getNickname());

            // 2. 기존 토큰을 블랙리스트에 추가 (선택사항 - 보안 강화)
            if (oldToken != null) {
                jwtBlacklistService.addToBlacklist(oldToken);
                log.info("기존 토큰을 블랙리스트에 추가: userId={}", updatedUser.getId());
            }

            // 3. 업데이트된 사용자 정보로 새로운 JWT 토큰 생성
            String newAccessToken = jwtTokenProvider.generateToken(updatedUser);

            log.info("새로운 JWT 토큰 발급 완료: userId={}", updatedUser.getId());

            // 4. 응답 DTO 생성
            UserUpdateResponseDto response = UserUpdateResponseDto.builder()
                    .user(UserInfoDto.fromEntity(updatedUser))
                    .accessToken(newAccessToken)
                    .tokenType("Bearer")
                    .expiresIn(30 * 60) // 30분
                    .message("프로필이 성공적으로 수정되었습니다.")
                    .build();

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("사용자 정보 수정 실패 - 잘못된 요청: userId={}, error={}",
                    currentUser.getId(), e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("사용자 정보 수정 실패: userId={}", currentUser.getId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @GetMapping("/withdrawal")
    @Operation( summary = "카카오 회원 탈퇴", description = "회원 탈퇴를 진행합닌다.")
    public ResponseEntity<String> withdrawal(
            HttpServletRequest request,
            @Parameter(description = "카카오 액세스 토큰 (선택사항)")
            @RequestParam(required = false) String kakaoAccessToken) {

        log.info("회원탈퇴 요청");

        try {
            Long userId = null;

            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof LabUsers) {
                LabUsers user = (LabUsers) authentication.getPrincipal();
                userId = user.getId();
            }

            authService.withdrawal( kakaoAccessToken, userId);

            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");

        } catch (Exception e) {
            log.error("회원탈퇴 실패", e);
            return ResponseEntity.ok("로그아웃이 완료되었습니다."); // 로그아웃은 항상 성공으로 처리
        }
    }

//    @PostMapping("/token/refresh")
//    @Operation(summary = "토큰 갱신", description = "Refresh Token으로 새로운 Access Token을 발급받습니다.")
//    public ResponseEntity<LoginResponseDto> refreshToken(
//            @RequestBody RefreshTokenRequestDto request,
//            HttpServletRequest httpRequest) {
//
//        log.info("토큰 갱신 요청");
//
//        try {
//            if (!StringUtils.hasText(request.getRefreshToken())) {
//                log.warn("Refresh Token이 없는 갱신 요청");
//                return ResponseEntity.badRequest().build();
//            }
//
//            LoginResponseDto response = authService.refreshToken(request.getRefreshToken(), httpRequest);
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            log.error("토큰 갱신 실패", e);
//            return ResponseEntity.status(401).build();
//        }
//    }

    @GetMapping("/token/validate")
    @Operation(summary = "토큰 검증", description = "현재 토큰의 유효성을 확인합니다.")
    public ResponseEntity<Boolean> validateToken(HttpServletRequest request) {
        String token = getTokenFromRequest(request);

        if (token == null) {
            return ResponseEntity.ok(false);
        }

        boolean isValid = authService.isTokenValid(token);
        return ResponseEntity.ok(isValid);
    }

//    @PostMapping("/token/revoke")
//    @Operation(summary = "토큰 취소", description = "특정 Refresh Token을 취소합니다.")
//    public ResponseEntity<String> revokeToken(
//            @RequestBody RefreshTokenRequestDto request) {
//
//        log.info("토큰 취소 요청");
//
//        try {
//            if (!StringUtils.hasText(request.getRefreshToken())) {
//                return ResponseEntity.badRequest().body("Refresh Token이 필요합니다.");
//            }
//
//            authService.revokeRefreshToken(request.getRefreshToken());
//            return ResponseEntity.ok("토큰이 취소되었습니다.");
//
//        } catch (Exception e) {
//            log.error("토큰 취소 실패", e);
//            return ResponseEntity.badRequest().body("토큰 취소에 실패했습니다.");
//        }
//    }

//    @GetMapping("/sessions/active")
//    @Operation(summary = "활성 세션 개수 조회", description = "현재 사용자의 활성 세션 개수를 조회합니다.")
//    public ResponseEntity<Long> getActiveSessionCount() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        if (authentication == null || !authentication.isAuthenticated() ||
//                !(authentication.getPrincipal() instanceof LabUsers)) {
//            return ResponseEntity.status(401).build();
//        }
//
//        LabUsers user = (LabUsers) authentication.getPrincipal();
//
//        try {
//            long activeSessionCount = authService.getActiveSessionCount(user.getId());
//            return ResponseEntity.ok(activeSessionCount);
//        } catch (Exception e) {
//            log.error("활성 세션 개수 조회 실패: userId={}", user.getId(), e);
//            return ResponseEntity.status(500).build();
//        }
//    }

    /**
     * HTTP 요청에서 JWT 토큰 추출
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}