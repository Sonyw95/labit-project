// src/hooks/useNavigation.js
import {useQuery} from '@tanstack/react-query';
import {useLocation} from 'react-router-dom';
import {useCallback, useEffect, useMemo} from 'react';
import useApiStore from "../../stores/apiStore.js";
import {navigationService} from "../../api/navigationApi.js";

// 네비게이션 트리 조회 훅
export const useNavigation = () => {
    const location = useLocation();
    const store = useApiStore();

    const query = useQuery({
        queryKey: ['navigationTree'],
        queryFn: async () => {
            return await navigationService.getNavigationTree();
        },
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // 데이터와 상태를 한 번에 업데이트하여 렌더링 최소화
    useEffect(() => {
        if (query.data && Array.isArray(query.data)) {
            store.setNavigationTree(query.data);
            store.setActiveByUrl(location.pathname);
            store.clearError();
        }
    }, [query.data, location.pathname]);

    useEffect(() => {
        if (query.error) {
            store.setError(query.error?.message || '네비게이션 데이터를 가져오는데 실패했습니다.');
        }
    }, [query.error, store]);

    useEffect(() => {
        store.setLoading(query.isLoading);
    }, [query.isLoading]);

    // 액션들을 메모이제이션
    const actions = useMemo(() => ({
        toggleNode: store.toggleNode,
        expandNode: store.expandNode,
        collapseNode: store.collapseNode,
        clearError: store.clearError,
        refetch: query.refetch,
    }), [store.toggleNode, store.expandNode, store.collapseNode, store.clearError, query.refetch]);

    // 결과를 메모이제이션하여 불필요한 리렌더링 방지
    return useMemo(() => ({
        navigationTree: store.navigationTree,
        expandedNodes: store.expandedNodes,
        activeNodeId: store.activeNodeId,
        currentPath: store.currentPath,
        isLoading: query.isLoading,
        error: query.error || store.error,
        currentUrl: location.pathname,
        actions,
    }), [
        store.navigationTree,
        store.expandedNodes,
        store.activeNodeId,
        store.currentPath,
        query.isLoading,
        query.error,
        store.error,
        location.pathname,
        actions,
    ]);
};

// 네비게이션 경로 조회 훅
export const useNavigationPath = (url) => {
    const { setCurrentPath } = useApiStore();

    const query = useQuery({
        queryKey: ['navigationPath', url],
        queryFn: async () => {
            if (!url) {
                return [];
            }
            const response = await navigationService.getNavigationPath(url);
            return response.data;
        },
        enabled: !!url,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setCurrentPath(data);
        },
    });

    return {
        path: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
    };
};

// 레거시 호환성을 위한 개별 훅들 (deprecated)
export const useNavigationTree = () => {
    const navigation = useNavigation();
    return {
        data: navigation.navigationTree,
        isLoading: navigation.isLoading,
        error: navigation.error,
        refetch: navigation.actions.refetch,
    };
};

export const useNavigationState = () => {
    const navigation = useNavigation();
    return {
        navigationTree: navigation.navigationTree,
        expandedNodes: navigation.expandedNodes,
        activeNodeId: navigation.activeNodeId,
        currentPath: navigation.currentPath,
        isLoading: navigation.isLoading,
        error: navigation.error,
        currentUrl: navigation.currentUrl,
        actions: navigation.actions,
    };
};

// 네비게이션 아이템 클릭 처리 훅
export const useNavigationClick = () => {
    const { expandNode, collapseNode, expandedNodes, setActiveNode } = useApiStore();

    const handleNavigationClick = useCallback((node, navigate) => {
        if (node.navUrl) {
            // URL이 있는 경우 라우팅
            setActiveNode(node.navId);
            navigate(node.navUrl);
        } else if (node.hasChildren) {
            // 자식이 있는 경우 토글
            if (expandedNodes.has(node.navId)) {
                collapseNode(node.navId);
            } else {
                expandNode(node.navId);
            }
        }
    }, [expandedNodes, expandNode, collapseNode, setActiveNode]);

    return { handleNavigationClick };
};