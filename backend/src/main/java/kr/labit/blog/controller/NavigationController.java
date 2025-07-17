package kr.labit.blog.controller;

import kr.labit.blog.dto.NavigationDto;
import kr.labit.blog.service.NavigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend-url}")
public class NavigationController {

    private final NavigationService navigationService;

    /**
     * 전체 네비게이션 트리 조회
     */
    @GetMapping("/tree")
    public ResponseEntity<List<NavigationDto>> getNavigationTree() {
        List<NavigationDto> navigationTree = navigationService.getNavigationTree();
        return ResponseEntity.ok(navigationTree);
    }

    /**
     * 현재 URL을 기준으로 확장된 네비게이션 트리 조회
     */
    @GetMapping("/tree/expanded")
    public ResponseEntity<List<NavigationDto>> getNavigationTreeWithExpanded(
            @RequestParam(required = false) String currentUrl) {
        List<NavigationDto> navigationTree = navigationService.getNavigationTreeWithExpanded(currentUrl);
        return ResponseEntity.ok(navigationTree);
    }

    /**
     * 특정 URL의 네비게이션 경로 조회 (breadcrumb)
     */
    @GetMapping("/path")
    public ResponseEntity<List<NavigationDto>> getNavigationPath(
            @RequestParam String url) {
        List<NavigationDto> navigationPath = navigationService.getNavigationPath(url);
        return ResponseEntity.ok(navigationPath);
    }
}