package kr.labit.blog.repository;


//@Repository
public interface RefreshTokenRepository
//        extends JpaRepository<RefreshToken, Long>
{

//    /**
//     * 토큰 문자열로 유효한 refresh token 조회
//     */
//    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token AND rt.isRevoked = false AND rt.expiresAt > :now")
//    Optional<RefreshToken> findValidTokenByToken(@Param("token") String token, @Param("now") LocalDateTime now);
//
//    /**
//     * 사용자 ID로 유효한 refresh token 목록 조회
//     */
//    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiresAt > :now ORDER BY rt.createdAt DESC")
//    List<RefreshToken> findValidTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
//
//    /**
//     * 사용자 ID로 모든 refresh token 조회 (만료되거나 취소된 것 포함)
//     */
//    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId ORDER BY rt.createdAt DESC")
//    List<RefreshToken> findAllTokensByUserId(@Param("userId") Long userId);
//
//    /**
//     * 사용자의 모든 refresh token 취소 (로그아웃 시 사용)
//     */
//    @Modifying
//    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.userId = :userId AND rt.isRevoked = false")
//    int revokeAllTokensByUserId(@Param("userId") Long userId);
//
//    /**
//     * 만료된 토큰들 삭제 (배치 작업용)
//     */
//    @Modifying
//    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :expiredBefore")
//    int deleteExpiredTokens(@Param("expiredBefore") LocalDateTime expiredBefore);
//
//    /**
//     * 취소되거나 만료된 토큰들 삭제 (배치 작업용)
//     */
//    @Modifying
//    @Query("DELETE FROM RefreshToken rt WHERE rt.isRevoked = true OR rt.expiresAt < :now")
//    int deleteInvalidTokens(@Param("now") LocalDateTime now);
//
//    /**
//     * 특정 사용자의 오래된 토큰들 삭제 (토큰 개수 제한용)
//     * 각 사용자당 최대 N개의 토큰만 유지
//     */
//    @Modifying
//    @Query(value = """
//        DELETE FROM refresh_tokens
//        WHERE user_id = :userId
//        AND id NOT IN (
//            SELECT * FROM (
//                SELECT id FROM refresh_tokens
//                WHERE user_id = :userId
//                AND is_revoked = false
//                AND expires_at > :now
//                ORDER BY created_at DESC
//                LIMIT :maxTokensPerUser
//            ) AS keep_tokens
//        )
//        """, nativeQuery = true)
//    int deleteOldTokensForUser(@Param("userId") Long userId, @Param("maxTokensPerUser") int maxTokensPerUser, @Param("now") LocalDateTime now);
//
//    /**
//     * 특정 디바이스/IP의 이전 토큰들 취소
//     */
//    @Modifying
//    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.userId = :userId AND rt.deviceInfo = :deviceInfo AND rt.ipAddress = :ipAddress AND rt.isRevoked = false")
//    int revokePreviousTokensForDevice(@Param("userId") Long userId, @Param("deviceInfo") String deviceInfo, @Param("ipAddress") String ipAddress);
//
//    /**
//     * 사용자별 유효한 토큰 개수 조회
//     */
//    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiresAt > :now")
//    long countValidTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
//
//    /**
//     * 특정 기간 이후 생성된 토큰들 조회 (보안 모니터링용)
//     */
//    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId AND rt.createdAt > :since ORDER BY rt.createdAt DESC")
//    List<RefreshToken> findTokensCreatedAfter(@Param("userId") Long userId, @Param("since") LocalDateTime since);
//
//    /**
//     * 토큰 사용 시간 업데이트
//     */
//    @Modifying
//    @Query("UPDATE RefreshToken rt SET rt.lastUsedAt = :lastUsedAt WHERE rt.token = :token")
//    int updateLastUsedAt(@Param("token") String token, @Param("lastUsedAt") LocalDateTime lastUsedAt);
}