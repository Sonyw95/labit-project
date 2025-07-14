package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
/**
 * 인증 응답 DTO
 */
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfoDto userInfo;
}