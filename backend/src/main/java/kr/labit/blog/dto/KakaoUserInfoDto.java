package kr.labit.blog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KakaoUserInfoDto {

    private Long id;

    @JsonProperty("connected_at")
    private String connectedAt;

    private KakaoAccount kakaoAccount;

    @Data
    public static class KakaoAccount {
        private Boolean profileNeedsAgreement;
        private Profile profile;
        private Boolean emailNeedsAgreement;
        private Boolean isEmailValid;
        private Boolean isEmailVerified;
        private String email;

        @Data
        public static class Profile {
            private String nickname;
            private String thumbnailImageUrl;
            private String profileImageUrl;
            private Boolean isDefaultImage;
        }
    }

    // 편의 메서드
    public String getNickname() {
        return kakaoAccount != null && kakaoAccount.getProfile() != null
                ? kakaoAccount.getProfile().getNickname() : null;
    }

    public String getEmail() {
        return kakaoAccount != null ? kakaoAccount.getEmail() : null;
    }

    public String getProfileImageUrl() {
        return kakaoAccount != null && kakaoAccount.getProfile() != null
                ? kakaoAccount.getProfile().getProfileImageUrl() : null;
    }
}