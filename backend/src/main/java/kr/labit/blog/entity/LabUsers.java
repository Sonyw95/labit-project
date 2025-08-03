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

//    public void updateLastLoginDate() {
//        this.lastLoginDate = LocalDateTime.now();
//    }

    public void updateProfile(String nickname, String email, String profileImage) {
        if (nickname != null && !nickname.trim().isEmpty()) {
            this.nickname = nickname.trim();
        }
        if (email != null && !email.trim().isEmpty()) {
            this.email = email.trim();
        }
        if (profileImage != null) {
            this.profileImage = profileImage.trim().isEmpty() ? null : profileImage.trim();
        }
        this.modifiedDate = LocalDateTime.now();
    }

    /**
     * 닉네임만 업데이트
     */
    public void updateNickname(String nickname) {
        if (nickname != null && !nickname.trim().isEmpty()) {
            this.nickname = nickname.trim();
            this.modifiedDate = LocalDateTime.now();
        }
    }

    /**
     * 이메일만 업데이트
     */
    public void updateEmail(String email) {
        if (email != null && !email.trim().isEmpty()) {
            this.email = email.trim();
            this.modifiedDate = LocalDateTime.now();
        }
    }

    /**
     * 프로필 이미지만 업데이트
     */
    public void updateProfileImage(String profileImage) {
        this.profileImage = profileImage != null && profileImage.trim().isEmpty() ? null : profileImage;
        this.modifiedDate = LocalDateTime.now();
    }

    /**
     * 계정 활성화 상태 변경
     */
    public void updateActiveStatus(Boolean isActive) {
        this.isActive = isActive;
        this.modifiedDate = LocalDateTime.now();
    }

    /**
     * 사용자 역할 변경
     */
    public void updateRole(UserRole role) {
        this.role = role;
        this.modifiedDate = LocalDateTime.now();
    }

    /**
     * 마지막 로그인 시간 업데이트 (기존 메서드가 있다면 오버라이드)
     */
    public void updateLastLoginDate() {
        this.lastLoginDate = LocalDateTime.now();
        this.modifiedDate = LocalDateTime.now();
    }

    /**
     * 사용자 정보 검증
     */
    public boolean isValidForUpdate() {
        return this.id != null &&
                this.kakaoId != null &&
                this.nickname != null && !this.nickname.trim().isEmpty() &&
                this.email != null && !this.email.trim().isEmpty() &&
                this.isActive != null && this.isActive;
    }

    /**
     * 프로필 완성도 확인
     */
    public boolean isProfileComplete() {
        return this.nickname != null && !this.nickname.trim().isEmpty() &&
                this.email != null && !this.email.trim().isEmpty() &&
                this.profileImage != null && !this.profileImage.trim().isEmpty();
    }

    /**
     * 사용자 표시명 반환 (닉네임 우선, 없으면 이메일 앞부분)
     */
    public String getDisplayName() {
        if (this.nickname != null && !this.nickname.trim().isEmpty()) {
            return this.nickname;
        }
        if (this.email != null && !this.email.trim().isEmpty()) {
            int atIndex = this.email.indexOf('@');
            return atIndex > 0 ? this.email.substring(0, atIndex) : this.email;
        }
        return "사용자" + (this.id != null ? this.id : "");
    }

    /**
     * 등급별 권한 확인
     */
    public boolean canManageUsers() {
        return this.role == UserRole.SUPER_ADMIN;
    }

    public boolean canManagePosts() {
        return this.role == UserRole.ADMIN || this.role == UserRole.SUPER_ADMIN;
    }

    public boolean canCreatePosts() {
        return this.isActive && (this.role == UserRole.USER || this.role == UserRole.ADMIN || this.role == UserRole.SUPER_ADMIN);
    }

    /**
     * 소프트 딜리트 (실제 삭제 대신 비활성화)
     */
    public void softDelete() {
        this.isActive = false;
        this.modifiedDate = LocalDateTime.now();
        // 개인정보 마스킹 (선택사항)
        // this.email = "deleted_" + this.id + "@deleted.com";
        // this.nickname = "삭제된사용자" + this.id;
        // this.profileImage = null;
    }

    /**
     * 계정 복구
     */
    public void restore() {
        this.isActive = true;
        this.modifiedDate = LocalDateTime.now();
    }
}