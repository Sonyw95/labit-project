/**
 * 역할별 페이지 접근 권한 확인
 */
export const getAccessiblePages = (userRole) => {
    const pages = {
        USER: ['/home', '/posts/java', '/posts/spring-boot', '/posts/react', '/posts/vue'],
        ADMIN: ['/home', '/posts/java', '/posts/spring-boot', '/posts/react', '/posts/vue', '/admin'],
        SUPER_ADMIN: ['/home', '/posts/java', '/posts/spring-boot', '/posts/react', '/posts/vue', '/admin'],
    };

    return pages[userRole] || pages.USER;
};

/**
 * 역할별 네비게이션 메뉴 필터링
 */
export const filterNavigationByRole = (navigationItems, userRole) => {
    // 관리자 전용 메뉴 항목들
    const adminOnlyPaths = ['/admin'];

    const filterItems = (items) => {
        return items
            .filter(item => {
                // 관리자 전용 메뉴는 관리자만 볼 수 있음
                if (adminOnlyPaths.includes(item.href)) {
                    return userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
                }
                return true;
            })
            .map(item => ({
                ...item,
                children: item.children ? filterItems(item.children) : []
            }));
    };

    return filterItems(navigationItems);
};