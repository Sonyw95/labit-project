package kr.labit.blog.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KakaoUserInfoDto {

    private Long id;

    @JsonProperty("connected_at")
    private String connectedAt;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Data
    public static class KakaoAccount {

        private String email;

        private Profile profile;

        @JsonProperty("email_needs_agreement")
        private Boolean emailNeedsAgreement;

        @JsonProperty("has_email")
        private Boolean hasEmail;

        @JsonProperty("is_email_valid")
        private Boolean isEmailValid;

        @JsonProperty("is_email_verified")
        private Boolean isEmailVerified;


        @Data
        public static class Profile {
            private String nickname;

            @JsonProperty("profile_image_url")
            private String profileImageUrl;

            @JsonProperty("thumbnail_image_url")
            private String thumbnailImageUrl;

            @JsonProperty("is_default_image")
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