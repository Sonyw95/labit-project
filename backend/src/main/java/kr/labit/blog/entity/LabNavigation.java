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
@Table(name = "LAB_NAVIGATION")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("네비게이션 메뉴 테이블")
public class LabNavigation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NAVIGATION_SEQ")
    @SequenceGenerator(name = "NAVIGATION_SEQ", sequenceName = "LAB_NAVIGATION_SEQ", allocationSize = 1)
    @Comment("네비게이션 ID")
    private Long id;

    @Column(name = "LABEL", nullable = false, length = 100)
    @Comment("메뉴 라벨")
    private String label;

    @Column(name = "HREF", length = 255)
    @Comment("메뉴 링크")
    private String href;

    @Column(name = "PARENT_ID")
    @Comment("부모 메뉴 ID")
    private Long parentId;

    @Column(name = "SORT_ORDER", nullable = false)
    @Comment("정렬 순서")
    private Integer sortOrder;

    @Column(name = "DEPTH", nullable = false)
    @Comment("메뉴 깊이")
    private Integer depth;

    @Column(name = "ICON", length = 50)
    @Comment("메뉴 아이콘")
    private String icon;

    @Column(name = "IS_ACTIVE", nullable = false)
    @Comment("활성화 여부")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "DESCRIPTION", length = 500)
    @Comment("메뉴 설명")
    private String description;

    @CreatedDate
    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    @Comment("생성일시")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "MODIFIED_DATE")
    @Comment("수정일시")
    private LocalDateTime modifiedDate;

    // JPA에서는 직접 매핑하지 않고 서비스에서 처리
    @Transient
    private List<LabNavigation> children = new ArrayList<>();

    // 편의 메서드
    public void addChild(LabNavigation child) {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(child);
        child.setParentId(this.id);
    }

    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    public boolean isRootMenu() {
        return parentId == null;
    }
}