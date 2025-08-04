package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 생성자 추가
public class PostCreateRequestDto {
    private String title;
    private String content;
    private String summary;
    private String thumbnailUrl;
    private List<String> tags;
    private Long categoryId;
    private String status; // DRAFT, PUBLISHED, PRIVATE
    private Boolean isFeatured;
}