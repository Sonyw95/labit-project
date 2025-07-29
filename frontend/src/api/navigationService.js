import {api} from "@/api/client.js";

export const navigationService = {
    // 네비게이션 트리 조회
    getNavigationTree: () => api.get('/navigation/tree'),
    // getNavigationTree: () => api.publicRequest('get', '/navigation/tree'),

    // 특정 경로의 네비게이션 경로 조회 ( breadcrumb 용 )
    getNavigationPath: (href) => api.get('/navigation/path', {
        params: { href }
    }),

    // 네비게이션 캐시 무효화
    evictNavigationCache: () => api.post('/navigation/cache/evict'),

    // 네비게이션 메뉴 생성
    createNavigation: (navigationData) => api.post('/navigation/create', navigationData),

    // 네비게이션 메뉴 수정
    updateNavigation: (id, navigationData) => api.put(`/navigation/${id}`, navigationData),

    // 네비게이션 메뉴 삭제
    deleteNavigation: (id) => api.delete(`/navigation/${id}`),

    // 네비게이션 메뉴 순서 변경 (Drag & Drop 후)
    updateNavigationOrder: (orderData) => api.put('/navigation/order', orderData),

    // 네비게이션 메뉴 활성화/비활성화
    toggleNavigationStatus: (id) => api.patch(`/navigation/${id}/toggle-status`),

    // 부모 메뉴 변경
    updateNavigationParent: (id, parentId) => api.patch(`/navigation/${id}/parent`, { parentId }),
}

export const dashBoardService = {
    // 대시보드 통계 조회
    getDashboardStats: () => api.get('/admin/dashboard/stats'),

    // 시스템 상태 조회
    getSystemStatus: () => api.get('/admin/dashboard/system-status'),

    // 최근 활동 로그 조회
    getRecentActivityLogs: (limit = 10) => api.get('/admin/dashboard/activity-logs', {
        params: { limit }
    }),
}
