import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {authApi} from "@/api/authApi.js";
import {useApiStore} from "@/stores/apiStore.js";
import {useApi} from "@/hooks/useApi.js";

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        accessToken,
        setAuth,
        clearAuth,
        setAuthLoading,
        setAuthError,
        updateUser
    } = useApiStore();
    const {createQuery, createMutation} =  useApi();

    // 사용자 정보 유효성 검증 (일정 시간마다)
    const { refetch: validateUser } = createQuery(
        ['validateUser'],
        async () => {
            try {
                const response = await authApi.getUserInfo();
                updateUser(response.data);
                return response.data;
            } catch (error) {
                // 사용자 정보가 유효하지 않으면 로그아웃
                logout();
                throw error;
            }
        },
        {
            enabled: isAuthenticated && !!accessToken,
            refetchInterval: 30 * 60 * 1000, // 30분마다 검증
            refetchOnWindowFocus: true,
            retry: 1,
        }
    )

    // 카카오 로그인
    const kakaoLoginMutation = createMutation(
        authApi.kakaoLogin,
        {
            onMutate: () => {
                setAuthLoading(true);
                setAuthError(null);
            },
            onSuccess: (response) => {
                const authData = response.data;
                setAuth(authData); // 🔥 persist가 자동으로 localStorage에 저장
                setAuthError(null);
            },
            onError: (error) => {
                setAuthError(error.response?.data?.message || '로그인에 실패했습니다.');
                clearAuth(); // 🔥 persist가 자동으로 localStorage에서 제거
            },
            onSettled: () => {
                setAuthLoading(false);
            },
        }

    )

    // 로그아웃
    const logoutMutation = createMutation(
        authApi.logout,
        {
            onMutate: () => {
                setAuthLoading(true);
            },
            onSuccess: () => {
                clearAuth(); // 🔥 persist가 자동으로 localStorage에서 제거
            },
            onError: (error) => {
                console.error('Logout error:', error);
                // 에러가 발생해도 로컬 상태는 초기화
                clearAuth();
            },
            onSettled: () => {
                setAuthLoading(false);
            },
        }
    )

    // 카카오 로그인 함수
    const kakaoLogin = useCallback(async (accessToken) => {
        return kakaoLoginMutation.mutateAsync(accessToken);
    }, [kakaoLoginMutation]);

    // 로그아웃 함수
    const logout = useCallback(() => {
        logoutMutation.mutate();
    }, [logoutMutation]);

    // 권한 체크 함수
    const hasRole = useCallback((requiredRole) => {
        if (!user || !isAuthenticated) {
            return false;
        }

        const userRole = user.role;

        // ADMIN은 모든 권한을 가짐
        if (userRole === 'ADMIN') {
            return true;
        }

        // 정확한 역할 매칭
        return userRole === requiredRole;
    }, [user, isAuthenticated]);

    // 권한 체크 (배열로 여러 권한 중 하나라도 만족)
    const hasAnyRole = useCallback((roles) => {
        if (!Array.isArray(roles)) {
            return hasRole(roles);
        }
        return roles.some(role => hasRole(role));
    }, [hasRole]);

    return {
        // 상태
        user,
        isAuthenticated,
        isLoading: kakaoLoginMutation.isPending || logoutMutation.isPending,
        error: useApiStore.getState().authError,

        // 액션
        kakaoLogin,
        logout,

        // 권한 체크
        hasRole,
        hasAnyRole,

        // 사용자 정보 재검증
        validateUser,
    };
};