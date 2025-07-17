package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "LAB_NAVIGATION")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Navigation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "nav_seq")
    @SequenceGenerator(name = "nav_seq", sequenceName = "seq_lab_navigation", allocationSize = 1)
    @Column(name = "nav_id")
    private Long navId;

    @Column(name = "nav_name", nullable = false, length = 100)
    private String navName;

    @Column(name = "nav_url", length = 500)
    private String navUrl;

    @Column(name = "nav_icon", length = 50)
    private String navIcon;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "nav_order")
    private Integer navOrder = 0;

    @Column(name = "nav_level")
    private Integer navLevel = 1;

    @Column(name = "is_active", length = 1)
    private char isActive = 'Y';

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 부모 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Navigation parent;

    // 자식 관계 설정
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("navOrder ASC")
    private List<Navigation> children;
}