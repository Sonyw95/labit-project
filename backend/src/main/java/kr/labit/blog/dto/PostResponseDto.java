package kr.labit.blog.dto;

import kr.labit.blog.entity.LabPost;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String thumbnailUrl;
    private List<String> tags;
    private CategoryDto category;
    private AuthorDto author;
    private String status;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private Boolean isFeatured;
    private LocalDateTime publishedDate;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    @Data
    @Builder
    public static class CategoryDto {
        private Long id;
        private String label;
        private String href;
    }

    @Data
    @Builder
    public static class AuthorDto {
        private Long id;
        private String nickname;
        private String profileImage;
    }

    public static PostResponseDto fromEntity(LabPost post) {
        return PostResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .summary(post.getSummary())
                .thumbnailUrl(post.getThumbnailUrl())
                .tags(post.getTagList())
                .category(post.getCategory() != null ?
                        CategoryDto.builder()
                                .id(post.getCategory().getId())
                                .label(post.getCategory().getLabel())
                                .href(post.getCategory().getHref())
                                .build() : null)
                .author(AuthorDto.builder()
                        .id(post.getAuthor().getId())
                        .nickname(post.getAuthor().getNickname())
                        .profileImage(post.getAuthor().getProfileImage())
                        .build())
                .status(post.getStatus().name())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .isFeatured(post.getIsFeatured())
                .publishedDate(post.getPublishedDate())
                .createdDate(post.getCreatedDate())
                .modifiedDate(post.getModifiedDate())
                .build();
    }
}