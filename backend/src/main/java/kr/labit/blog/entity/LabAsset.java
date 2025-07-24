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
@Table(name = "LAB_ASSET")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("에셋 관리 테이블")
public class LabAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ASSET_SEQ")
    @SequenceGenerator(name = "ASSET_SEQ", sequenceName = "LAB_ASSET_SEQ", allocationSize = 1)
    @Comment("에셋 ID")
    private Long id;

    @Column(name = "NAME", nullable = false, length = 255)
    @Comment("에셋 이름")
    private String name;

    @Column(name = "ORIGINAL_NAME", length = 255)
    @Comment("원본 파일명")
    private String originalName;

    @Column(name = "TYPE", nullable = false, length = 20)
    @Comment("에셋 타입 (folder, file)")
    private String type;

    @Column(name = "URL", length = 500)
    @Comment("파일 URL")
    private String url;

    @Column(name = "MIME_TYPE", length = 100)
    @Comment("MIME 타입")
    private String mimeType;

    @Column(name = "SIZE")
    @Comment("파일 크기 (bytes)")
    private Long size;

    @Column(name = "FOLDER_ID")
    @Comment("폴더 ID")
    private Long folderId;

    @Column(name = "PARENT_ID")
    @Comment("부모 폴더 ID")
    private Long parentId;

    @Column(name = "SORT_ORDER", nullable = false)
    @Comment("정렬 순서")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "DEPTH")
    @Comment("폴더 깊이")
    @Builder.Default
    private Integer depth = 0;

    @Column(name = "DESCRIPTION", length = 500)
    @Comment("설명")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UPLOADER_ID")
    @Comment("업로더")
    private LabUsers uploader;

    @Column(name = "IS_PUBLIC", nullable = false)
    @Comment("공개 여부")
    @Builder.Default
    private Boolean isPublic = true;

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
    private List<LabAsset> children = new ArrayList<>();

    @Transient
    private Integer fileCount = 0;

    // 편의 메서드
    public void addChild(LabAsset child) {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        this.children.add(child);
        child.setParentId(this.id);
    }

    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    public boolean isFolder() {
        return "folder".equals(this.type);
    }

    public boolean isFile() {
        return "file".equals(this.type);
    }
}