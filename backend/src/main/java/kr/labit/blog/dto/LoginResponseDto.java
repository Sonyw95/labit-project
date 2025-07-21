package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String accessToken;
    private String tokenType;
    private Integer expiresIn;
    private String refreshToken;
}
