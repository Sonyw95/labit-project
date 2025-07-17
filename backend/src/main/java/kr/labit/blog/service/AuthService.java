package kr.labit.blog.service;

import kr.labit.blog.dto.KakaoTokenDto;
import kr.labit.blog.dto.KakaoUserInfoDto;
import kr.labit.blog.dto.LoginResponseDto;
import kr.labit.blog.dto.UserDto;
import kr.labit.blog.entity.User;
import kr.labit.blog.repository.UserRepository;
import kr.labit.blog.util.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final KakaoOAuthService kakaoOAuthService;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponseDto kakaoLogin(String code) {
        try {
            // 1. 카카오에서 액세스 토큰 받기
            KakaoTokenDto tokenDto = kakaoOAuthService.getAccessToken(code);

            // 2. 액세스 토큰으로 사용자 정보 받기
            KakaoUserInfoDto userInfo = kakaoOAuthService.getUserInfo(tokenDto.getAccessToken());

            // 3. 사용자 정보로 회원가입 또는 로그인 처리
            User user = findOrCreateUser(userInfo);

            // 4. JWT 토큰 생성
            String jwtToken = jwtTokenProvider.generateToken(
                    user.getKakaoId(),
                    user.getEmail(),
                    user.getUserRole().name()
            );

            // 5. 마지막 로그인 시간 업데이트
            user.updateLastLoginAt();
            userRepository.save(user);

            return LoginResponseDto.builder()
                    .accessToken(jwtToken)
                    .user(UserDto.from(user))
                    .build();

        } catch (Exception e) {
            log.error("Kakao login failed: {}", e.getMessage());
            throw new RuntimeException("카카오 로그인에 실패했습니다.", e);
        }
    }

    private User findOrCreateUser(KakaoUserInfoDto userInfo) {
        Optional<User> existingUser = userRepository.findByKakaoIdAndActive(userInfo.getId());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // 사용자 정보 업데이트
            user.setNickname(userInfo.getNickname());
            user.setProfileImage(userInfo.getProfileImageUrl());
            user.setThumbnailImage(userInfo.getThumbnailImageUrl());
            return user;
        }

        // 새 사용자 생성
        User newUser = User.builder()
                .kakaoId(userInfo.getId())
                .email(userInfo.getEmail())
                .nickname(userInfo.getNickname())
                .profileImage(userInfo.getProfileImageUrl())
                .thumbnailImage(userInfo.getThumbnailImageUrl())
                .userRole(User.UserRole.USER)
                .isActive('Y')
                .build();

        return userRepository.save(newUser);
    }

    public void logout(String kakaoId) {
        // 실제 구현에서는 토큰을 블랙리스트에 추가하거나 무효화할 수 있음
        log.info("User {} logged out", kakaoId);
    }

    public UserDto getUserInfo(String kakaoId) {
        User user = userRepository.findByKakaoIdAndActive(kakaoId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return UserDto.from(user);
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}
