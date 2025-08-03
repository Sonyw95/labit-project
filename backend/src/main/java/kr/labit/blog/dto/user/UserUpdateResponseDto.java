package kr.labit.blog.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "사용자 정보 수정 응답 DTO")
public class UserUpdateResponseDto {

    @JsonProperty("user")
    @Schema(description = "수정된 사용자 정보")
    private UserInfoDto user;

    @JsonProperty("accessToken")
    @Schema(description = "새로 발급된 JWT Access Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @JsonProperty("tokenType")
    @Schema(description = "토큰 타입", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @JsonProperty("expiresIn")
    @Schema(description = "Access Token 만료 시간 (초)", example = "1800")
    private Integer expiresIn;

    @JsonProperty("issuedAt")
    @Schema(description = "토큰 발급 시간 (Unix timestamp)", example = "1640995200")
    private Long issuedAt;

    @JsonProperty("message")
    @Schema(description = "응답 메시지", example = "프로필이 성공적으로 수정되었습니다.")
    private String message;

    /**
     * 현재 시간을 Unix timestamp로 설정
     */
    public void setIssuedAtNow() {
        this.issuedAt = System.currentTimeMillis() / 1000;
    }

//    /**
//     * 빌더 패턴으로 생성 시 자동으로 발급 시간 설정
//     */
//    public static class UserUpdateResponseDtoBuilder {
//        public UserUpdateResponseDto build() {
//            UserUpdateResponseDto dto = new UserUpdateResponseDto(user, accessToken, tokenType, expiresIn, issuedAt, message);
//            if (dto.issuedAt == null) {
//                dto.setIssuedAtNow();
//            }
//            return dto;
//        }
//    }
}