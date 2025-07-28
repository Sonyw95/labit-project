package kr.labit.blog.entity;

//@Entity
//@Table(name = "refresh_tokens", indexes = {
//        @Index(name = "idx_refresh_tokens_token", columnList = "token"),
//        @Index(name = "idx_refresh_tokens_user_id", columnList = "user_id"),
//        @Index(name = "idx_refresh_tokens_expires_at", columnList = "expires_at")
//})
//@Getter
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
//@AllArgsConstructor(access = AccessLevel.PRIVATE)
//@Builder
public class RefreshToken {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "token", nullable = false, unique = true, length = 500)
//    private String token;
//
//    @Column(name = "user_id", nullable = false)
//    private Long userId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", insertable = false, updatable = false)
//    private LabUsers user;
//
//    @Column(name = "expires_at", nullable = false)
//    private LocalDateTime expiresAt;
//
//    @Column(name = "created_at", nullable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "last_used_at")
//    private LocalDateTime lastUsedAt;
//
//    @Column(name = "is_revoked", nullable = false)
//    @Builder.Default
//    private Boolean isRevoked = false;
//
//    @Column(name = "device_info", length = 500)
//    private String deviceInfo;
//
//    @Column(name = "ip_address", length = 45)
//    private String ipAddress;
//
//    @PrePersist
//    private void prePersist() {
//        this.createdAt = LocalDateTime.now();
//        if (this.isRevoked == null) {
//            this.isRevoked = false;
//        }
//    }
//
//    /**
//     * 토큰 만료 여부 확인
//     */
//    public boolean isExpired() {
//        return LocalDateTime.now().isAfter(this.expiresAt);
//    }
//
//    /**
//     * 토큰 취소 여부 또는 만료 여부 확인
//     */
//    public boolean isValid() {
//        return !this.isRevoked && !isExpired();
//    }
//
//    /**
//     * 토큰 취소
//     */
//    public void revoke() {
//        this.isRevoked = true;
//    }
//
//    /**
//     * 마지막 사용 시간 업데이트
//     */
//    public void updateLastUsedAt() {
//        this.lastUsedAt = LocalDateTime.now();
//    }
//
//    /**
//     * 디바이스 정보 및 IP 주소 업데이트
//     */
//    public void updateDeviceInfo(String deviceInfo, String ipAddress) {
//        this.deviceInfo = deviceInfo;
//        this.ipAddress = ipAddress;
//    }
//
//    /**
//     * 새로운 만료 시간으로 업데이트 (토큰 연장)
//     */
//    public void extendExpiration(LocalDateTime newExpiresAt) {
//        this.expiresAt = newExpiresAt;
//    }
}