// 필수! Mantine CSS 가져오기 (이게 없으면 Toast가 안 보임)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css'

import React, { memo } from 'react';
import {
    MantineProvider,
} from '@mantine/core';


// 지연 로딩 컴포넌트
import AppRouter from "./Router.jsx";
import {Notifications} from "@mantine/notifications";

import {AppProvider} from "@/contexts/AppContext.jsx";
import {ThemeProvider} from "@/contexts/ThemeContext.jsx";
import {ToastProvider} from "@/contexts/ToastContext.jsx";
import {ModalsProvider} from "@mantine/modals";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
// import {NotificationProvider} from "@/contexts/NotificationContext.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

// 메인 App 컴포넌트
const App = memo(() => {

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider defaultColorScheme="auto">
                <ModalsProvider >
                    {/* 🔥 중요! Notifications 컴포넌트가 있어야 Toast가 보임 */}
                    <Notifications
                        position="top-center"
                        zIndex={2077}
                        limit={5}
                        autoClose={4000}
                        transitionDuration={150}
                        containerWidth={320}
                    />
                    <AppProvider>
                        <ThemeProvider>
                            <ToastProvider>
                                <AppRouter />
                            </ToastProvider>
                        </ThemeProvider>
                    </AppProvider>
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    );
});

App.displayName = 'App';

export default App;