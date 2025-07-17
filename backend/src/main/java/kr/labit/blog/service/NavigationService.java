package kr.labit.blog.service;

import kr.labit.blog.dto.NavigationDto;
import kr.labit.blog.entity.Navigation;
import kr.labit.blog.repository.NavigationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NavigationService {

    private final NavigationRepository navigationRepository;

    /**
     * 전체 네비게이션 트리 구조 조회
     */
    public List<NavigationDto> getNavigationTree() {
        List<Navigation> allNavigations = navigationRepository.findAllActiveNavigations();
        return buildNavigationTree(allNavigations);
    }

    /**
     * 특정 URL의 네비게이션 경로 조회 (breadcrumb 용)
     */
    public List<NavigationDto> getNavigationPath(String url) {
        Navigation navigation = navigationRepository.findByNavUrl(url);
        if (navigation == null) {
            return new ArrayList<>();
        }

        List<Navigation> pathNavigations = navigationRepository.findNavigationPath(navigation.getNavId());
        return pathNavigations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 활성 상태인 네비게이션의 부모들을 찾아서 확장 상태 설정
     */
    public List<NavigationDto> getNavigationTreeWithExpanded(String currentUrl) {
        List<Navigation> allNavigations = navigationRepository.findAllActiveNavigations();
        List<NavigationDto> tree = buildNavigationTree(allNavigations);

        if (currentUrl != null && !currentUrl.isEmpty()) {
            Navigation currentNav = navigationRepository.findByNavUrl(currentUrl);
            if (currentNav != null) {
                setExpandedState(tree, currentNav.getNavId());
            }
        }

        return tree;
    }

    /**
     * 네비게이션 리스트를 트리 구조로 변환
     */
    private List<NavigationDto> buildNavigationTree(List<Navigation> navigations) {
        Map<Long, NavigationDto> navigationMap = new HashMap<>();
        List<NavigationDto> rootNavigations = new ArrayList<>();

        // 1단계: 모든 네비게이션을 DTO로 변환하고 맵에 저장
        for (Navigation nav : navigations) {
            NavigationDto dto = convertToDto(nav);
            navigationMap.put(nav.getNavId(), dto);
        }

        // 2단계: 부모-자식 관계 설정
        for (Navigation nav : navigations) {
            NavigationDto dto = navigationMap.get(nav.getNavId());

            if (nav.getParentId() == null) {
                // 루트 네비게이션
                rootNavigations.add(dto);
            } else {
                // 자식 네비게이션
                NavigationDto parent = navigationMap.get(nav.getParentId());
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(dto);
                    parent.setHasChildren(true);
                }
            }
        }

        // 3단계: 자식 정렬
        sortNavigationTree(rootNavigations);

        return rootNavigations;
    }

    /**
     * 네비게이션 트리 정렬
     */
    private void sortNavigationTree(List<NavigationDto> navigations) {
        if (navigations == null || navigations.isEmpty()) {
            return;
        }

        navigations.sort((a, b) -> {
            int orderA = a.getNavOrder() != null ? a.getNavOrder() : 0;
            int orderB = b.getNavOrder() != null ? b.getNavOrder() : 0;
            return Integer.compare(orderA, orderB);
        });

        for (NavigationDto nav : navigations) {
            if (nav.getChildren() != null) {
                sortNavigationTree(nav.getChildren());
            }
        }
    }

    /**
     * 현재 활성 네비게이션의 부모들을 확장 상태로 설정
     */
    private boolean setExpandedState(List<NavigationDto> navigations, Long activeNavId) {
        if (navigations == null || navigations.isEmpty()) {
            return false;
        }

        for (NavigationDto nav : navigations) {
            if (activeNavId.equals(nav.getNavId())) {
                return true;
            }

            if (nav.getChildren() != null) {
                boolean foundInChildren = setExpandedState(nav.getChildren(), activeNavId);
                if (foundInChildren) {
                    nav.setIsExpanded(true);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Navigation Entity를 DTO로 변환
     */
    private NavigationDto convertToDto(Navigation navigation) {
        return NavigationDto.builder()
                .navId(navigation.getNavId())
                .navName(navigation.getNavName())
                .navUrl(navigation.getNavUrl())
                .navIcon(navigation.getNavIcon())
                .parentId(navigation.getParentId())
                .navOrder(navigation.getNavOrder())
                .navLevel(navigation.getNavLevel())
                .isActive(navigation.getIsActive())
                .hasChildren(false)
                .isExpanded(false)
                .build();
    }
}