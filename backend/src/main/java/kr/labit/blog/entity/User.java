package kr.labit.blog.entity;

import jakarta.persistence.*;
import kr.labit.blog.dto.KakaoUserInfoDto;
import kr.labit.blog.dto.UserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "LAB_USERS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String nickname;

    @Column(name = "PROFILE_IMAGE_URL")
    private String profileImageUrl;

    @Column
    private String provider;

    @Column(name = "PROVIDER_ID")
    private String providerId;

    @Column(nullable = false)
    private String role;

    @Column(name = "IS_ACTIVE")
    private Boolean isActive;

    @Column(name = "CREATE_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATE_AT")
    private LocalDateTime updatedAt;

    @Column(name = "LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // UserDetails 구현
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return null; // OAuth 사용자는 패스워드 없음
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    // 카카오 정보 업데이트
    public void updateKakaoInfo(KakaoUserInfoDto kakaoUserInfo) {
        this.nickname = kakaoUserInfo.getKakaoAccount().getProfile().getNickname();
        this.profileImageUrl = kakaoUserInfo.getKakaoAccount().getProfile().getProfileImageUrl();
        this.lastLoginAt = LocalDateTime.now();
    }

    // UserInfoDto 변환
    public UserInfoDto toUserInfoDto() {
        return UserInfoDto.builder()
                .id(this.id)
                .email(this.email)
                .nickname(this.nickname)
                .profileImageUrl(this.profileImageUrl)
                .role(this.role)
                .isActive(this.isActive)
                .build();
    }
}