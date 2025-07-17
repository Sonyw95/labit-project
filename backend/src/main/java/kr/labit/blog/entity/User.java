package kr.labit.blog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "LAB_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USER_SEQ")
    @SequenceGenerator(name = "USER_SEQ", sequenceName = "SEQ_LAB_USER", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "KAKAO_ID", unique = true, nullable = false, length = 50)
    private String kakaoId;

    @Column(name = "EMAIL", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "NICKNAME", nullable = false, length = 100)
    private String nickname;

    @Column(name = "PROFILE_IMAGE", length = 500)
    private String profileImage;

    @Column(name = "THUMBNAIL_IMAGE", length = 500)
    private String thumbnailImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "USER_ROLE", length = 20)
    @Builder.Default
    private UserRole userRole = UserRole.USER;

    @Column(name = "IS_ACTIVE", length = 1)
    @Builder.Default
    private char isActive = 'Y';

    @Column(name = "LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

    @CreatedDate
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public enum UserRole {
        USER, ADMIN
    }

    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return "Y".equals(this.isActive);
    }
}