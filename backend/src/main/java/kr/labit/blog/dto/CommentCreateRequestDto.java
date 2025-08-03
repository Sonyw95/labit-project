package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor // 모든 필드 생성자 추가
public class CommentCreateRequestDto {
    private Long postId;
    private String content;
    private Long parentId; // 대댓글인 경우
}