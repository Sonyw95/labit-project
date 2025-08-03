package kr.labit.blog.security.jwt;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtBlacklistService {

    private final JwtTokenProvider jwtTokenProvider;

    // 메모리 기반 블랙리스트 (운영환경에서는 Redis 사용 권장)
    private final ConcurrentHashMap<String, LocalDateTime> blacklistedTokens = new ConcurrentHashMap<>();

    // 정기적으로 만료된 토큰을 정리하는 스케줄러
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @PostConstruct
    private void init() {
        // 1시간마다 만료된 토큰들을 정리
        scheduler.scheduleAtFixedRate(this::cleanupExpiredTokens, 1, 1, TimeUnit.HOURS);
        log.info("JWT 블랙리스트 서비스 초기화 완료");
    }


    /**
     * 토큰을 블랙리스트에 추가
     */
    public void addToBlacklist(String token) {
        if (token == null || token.trim().isEmpty()) {
            return;
        }

        try {
            // 토큰의 만료시간을 가져와서 함께 저장
            LocalDateTime expirationTime = jwtTokenProvider.getExpirationDateFromToken(token);
            blacklistedTokens.put(token, expirationTime);

            log.info("토큰이 블랙리스트에 추가됨: {}...{}",
                    token.substring(0, Math.min(10, token.length())),
                    token.length() > 10 ? token.substring(token.length() - 10) : "");

        } catch (Exception e) {
            log.warn("토큰 블랙리스트 추가 실패", e);
        }
    }

    /**
     * 토큰이 블랙리스트에 있는지 확인
     */
    public boolean isBlacklisted(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        return blacklistedTokens.containsKey(token);
    }

    /**
     * 만료된 토큰들을 블랙리스트에서 제거
     */
    private void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        int beforeSize = blacklistedTokens.size();

        blacklistedTokens.entrySet().removeIf(entry ->
                entry.getValue().isBefore(now)
        );

        int afterSize = blacklistedTokens.size();
        int removedCount = beforeSize - afterSize;

        if (removedCount > 0) {
            log.info("만료된 블랙리스트 토큰 {} 개 정리 완료 (남은 토큰: {}개)", removedCount, afterSize);
        }
    }

    /**
     * 사용자의 모든 토큰을 블랙리스트에 추가 (모든 기기에서 로그아웃)
     */
    public void addUserTokensToBlacklist(Long userId, String currentToken) {
        // 현재 토큰만 블랙리스트에 추가
        // 향후 사용자별 토큰 관리 시스템이 있다면 모든 토큰을 무효화할 수 있음
        if (currentToken != null) {
            addToBlacklist(currentToken);
        }

        log.info("사용자 {}의 토큰이 블랙리스트에 추가됨", userId);
    }

    /**
     * 블랙리스트 상태 조회 (모니터링용)
     */
    public int getBlacklistSize() {
        return blacklistedTokens.size();
    }

    /**
     * 블랙리스트 전체 정리 (관리자용)
     */
    public void clearBlacklist() {
        int size = blacklistedTokens.size();
        blacklistedTokens.clear();
        log.info("블랙리스트 전체 정리 완료: {} 개 토큰 제거", size);
    }
}