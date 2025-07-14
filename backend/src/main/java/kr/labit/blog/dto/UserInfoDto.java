package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

// 사용자 정보 DTO
@Data
@Builder
public class UserInfoDto {
    private Long id;
    private String email;
    private String nickname;
    private String profileImageUrl;
    private String role;
    private Boolean isActive;
}