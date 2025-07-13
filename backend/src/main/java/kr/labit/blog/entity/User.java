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
@Table( name = "LABUSER" )
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "USER_SEQ", allocationSize = 1)
    @Column(name = "USER_ID")
    private Long id;

    @Column(name = "KAKAO_ID", unique = true)
    private String kakaoId;

    @Column(name = "EMAIL", length = 200)
    private String email;

    @Column(name = "NICKNAME", nullable = false, length = 100)
    private String nickname;

    @Column(name = "PROFILE_IMAGE_URL", length = 500)
    private String profileImageUrl;

    @Column(name = "ROLE", nullable = false, length = 20)
    @Builder.Default
    private String role = "USER";

    @Column(name = "IS_ACTIVE", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "REFRESH_TOKEN", length = 500)
    private String refreshToken;

    @Column(name = "KAKAO_ACCESS_TOKEN", length = 500)
    private String kakaoAccessToken;

    @Column(name = "LAST_LOGIN_AT")
    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}