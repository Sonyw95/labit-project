package kr.labit.blog.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.labit.blog.dto.NavigationResponseDto;
import kr.labit.blog.service.NavigationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Navigation", description = "네비게이션 메뉴 API")
@CrossOrigin(origins = "${app.frontend-url}", maxAge = 3600)
public class NavigationController {

    private final NavigationService navigationService;

    @GetMapping("/tree")
    @Operation(summary = "네비게이션 트리 조회", description = "전체 네비게이션 메뉴를 트리 형태로 조회합니다.")
    public ResponseEntity<List<NavigationResponseDto>> getNavigationTree() {
        log.info("네비게이션 트리 조회 요청");

        List<NavigationResponseDto> navigationTree = navigationService.getNavigationTree();

        return ResponseEntity.ok(navigationTree);
    }

    @GetMapping("/path")
    @Operation(summary = "네비게이션 경로 조회", description = "특정 URL의 네비게이션 경로를 조회합니다 (breadcrumb용).")
    public ResponseEntity<List<NavigationResponseDto>> getNavigationPath(
            @Parameter(description = "조회할 URL 경로", example = "/posts/java")
            @RequestParam String href) {

        log.info("네비게이션 경로 조회 요청: {}", href);

        List<NavigationResponseDto> path = navigationService.getNavigationPath(href);

        return ResponseEntity.ok(path);
    }

    @PostMapping("/cache/evict")
    @Operation(summary = "네비게이션 캐시 무효화", description = "네비게이션 캐시를 무효화합니다.")
    public ResponseEntity<String> evictNavigationCache() {
        log.info("네비게이션 캐시 무효화 요청");

        navigationService.evictNavigationCache();

        return ResponseEntity.ok("네비게이션 캐시가 무효화되었습니다.");
    }
}

