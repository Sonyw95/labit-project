package kr.labit.blog.dto;

import kr.labit.blog.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String kakaoId;
    private String email;
    private String nickname;
    private String profileImage;
    private String thumbnailImage;
    private String userRole;
    private String isActive;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .kakaoId(user.getKakaoId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .thumbnailImage(user.getThumbnailImage())
                .userRole(user.getUserRole().name())
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}