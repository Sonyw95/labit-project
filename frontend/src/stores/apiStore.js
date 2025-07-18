import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {authService, tokenUtils, userUtils} from "../api/authAPi.js";

const useApiStore = create(
    devtools(
        persist(
            (set, get) => ({
                // 상태
                navigationTree: [],
                expandedNodes: new Set(),
                activeNodeId: null,
                currentPath: [],
                isLoading: false,
                error: null,

                user: null,
                isAuthenticated: false,

                setUser: (user) => {
                    set({ user, isAuthenticated: !!user });
                    if (user) {
                        userUtils.saveUser(user);
                    }
                },

                // 액션
                setNavigationTree: (tree) => {
                    set({ navigationTree: tree });
                },

                setExpandedNodes: (nodes) => {
                    set({ expandedNodes: new Set(nodes) });
                },

                toggleNode: (nodeId) => {
                    set((state) => {
                        const newExpanded = new Set(state.expandedNodes);
                        if (newExpanded.has(nodeId)) {
                            newExpanded.delete(nodeId);
                        } else {
                            newExpanded.add(nodeId);
                        }
                        return { expandedNodes: newExpanded };
                    });
                },

                expandNode: (nodeId) => {
                    set((state) => {
                        const newExpanded = new Set(state.expandedNodes);
                        newExpanded.add(nodeId);
                        return { expandedNodes: newExpanded };
                    });
                },

                collapseNode: (nodeId) => {
                    set((state) => {
                        const newExpanded = new Set(state.expandedNodes);
                        newExpanded.delete(nodeId);
                        return { expandedNodes: newExpanded };
                    });
                },

                setActiveNode: (nodeId) => {
                    set({ activeNodeId: nodeId });
                },

                setCurrentPath: (path) => {
                    set({ currentPath: path });
                },

                setLoading: (loading) => {
                    set({ isLoading: loading });
                },

                setError: (error) => {
                    set({ error });
                },

                clearError: () => {
                    set({ error: null });
                },

                // 특정 노드까지의 경로를 확장
                expandToNode: (nodeId) => {
                    const { navigationTree } = get();
                    const pathToNode = findPathToNode(navigationTree, nodeId);
                    if (pathToNode.length > 0) {
                        set((state) => {
                            const newExpanded = new Set(state.expandedNodes);
                            pathToNode.forEach(id => newExpanded.add(id));
                            return { expandedNodes: newExpanded };
                        });
                    }
                },

                // 현재 URL에 따른 활성 상태 설정
                setActiveByUrl: (url) => {
                    const { navigationTree } = get();
                    const node = findNodeByUrl(navigationTree, url);
                    if (node) {
                        set({ activeNodeId: node.navId });
                        get().expandToNode(node.navId);
                    }
                },
// 카카오 로그
                login: async() => {
                    set({
                        isLoading: false,
                        error: '테스트',
                        user: null,
                        isAuthenticated: false
                    });
                    return { success: false, error: '테스트' };
                },
                loginWithKakao: async () => {
                    set({ isLoading: true, error: null });

                    try {
                        const code = await authService.openKakaoLoginPopup();

                        const response = await authService.loginWithKakaoCode(code);

                        const { accessToken, user } = response.data.data;

                        // 토큰 저장
                        tokenUtils.saveToken(accessToken);

                        // 사용자 정보 저장
                        get().setUser(user);

                        set({ isLoading: false });
                        return { success: true, user };

                    } catch (error) {
                        const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
                        set({
                            isLoading: false,
                            error: errorMessage,
                            user: null,
                            isAuthenticated: false
                        });
                        return { success: false, error: errorMessage };
                    }
                },

                // 로그아웃
                logout: async () => {
                    set({ isLoading: true });

                    try {
                        // 서버에 로그아웃 요청
                        await authService.logout();
                    } catch (error) {
                        console.error('서버 로그아웃 실패:', error);
                    } finally {
                        // 로컬 데이터 정리
                        tokenUtils.removeToken();
                        userUtils.removeUser();

                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null
                        });
                    }
                },

                // 현재 사용자 정보 조회
                fetchCurrentUser: async () => {
                    const token = tokenUtils.getToken();
                    if (!token || !tokenUtils.isValidToken(token)) {
                        get().logout();
                        return;
                    }

                    set({ isLoading: true });

                    try {
                        const response = await authService.getCurrentUser();
                        const user = response.data.data;

                        get().setUser(user);
                        set({ isLoading: false });

                    } catch (error) {
                        console.error('사용자 정보 조회 실패:', error);
                        get().logout();
                    }
                },

                // 토큰 검증
                validateToken: async () => {
                    const token = tokenUtils.getToken();
                    if (!token) {
                        get().logout();
                        return false;
                    }

                    // 클라이언트 측 토큰 만료 확인
                    if (tokenUtils.isTokenExpired(token)) {
                        get().logout();
                        return false;
                    }

                    try {
                        const response = await authService.validateToken(token);
                        const isValid = response.data.data;

                        if (!isValid) {
                            get().logout();
                            return false;
                        }

                        return true;

                    } catch (error) {
                        console.error('토큰 검증 실패:', error);
                        get().logout();
                        return false;
                    }
                },
                nitialize: async () => {
                    const token = tokenUtils.getToken();
                    const user = userUtils.getUser();

                    if (token && user && tokenUtils.isValidToken(token)) {
                        set({
                            user,
                            isAuthenticated: true,
                            isLoading: false
                        });

                        // 사용자 정보 업데이트
                        await get().fetchCurrentUser();
                    } else {
                        get().logout();
                    }
                },

                // 권한 확인
                hasRole: (role) => {
                    const { user } = get();
                    return user && user.userRole === role;
                },

                // 관리자 권한 확인
                isAdmin: () => {
                    return get().hasRole('ADMIN');
                },
                // 리셋
                reset: () => {
                    set({
                        navigationTree: [],
                        expandedNodes: new Set(),
                        activeNodeId: null,
                        currentPath: [],
                        isLoading: false,
                        error: null,
                        user: null,
                        isAuthenticated: false,
                    });
                },
            }),
            {
                name: 'api-store',
                partialize: (state) => ({
                    expandedNodes: Array.from(state.expandedNodes),
                    activeNodeId: state.activeNodeId,
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
                onRehydrateStorage: () => (state) => {
                    if (state && state.expandedNodes && Array.isArray(state.expandedNodes)) {
                        state.expandedNodes = new Set(state.expandedNodes);
                    }
                },
            }
        ),
        { name: 'navigation-store' }
    )
);
// 헬퍼 함수들
const findPathToNode = (nodes, targetId, currentPath = []) => {
    for (const node of nodes) {
        const newPath = [...currentPath, node.navId];

        if (node.navId === targetId) {
            return newPath;
        }

        if (node.children && node.children.length > 0) {
            const result = findPathToNode(node.children, targetId, newPath);
            if (result.length > 0) {
                return result;
            }
        }
    }
    return [];
};

const findNodeByUrl = (nodes, url) => {
    for (const node of nodes) {
        if (node.navUrl === url) {
            return node;
        }

        if (node.children && node.children.length > 0) {
            const result = findNodeByUrl(node.children, url);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

export default useApiStore;