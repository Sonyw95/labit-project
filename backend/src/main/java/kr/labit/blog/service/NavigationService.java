package kr.labit.blog.service;

import kr.labit.blog.dto.NavigationItemDto;
import kr.labit.blog.entity.NavigationItem;
import kr.labit.blog.repository.NavigationItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavigationService {

    private final NavigationItemRepository navigationItemRepository;
    private final UserService userService;

    public List<NavigationItemDto> getNavigationItemsByUserRole() {
        User currentUser = userService.getCurrentUser();
        List<NavigationItem> navigationItems = navigationItemRepository.findByRoleOrderByOrderIndex(currentUser.getRole());
        return buildNavigationTree(navigationItems);
    }

    public List<NavigationItemDto> getAllNavigationItems() {
        List<NavigationItem> navigationItems = navigationItemRepository.findAllByOrderByOrderIndex();
        return buildNavigationTree(navigationItems);
    }

    private List<NavigationItemDto> buildNavigationTree(List<NavigationItem> items) {
        return items.stream()
                .filter(item -> item.getParentId() == null)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private NavigationItemDto convertToDto(NavigationItem item) {
        NavigationItemDto dto = NavigationItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .path(item.getPath())
                .icon(item.getIcon())
                .orderIndex(item.getOrderIndex())
                .isActive(item.getIsActive())
                .build();

        // 자식 항목들 재귀적으로 처리
        List<NavigationItemDto> children = item.getChildren().stream()
                .filter(child -> child.getIsActive())
                .map(this::convertToDto)
                .collect(Collectors.toList());

        dto.setChildren(children);
        return dto;
    }
}