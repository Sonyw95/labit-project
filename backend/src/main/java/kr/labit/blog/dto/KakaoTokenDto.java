package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoTokenDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private int expiresIn;
    private String scope;
}