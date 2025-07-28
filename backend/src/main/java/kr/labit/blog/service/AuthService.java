package kr.labit.blog.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.labit.blog.dto.KakaoTokenDto;
import kr.labit.blog.dto.KakaoUserInfoDto;
import kr.labit.blog.dto.LoginResponseDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.UserRole;
import kr.labit.blog.repository.LabUsersRepository;
import kr.labit.blog.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final KakaoService kakaoService;
    private final LabUsersRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
//    private final RefreshTokenService refreshTokenService;

    /**
     * 카카오 로그인 인증 주소
     */
    public String kakaoAuthPath(){
        try{
            return kakaoService.getKakaoAuthPath();
        }catch (Exception e){
            log.error("카카오 인증 주소 가져오기 실패", e);
            throw new RuntimeException("카카오 인증 주소 가져오기에 실패 하였습니다.", e);
        }
    }

    /**
     * 카카오 로그인 처리 (Access Token + Refresh Token 발급)
     */
    public LoginResponseDto kakaoLogin(String authorizationCode, HttpServletRequest request) {
        try {
            // 1. 카카오 액세스 토큰 발급
            KakaoTokenDto tokenDto = kakaoService.getAccessToken(authorizationCode);

            // 2. 카카오 사용자 정보 조회
            KakaoUserInfoDto kakaoUserInfo = kakaoService.getUserInfo(tokenDto.getAccessToken());

            // 3. 사용자 정보 저장 또는 업데이트
            LabUsers user = saveOrUpdateUser(kakaoUserInfo);

            // 4. JWT Access Token 생성
            String accessToken = jwtTokenProvider.generateToken(user);

//            // 5. Refresh Token 생성
//            RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user, request);

            // 6. 응답 DTO 생성
            LoginResponseDto response = LoginResponseDto.builder()
                    .accessToken(accessToken)
//                    .refreshToken(refreshToken.getToken())
                    .tokenType("Bearer")
                    .expiresIn(30 * 60) // 30분
                    .build();

            log.info("카카오 로그인 성공: 사용자 ID = {}, 카카오 ID = {}", user.getId(), user.getKakaoId());
            return response;

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            throw new RuntimeException("카카오 로그인에 실패했습니다.", e);
        }
    }

    /**
     * 사용자 정보 저장 또는 업데이트
     */
    private LabUsers saveOrUpdateUser(KakaoUserInfoDto kakaoUserInfo) {
        Optional<LabUsers> existingUser = userRepository.findByKakaoId(kakaoUserInfo.getId());

        if (existingUser.isPresent()) {
            // 기존 사용자 정보 업데이트
            LabUsers user = existingUser.get();
            user.updateProfile(
                    kakaoUserInfo.getNickname(),
                    kakaoUserInfo.getEmail(),
                    kakaoUserInfo.getProfileImageUrl()
            );
            user.updateLastLoginDate();

            return userRepository.save(user);
        } else {
            // 새 사용자 생성
            LabUsers newUser = LabUsers.builder()
                    .kakaoId(kakaoUserInfo.getId())
                    .nickname(kakaoUserInfo.getNickname())
                    .email(kakaoUserInfo.getEmail())
                    .profileImage(kakaoUserInfo.getProfileImageUrl())
                    .role(UserRole.USER) // 기본 역할
                    .isActive(true)
                    .lastLoginDate(LocalDateTime.now())
                    .build();

            return userRepository.save(newUser);
        }
    }

    /**
     * JWT 토큰 검증 및 사용자 조회
     */
    @Transactional(readOnly = true)
    public Optional<LabUsers> validateTokenAndGetUser(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            return Optional.empty();
        }

        Long kakaoId = jwtTokenProvider.getKakaoIdFromToken(token);
        return userRepository.findActiveUserByKakaoId(kakaoId);
    }

    /**
     * 로그아웃 (모든 토큰 무효화)
     */
    public void logout(String jwtToken, String kakaoAccessToken, Long userId) {
        try {
//            // 1. 사용자의 모든 Refresh Token 취소
//            if (userId != null) {
//                refreshTokenService.revokeAllUserTokens(userId);
//            }

            // 2. 카카오 로그아웃 (실패해도 진행)
            if (kakaoAccessToken != null) {
                try {
                    kakaoService.logout(kakaoAccessToken);
                } catch (Exception e) {
                    log.warn("카카오 로그아웃 실패, 로컬 로그아웃은 계속 진행", e);
                }
            }

            log.info("로그아웃 완료: userId={}", userId);

        } catch (Exception e) {
            log.warn("로그아웃 중 오류 발생: userId={}", userId, e);
        }
    }

//    /**
//     * Refresh Token을 사용한 Access Token 갱신
//     */
//    public LoginResponseDto refreshToken(String refreshTokenValue, HttpServletRequest request) {
//        try {
//            // 1. Refresh Token 검증
//            Optional<RefreshToken> refreshTokenOptional = refreshTokenService
//                    .validateAndGetRefreshToken(refreshTokenValue);
//
//            if (refreshTokenOptional.isEmpty()) {
//                throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
//            }
//
//            RefreshToken refreshToken = refreshTokenOptional.get();
//
//            // 2. 사용자 정보 조회
//            Optional<LabUsers> userOptional = userRepository.findById(refreshToken.getUserId());
//            if (userOptional.isEmpty()) {
//                throw new RuntimeException("사용자를 찾을 수 없습니다.");
//            }
//
//            LabUsers user = userOptional.get();
//
//            // 3. 새로운 Access Token 생성
//            String newAccessToken = jwtTokenProvider.generateToken(user);
//
//            // 4. Refresh Token 회전 (보안 강화)
//            RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken, request);
//
//            // 5. 응답 DTO 생성
//            LoginResponseDto response = LoginResponseDto.builder()
//                    .accessToken(newAccessToken)
//                    .refreshToken(newRefreshToken.getToken())
//                    .tokenType("Bearer")
//                    .expiresIn(30 * 60) // 30분
//                    .build();
//
//            log.info("토큰 갱신 성공: userId={}, oldRefreshTokenId={}, newRefreshTokenId={}",
//                    user.getId(), refreshToken.getId(), newRefreshToken.getId());
//
//            return response;
//
//        } catch (Exception e) {
//            log.error("토큰 갱신 실패", e);
//            throw new RuntimeException("토큰 갱신에 실패했습니다.", e);
//        }
//    }

    /**
     * 사용자 정보 조회 (토큰 기반)
     */
    @Transactional(readOnly = true)
    public Optional<LabUsers> getUserInfo(String accessToken) {
        try {
            if (!jwtTokenProvider.validateToken(accessToken)) {
                return Optional.empty();
            }

            Long kakaoId = jwtTokenProvider.getKakaoIdFromToken(accessToken);
            return userRepository.findActiveUserByKakaoId(kakaoId);

        } catch (Exception e) {
            log.error("사용자 정보 조회 실패", e);
            return Optional.empty();
        }
    }

    /**
     * 토큰 유효성 검사
     */
    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        return jwtTokenProvider.validateToken(token) && !jwtTokenProvider.isTokenExpired(token);
    }

//    /**
//     * 사용자 활성 세션 개수 조회
//     */
//    @Transactional(readOnly = true)
//    public long getActiveSessionCount(Long userId) {
//        return refreshTokenService.countValidTokensByUser(userId);
//    }
//
//    /**
//     * 특정 Refresh Token 취소
//     */
//    public void revokeRefreshToken(String refreshTokenValue) {
//        refreshTokenService.revokeRefreshToken(refreshTokenValue);
//    }
}