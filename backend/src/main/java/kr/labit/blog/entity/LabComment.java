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
@Table(name = "LAB_COMMENT")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("댓글 정보 테이블")
public class LabComment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "COMMENT_SEQ")
    @SequenceGenerator(name = "COMMENT_SEQ", sequenceName = "LAB_COMMENT_SEQ", allocationSize = 1)
    @Comment("댓글 ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "POST_ID", nullable = false)
    @Comment("포스트 ID")
    private LabPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AUTHOR_ID", nullable = false)
    @Comment("작성자")
    private LabUsers author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_ID")
    @Comment("부모 댓글 ID (대댓글인 경우)")
    private LabComment parent;

    @Column(name = "CONTENT", nullable = false, columnDefinition = "CLOB")
    @Comment("댓글 내용")
    private String content;

    @Column(name = "DEPTH", nullable = false)
    @Comment("댓글 깊이 (0: 댓글, 1: 대댓글)")
    @Builder.Default
    private Integer depth = 0;

    @Column(name = "IS_DELETED", nullable = false)
    @Comment("삭제 여부")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "LIKE_COUNT", nullable = false)
    @Comment("좋아요 수")
    @Builder.Default
    private Long likeCount = 0L;

    @CreatedDate
    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    @Comment("생성일시")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "MODIFIED_DATE")
    @Comment("수정일시")
    private LocalDateTime modifiedDate;

    // 자식 댓글들 (대댓글)
    @Transient
    private List<LabComment> replies = new ArrayList<>();

    // 편의 메서드
    public void delete() {
        this.isDeleted = true;
        this.content = "삭제된 댓글입니다.";
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    public boolean isOwnedBy(LabUsers user) {
        return author != null && author.getId().equals(user.getId());
    }

    public boolean isReply() {
        return parent != null;
    }

    public boolean canReply() {
        return depth < 1; // 대댓글까지만 허용
    }
}