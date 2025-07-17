import {apiClient} from "./apiClient.js";

export const navigationService = {
    // 전체 네비게이션 트리 조회
    getNavigationTree: () => apiClient.get('/navigation/tree'),

    // 확장된 네비게이션 트리 조회
    getNavigationTreeWithExpanded: (currentUrl) =>
        apiClient.get('/navigation/tree/expanded', {
            params: { currentUrl }
        }),

    // 네비게이션 경로 조회
    getNavigationPath: (url) =>
        apiClient.get('/navigation/path', {
            params: { url }
        }),
};
