package kr.labit.blog.service;


import jakarta.persistence.EntityNotFoundException;
import kr.labit.blog.dto.navigation.NavigationOrderDto;
import kr.labit.blog.dto.navigation.NavigationRequestDto;
import kr.labit.blog.dto.navigation.NavigationResponseDto;
import kr.labit.blog.entity.LabNavigation;
import kr.labit.blog.entity.LabUsers;
import kr.labit.blog.entity.UserRole;
import kr.labit.blog.repository.LabNavigationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
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

    private final ActivityLogService activityLogService;


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

    /**
     * 네비게이션 메뉴 생성
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public NavigationResponseDto createNavigation(NavigationRequestDto requestDto) {
        log.info("네비게이션 메뉴 생성: {}", requestDto.getLabel());

        // 부모 메뉴 검증
        if (requestDto.getParentId() != null) {
            LabNavigation parent = navigationRepository.findById(requestDto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("부모 메뉴를 찾을 수 없습니다: " + requestDto.getParentId()));
        }

        // sortOrder 계산
        Integer maxSortOrder = getMaxSortOrder(requestDto.getParentId());
        Integer depth = calculateDepth(requestDto.getParentId());

        LabNavigation navigation = LabNavigation.builder()
                .label(requestDto.getLabel())
                .href(requestDto.getHref())
                .parentId(requestDto.getParentId())
                .sortOrder(maxSortOrder + 1)
                .depth(depth)
                .icon(requestDto.getIcon())
                .description(requestDto.getDescription())
                .isActive(requestDto.getIsActive())
                .build();

        LabNavigation saved = navigationRepository.save(navigation);

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 메뉴 생성", "메뉴 생성: " + saved.getLabel(),
                "success", "navigation", saved.getId());

        return NavigationResponseDto.fromEntity(saved);
    }

    /**
     * 네비게이션 메뉴 수정
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public NavigationResponseDto updateNavigation(Long id, NavigationRequestDto requestDto) {
        log.info("네비게이션 메뉴 수정: ID={}", id);

        LabNavigation navigation = navigationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("네비게이션 메뉴를 찾을 수 없습니다: " + id));

        String oldValue = navigation.getLabel();

        // 부모 메뉴 검증 (자기 자신이나 자식 메뉴로 설정되지 않도록)
        if (requestDto.getParentId() != null) {
            validateParentChange(id, requestDto.getParentId());
        }

        // 업데이트
        navigation.setLabel(requestDto.getLabel());
        navigation.setHref(requestDto.getHref());
        navigation.setIcon(requestDto.getIcon());
        navigation.setDescription(requestDto.getDescription());
        navigation.setIsActive(requestDto.getIsActive());

        // 부모가 변경되면 depth와 sortOrder 재계산
        if (!java.util.Objects.equals(navigation.getParentId(), requestDto.getParentId())) {
            navigation.setParentId(requestDto.getParentId());
            navigation.setDepth(calculateDepth(requestDto.getParentId()));
            navigation.setSortOrder(getMaxSortOrder(requestDto.getParentId()) + 1);
        }

        LabNavigation updated = navigationRepository.save(navigation);

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 메뉴 수정",
                String.format("메뉴 수정: %s -> %s", oldValue, updated.getLabel()),
                "success", "navigation", updated.getId());

        return NavigationResponseDto.fromEntity(updated);
    }

    /**
     * 네비게이션 메뉴 삭제
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public void deleteNavigation(Long id) {
        log.info("네비게이션 메뉴 삭제: ID={}", id);

        LabNavigation navigation = navigationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("네비게이션 메뉴를 찾을 수 없습니다: " + id));

        // 하위 메뉴가 있는지 확인
        List<LabNavigation> children = navigationRepository.findChildrenByParentId(id);
        if (!children.isEmpty()) {
            throw new IllegalStateException("하위 메뉴가 있는 메뉴는 삭제할 수 없습니다.");
        }

        String deletedLabel = navigation.getLabel();
        navigationRepository.delete(navigation);

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 메뉴 삭제", "메뉴 삭제: " + deletedLabel,
                "success", "navigation", id);
    }

    /**
     * 네비게이션 순서 변경
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public void updateNavigationOrder(List<NavigationOrderDto> orderData) {
        log.info("네비게이션 순서 변경: {} 개 메뉴", orderData.size());

        for (NavigationOrderDto order : orderData) {
            LabNavigation navigation = navigationRepository.findById(order.getId())
                    .orElseThrow(() -> new EntityNotFoundException("네비게이션 메뉴를 찾을 수 없습니다: " + order.getId()));

            navigation.setSortOrder(order.getSortOrder());
            navigation.setParentId(order.getParentId());
            navigation.setDepth(calculateDepth(order.getParentId()));

            navigationRepository.save(navigation);
        }

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 순서 변경",
                orderData.size() + "개 메뉴 순서 변경", "success", "navigation", null);
    }

    /**
     * 네비게이션 활성화/비활성화 토글
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public void toggleNavigationStatus(Long id) {
        log.info("네비게이션 상태 토글: ID={}", id);

        LabNavigation navigation = navigationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("네비게이션 메뉴를 찾을 수 없습니다: " + id));

        boolean newStatus = !navigation.getIsActive();
        navigation.setIsActive(newStatus);

        navigationRepository.save(navigation);

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 상태 변경",
                String.format("메뉴 %s: %s", navigation.getLabel(), newStatus ? "활성화" : "비활성화"),
                "success", "navigation", id);
    }

    /**
     * 부모 메뉴 변경
     */
    @Transactional
    @CacheEvict(value = {"adminNavigations", "navigationTree"}, allEntries = true)
    public void updateNavigationParent(Long id, Long parentId) {
        log.info("네비게이션 부모 변경: ID={}, 새 부모 ID={}", id, parentId);

        LabNavigation navigation = navigationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("네비게이션 메뉴를 찾을 수 없습니다: " + id));

        // 부모 메뉴 검증
        if (parentId != null) {
            validateParentChange(id, parentId);
        }

        Long oldParentId = navigation.getParentId();
        navigation.setParentId(parentId);
        navigation.setDepth(calculateDepth(parentId));
        navigation.setSortOrder(getMaxSortOrder(parentId) + 1);

        navigationRepository.save(navigation);

        // 활동 로그 기록
        activityLogService.logActivity("네비게이션 부모 변경",
                String.format("메뉴 %s 부모 변경: %s -> %s", navigation.getLabel(), oldParentId, parentId),
                "success", "navigation", id);
    }

    // 헬퍼 메소드들

    private Integer getMaxSortOrder(Long parentId) {
        List<LabNavigation> siblings;
        if (parentId == null) {
            siblings = navigationRepository.findRootMenus();
        } else {
            siblings = navigationRepository.findChildrenByParentId(parentId);
        }

        return siblings.stream()
                .mapToInt(nav -> nav.getSortOrder() != null ? nav.getSortOrder() : 0)
                .max()
                .orElse(0);
    }

    private Integer calculateDepth(Long parentId) {
        if (parentId == null) {
            return 0;
        }

        LabNavigation parent = navigationRepository.findById(parentId)
                .orElseThrow(() -> new EntityNotFoundException("부모 메뉴를 찾을 수 없습니다: " + parentId));

        return (parent.getDepth() != null ? parent.getDepth() : 0) + 1;
    }

    private void validateParentChange(Long navigationId, Long newParentId) {
        if (navigationId.equals(newParentId)) {
            throw new IllegalArgumentException("자기 자신을 부모로 설정할 수 없습니다.");
        }

        // 순환 참조 검사 (자식 메뉴를 부모로 설정하는 것 방지)
        LabNavigation newParent = navigationRepository.findById(newParentId)
                .orElseThrow(() -> new EntityNotFoundException("부모 메뉴를 찾을 수 없습니다: " + newParentId));

        checkCircularReference(navigationId, newParent);
    }

    private void checkCircularReference(Long navigationId, LabNavigation candidate) {
        if (candidate.getParentId() == null) {
            return; // 루트에 도달했으므로 순환 참조 없음
        }

        if (candidate.getParentId().equals(navigationId)) {
            throw new IllegalArgumentException("순환 참조가 발생합니다.");
        }

        LabNavigation parent = navigationRepository.findById(candidate.getParentId())
                .orElse(null);

        if (parent != null) {
            checkCircularReference(navigationId, parent);
        }
    }

}