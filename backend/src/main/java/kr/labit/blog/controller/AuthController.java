package kr.labit.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import kr.labit.blog.dto.LoginResponseDto;
import kr.labit.blog.dto.UserInfoDto;
import kr.labit.blog.entity.LabUsers;
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

    @GetMapping("/kakao/path")
    @Operation( summary = "카카오 인증 주소", description = "카카오 계정 인증 주소 가져오기")
    public ResponseEntity<String> getKakaoPath(){
        log.info("카카오 인증 주소 요청");
        try{
            return ResponseEntity.ok( authService.kakaoAuthPath() );
        }catch (Exception e){
            log.error("카카오 인증 주소 가져오기 실패", e);
            return ResponseEntity.badRequest().build();
        }

    }

    @PostMapping("/kakao/login")
    @Operation(summary = "카카오 로그인", description = "카카오 인증 코드로 로그인하고 JWT 토큰을 발급받습니다.")
    public ResponseEntity<LoginResponseDto> kakaoLogin(
            @Parameter(description = "카카오 인증 코드", required = true)
            @RequestParam( name = "code" ) String code) {

        log.info("카카오 로그인 요청: code = {}", code);

        try {
            String jwtToken = authService.kakaoLogin(code);

            LoginResponseDto response = LoginResponseDto.builder()
                    .accessToken(jwtToken)
                    .tokenType("Bearer")
                    .expiresIn(30 * 60) // 30분
                    .build();

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
            @Parameter(description = "카카오 액세스 토큰 (선택사항)")
            @RequestParam(required = false) String kakaoAccessToken) {

        log.info("로그아웃 요청");

        try {
            String jwtToken = getTokenFromRequest(request);
            authService.logout(jwtToken, kakaoAccessToken);

            return ResponseEntity.ok("로그아웃이 완료되었습니다.");

        } catch (Exception e) {
            log.error("로그아웃 실패", e);
            return ResponseEntity.ok("로그아웃이 완료되었습니다."); // 로그아웃은 항상 성공으로 처리
        }
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    public ResponseEntity<UserInfoDto> getUserInfo() {
        log.info("사용자 정보 조회 요청");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                !(authentication.getPrincipal() instanceof LabUsers)) {
            return ResponseEntity.status(401).build();
        }

        LabUsers user = (LabUsers) authentication.getPrincipal();
        UserInfoDto userInfo = UserInfoDto.fromEntity(user);

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/token/refresh")
    @Operation(summary = "토큰 갱신", description = "기존 토큰으로 새로운 토큰을 발급받습니다.")
    public ResponseEntity<LoginResponseDto> refreshToken(HttpServletRequest request) {
        log.info("토큰 갱신 요청");

        try {
            String oldToken = getTokenFromRequest(request);
            if (oldToken == null) {
                return ResponseEntity.status(401).build();
            }

            String newToken = authService.refreshToken(oldToken);

            LoginResponseDto response = LoginResponseDto.builder()
                    .accessToken(newToken)
                    .tokenType("Bearer")
                    .expiresIn(30 * 60)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("토큰 갱신 실패", e);
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/token/validate")
    @Operation(summary = "토큰 검증", description = "현재 토큰의 유효성을 확인합니다.")
    public ResponseEntity<Boolean> validateToken(HttpServletRequest request) {
        String token = getTokenFromRequest(request);

        if (token == null) {
            return ResponseEntity.ok(false);
        }

        boolean isValid = jwtTokenProvider.validateToken(token) &&
                !jwtTokenProvider.isTokenExpired(token);

        return ResponseEntity.ok(isValid);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}