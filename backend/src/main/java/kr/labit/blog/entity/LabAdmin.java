package kr.labit.blog.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "LAB_ADMIN")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LAB_ADMIN_SEQ")
    @SequenceGenerator(name = "LAB_ADMIN_SEQ", sequenceName = "LAB_ADMIN_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String role;

    @Column(columnDefinition = "CLOB")
    private String bio;

    @Column(name = "PROFILE_IMAGE", length = 500)
    private String profileImage;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "GITHUB_URL", length = 200)
    private String githubUrl;

    @Column(name = "TOTAL_VIEWS")
    @Builder.Default
    private Long totalViews = 0L;

    @Column(name = "START_YEAR")
    private Integer startYear;

    @Column(name = "IS_ACTIVE")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
