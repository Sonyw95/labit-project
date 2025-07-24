package kr.labit.blog.service;

import kr.labit.blog.dto.dashboard.ActivityLogDto;
import kr.labit.blog.dto.dashboard.DashboardStatsDto;
import kr.labit.blog.dto.dashboard.SystemStatusDto;
import kr.labit.blog.entity.LabActivityLog;
import kr.labit.blog.repository.LabActivityLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.OperatingSystemMXBean;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardService {

    private final LabActivityLogRepository activityLogRepository;
//
//    private final CacheManager cacheManager;
//
//    private final DataSource dataSource;

    /**
     * 대시보드 통계 조회
     */
//    @Cacheable(value = "dashboardStats", unless = "#result == null")
//    public DashboardStatsDto getDashboardStats() {
//        log.info("대시보드 통계 조회");
//
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime monthAgo = now.minusMonths(1);
//        LocalDateTime today = now.toLocalDate().atStartOfDay();
//
//        try {
//            // 사용자 통계
//            Long totalUsers = usersRepository.count();
//            Long lastMonthUsers = usersRepository.countByCreatedDateBefore(monthAgo);
//            Long newUsersToday = usersRepository.countByCreatedDateAfter(today);
//            Long activeUsersToday = usersRepository.countActiveUsersToday();
//            Double userGrowth = calculateGrowthRate(totalUsers, lastMonthUsers);
//
//            // 포스트 통계
//            Long totalPosts = postRepository.count();
//            Long lastMonthPosts = postRepository.countByCreatedDateBefore(monthAgo);
//            Long newPostsToday = postRepository.countByCreatedDateAfter(today);
//            Long publishedPostsToday = postRepository.countPublishedToday();
//            Double postGrowth = calculateGrowthRate(totalPosts, lastMonthPosts);
//
//            // 에셋 통계
//            Long totalAssets = assetRepository.countByType("file");
//            Long lastMonthAssets = assetRepository.countByTypeAndCreatedDateBefore("file", monthAgo);
//            Long totalAssetSize = assetRepository.sumSizeByType("file");
//            Long uploadedAssetsToday = assetRepository.countByTypeAndCreatedDateAfter("file", today);
//            Double assetGrowth = calculateGrowthRate(totalAssets, lastMonthAssets);
//
//            // 조회수 통계 (임시 데이터 - 실제로는 별도 테이블에서 조회)
//            Long totalViews = 45678L; // postRepository.sumAllViews();
//            Long todayViews = 1234L; // postRepository.sumViewsToday();
//            Long uniqueViewsToday = 987L; // postRepository.sumUniqueViewsToday();
//            Double viewGrowth = 15.7; // calculateViewGrowth();
//
//            return DashboardStatsDto.builder()
//                    .users(DashboardStatsDto.UserStats.builder()
//                            .total(totalUsers)
//                            .growth(userGrowth)
//                            .newToday(newUsersToday)
//                            .activeToday(activeUsersToday)
//                            .build())
//                    .posts(DashboardStatsDto.PostStats.builder()
//                            .total(totalPosts)
//                            .growth(postGrowth)
//                            .newToday(newPostsToday)
//                            .publishedToday(publishedPostsToday)
//                            .build())
//                    .assets(DashboardStatsDto.AssetStats.builder()
//                            .total(totalAssets)
//                            .growth(assetGrowth)
//                            .totalSize(totalAssetSize != null ? totalAssetSize : 0L)
//                            .uploadedToday(uploadedAssetsToday)
//                            .build())
//                    .views(DashboardStatsDto.ViewStats.builder()
//                            .total(totalViews)
//                            .growth(viewGrowth)
//                            .today(todayViews)
//                            .uniqueToday(uniqueViewsToday)
//                            .build())
//                    .build();
//
//        } catch (Exception e) {
//            log.error("대시보드 통계 조회 중 오류 발생", e);
//            return createDefaultStats();
//        }
//    }

    /**
     * 시스템 상태 조회
     */
//    public SystemStatusDto getSystemStatus() {
//        log.info("시스템 상태 조회");
//
//        try {
//            // 전체 시스템 상태 판단
//            String overallStatus = "healthy";
//
//            // 서비스 상태 체크
//            List<SystemStatusDto.ServiceStatus> services = List.of(
//                    checkDatabaseStatus(),
//                    checkCacheStatus(),
//                    checkFileSystemStatus(),
//                    checkMemoryStatus()
//            );
//
//            // 하나라도 error가 있으면 전체 상태를 error로
//            boolean hasError = services.stream().anyMatch(s -> "error".equals(s.getStatus()));
//            boolean hasWarning = services.stream().anyMatch(s -> "warning".equals(s.getStatus()));
//
//            if (hasError) {
//                overallStatus = "error";
//            } else if (hasWarning) {
//                overallStatus = "warning";
//            }
//
//            // 리소스 사용량
//            SystemStatusDto.ResourceUsage resources = getResourceUsage();
//
//            // 데이터베이스 상태
//            SystemStatusDto.DatabaseStatus database = getDatabaseStatus();
//
//            return SystemStatusDto.builder()
//                    .status(overallStatus)
//                    .services(services)
//                    .resources(resources)
//                    .database(database)
//                    .build();
//
//        } catch (Exception e) {
//            log.error("시스템 상태 조회 중 오류 발생", e);
//            return createDefaultSystemStatus();
//        }
//    }

    /**
     * 최근 활동 로그 조회
     */
    public List<ActivityLogDto> getRecentActivityLogs(int limit) {
        log.info("최근 활동 로그 조회: limit={}", limit);

        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdDate"));
        List<LabActivityLog> logs = activityLogRepository.findRecentLogs(pageRequest);

        return logs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

//    /**
//     * 모든 캐시 초기화
//     */
//    @Transactional
//    public void clearAllCaches() {
//        log.info("모든 캐시 초기화");
//
//        cacheManager.getCacheNames().forEach(cacheName -> {
//            cacheManager.getCache(cacheName).clear();
//            log.debug("캐시 초기화: {}", cacheName);
//        });
//    }
//
//    /**
//     * 시스템 헬스 체크
//     */
//    public boolean performHealthCheck() {
//        log.info("시스템 헬스 체크 수행");
//
//        try {
//            // 데이터베이스 연결 테스트
//            try (Connection conn = dataSource.getConnection()) {
//                boolean isValid = conn.isValid(5); // 5초 타임아웃
//                if (!isValid) {
//                    log.warn("데이터베이스 연결이 유효하지 않습니다");
//                    return false;
//                }
//            }
//
//            // 메모리 사용량 체크 (90% 이상이면 경고)
//            MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
//            long usedMemory = memoryBean.getHeapMemoryUsage().getUsed();
//            long maxMemory = memoryBean.getHeapMemoryUsage().getMax();
//            double memoryUsage = (double) usedMemory / maxMemory * 100;
//
//            if (memoryUsage > 90) {
//                log.warn("메모리 사용량이 높습니다: {}%", memoryUsage);
//                return false;
//            }
//
//            // 캐시 매니저 상태 체크
//            if (cacheManager == null) {
//                log.warn("캐시 매니저를 사용할 수 없습니다");
//                return false;
//            }
//
//            return true;
//
//        } catch (Exception e) {
//            log.error("헬스 체크 중 오류 발생", e);
//            return false;
//        }
//    }

    // 헬퍼 메소드들

    private Double calculateGrowthRate(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((double) (current - previous) / previous) * 100;
    }

    private DashboardStatsDto createDefaultStats() {
        return DashboardStatsDto.builder()
                .users(DashboardStatsDto.UserStats.builder().total(0L).growth(0.0).newToday(0L).activeToday(0L).build())
                .posts(DashboardStatsDto.PostStats.builder().total(0L).growth(0.0).newToday(0L).publishedToday(0L).build())
                .assets(DashboardStatsDto.AssetStats.builder().total(0L).growth(0.0).totalSize(0L).uploadedToday(0L).build())
                .views(DashboardStatsDto.ViewStats.builder().total(0L).growth(0.0).today(0L).uniqueToday(0L).build())
                .build();
    }

    private SystemStatusDto createDefaultSystemStatus() {
        return SystemStatusDto.builder()
                .status("unknown")
                .services(List.of())
                .resources(SystemStatusDto.ResourceUsage.builder()
                        .cpu(0).memory(0).disk(0).network(0)
                        .diskSpace("알 수 없음").memoryUsage("알 수 없음").build())
                .database(SystemStatusDto.DatabaseStatus.builder()
                        .status("unknown").connectionCount(0).maxConnections(0)
                        .responseTime(0.0).version("알 수 없음").build())
                .build();
    }

//    private SystemStatusDto.ServiceStatus checkDatabaseStatus() {
//        try (Connection conn = dataSource.getConnection()) {
//            long startTime = System.currentTimeMillis();
//            boolean isValid = conn.isValid(5);
//            long responseTime = System.currentTimeMillis() - startTime;
//
//            return SystemStatusDto.ServiceStatus.builder()
//                    .name("Database")
//                    .status(isValid ? "healthy" : "error")
//                    .uptime("99.9%") // 실제로는 별도 모니터링 시스템에서 가져와야 함
//                    .lastChecked(LocalDateTime.now().toString())
//                    .errorMessage(isValid ? null : "데이터베이스 연결 실패")
//                    .build();
//        } catch (Exception e) {
//            return SystemStatusDto.ServiceStatus.builder()
//                    .name("Database")
//                    .status("error")
//                    .uptime("0%")
//                    .lastChecked(LocalDateTime.now().toString())
//                    .errorMessage(e.getMessage())
//                    .build();
//        }
//    }
//
//    private SystemStatusDto.ServiceStatus checkCacheStatus() {
//        try {
//            if (cacheManager != null && !cacheManager.getCacheNames().isEmpty()) {
//                return SystemStatusDto.ServiceStatus.builder()
//                        .name("Cache")
//                        .status("healthy")
//                        .uptime("100%")
//                        .lastChecked(LocalDateTime.now().toString())
//                        .build();
//            } else {
//                return SystemStatusDto.ServiceStatus.builder()
//                        .name("Cache")
//                        .status("warning")
//                        .uptime("50%")
//                        .lastChecked(LocalDateTime.now().toString())
//                        .errorMessage("캐시 매니저를 사용할 수 없습니다")
//                        .build();
//            }
//        } catch (Exception e) {
//            return SystemStatusDto.ServiceStatus.builder()
//                    .name("Cache")
//                    .status("error")
//                    .uptime("0%")
//                    .lastChecked(LocalDateTime.now().toString())
//                    .errorMessage(e.getMessage())
//                    .build();
//        }
//    }

    private SystemStatusDto.ServiceStatus checkFileSystemStatus() {
        try {
            java.io.File rootDir = new java.io.File("/");
            long totalSpace = rootDir.getTotalSpace();
            long freeSpace = rootDir.getFreeSpace();
            double usagePercent = ((double) (totalSpace - freeSpace) / totalSpace) * 100;

            String status = usagePercent > 90 ? "error" : usagePercent > 80 ? "warning" : "healthy";

            return SystemStatusDto.ServiceStatus.builder()
                    .name("File System")
                    .status(status)
                    .uptime("99.8%")
                    .lastChecked(LocalDateTime.now().toString())
                    .errorMessage(usagePercent > 90 ? "디스크 공간 부족" : null)
                    .build();
        } catch (Exception e) {
            return SystemStatusDto.ServiceStatus.builder()
                    .name("File System")
                    .status("error")
                    .uptime("0%")
                    .lastChecked(LocalDateTime.now().toString())
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    private SystemStatusDto.ServiceStatus checkMemoryStatus() {
        try {
            MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
            long usedMemory = memoryBean.getHeapMemoryUsage().getUsed();
            long maxMemory = memoryBean.getHeapMemoryUsage().getMax();
            double memoryUsage = (double) usedMemory / maxMemory * 100;

            String status = memoryUsage > 90 ? "error" : memoryUsage > 80 ? "warning" : "healthy";

            return SystemStatusDto.ServiceStatus.builder()
                    .name("Memory")
                    .status(status)
                    .uptime("100%")
                    .lastChecked(LocalDateTime.now().toString())
                    .errorMessage(memoryUsage > 90 ? "메모리 사용량 과다" : null)
                    .build();
        } catch (Exception e) {
            return SystemStatusDto.ServiceStatus.builder()
                    .name("Memory")
                    .status("error")
                    .uptime("0%")
                    .lastChecked(LocalDateTime.now().toString())
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    private SystemStatusDto.ResourceUsage getResourceUsage() {
        try {
            OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
            MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();

            // CPU 사용률 (간단한 방식)
            double cpuUsage = osBean.getSystemLoadAverage() * 100 / osBean.getAvailableProcessors();
            int cpu = Math.max(0, Math.min(100, (int) cpuUsage));

            // 메모리 사용률
            long usedMemory = memoryBean.getHeapMemoryUsage().getUsed();
            long maxMemory = memoryBean.getHeapMemoryUsage().getMax();
            int memory = (int) ((double) usedMemory / maxMemory * 100);

            // 디스크 사용률
            java.io.File rootDir = new java.io.File("/");
            long totalSpace = rootDir.getTotalSpace();
            long freeSpace = rootDir.getFreeSpace();
            int disk = (int) (((double) (totalSpace - freeSpace) / totalSpace) * 100);

            // 포맷된 문자열
            String diskSpace = String.format("%.2f GB / %.2f GB",
                    (totalSpace - freeSpace) / (1024.0 * 1024.0 * 1024.0),
                    totalSpace / (1024.0 * 1024.0 * 1024.0));
            String memoryUsage = String.format("%.2f MB / %.2f MB",
                    usedMemory / (1024.0 * 1024.0),
                    maxMemory / (1024.0 * 1024.0));

            return SystemStatusDto.ResourceUsage.builder()
                    .cpu(cpu)
                    .memory(memory)
                    .disk(disk)
                    .network(12) // 임시값 - 실제로는 네트워크 모니터링 필요
                    .diskSpace(diskSpace)
                    .memoryUsage(memoryUsage)
                    .build();

        } catch (Exception e) {
            log.error("리소스 사용량 조회 중 오류 발생", e);
            return SystemStatusDto.ResourceUsage.builder()
                    .cpu(0).memory(0).disk(0).network(0)
                    .diskSpace("알 수 없음").memoryUsage("알 수 없음")
                    .build();
        }
    }

//    private SystemStatusDto.DatabaseStatus getDatabaseStatus() {
//        try (Connection conn = dataSource.getConnection()) {
//            DatabaseMetaData metaData = conn.getMetaData();
//
//            long startTime = System.currentTimeMillis();
//            conn.isValid(1);
//            double responseTime = System.currentTimeMillis() - startTime;
//
//            return SystemStatusDto.DatabaseStatus.builder()
//                    .status("healthy")
//                    .connectionCount(10) // 실제로는 커넥션 풀에서 가져와야 함
//                    .maxConnections(100) // 실제로는 설정에서 가져와야 함
//                    .responseTime(responseTime)
//                    .version(metaData.getDatabaseProductVersion())
//                    .build();
//
//        } catch (Exception e) {
//            log.error("데이터베이스 상태 조회 중 오류 발생", e);
//            return SystemStatusDto.DatabaseStatus.builder()
//                    .status("error")
//                    .connectionCount(0)
//                    .maxConnections(0)
//                    .responseTime(0.0)
//                    .version("알 수 없음")
//                    .build();
//        }
//    }

    private ActivityLogDto convertToDto(LabActivityLog log) {
        return ActivityLogDto.builder()
                .id(log.getId())
                .user(log.getUser() != null ? log.getUser().getNickname() : "시스템")
                .userId(log.getUser() != null ? log.getUser().getId().toString() : null)
                .action(log.getAction())
                .description(log.getDescription())
                .status(log.getStatus())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .timestamp(log.getCreatedDate())
                .resourceType(log.getResourceType())
                .resourceId(log.getResourceId())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .build();
    }
}
