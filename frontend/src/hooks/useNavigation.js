import { useQuery } from '@tanstack/react-query';
import useApiStore from '../stores/apiStore';
import { useEffect } from 'react';
import {navigationApi} from "../api/navigationApi.js";

export const useNavigation = () => {
    const {
        navigationItems,
        setNavigationItems,
        setNavigationLoading,
        setNavigationError,
        user,
    } = useApiStore();

    const {
        data,
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ['navigation'],
        queryFn: async () => {
            setNavigationLoading(true);
            try {
                console.log('🌐 API 요청 준비 중...');
                const response = user?.role === 'ADMIN'
                    ? await navigationApi.getAdminNavigationItems()
                    : await navigationApi.getNavigationItems();
                console.log('✅ Navigation API 응답:', response.data);

                const items = response.data;
                setNavigationItems(items);
                setNavigationError(null);
                return items;
            } catch (err) {
                console.error('❌ Navigation API 에러:', err);
                setNavigationError(err.message);
                throw err;
            } finally {
                setNavigationLoading(false);
                console.log('🏁 Navigation API 호출 완료');
            }
        },
        staleTime: 0, // 🔍 테스트를 위해 0으로 설정
        cacheTime: 0, // 🔍 테스트를 위해 0으로 설정
        retry: 0,
        refetchOnWindowFocus: false,
    });

    return {
        navigationItems: data || navigationItems,
        isLoading: isLoading || isRefetching,
        error,
        refetch,
    };
};