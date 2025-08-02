// 필수! Mantine CSS 가져오기 (이게 없으면 Toast가 안 보임)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/spotlight/styles.css';

import 'highlight.js/styles/idea.css';
import './App.css'

import React, {memo, useEffect, useState} from 'react';
import {
    MantineProvider,
    LoadingOverlay,
    Center,
    Text,
    Stack,
} from '@mantine/core';

import AppRouter from "./Router.jsx";
import {Notifications} from "@mantine/notifications";

import {ThemeProvider} from "@/contexts/ThemeContext.jsx";
import {ToastProvider} from "@/contexts/ToastContext.jsx";
import {ModalsProvider} from "@mantine/modals";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import useAuthStore from "./stores/authStore.js";
import {showToast} from "./components/advanced/Toast.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                // 401 에러는 재시도하지 않음 (토큰 갱신은 interceptor에서 처리)
                if (error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 1;
            },
            staleTime: 5 * 60 * 1000, // 5분
            cacheTime: 10 * 60 * 1000, // 10분
        },
        mutations: {
            retry: (failureCount, error) => {
                if (error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 1;
            },
        },
    },
});

// 메인 App 컴포넌트
const App = memo(() => {
    const {
        validateStoredTokens,
        setLoading,
        isLoading,
        setTokens,
        logout
    } = useAuthStore();

    const [isInitializing, setIsInitializing] = useState(true);

    // 앱 시작시 토큰 유효성 검사 및 자동 갱신
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);
                console.log('앱 초기화: 인증 상태 확인 시작');

                const validationResult = validateStoredTokens();

                if (validationResult === 'refresh_needed') {
                    // Refresh token으로 자동 갱신 시도
                    console.log('토큰 자동 갱신 시도');
                    // const refreshToken = useAuthStore.getState().getRefreshToken();

                    // try {
                    //     const response = await authService.refreshToken();
                    //     const { accessToken, refreshToken: newRefreshToken } = response;
                    //
                    //     const success = setTokens(accessToken, newRefreshToken);
                    //     if (success) {
                    //         console.log('앱 시작시 토큰 자동 갱신 성공');
                    //         showToast.success('세션 복원', '이전 로그인 세션이 복원되었습니다.');
                    //     } else {
                    //         throw new Error('토큰 저장 실패');
                    //     }
                    // } catch (error) {
                    //     console.error('앱 시작시 토큰 갱신 실패:', error);
                    //     logout();
                    //     showToast.info('세션 만료', '새로 로그인해주세요.');
                    // }
                    logout();
                    showToast.info('세션 만료', '새로 로그인해주세요.');
                } else if (validationResult === true) {
                    console.log('저장된 토큰이 유효함');
                } else {
                    console.log('유효한 토큰이 없음');
                }

            } catch (error) {
                console.error('앱 초기화 중 오류:', error);
                logout();
            } finally {
                setLoading(false);
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [validateStoredTokens, setLoading, setTokens, logout]);

    // 초기화 중 로딩 화면
    if (isInitializing) {
        return (
            <MantineProvider defaultColorScheme="auto">
                <Center h="100vh">
                    <Stack align="center" spacing="md">
                        <LoadingOverlay
                            overlayProps={{ radius: "sm", blur: 2 }}
                            loaderProps={{ size: 'lg' }}
                        />
                        <Text size="lg" fw={500}>앱을 시작하는 중...</Text>
                        <Text size="sm" c="dimmed">잠시만 기다려주세요</Text>
                    </Stack>
                </Center>
            </MantineProvider>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme="auto">
                <ModalsProvider>
                    {/* 🔥 중요! Notifications 컴포넌트가 있어야 Toast가 보임 */}
                    <Notifications
                        position="top-center"
                        zIndex={2077}
                        limit={5}
                        autoClose={4000}
                        transitionDuration={150}
                        containerWidth={320}
                    />
                    <ThemeProvider>
                        <ToastProvider>
                            {/* 전역 로딩 상태 */}
                            {/*<LoadingOverlay*/}
                            {/*    visible={isLoading}*/}
                            {/*    overlayProps={{ radius: "sm", blur: 1 }}*/}
                            {/*    loaderProps={{ size: 'md' }}*/}
                            {/*/>*/}
                            <AppRouter />
                        </ToastProvider>
                    </ThemeProvider>
                </ModalsProvider>

            </MantineProvider>
        </QueryClientProvider>
    );
});

App.displayName = 'App';

export default App;