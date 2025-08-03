package kr.labit.blog.dto.user;

import kr.labit.blog.entity.LabUsers;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfoDto {
    private Long id;
    private Long kakaoId;
    private String email;
    private String nickname;
    private String profileImage;
    private String role;
    private Boolean isActive;
    private String lastLoginDate;
    private String createdDate;

    public static UserInfoDto fromEntity(LabUsers user) {
        return UserInfoDto.builder()
                .id(user.getId())
                .kakaoId(user.getKakaoId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .lastLoginDate(user.getLastLoginDate() != null ?
                        user.getLastLoginDate().toString() : null)
                .createdDate(user.getCreatedDate() != null ?
                        user.getCreatedDate().toString() : null)
                .build();
    }
}