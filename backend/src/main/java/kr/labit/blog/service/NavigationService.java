package kr.labit.blog.service;


import kr.labit.blog.dto.NavigationResponseDto;
import kr.labit.blog.entity.LabNavigation;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.UserRole;
import kr.labit.blog.repository.LabNavigationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NavigationService {

    private final LabNavigationRepository navigationRepository;

    /**
     * 사용자 역할에 따른 네비게이션 트리 조회
     */
    public List<NavigationResponseDto> getNavigationTreeByUserRole(LabUsers user) {
        log.info("사용자 역할별 네비게이션 트리 조회: 사용자 = {}",
                user != null ? user.getNickname() : "게스트");

        try {
            List<LabNavigation> allMenus = navigationRepository.findAllActiveOrderBySortOrder();

            if (allMenus.isEmpty()) {
                log.warn("활성화된 네비게이션 메뉴가 없습니다.");
                return new ArrayList<>();
            }

            // 사용자 권한에 따라 메뉴 필터링
            List<LabNavigation> filteredMenus = filterMenusByUserRole(allMenus, user);

            // 트리 구조 구성
            List<LabNavigation> treeMenus = buildNavigationTree(filteredMenus);

            // DTO로 변환
            List<NavigationResponseDto> result = treeMenus.stream()
                    .map(NavigationResponseDto::fromEntity)
                    .collect(Collectors.toList());

            log.info("네비게이션 트리 조회 완료: {} 개의 루트 메뉴", result.size());
            return result;

        } catch (Exception e) {
            log.error("네비게이션 트리 조회 중 오류 발생", e);
            throw new RuntimeException("네비게이션 메뉴를 불러올 수 없습니다.", e);
        }
    }

    /**
     * 사용자 권한에 따른 메뉴 필터링
     */
    private List<LabNavigation> filterMenusByUserRole(List<LabNavigation> allMenus, LabUsers user) {
        // 현재는 모든 메뉴를 반환하지만, 필요시 권한별로 필터링 로직 추가
        // 예: 관리자 전용 메뉴, 특정 역할 전용 메뉴 등

        UserRole userRole = user != null ? user.getRole() : UserRole.USER;

        return allMenus.stream()
                .filter(menu -> isMenuAccessible(menu, userRole))
                .collect(Collectors.toList());
    }

    /**
     * 메뉴 접근 권한 확인
     */
    private boolean isMenuAccessible(LabNavigation menu, UserRole userRole) {
        // 기본적으로 모든 메뉴는 접근 가능
        // 필요시 메뉴별 접근 권한 로직 추가

        // 예시: 관리자 메뉴는 ADMIN 이상만 접근 가능
        if (menu.getDescription() != null && menu.getDescription().contains("관리자")) {
            return userRole == UserRole.ADMIN || userRole == UserRole.SUPER_ADMIN;
        }

        return true;
    }

    /**
     * 트리 형태의 네비게이션 메뉴 조회 (캐시 적용)
     */
    @Cacheable(value = "navigationTree", unless = "#result.isEmpty()")
    public List<NavigationResponseDto> getNavigationTree() {
        return getNavigationTreeByUserRole(null);
    }

    /**
     * 특정 경로의 네비게이션 경로 조회 (breadcrumb용)
     */
    public List<NavigationResponseDto> getNavigationPath(String href) {
        log.info("네비게이션 경로 조회: {}", href);

        List<LabNavigation> menus = navigationRepository.findByHref(href);
        if (menus.isEmpty()) {
            return new ArrayList<>();
        }

        LabNavigation targetMenu = menus.get(0);
        List<LabNavigation> path = buildNavigationPath(targetMenu);

        return path.stream()
                .map(NavigationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 메뉴 트리 구조 생성
     */
    private List<LabNavigation> buildNavigationTree(List<LabNavigation> allMenus) {
        // 부모 ID별로 그룹핑
        Map<Long, List<LabNavigation>> menusByParentId = allMenus.stream()
                .filter(menu -> menu.getParentId() != null)
                .collect(Collectors.groupingBy(LabNavigation::getParentId));

        // 루트 메뉴들 찾기
        List<LabNavigation> rootMenus = allMenus.stream()
                .filter(menu -> menu.getParentId() == null)
                .collect(Collectors.toList());

        // 각 메뉴에 자식 메뉴들 연결
        allMenus.forEach(menu -> {
            List<LabNavigation> children = menusByParentId.get(menu.getId());
            if (children != null) {
                menu.setChildren(children);
            }
        });

        return rootMenus;
    }

    /**
     * 특정 메뉴까지의 경로 생성 (breadcrumb)
     */
    private List<LabNavigation> buildNavigationPath(LabNavigation targetMenu) {
        List<LabNavigation> path = new ArrayList<>();
        LabNavigation currentMenu = targetMenu;

        while (currentMenu != null) {
            path.add(0, currentMenu); // 앞쪽에 추가하여 역순으로 만들기

            if (currentMenu.getParentId() != null) {
                currentMenu = navigationRepository.findById(currentMenu.getParentId())
                        .orElse(null);
            } else {
                break;
            }
        }

        return path;
    }

    /**
     * 네비게이션 캐시 무효화
     */
    @org.springframework.cache.annotation.CacheEvict(value = "navigationTree", allEntries = true)
    public void evictNavigationCache() {
        log.info("네비게이션 캐시 무효화");
    }
}