package kr.labit.blog.service;

import kr.labit.blog.dto.AuthResponseDto;
import kr.labit.blog.dto.KakaoUserInfoDto;
import kr.labit.blog.entity.User;
import kr.labit.blog.repository.UserRepository;
import kr.labit.blog.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private final WebClient kakaoWebClient;

    @Value("${kakao.api.user-info-url}")
    private String kakaoUserInfoUrl;

    public AuthResponseDto authenticateWithKakao(String accessToken) {
        try {
            // 카카오 API에서 사용자 정보 가져오기
            KakaoUserInfoDto kakaoUserInfo = getKakaoUserInfo(accessToken);

            // 사용자 정보로 로그인 또는 회원가입 처리
            User user = findOrCreateUser(kakaoUserInfo);

            // JWT 토큰 생성
            String jwtToken = jwtTokenProvider.createToken(user.getEmail(), user.getRole());
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

            // 보안 컨텍스트에 인증 정보 설정
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(), null, user.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return AuthResponseDto.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getTokenValidityInSeconds())
                    .userInfo(user.toUserInfoDto())
                    .build();

        } catch (Exception e) {
            log.error("Kakao authentication failed", e);
            throw new RuntimeException("카카오 로그인 실패", e);
        }
    }

    private KakaoUserInfoDto getKakaoUserInfo(String accessToken) {
        try {
            // WebClient를 사용한 비동기 호출
            Mono<KakaoUserInfoDto> response = kakaoWebClient
                    .get()
                    .uri("/v2/user/me")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(KakaoUserInfoDto.class);

            // 동기식으로 결과 반환 (필요시 비동기로 변경 가능)
            return response.block();

        } catch (Exception e) {
            log.error("Failed to get Kakao user info", e);
            throw new RuntimeException("카카오 사용자 정보 조회 실패", e);
        }
    }

    private User findOrCreateUser(KakaoUserInfoDto kakaoUserInfo) {
        String email = kakaoUserInfo.getKakaoAccount().getEmail();

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // 카카오 정보로 사용자 정보 업데이트
            user.updateKakaoInfo(kakaoUserInfo);
            return userRepository.save(user);
        } else {
            // 새 사용자 생성
            User newUser = User.builder()
                    .email(email)
                    .nickname(kakaoUserInfo.getKakaoAccount().getProfile().getNickname())
                    .profileImageUrl(kakaoUserInfo.getKakaoAccount().getProfile().getProfileImageUrl())
                    .provider("KAKAO")
                    .providerId(kakaoUserInfo.getId().toString())
                    .role("USER")
                    .isActive(true)
                    .build();

            return userRepository.save(newUser);
        }
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }

    public AuthResponseDto refreshToken(String refreshToken) {
        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

        return AuthResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getTokenValidityInSeconds())
                .userInfo(user.toUserInfoDto())
                .build();
    }

    public Object getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return user.toUserInfoDto();
        }
        return null;
    }
}