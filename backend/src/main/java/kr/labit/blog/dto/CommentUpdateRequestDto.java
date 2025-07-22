package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentUpdateRequestDto {
    private String content;
}