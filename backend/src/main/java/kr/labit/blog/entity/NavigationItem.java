package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "LAB_NAVIGATION")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NavigationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String path;

    @Column
    private String icon;

    @Column(name = "PARENT_ID")
    private Long parentId;

    @Column(name = "ORDER_INDEX")
    private Integer orderIndex;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "REQUIRED_ROLE")
    private String requiredRole;

    @OneToMany(mappedBy = "PARENT_ID", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<NavigationItem> children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_ID", insertable = false, updatable = false)
    private NavigationItem parent;
}