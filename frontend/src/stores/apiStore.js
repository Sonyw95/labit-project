import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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

                // 리셋
                reset: () => {
                    set({
                        navigationTree: [],
                        expandedNodes: new Set(),
                        activeNodeId: null,
                        currentPath: [],
                        isLoading: false,
                        error: null,
                    });
                },
            }),
            {
                name: 'api-store',
                partialize: (state) => ({
                    expandedNodes: Array.from(state.expandedNodes),
                    activeNodeId: state.activeNodeId,
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