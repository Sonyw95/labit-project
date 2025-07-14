package kr.labit.blog.dto;

import lombok.Data;

// 카카오 사용자 정보 DTO
@Data
public class KakaoUserInfoDto {
    private Long id;
    private String connectedAt;
    private KakaoAccount kakaoAccount;

    @Data
    public static class KakaoAccount {
        private Boolean profileNeedsAgreement;
        private Boolean profileNicknameNeedsAgreement;
        private Boolean profileImageNeedsAgreement;
        private Profile profile;
        private Boolean hasEmail;
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
}
