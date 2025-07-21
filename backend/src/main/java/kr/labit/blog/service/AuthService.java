package kr.labit.blog.service;

import kr.labit.blog.dto.KakaoTokenDto;
import kr.labit.blog.dto.KakaoUserInfoDto;
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
     * 카카오 로그인 처리
     */
    public String kakaoLogin(String authorizationCode) {
        try {
            // 1. 카카오 액세스 토큰 발급
            KakaoTokenDto tokenDto = kakaoService.getAccessToken(authorizationCode);

            // 2. 카카오 사용자 정보 조회
            KakaoUserInfoDto kakaoUserInfo = kakaoService.getUserInfo(tokenDto.getAccessToken());

            // 3. 사용자 정보 저장 또는 업데이트
            LabUsers user = saveOrUpdateUser(kakaoUserInfo);

            // 4. JWT 토큰 생성
            String jwtToken = jwtTokenProvider.generateToken(user);

            log.info("카카오 로그인 성공: 사용자 ID = {}, 카카오 ID = {}", user.getId(), user.getKakaoId());
            return jwtToken;

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
     * 로그아웃
     */
    public void logout(String jwtToken, String kakaoAccessToken) {
        try {
            // 카카오 로그아웃 (실패해도 진행)
            if (kakaoAccessToken != null) {
                kakaoService.logout(kakaoAccessToken);
            }

            log.info("로그아웃 완료");
        } catch (Exception e) {
            log.warn("로그아웃 중 오류 발생", e);
        }
    }

    /**
     * 토큰 갱신
     */
    public String refreshToken(String oldToken) {
        if (!jwtTokenProvider.validateToken(oldToken)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        Long kakaoId = jwtTokenProvider.getKakaoIdFromToken(oldToken);
        Optional<LabUsers> userOptional = userRepository.findActiveUserByKakaoId(kakaoId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        return jwtTokenProvider.generateToken(userOptional.get());
    }
}