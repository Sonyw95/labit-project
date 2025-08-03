package kr.labit.blog.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.repository.LabUsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    private final LabUsersRepository userRepository;

    private final ObjectMapper objectMapper;

    private final JwtBlacklistService jwtBlacklistService; // 추가

    // 인증이 필요하지 않은 경로들
    private static final String[] PUBLIC_URLS = {
            "/api/auth/kakao/login",
            "/api/auth/kakao/path",
            "/api/files",
            "/api/auth/token/refresh",
            "/api/auth/token/validate",
            "/api/posts",
            "/swagger-ui",
            "/v3/api-docs",
            "/swagger-resources",
            "/webjars",
            "/h2-console",
            "/actuator"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.debug("JWT 필터 처리 시작: {}", requestURI);

        try {
            String jwt = getTokenFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                processJwtToken(jwt, request);
            } else {
                log.debug("JWT 토큰이 없음: {}", requestURI);
            }

        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰: {}", requestURI);
            handleExpiredToken(request, response);
            return;

        } catch (JwtException e) {
            log.warn("유효하지 않은 JWT 토큰: {} - {}", requestURI, e.getMessage());
            handleInvalidToken(request, response);
            return;

        } catch (Exception e) {
            log.error("JWT 인증 처리 중 예상치 못한 오류 발생: {}", requestURI, e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * JWT 토큰 처리
     */
    private void processJwtToken(String jwt, HttpServletRequest request) {

        // 1. 블랙리스트 확인
        if (jwtBlacklistService.isBlacklisted(jwt)) {
            log.debug("블랙리스트된 토큰 사용 시도");
            throw new JwtException("Token is blacklisted");
        }


        if (!jwtTokenProvider.validateToken(jwt)) {
            log.debug("JWT 토큰 검증 실패");
            return;
        }

        // 토큰 만료 확인
        if (jwtTokenProvider.isTokenExpired(jwt)) {
            throw new ExpiredJwtException(null, null, "JWT token expired");
        }

        Long kakaoId = jwtTokenProvider.getKakaoIdFromToken(jwt);
        Optional<LabUsers> userOptional = userRepository.findActiveUserByKakaoId(kakaoId);

        if (userOptional.isPresent()) {
            LabUsers user = userOptional.get();

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getAuthority()))
                    );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.debug("JWT 인증 성공: 사용자 ID = {}, 역할 = {}", user.getId(), user.getRole());
        } else {
            log.debug("사용자를 찾을 수 없음: kakaoId = {}", kakaoId);
        }
    }

    /**
     * 만료된 토큰 처리
     */
    private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String requestURI = request.getRequestURI();

        // API 요청인 경우 JSON 응답
        if (requestURI.startsWith("/api/")) {
            sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "TOKEN_EXPIRED", "JWT 토큰이 만료되었습니다.");
        }
        // 그 외의 경우는 필터 체인 계속 (페이지 리다이렉트는 프론트엔드에서 처리)
    }

    /**
     * 유효하지 않은 토큰 처리
     */
    private void handleInvalidToken(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String requestURI = request.getRequestURI();

        // SecurityContext 비우기
        SecurityContextHolder.clearContext();

        // API 요청인 경우 JSON 응답
        if (requestURI.startsWith("/api/")) {
            sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "TOKEN_INVALID", "유효하지 않은 JWT 토큰입니다.");
        }
    }

    /**
     * JSON 에러 응답 전송
     */
    private void sendJsonErrorResponse(HttpServletResponse response, int status,
                                       String errorCode, String message) throws IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", errorCode);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        errorResponse.put("status", status);

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

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

    /**
     * 필터를 적용하지 않을 요청인지 확인
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestURI = request.getRequestURI();

        log.info("URL: {}", requestURI);
        // PUBLIC_URLS에 포함된 경로는 필터 적용 안 함
        for (String publicUrl : PUBLIC_URLS) {
            if (requestURI.startsWith(publicUrl)) {
                log.debug("공개 URL로 JWT 필터 스킵: {}", requestURI);
                return true;
            }
        }

        return false;
    }
}