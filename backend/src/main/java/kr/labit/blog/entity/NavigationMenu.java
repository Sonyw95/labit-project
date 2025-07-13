package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table( name = "LAB_NAVIGATION")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NavigationMenu {

    @Id
    @GeneratedValue( strategy = GenerationType.SEQUENCE, generator = "nav_seq")
    @SequenceGenerator( name = "nav_seq", sequenceName = "NAVIGATION_MENU_SEQ", allocationSize = 1)
    @Column( name = "MENU_ID" )
    private Long id;

    @Column( name = "LABEL", nullable = false, length = 100 )
    private String label;

    @Column( name = "PATH", length = 200 )
    private String path;

    @Column( name = "ICON", length = 100 )
    private String icon;

    @Column( name = "DESCRIPTION", length = 500 )
    private String description;

    @Column( name = "SROT_ORDER", nullable = false )
    private Integer sortOrder;

    @Column( name = "PARENT_ID" )
    private Long parentId;

    @Column( name = "IS_ACTIVE", nullable = false )
    @Builder.Default
    private Boolean isActive;

    @Column( name = "IS_VISIBLE", nullable = false )
    @Builder.Default
    private Boolean isVisible;

    @Column( name = "REQUIRED_ROLE", length = 50 )
    private String requiredRole;

    @CreationTimestamp
    @Column( name ="CREATE_AT" )
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column( name ="UPDATE_AT" )
    private LocalDateTime updateAt;


    // 하위 메뉴 매핑
    @OneToMany( fetch = FetchType.LAZY )
    @JoinColumn( name = "PARENT_ID" )
    @OrderBy("sortOrder ASC")
    private List<NavigationMenu> children;

}
