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
        isAuthenticated
    } = useApiStore();

    // 🔍 1단계: 기본 상태 확인
    console.log('🔍 useNavigation 훅 실행됨');
    console.log('🔍 user:', user);
    console.log('🔍 isAuthenticated:', isAuthenticated);
    console.log('🔍 user && isAuthenticated:', !!user && isAuthenticated);

    // 🔍 2단계: enabled 조건 확인
    const isQueryEnabled = !!user && isAuthenticated;
    console.log('🔍 Query enabled 조건:', isQueryEnabled);

    const {
        data,
        isLoading,
        error,
        refetch,
        isRefetching,
        isIdle,
        isFetching,
        status
    } = useQuery({
        queryKey: ['navigation', user?.role],
        queryFn: async () => {
            console.log('🚀 ===== Navigation API 호출 시작! =====');
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
        enabled: isQueryEnabled, // 🔍 명시적으로 변수 사용
        staleTime: 0, // 🔍 테스트를 위해 0으로 설정
        cacheTime: 0, // 🔍 테스트를 위해 0으로 설정
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // 🔍 3단계: 쿼리 상태 모니터링
    useEffect(() => {
        console.log('📊 Query 상태 변화:', {
            status,
            isIdle,
            isLoading,
            isFetching,
            isRefetching,
            enabled: isQueryEnabled,
            hasData: !!data,
            hasError: !!error
        });
    }, [status, isIdle, isLoading, isFetching, isRefetching, isQueryEnabled, data, error]);

    // // 🔍 4단계: 수동 테스트 함수
    // const manualTest = async () => {
    //     console.log('🧪 수동 테스트 시작...');
    //     try {
    //         const response = await navigationApi.getNavigationItems();
    //         console.log('🧪 수동 테스트 성공:', response.data);
    //     } catch (err) {
    //         console.error('🧪 수동 테스트 실패:', err);
    //     }
    // };
    //
    // // 🔍 5단계: 컴포넌트 마운트 시 즉시 수동 테스트
    // useEffect(() => {
    //     console.log('🔄 useNavigation 마운트됨 - 수동 테스트 실행');
    //     manualTest();
    // }, []);

    return {
        navigationItems: data || navigationItems,
        isLoading: isLoading || isRefetching,
        error,
        refetch,
        // manualTest, // 🔍 수동 테스트 함수 노출
        debug: {
            user,
            isAuthenticated,
            isQueryEnabled,
            status,
            isIdle,
            isLoading,
            isFetching,
            hasData: !!data,
            hasError: !!error
        }
    };
};