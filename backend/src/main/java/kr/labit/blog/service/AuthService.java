package kr.labit.blog.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.labit.blog.dto.user.KakaoTokenDto;
import kr.labit.blog.dto.user.KakaoUserInfoDto;
import kr.labit.blog.dto.user.LoginResponseDto;
import kr.labit.blog.dto.user.UserUpdateRequestDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.UserRole;
import kr.labit.blog.repository.LabUsersRepository;
import kr.labit.blog.security.jwt.JwtBlacklistService;
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
    private final JwtBlacklistService jwtBlacklistService;
//    private final RefreshTokenService refreshTokenService;

    /**
     * 카카오 로그인 인증 주소
     * @return Kakak Login Page Path
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
     *  카카오 로그인 처리 (Access Token + Refresh Token 발급 ) Refresh Token 현재 발급 중지.
     * @param authorizationCode Kakao Login 인증 코드
     * @param request Refresh Token 발급용 = 현자 발급 중지
     * @return LoginResponseDto
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
     * 카카오 인증 유저 탈퇴
     * @param kakaoAccessToken
     * @param userId
     */
    public void withdrawal(String kakaoAccessToken, Long userId) {

        log.info("회원탈퇴 실시 ID={}", userId);
        Optional<LabUsers> existingUser = userRepository.findByKakaoId(userId);
        log.info("USER INFO={}", existingUser);

//
//        try {
//            if (kakaoAccessToken != null) {
//                try {
//                    kakaoService.accountDelete(kakaoAccessToken);
//
//
//                } catch (Exception e) {
//                    log.warn("카카오 회원 탈퇴 실패", e);
//                }
//            }
//
//            log.info("회원 탈퇴 완료: userId={}", userId);
//
//        } catch (Exception e) {
//            log.warn("회원탈퇴 중 오류 발생: userId={}", userId, e);
//            throw new RuntimeException("카카오 회원 탈퇴에 실패했습니다.", e);
//        }
    }

    /**
     * 사용자 정보 저장 또는 업데이트
     */
    private LabUsers saveOrUpdateUser(KakaoUserInfoDto kakaoUserInfo) {
        Optional<LabUsers> existingUser = userRepository.findByKakaoId(kakaoUserInfo.getId());

        if (existingUser.isEmpty()) {
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
        else {
            // 기존 사용자 정보 업데이트
//            LabUsers user = existingUser.get();
//            user.updateProfile(
//                    null,
//                    kakaoUserInfo.getEmail(),
//                    kakaoUserInfo.getProfileImageUrl()
//            );
//            user.updateLastLoginDate();
//
//            return userRepository.save(user);
            return existingUser.get();
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
            // 1. JWT 토큰을 블랙리스트에 추가하여 무효화
            if (jwtToken != null && !jwtToken.trim().isEmpty()) {
                jwtBlacklistService.addToBlacklist(jwtToken);
                log.info("JWT 토큰이 블랙리스트에 추가됨: userId={}", userId);
            }

            // 2. 카카오 로그아웃 (실패해도 로컬 로그아웃은 계속 진행)
            if (kakaoAccessToken != null && !kakaoAccessToken.trim().isEmpty()) {
                try {
                    kakaoService.logout(kakaoAccessToken);
                    log.info("카카오 로그아웃 성공: userId={}", userId);
                } catch (Exception e) {
                    log.warn("카카오 로그아웃 실패, 로컬 로그아웃은 계속 진행: userId={}", userId, e);
                }
            }

            // 3. 사용자 마지막 로그아웃 시간 업데이트 (선택사항)
            if (userId != null) {
                try {
                    Optional<LabUsers> userOpt = userRepository.findById(userId);
                    if (userOpt.isPresent()) {
                        LabUsers user = userOpt.get();
                        // 필요하다면 lastLogoutDate 필드를 추가하여 업데이트
                        // user.setLastLogoutDate(LocalDateTime.now());
                        // userRepository.save(user);
                    }
                } catch (Exception e) {
                    log.warn("사용자 로그아웃 시간 업데이트 실패: userId={}", userId, e);
                }
            }

            log.info("로그아웃 완료: userId={}", userId);

        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생: userId={}", userId, e);
            // 로그아웃 실패해도 JWT 토큰은 블랙리스트에 추가
            if (jwtToken != null && !jwtToken.trim().isEmpty()) {
                try {
                    jwtBlacklistService.addToBlacklist(jwtToken);
                } catch (Exception ex) {
                    log.error("JWT 토큰 블랙리스트 추가 실패: userId={}", userId, ex);
                }
            }
        }
    }

    /**
     * 강제 로그아웃 (모든 기기에서 로그아웃)
     */
    public void forceLogoutAllDevices(Long userId, String currentJwtToken) {
        try {
            // 현재 토큰을 블랙리스트에 추가
            if (currentJwtToken != null) {
                jwtBlacklistService.addUserTokensToBlacklist(userId, currentJwtToken);
            }

            log.info("사용자 모든 기기 강제 로그아웃 완료: userId={}", userId);

        } catch (Exception e) {
            log.error("강제 로그아웃 실패: userId={}", userId, e);
            throw new RuntimeException("강제 로그아웃에 실패했습니다.", e);
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
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        // 1. 블랙리스트 확인
        if (jwtBlacklistService.isBlacklisted(token)) {
            log.debug("블랙리스트된 토큰");
            return false;
        }

        // 2. JWT 검증
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
    /**
     * 사용자 정보 수정
     */
    @Transactional
    public LabUsers updateUserInfo(Long userId, UserUpdateRequestDto updateRequest) {
        log.info("사용자 정보 수정 시작: userId={}", userId);

        // 사용자 조회
        LabUsers user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 활성 사용자인지 확인
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 사용자입니다.");
        }

        // 닉네임 중복 검사 (본인 제외)
        if (!updateRequest.getNickname().equals(user.getNickname())) {
            Optional<LabUsers> existingUserByNickname = userRepository.findByNickname(updateRequest.getNickname());
            if (existingUserByNickname.isPresent() && !existingUserByNickname.get().getId().equals(userId)) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
        }

        // 이메일 중복 검사 (본인 제외)
        if (!updateRequest.getEmail().equals(user.getEmail())) {
            Optional<LabUsers> existingUserByEmail = userRepository.findByEmail(updateRequest.getEmail());
            if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(userId)) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
        }

        // 사용자 정보 업데이트
        user.updateProfile(
                updateRequest.getNickname(),
                updateRequest.getEmail(),
                updateRequest.getProfileImage()
        );

        LabUsers savedUser = userRepository.save(user);

        log.info("사용자 정보 수정 완료: userId={}, nickname={}, email={}",
                savedUser.getId(), savedUser.getNickname(), savedUser.getEmail());

        return savedUser;
    }
    /**
     * 이메일 중복 검사
     */
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.findByEmail(email).isPresent();
    }

    /**
     * 사용자 정보 부분 업데이트 (프로필 이미지만)
     */
    @Transactional
    public LabUsers updateProfileImage(Long userId, String profileImageUrl) {
        log.info("프로필 이미지 업데이트: userId={}, imageUrl={}", userId, profileImageUrl);

        LabUsers user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 사용자입니다.");
        }

        user.updateProfile(user.getNickname(), user.getEmail(), profileImageUrl);
        LabUsers savedUser = userRepository.save(user);

        log.info("프로필 이미지 업데이트 완료: userId={}", savedUser.getId());
        return savedUser;
    }

    /**
     * 사용자 정보 검증
     */
    @Transactional(readOnly = true)
    public void validateUserUpdate(Long userId, UserUpdateRequestDto updateRequest) {
        // 기본 유효성 검사는 Bean Validation으로 처리

        // 사용자 존재 여부 확인
        LabUsers user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 활성 사용자인지 확인
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 사용자입니다.");
        }

        // 닉네임 중복 검사 (본인 제외)
        if (!updateRequest.getNickname().equals(user.getNickname())) {
            if (!isNicknameAvailable(updateRequest.getNickname())) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
        }

        // 이메일 중복 검사 (본인 제외)
        if (!updateRequest.getEmail().equals(user.getEmail())) {
            if (!isEmailAvailable(updateRequest.getEmail())) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
        }

        log.info("사용자 정보 검증 완료: userId={}", userId);
    }

    /**
     * 사용자 활동 로그 (향후 확장용)
     */
    @Transactional
    public void logUserActivity(Long userId, String activity, String details) {
        try {
            // 향후 사용자 활동 로그 테이블에 저장
            log.info("사용자 활동 로그: userId={}, activity={}, details={}", userId, activity, details);
        } catch (Exception e) {
            log.warn("사용자 활동 로그 저장 실패: userId={}", userId, e);
        }
    }
    /**
     * 닉네임 중복 검사
     */
    @Transactional(readOnly = true)
    public boolean isNicknameAvailable(String nickname) {
        return !userRepository.findByNickname(nickname).isPresent();
    }
}