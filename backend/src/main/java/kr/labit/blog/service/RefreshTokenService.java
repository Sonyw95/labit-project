package kr.labit.blog.service;

//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
public class RefreshTokenService {
//
//    private final RefreshTokenRepository refreshTokenRepository;
//    private final SecureRandom secureRandom = new SecureRandom();
//
//    @Value("${jwt.refresh-expiration:604800000}") // 7일 = 604800000ms
//    private long refreshTokenExpirationMs;
//
//    @Value("${jwt.max-tokens-per-user:5}")
//    private int maxTokensPerUser;
//
//    /**
//     * 새로운 Refresh Token 생성
//     */
//    public RefreshToken generateRefreshToken(LabUsers user, HttpServletRequest request) {
//        try {
//            // 기존 토큰 정리 (사용자당 최대 토큰 수 제한)
//            cleanupOldTokensForUser(user.getId());
//
//            // 디바이스/IP 정보로 이전 토큰들 취소 (선택사항)
//            String deviceInfo = extractDeviceInfo(request);
//            String ipAddress = extractIpAddress(request);
//
//            if (StringUtils.hasText(deviceInfo) && StringUtils.hasText(ipAddress)) {
//                refreshTokenRepository.revokePreviousTokensForDevice(user.getId(), deviceInfo, ipAddress);
//            }
//
//            // 새 토큰 생성
//            String tokenValue = generateSecureToken();
//            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000);
//
//            RefreshToken refreshToken = RefreshToken.builder()
//                    .token(tokenValue)
//                    .userId(user.getId())
//                    .expiresAt(expiresAt)
//                    .deviceInfo(deviceInfo)
//                    .ipAddress(ipAddress)
//                    .build();
//
//            RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
//
//            log.info("새 Refresh Token 생성 완료: userId={}, tokenId={}, expiresAt={}",
//                    user.getId(), savedToken.getId(), expiresAt);
//
//            return savedToken;
//
//        } catch (Exception e) {
//            log.error("Refresh Token 생성 실패: userId={}", user.getId(), e);
//            throw new RuntimeException("Refresh Token 생성에 실패했습니다.", e);
//        }
//    }
//
//    /**
//     * Refresh Token 검증 및 조회
//     */
//    @Transactional(readOnly = true)
//    public Optional<RefreshToken> validateAndGetRefreshToken(String tokenValue) {
//        if (!StringUtils.hasText(tokenValue)) {
//            return Optional.empty();
//        }
//
//        try {
//            Optional<RefreshToken> tokenOptional = refreshTokenRepository
//                    .findValidTokenByToken(tokenValue, LocalDateTime.now());
//
//            if (tokenOptional.isPresent()) {
//                RefreshToken token = tokenOptional.get();
//
//                // 사용 시간 업데이트 (비동기로 처리 가능)
//                updateLastUsedAt(token.getToken());
//
//                log.debug("Refresh Token 검증 성공: tokenId={}, userId={}",
//                        token.getId(), token.getUserId());
//
//                return tokenOptional;
//            } else {
//                log.debug("유효하지 않은 Refresh Token: {}", tokenValue.substring(0, Math.min(tokenValue.length(), 10)) + "...");
//                return Optional.empty();
//            }
//
//        } catch (Exception e) {
//            log.error("Refresh Token 검증 중 오류 발생", e);
//            return Optional.empty();
//        }
//    }
//
//    /**
//     * Refresh Token 갱신 (Rotating Refresh Token)
//     */
//    public RefreshToken rotateRefreshToken(RefreshToken oldToken, HttpServletRequest request) {
//        try {
//            // 기존 토큰 취소
//            oldToken.revoke();
//            refreshTokenRepository.save(oldToken);
//
//            // 새 토큰 생성 (사용자 정보는 oldToken에서 가져옴)
//            LabUsers user = oldToken.getUser();
//            RefreshToken newToken = generateRefreshToken(user, request);
//
//            log.info("Refresh Token 회전 완료: userId={}, oldTokenId={}, newTokenId={}",
//                    user.getId(), oldToken.getId(), newToken.getId());
//
//            return newToken;
//
//        } catch (Exception e) {
//            log.error("Refresh Token 회전 실패: oldTokenId={}", oldToken.getId(), e);
//            throw new RuntimeException("Refresh Token 회전에 실패했습니다.", e);
//        }
//    }
//
//    /**
//     * 사용자의 모든 Refresh Token 취소 (로그아웃)
//     */
//    public void revokeAllUserTokens(Long userId) {
//        try {
//            int revokedCount = refreshTokenRepository.revokeAllTokensByUserId(userId);
//            log.info("사용자의 모든 Refresh Token 취소 완료: userId={}, revokedCount={}", userId, revokedCount);
//        } catch (Exception e) {
//            log.error("Refresh Token 취소 실패: userId={}", userId, e);
//            throw new RuntimeException("Refresh Token 취소에 실패했습니다.", e);
//        }
//    }
//
//    /**
//     * 특정 Refresh Token 취소
//     */
//    public void revokeRefreshToken(String tokenValue) {
//        try {
//            Optional<RefreshToken> tokenOptional = refreshTokenRepository
//                    .findValidTokenByToken(tokenValue, LocalDateTime.now());
//
//            if (tokenOptional.isPresent()) {
//                RefreshToken token = tokenOptional.get();
//                token.revoke();
//                refreshTokenRepository.save(token);
//                log.info("Refresh Token 취소 완료: tokenId={}", token.getId());
//            }
//        } catch (Exception e) {
//            log.error("Refresh Token 취소 실패", e);
//        }
//    }
//
//    /**
//     * 사용자별 유효한 토큰 개수 조회
//     */
//    @Transactional(readOnly = true)
//    public long countValidTokensByUser(Long userId) {
//        return refreshTokenRepository.countValidTokensByUserId(userId, LocalDateTime.now());
//    }
//
//    /**
//     * 사용자의 오래된 토큰들 정리
//     */
//    private void cleanupOldTokensForUser(Long userId) {
//        try {
//            int deletedCount = refreshTokenRepository.deleteOldTokensForUser(
//                    userId, maxTokensPerUser, LocalDateTime.now());
//
//            if (deletedCount > 0) {
//                log.info("사용자의 오래된 토큰 정리 완료: userId={}, deletedCount={}", userId, deletedCount);
//            }
//        } catch (Exception e) {
//            log.warn("사용자 토큰 정리 중 오류 발생: userId={}", userId, e);
//        }
//    }
//
//    /**
//     * 마지막 사용 시간 업데이트
//     */
//    private void updateLastUsedAt(String tokenValue) {
//        try {
//            refreshTokenRepository.updateLastUsedAt(tokenValue, LocalDateTime.now());
//        } catch (Exception e) {
//            log.warn("토큰 사용 시간 업데이트 실패", e);
//        }
//    }
//
//    /**
//     * 안전한 토큰 값 생성
//     */
//    private String generateSecureToken() {
//        byte[] tokenBytes = new byte[64]; // 512비트
//        secureRandom.nextBytes(tokenBytes);
//        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
//    }
//
//    /**
//     * HTTP 요청에서 디바이스 정보 추출
//     */
//    private String extractDeviceInfo(HttpServletRequest request) {
//        String userAgent = request.getHeader("User-Agent");
//        if (StringUtils.hasText(userAgent)) {
//            // User-Agent를 간략화 (길이 제한)
//            return userAgent.length() > 500 ? userAgent.substring(0, 500) : userAgent;
//        }
//        return "Unknown Device";
//    }
//
//    /**
//     * HTTP 요청에서 IP 주소 추출
//     */
//    private String extractIpAddress(HttpServletRequest request) {
//        String[] headerNames = {
//                "X-Forwarded-For",
//                "X-Real-IP",
//                "Proxy-Client-IP",
//                "WL-Proxy-Client-IP",
//                "HTTP_X_FORWARDED_FOR",
//                "HTTP_X_FORWARDED",
//                "HTTP_X_CLUSTER_CLIENT_IP",
//                "HTTP_CLIENT_IP",
//                "HTTP_FORWARDED_FOR",
//                "HTTP_FORWARDED",
//                "HTTP_VIA",
//                "REMOTE_ADDR"
//        };
//
//        for (String headerName : headerNames) {
//            String ip = request.getHeader(headerName);
//            if (StringUtils.hasText(ip) && !"unknown".equalsIgnoreCase(ip)) {
//                // 첫 번째 IP 주소 반환 (프록시 체인의 경우)
//                if (ip.contains(",")) {
//                    ip = ip.split(",")[0].trim();
//                }
//                return ip;
//            }
//        }
//
//        return request.getRemoteAddr();
//    }
//
//    /**
//     * 만료된 토큰들 정리 (스케줄 작업)
//     * 매일 새벽 2시에 실행
//     */
//    @Scheduled(cron = "0 0 2 * * ?")
//    public void cleanupExpiredTokens() {
//        try {
//            log.info("만료된 Refresh Token 정리 작업 시작");
//
//            LocalDateTime cutoffTime = LocalDateTime.now().minusDays(1); // 1일전 만료된 토큰들
//            int deletedCount = refreshTokenRepository.deleteExpiredTokens(cutoffTime);
//
//            log.info("만료된 Refresh Token 정리 완료: deletedCount={}", deletedCount);
//        } catch (Exception e) {
//            log.error("만료된 토큰 정리 작업 실패", e);
//        }
//    }
//
//    /**
//     * 취소되거나 만료된 토큰들 정리 (스케줄 작업)
//     * 매주 월요일 새벽 3시에 실행
//     */
//    @Scheduled(cron = "0 0 3 * * MON")
//    public void cleanupInvalidTokens() {
//        try {
//            log.info("무효한 Refresh Token 정리 작업 시작");
//
//            int deletedCount = refreshTokenRepository.deleteInvalidTokens(LocalDateTime.now());
//
//            log.info("무효한 Refresh Token 정리 완료: deletedCount={}", deletedCount);
//        } catch (Exception e) {
//            log.error("무효한 토큰 정리 작업 실패", e);
//        }
//    }
}