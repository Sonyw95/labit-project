package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PostUpdateRequestDto {
    private String title;
    private String content;
    private String summary;
    private String thumbnailUrl;
    private List<String> tags;
    private Long categoryId;
    private String status;
    private Boolean isFeatured;
}