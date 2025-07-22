package kr.labit.blog.dto;

import kr.labit.blog.entity.LabComment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommentResponseDto {
    private Long id;
    private Long postId;
    private String content;
    private AuthorDto author;
    private Long parentId;
    private Integer depth;
    private Boolean isDeleted;
    private Long likeCount;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private List<CommentResponseDto> replies;

    @Data
    @Builder
    public static class AuthorDto {
        private Long id;
        private String nickname;
        private String profileImage;
    }

    public static CommentResponseDto fromEntity(LabComment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .content(comment.getContent())
                .author(AuthorDto.builder()
                        .id(comment.getAuthor().getId())
                        .nickname(comment.getAuthor().getNickname())
                        .profileImage(comment.getAuthor().getProfileImage())
                        .build())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .depth(comment.getDepth())
                .isDeleted(comment.getIsDeleted())
                .likeCount(comment.getLikeCount())
                .createdDate(comment.getCreatedDate())
                .modifiedDate(comment.getModifiedDate())
                .build();
    }
}