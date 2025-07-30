package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private Long id;
    private String name;
    private String role;
    private String bio;
    private String profileImage;
    private String location;
    private String email;
    private String githubUrl;
    private String totalViews; // 포맷된 문자열 (12.5K 등)
    private Integer startYear;
}