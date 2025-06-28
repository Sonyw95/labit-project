package app.labit.dto.kakao;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@Alias("KakaoDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data  class KakaoDto {
    private String id;
    private String connected_at;
    private KakaoProperties properties;
    private KakaoAccount kakao_account;


    public @Data static class KakaoProperties {
        private String nickname;
        private String profile_image;
        private String thumbnail_image;
    };

    public @Data static class KakaoAccount{
        private Boolean profile_nickname_needs_agreement;
        private Boolean profile_image_needs_agreement;
        private KakaoProfile profile;

        private Boolean has_email;
        private Boolean email_needs_agreement;
        private Boolean is_email_valid;
        private Boolean is_email_verified;
        private String email;
        private Boolean has_age_range;
        private Boolean age_range_needs_agreement;
        private String age_range;
    }

    public @Data static class KakaoProfile{
        private String nickname;
        private String thumbnail_image_url;
        private String profile_image_url;
        private Boolean is_default_image;
    }
}
