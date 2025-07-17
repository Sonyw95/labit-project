package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoUserInfoDto {
    private String id;
    private String connectedAt;
    private String email;
    private String nickname;
    private String profileImageUrl;
    private String thumbnailImageUrl;
}