package kr.labit.blog.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.labit.blog.entity.LabActivityLog;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.repository.LabActivityLogRepository;
import kr.labit.blog.repository.LabUsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityLogService {

    private final LabActivityLogRepository activityLogRepository;
    private final LabUsersRepository usersRepository;

    /**
     * 활동 로그 기록 (비동기)
     */
    @Async
    @Transactional
    public void logActivity(String action, String description, String status, String resourceType, Long resourceId) {
        try {
            LabUsers currentUser = getCurrentUser();
            HttpServletRequest request = getCurrentRequest();

            LabActivityLog activityLog = LabActivityLog.builder()
                    .user(currentUser)
                    .action(action)
                    .description(description)
                    .status(status)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .ipAddress(getClientIpAddress(request))
                    .userAgent(getUserAgent(request))
                    .build();

            activityLogRepository.save(activityLog);
            log.info("활동 로그 기록: {}", action);

        } catch (Exception e) {
            log.error("활동 로그 기록 중 오류 발생", e);
        }
    }

    /**
     * 상세 활동 로그 기록 (변경 전후 값 포함)
     */
    @Async
    @Transactional
    public void logActivityWithValues(String action, String description, String status,
                                      String resourceType, Long resourceId, String oldValue, String newValue) {
        try {
            LabUsers currentUser = getCurrentUser();
            HttpServletRequest request = getCurrentRequest();

            LabActivityLog activityLog = LabActivityLog.builder()
                    .user(currentUser)
                    .action(action)
                    .description(description)
                    .status(status)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .ipAddress(getClientIpAddress(request))
                    .userAgent(getUserAgent(request))
                    .build();

            activityLogRepository.save(activityLog);
            log.info("상세 활동 로그 기록: {}", action);

        } catch (Exception e) {
            log.error("상세 활동 로그 기록 중 오류 발생", e);
        }
    }

    // 헬퍼 메소드들

    private LabUsers getCurrentUser() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!"anonymousUser".equals(username)) {
                return usersRepository.findByEmail(username).orElse(null);
            }
        } catch (Exception e) {
            log.info("현재 사용자 정보를 가져올 수 없습니다", e);
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            return attributes.getRequest();
        } catch (Exception e) {
            log.info("현재 요청 정보를 가져올 수 없습니다", e);
            return null;
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    private String getUserAgent(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        return request.getHeader("User-Agent");
    }
}