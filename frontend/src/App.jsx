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