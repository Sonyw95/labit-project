package app.labit.dto.oauth;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

import java.util.Map;

@Alias("OauthDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data class OauthDto {


    private String code;
    private String platform;
    private String url;
    private String redirectUrl;
    private String restKey;
    private String authSns;

    /* Kakao */
    private String id;
    private String connected_at;
    private String token_type;
    private String refresh_token;
    private String id_token;
    private String access_token;
    private String scope;




}
