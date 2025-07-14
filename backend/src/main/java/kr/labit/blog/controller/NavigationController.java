package kr.labit.blog.controller;

import kr.labit.blog.dto.NavigationItemDto;
import kr.labit.blog.service.NavigationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend-url}")
@Slf4j
public class NavigationController {

    private final NavigationService navigationService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NavigationItemDto>> getNavigationItems() {
        List<NavigationItemDto> navigationItems = navigationService.getNavigationItemsByUserRole();
        return ResponseEntity.ok(navigationItems);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NavigationItemDto>> getAdminNavigationItems() {
        List<NavigationItemDto> navigationItems = navigationService.getAllNavigationItems();
        return ResponseEntity.ok(navigationItems);
    }
}