package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentCreateRequestDto {
    private Long postId;
    private String content;
    private Long parentId; // 대댓글인 경우
}