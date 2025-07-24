package kr.labit.blog.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.labit.blog.dto.dashboard.ActivityLogDto;
import kr.labit.blog.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Dashboard", description = "관리자 대시보드 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
public class DashboardController {

    private DashboardService dashboardService;

//    @GetMapping("/stats")
//    @Operation(summary = "대시보드 통계 조회", description = "사용자, 포스트, 에셋, 조회수 등의 통계를 조회합니다.")
//    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
//        log.info("대시보드 통계 조회 요청");
//
//        DashboardStatsDto stats = dashboardService.getDashboardStats();
//
//        return ResponseEntity.ok(stats);
//    }

//    @GetMapping("/system-status")
//    @Operation(summary = "시스템 상태 조회", description = "시스템의 현재 상태와 리소스 사용량을 조회합니다.")
//    @PreAuthorize("hasRole('SUPER_ADMIN')")
//    public ResponseEntity<SystemStatusDto> getSystemStatus() {
//        log.info("시스템 상태 조회 요청");
//
//        SystemStatusDto systemStatus = dashboardService.getSystemStatus();
//
//        return ResponseEntity.ok(systemStatus);
//    }

    @GetMapping("/activity-logs")
    @Operation(summary = "최근 활동 로그 조회", description = "최근 관리자 활동 로그를 조회합니다.")
    public ResponseEntity<List<ActivityLogDto>> getRecentActivityLogs(
            @Parameter(description = "조회할 로그 개수") @RequestParam(defaultValue = "10") int limit) {

        log.info("최근 활동 로그 조회 요청: limit={}", limit);

        List<ActivityLogDto> activityLogs = dashboardService.getRecentActivityLogs(limit);

        return ResponseEntity.ok(activityLogs);
    }

//    @PostMapping("/cache/clear")
//    @Operation(summary = "캐시 초기화", description = "시스템 캐시를 초기화합니다.")
//    @PreAuthorize("hasRole('SUPER_ADMIN')")
//    public ResponseEntity<String> clearCache() {
//        log.info("캐시 초기화 요청");
//
//        dashboardService.clearAllCaches();
//
//        return ResponseEntity.ok("캐시가 성공적으로 초기화되었습니다.");
//    }
//
//    @GetMapping("/health-check")
//    @Operation(summary = "시스템 헬스 체크", description = "시스템의 전반적인 건강 상태를 확인합니다.")
//    public ResponseEntity<String> healthCheck() {
//        log.info("시스템 헬스 체크 요청");
//
//        boolean isHealthy = dashboardService.performHealthCheck();
//
//        if (isHealthy) {
//            return ResponseEntity.ok("시스템이 정상적으로 작동 중입니다.");
//        } else {
//            return ResponseEntity.status(503).body("시스템에 문제가 있습니다.");
//        }
//    }
}
