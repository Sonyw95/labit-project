package kr.labit.blog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "로그인 응답 DTO")
public class LoginResponseDto {

    @JsonProperty("accessToken")
    @Schema(description = "JWT Access Token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;

    @JsonProperty("refreshToken")
    @Schema(description = "Refresh Token", example = "rt_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;

    @JsonProperty("tokenType")
    @Schema(description = "토큰 타입", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @JsonProperty("expiresIn")
    @Schema(description = "Access Token 만료 시간 (초)", example = "1800")
    private Integer expiresIn;

    @JsonProperty("scope")
    @Schema(description = "토큰 스코프 (선택사항)", example = "read write")
    private String scope;

    @JsonProperty("issuedAt")
    @Schema(description = "토큰 발급 시간 (Unix timestamp)", example = "1640995200")
    private Long issuedAt;

    // 사용자 정보 포함 (선택사항)
    @JsonProperty("user")
    @Schema(description = "사용자 기본 정보")
    private UserSummaryDto user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "사용자 요약 정보")
    public static class UserSummaryDto {

        @JsonProperty("id")
        @Schema(description = "사용자 ID", example = "1")
        private Long id;

        @JsonProperty("nickname")
        @Schema(description = "닉네임", example = "홍길동")
        private String nickname;

        @JsonProperty("email")
        @Schema(description = "이메일", example = "user@example.com")
        private String email;

        @JsonProperty("profileImage")
        @Schema(description = "프로필 이미지 URL")
        private String profileImage;

        @JsonProperty("role")
        @Schema(description = "사용자 역할", example = "USER")
        private String role;

        @JsonProperty("isAdmin")
        @Schema(description = "관리자 여부", example = "false")
        private Boolean isAdmin;
    }

    /**
     * 현재 시간을 Unix timestamp로 설정
     */
    public void setIssuedAtNow() {
        this.issuedAt = System.currentTimeMillis() / 1000;
    }

    /**
     * 사용자 정보로부터 UserSummaryDto 생성
     */
    public static UserSummaryDto createUserSummary(kr.labit.blog.entity.LabUsers user) {
        if (user == null) {
            return null;
        }

        boolean isAdmin = user.getRole() != null &&
                (user.getRole().name().equals("ADMIN") || user.getRole().name().equals("SUPER_ADMIN"));

        return UserSummaryDto.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .role(user.getRole() != null ? user.getRole().name() : "USER")
                .isAdmin(isAdmin)
                .build();
    }
}