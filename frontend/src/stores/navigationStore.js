import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";


const useNavigationStore = create(
    devtools(
        persist(
            (set, get) => ({
                // 현재 활성화된 경로
                activePath: '',

                // 펼쳐진 메뉴들의 ID 배열
                expandedMenus: [],

                // 선택된 메뉴 ID
                selectedMenuId: null,

                // 네비게이션 로딩 상태
                isNavigationLoading: false,

                // 액션들
                setActivePath: (path) => set({ activePath: path }),

                setSelectedMenuId: (menuId) => set({ selectedMenuId: menuId }),

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
                                if (foundPath) return foundPath;
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
            { name: 'navigation-store' }
        )
    )
)

export default useNavigationStore;