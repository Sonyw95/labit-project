// components/auth/ProtectedRoute.jsx
import React, { memo, useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Loader, Text, Stack } from '@mantine/core';
import useAuthStore from "../../stores/authStore.js";
import {showToast} from "../advanced/Toast.jsx";

const ProtectedRoute = memo(({
                                 children,
                                 requiredRole = null,
                                 fallbackPath = '/home',
                                 allowedRoles = [],
                                 showLoader = true
                             }) => {
    const location = useLocation();
    const {
        isAuthenticated,
        user,
        isLoading,
        checkTokenValidity,
        initialize
    } = useAuthStore();

    // 현재 경로가 인증이 필요한지 확인
    const requiresAuth = useMemo(() => {
        const publicPaths = [
            '/',
            '/home',
            '/auth/kakao/callback',
            '/posts',
            '/post/view'
        ];

        return !publicPaths.some(path =>
            location.pathname === path ||
            location.pathname.startsWith(path)
        );
    }, [location.pathname]);

    // 역할 확인 함수
    const hasRequiredRole = useMemo(() => {
        if (!user || (!requiredRole && allowedRoles.length === 0)) {
            return true;
        }

        if (requiredRole) {
            return user.role === requiredRole;
        }

        if (allowedRoles.length > 0) {
            return allowedRoles.includes(user.role);
        }

        return false;
    }, [user, requiredRole, allowedRoles]);

    // 초기화 및 토큰 검증
    useEffect(() => {
        const initializeAuth = async () => {
            if (!isAuthenticated && requiresAuth) {
                await initialize();
            }
        };

        initializeAuth();
    }, [initialize, isAuthenticated, requiresAuth]);

    // 토큰 유효성 주기적 확인 (5분마다)
    useEffect(() => {
        if (!isAuthenticated || !requiresAuth) {
            return;
        }

        const interval = setInterval(() => {
            if (!checkTokenValidity()) {
                showToast.warning('세션 만료', '다시 로그인해주세요.');
                // 자동 로그아웃은 API 인터셉터에서 처리
            }
        }, 5 * 60 * 1000); // 5분

        return () => clearInterval(interval);
    }, [isAuthenticated, checkTokenValidity, requiresAuth]);

    // 로딩 상태
    if (isLoading && showLoader) {
        return (
            <Center h="100vh">
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text size="sm" c="dimmed">
                        인증 정보를 확인 중입니다...
                    </Text>
                </Stack>
            </Center>
        );
    }

    // 인증이 필요하지 않은 페이지
    if (!requiresAuth) {
        return children;
    }

    // 인증되지 않은 사용자
    if (!isAuthenticated) {
        showToast.warning('로그인 필요', '로그인이 필요한 페이지입니다.');
        return (
            <Navigate
                to={fallbackPath}
                state={{ from: location }}
                replace
            />
        );
    }

    // 권한이 없는 사용자
    if (!hasRequiredRole) {
        showToast.error('접근 권한 없음', '해당 페이지에 접근할 권한이 없습니다.');
        return (
            <Navigate
                to={fallbackPath}
                state={{ from: location }}
                replace
            />
        );
    }

    // 토큰이 만료된 경우
    if (!checkTokenValidity()) {
        showToast.warning('세션 만료', '세션이 만료되었습니다. 다시 로그인해주세요.');
        return (
            <Navigate
                to={fallbackPath}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;