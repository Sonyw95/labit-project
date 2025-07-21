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

@Entity
@Table(name = "LAB_USERS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Comment("사용자 정보 테이블")
public class LabUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USERS_SEQ")
    @SequenceGenerator(name = "USERS_SEQ", sequenceName = "LAB_USERS_SEQ", allocationSize = 1)
    @Comment("사용자 ID")
    private Long id;

    @Column(name = "KAKAO_ID", unique = true, nullable = false)
    @Comment("카카오 사용자 ID")
    private Long kakaoId;

    @Column(name = "EMAIL", length = 255)
    @Comment("이메일")
    private String email;

    @Column(name = "NICKNAME", nullable = false, length = 100)
    @Comment("닉네임")
    private String nickname;

    @Column(name = "PROFILE_IMAGE", length = 500)
    @Comment("프로필 이미지 URL")
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", nullable = false, length = 20)
    @Comment("사용자 역할")
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Column(name = "IS_ACTIVE", nullable = false)
    @Comment("계정 활성화 여부")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "LAST_LOGIN_DATE")
    @Comment("최근 로그인 일시")
    private LocalDateTime lastLoginDate;

    @CreatedDate
    @Column(name = "CREATED_DATE", nullable = false, updatable = false)
    @Comment("생성일시")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "MODIFIED_DATE")
    @Comment("수정일시")
    private LocalDateTime modifiedDate;

    // 편의 메서드
    public boolean isAdmin() {
        return role == UserRole.ADMIN || role == UserRole.SUPER_ADMIN;
    }

    public boolean hasRole(UserRole requiredRole) {
        return this.role.ordinal() >= requiredRole.ordinal();
    }

    public void updateLastLoginDate() {
        this.lastLoginDate = LocalDateTime.now();
    }

    public void updateProfile(String nickname, String email, String profileImage) {
        this.nickname = nickname;
        this.email = email;
        this.profileImage = profileImage;
    }
}