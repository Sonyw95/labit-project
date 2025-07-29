import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import {navigationService} from "@/api/navigationService.js";


const useNavigationStore = create(
    devtools(
        persist(
            (set, get) => ({
                // 현재 활성화된 경로
                activePath: '',
                navigationTree: [],
                // 펼쳐진 메뉴들의 ID 배열
                expandedMenus: [],

                // 선택된 메뉴 ID
                selectedMenuId: null,

                // 네비게이션 로딩 상태
                isNavigationLoading: false,

                // 네비게이션 에러 상태
                navigationError: null,

                // 액션들
                setNavigationTree: (tree) => set({ navigationTree: tree }),

                setActivePath: (path) => set({ activePath: path }),

                setSelectedMenuId: (menuId) => set({ selectedMenuId: menuId }),

                // 네비게이션 트리 API 호출
                fetchNavigationTree: async () => {
                    const { navigationTree } = get();
                    // 이미 데이터가 있으면 스킵 (캐시된 데이터 사용)
                    if (navigationTree && navigationTree.length > 0) {
                        return navigationTree;
                    }

                    set({ isNavigationLoading: true, navigationError: null });

                    try {
                        const navigationTree = await navigationService.getNavigationTree();
                        set({
                            navigationTree,
                            isNavigationLoading: false,
                            navigationError: null
                        });

                        return navigationTree;
                    } catch (error) {
                        console.error('Navigation tree fetch failed:', error);
                        set({
                            isNavigationLoading: false,
                            navigationError: error.message || '네비게이션 로드 실패'
                        });
                        return [];
                    }
                },

                // 네비게이션 캐시 새로고침
                refreshNavigationTree: async () => {
                    set({
                        navigationTree: [],
                        isNavigationLoading: true,
                        navigationError: null
                    });

                    try {
                        const response = await navigationService.getNavigationTree();
                        const data = response.data;

                        set({
                            navigationTree: data,
                            isNavigationLoading: false,
                            navigationError: null
                        });

                        return data;
                    } catch (error) {
                        console.error('Navigation tree refresh failed:', error);
                        set({
                            isNavigationLoading: false,
                            navigationError: error.message || '네비게이션 새로고침 실패'
                        });
                        return [];
                    }
                },

                // 메뉴 펼치기/접기
                toggleMenuExpansion: (menuId) =>
                    set((state) => ({
                        expandedMenus: state.expandedMenus.includes(menuId)
                            ? state.expandedMenus.filter(id => id !== menuId)
                            : [...state.expandedMenus, menuId]
                    })),

                // 메뉴 펼치기
                expandMenu: (menuId) =>
                    set((state) => ({
                        expandedMenus: state.expandedMenus.includes(menuId)
                            ? state.expandedMenus
                            : [...state.expandedMenus, menuId]
                    })),

                // 메뉴 접기
                collapseMenu: (menuId) =>
                    set((state) => ({
                        expandedMenus: state.expandedMenus.filter(id => id !== menuId)
                    })),

                // 여러 메뉴 한번에 펼치기 (경로 기반)
                expandMenusByPath: (menuIds) =>
                    set((state) => ({
                        expandedMenus: [...new Set([...state.expandedMenus, ...menuIds])]
                    })),

                // 모든 메뉴 접기
                collapseAllMenus: () => set({ expandedMenus: [] }),

                // 로딩 상태 설정
                setNavigationLoading: (loading) => set({ isNavigationLoading: loading }),

                // 활성 경로에 따른 메뉴 상태 자동 설정
                updateNavigationState: (currentPath, navigationTree) => {
                    const findMenuPath = (menus, targetPath, path = []) => {
                        for (const menu of menus) {
                            const currentMenuPath = [...path, menu.id];

                            if (menu.href === targetPath) {
                                return currentMenuPath;
                            }

                            if (menu.children && menu.children.length > 0) {
                                const foundPath = findMenuPath(menu.children, targetPath, currentMenuPath);
                                if (foundPath) {
                                    return foundPath;
                                }
                            }
                        }
                        return null;
                    };

                    if (navigationTree && navigationTree.length > 0) {
                        const menuPath = findMenuPath(navigationTree, currentPath);

                        if (menuPath && menuPath.length > 0) {
                            const selectedId = menuPath[menuPath.length - 1];
                            const expandIds = menuPath.slice(0, -1); // 선택된 메뉴 제외한 부모 메뉴들

                            set({
                                activePath: currentPath,
                                selectedMenuId: selectedId,
                                expandedMenus: expandIds
                            });
                        }
                    }
                },
            }),
            {
                name: 'navigation-store',
                // persist에서 일부 상태는 제외 (로딩 상태, 에러 상태는 저장하지 않음)
                partialize: (state) => ({
                    activePath: state.activePath,
                    navigationTree: state.navigationTree,
                    expandedMenus: state.expandedMenus,
                    selectedMenuId: state.selectedMenuId,
                })
            }
        )
    )
)

export default useNavigationStore;