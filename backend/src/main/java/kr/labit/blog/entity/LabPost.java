package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "LAB_POST")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("포스트 정보 테이블")
public class LabPost {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "POST_SEQ")
    @SequenceGenerator(name = "POST_SEQ", sequenceName = "LAB_POST_SEQ", allocationSize = 1)
    @Comment("포스트 ID")
    private Long id;

    @Column(name = "TITLE", nullable = false, length = 200)
    @Comment("포스트 제목")
    private String title;

    @Column(name = "CONTENT", columnDefinition = "CLOB")
    @Comment("포스트 내용 (HTML)")
    private String content;

    @Column(name = "SUMMARY", length = 500)
    @Comment("포스트 요약")
    private String summary;

    @Column(name = "THUMBNAIL_URL", length = 500)
    @Comment("썸네일 이미지 URL")
    private String thumbnailUrl;

    @Column(name = "TAGS", length = 1000)
    @Comment("태그 (쉼표로 구분)")
    private String tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_ID")
    @Comment("카테고리 (네비게이션 참조)")
    private LabNavigation category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AUTHOR_ID", nullable = false)
    @Comment("작성자")
    private LabUsers author;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    @Comment("포스트 상태")
    @Builder.Default
    private PostStatus status = PostStatus.DRAFT;

    @Column(name = "VIEW_COUNT", nullable = false)
    @Comment("조회수")
    @Builder.Default
    private Long viewCount = 0L;

    @Column(name = "LIKE_COUNT", nullable = false)
    @Comment("좋아요 수")
    @Builder.Default
    private Long likeCount = 0L;

    @Column(name = "COMMENT_COUNT", nullable = false)
    @Comment("댓글 수")
    @Builder.Default
    private Long commentCount = 0L;

    @Column(name = "IS_FEATURED", nullable = false)
    @Comment("추천 포스트 여부")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "PUBLISHED_DATE")
    @Comment("발행일시")
    private LocalDateTime publishedDate;

    @CreatedDate
    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    @Comment("생성일시")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "MODIFIED_DATE")
    @Comment("수정일시")
    private LocalDateTime modifiedDate;

    // 연관 관계 (Comment는 별도 관리)
    @Transient
    private List<LabComment> comments = new ArrayList<>();

    // 편의 메서드
    public void publish() {
        this.status = PostStatus.PUBLISHED;
        this.publishedDate = LocalDateTime.now();
    }

    public void unpublish() {
        this.status = PostStatus.DRAFT;
        this.publishedDate = null;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    public void updateCommentCount(long count) {
        this.commentCount = Math.max(0, count);
    }

    public boolean isPublished() {
        return status == PostStatus.PUBLISHED;
    }

    public boolean isOwnedBy(LabUsers user) {
        return author != null && author.getId().equals(user.getId());
    }

    public List<String> getTagList() {
        if (tags == null || tags.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(tags.split(","));
    }

    public void setTagList(List<String> tagList) {
        if (tagList == null || tagList.isEmpty()) {
            this.tags = null;
        } else {
            this.tags = String.join(",", tagList);
        }
    }
}