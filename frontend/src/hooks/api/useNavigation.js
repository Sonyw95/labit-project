import useApiStore from "@/stores/apiStore.js";
import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {navigationService} from "@/api/apiClient.js";
import {useEffect} from "react";

export const useNavigationTree = () => {
    const location = useLocation();
    const {
        setNavigationTree,
        setActiveByUrl,
        setLoading,
        setError,
        clearError,

    } = useApiStore();

    const query = useQuery({
        queryKey: ['navigationTree', location.pathname],
        queryFn: async () => {
            console.log('API TREE')
            return {data: await navigationService.getNavigationTree()};
        },
        staleTime: 1000 * 60 * 5, // 5분
        cacheTime: 1000 * 60 * 10, // 10분
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 0,
        // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        onSuccess: (data) => {
            setNavigationTree(data);
            setActiveByUrl(location.pathname);
            clearError();
        },
        onError: (error) => {
            setError(error.message || '네비게이션 데이터를 가져오는데 실패했습니다.');
        },
        onSettled: () => {

            setLoading(false);
        },
    });

    // 로딩 상태 동기화
    useEffect(() => {
        setLoading(query.isLoading);
    }, [query.isLoading, setLoading]);

    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
        isRefetching: query.isRefetching,
    };
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

// 현재 위치에 따른 네비게이션 상태 관리 훅
export const useNavigationState = () => {
    const location = useLocation();
    const {
        navigationTree,
        expandedNodes,
        activeNodeId,
        currentPath,
        isLoading,
        error,
        setActiveByUrl,
        toggleNode,
        expandNode,
        collapseNode,
        clearError,
    } = useApiStore();

    // 경로 변경 시 활성 상태 업데이트
    useEffect(() => {
        console.log('API State')
        if (navigationTree.length > 0) {
            setActiveByUrl(location.pathname);
        }
    }, [location.pathname, navigationTree, setActiveByUrl]);

    return {
        navigationTree,
        expandedNodes,
        activeNodeId,
        currentPath,
        isLoading,
        error,
        currentUrl: location.pathname,
        actions: {
            toggleNode,
            expandNode,
            collapseNode,
            clearError,
        },
    };
};

// 네비게이션 아이템 클릭 처리 훅
export const useNavigationClick = () => {
    const { expandNode, collapseNode, expandedNodes, setActiveNode } = useApiStore();

    const handleNavigationClick = (node, navigate) => {
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
    };

    return { handleNavigationClick };
};