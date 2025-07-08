
// ========================================
// api/queryClient.js - TanStack Query 설정
// ========================================
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5분
            gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
            retry: (failureCount, error) => {
                // 401, 403, 404 에러는 재시도하지 않음
                if (error?.status && [401, 403, 404].includes(error.status)) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
