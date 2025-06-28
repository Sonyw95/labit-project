package app.labit.dto.session;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;
import java.io.Serializable;

@Alias("SessionUser")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data class SessionUser implements Serializable {

    /* LABUSERS */
    private String id;
    private String thumbnail;
    private String email;
    private String password;
    private String username;
    private String authSns;
    private String isAdmin;
    private String userLevel;
    private String userExp;
    private String loginChk;
    private String useYn;
    private String isAuth;
    private String logoutUrl;
    private String ktoken;

    private Object authData;


}
