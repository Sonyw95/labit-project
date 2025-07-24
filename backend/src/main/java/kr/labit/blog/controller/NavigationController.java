package kr.labit.blog.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import kr.labit.blog.dto.navigation.NavigationOrderDto;
import kr.labit.blog.dto.navigation.NavigationRequestDto;
import kr.labit.blog.dto.navigation.NavigationResponseDto;
import kr.labit.blog.dto.navigation.ParentUpdateDto;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.service.NavigationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Operation(summary = "네비게이션 트리 조회", description = "사용자 권한에 따른 네비게이션 메뉴를 트리 형태로 조회합니다.")
    public ResponseEntity<List<NavigationResponseDto>> getNavigationTree() {
        log.info("네비게이션 트리 조회 요청");

        // 현재 사용자 정보 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LabUsers currentUser = null;

        if (authentication != null && authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof LabUsers) {
            currentUser = (LabUsers) authentication.getPrincipal();
        }

        List<NavigationResponseDto> navigationTree = navigationService.getNavigationTreeByUserRole(currentUser);

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

    @PostMapping("/create")
    @Operation(summary = "네비게이션 메뉴 생성", description = "새로운 네비게이션 메뉴를 생성합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<NavigationResponseDto> createNavigation(
            @Valid @RequestBody NavigationRequestDto requestDto) {

        log.info("네비게이션 메뉴 생성 요청: {}", requestDto.getLabel());

        NavigationResponseDto created = navigationService.createNavigation(requestDto);

        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "네비게이션 메뉴 수정", description = "기존 네비게이션 메뉴를 수정합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<NavigationResponseDto> updateNavigation(
            @Parameter(description = "네비게이션 ID") @PathVariable Long id,
            @Valid @RequestBody NavigationRequestDto requestDto) {

        log.info("네비게이션 메뉴 수정 요청: ID={}, Label={}", id, requestDto.getLabel());

        NavigationResponseDto updated = navigationService.updateNavigation(id, requestDto);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "네비게이션 메뉴 삭제", description = "네비게이션 메뉴를 삭제합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<Void> deleteNavigation(
            @Parameter(description = "네비게이션 ID") @PathVariable Long id) {

        log.info("네비게이션 메뉴 삭제 요청: ID={}", id);

        navigationService.deleteNavigation(id);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/order")
    @Operation(summary = "네비게이션 순서 변경", description = "드래그 앤 드롭 후 메뉴 순서를 업데이트합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<Void> updateNavigationOrder(
            @Valid @RequestBody List<NavigationOrderDto> orderData) {

        log.info("네비게이션 순서 변경 요청: {} 개 메뉴", orderData.size());

        navigationService.updateNavigationOrder(orderData);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "네비게이션 상태 토글", description = "네비게이션 메뉴의 활성화/비활성화 상태를 변경합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<Void> toggleNavigationStatus(
            @Parameter(description = "네비게이션 ID") @PathVariable Long id) {

        log.info("네비게이션 상태 토글 요청: ID={}", id);

        navigationService.toggleNavigationStatus(id);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/parent")
    @Operation(summary = "부모 메뉴 변경", description = "네비게이션 메뉴의 부모를 변경합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') ")
    public ResponseEntity<Void> updateNavigationParent(
            @Parameter(description = "네비게이션 ID") @PathVariable Long id,
            @Valid @RequestBody ParentUpdateDto parentUpdateDto) {

        log.info("네비게이션 부모 변경 요청: ID={}, 새 부모 ID={}", id, parentUpdateDto.getParentId());

        navigationService.updateNavigationParent(id, parentUpdateDto.getParentId());

        return ResponseEntity.ok().build();
    }
}

