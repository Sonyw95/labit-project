package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
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