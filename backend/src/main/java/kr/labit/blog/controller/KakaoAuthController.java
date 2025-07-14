package kr.labit.blog.controller;

import kr.labit.blog.dto.AuthResponseDto;
import kr.labit.blog.dto.KakaoTokenDto;
import kr.labit.blog.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/kakao")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend-url}")
@Slf4j
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> kakaoLogin(@RequestBody KakaoTokenDto tokenDto) {
        AuthResponseDto authResponse = kakaoAuthService.authenticateWithKakao(tokenDto.getAccessToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> kakaoLogout() {
        kakaoAuthService.logout();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        AuthResponseDto authResponse = kakaoAuthService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/user-info")
    public ResponseEntity<Object> getUserInfo() {
        Object userInfo = kakaoAuthService.getCurrentUserInfo();
        return ResponseEntity.ok(userInfo);
    }
}