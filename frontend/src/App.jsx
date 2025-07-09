// 필수! Mantine CSS 가져오기 (이게 없으면 Toast가 안 보임)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React, { lazy, memo, useMemo } from 'react';
import {
    MantineProvider,
    ColorSchemeScript,
    createTheme, Box, Button, Text, Title,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { ToastProvider } from './contexts/ToastContext'; // 수정된 ToastProvider
import { ThemeProvider } from './contexts/ThemeContext';

// 지연 로딩 컴포넌트
import AppRouter from "./Router.jsx";
import Skeleton from "./components/common/Skeleton.jsx";

// React Query 클라이언트 설정
const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

// 로딩 컴포넌트
const GlobalLoading = memo(() => (
    <Box style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
    }}>
        <Skeleton type="card" count={3} />
    </Box>
));

GlobalLoading.displayName = 'GlobalLoading';

// 에러 경계 컴포넌트
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <Title>오류가 발생했습니다</Title>
                    <Text>{this.state.error?.message}</Text>
                    <Button
                        onClick={this.handleReset}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        다시 시도
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

// Context Provider 래퍼
const ContextProviders = memo(({ children, queryClient }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <AuthProvider>
                <BlogProvider>
                    <ToastProvider>
                        {children}
                        {import.meta.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools
                                initialIsOpen={false}
                                position="bottom-right"
                            />
                        )}
                    </ToastProvider>
                </BlogProvider>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
));

ContextProviders.displayName = 'ContextProviders';

// Mantine Provider 래퍼
const MantineProviders = memo(({ children }) => (
    <MantineProvider defaultColorScheme="auto">
        <ModalsProvider>
            {/* 🔥 중요! Notifications 컴포넌트가 있어야 Toast가 보임 */}
            <Notifications
                position="top-right"
                zIndex={2077}
                limit={5}
                autoClose={4000}
                transitionDuration={150}
                containerWidth={320}
            />
            {children}
        </ModalsProvider>
    </MantineProvider>
));

MantineProviders.displayName = 'MantineProviders';

// // 앱 콘텐츠 컴포넌트
// const AppContent = memo(() => {
//     const [showTest, setShowTest] = React.useState(false);
//
//     return (
//         <div>
//             {/* Toast 테스트 버튼 (개발 환경에서만) */}
//             {process.env.NODE_ENV === 'development' && (
//                 <div style={{
//                     position: 'fixed',
//                     top: '10px',
//                     left: '10px',
//                     zIndex: 9999,
//                     background: 'white',
//                     padding: '10px',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                     border: '1px solid #ddd'
//                 }}>
//                     <button
//                         onClick={() => setShowTest(!showTest)}
//                         style={{
//                             background: '#2196f3',
//                             color: 'white',
//                             border: 'none',
//                             padding: '8px 16px',
//                             borderRadius: '4px',
//                             cursor: 'pointer',
//                             marginBottom: showTest ? '10px' : '0'
//                         }}
//                     >
//                         {showTest ? 'Hide' : 'Show'} Toast Test
//                     </button>
//                     {showTest && <ToastTest />}
//                 </div>
//             )}
//
//             {/* 메인 콘텐츠 */}
//             <Suspense fallback={<GlobalLoading />}>
//                 <TechBlogLayout />
//             </Suspense>
//         </div>
//     );
// });
//
// AppContent.displayName = 'AppContent';

// 메인 App 컴포넌트
const App = memo(() => {
    const queryClient = useMemo(() => createQueryClient(), []);

    const handleErrorReset = () => {
        queryClient.clear();
        window.location.reload();
    };

    return (
        <>
            {/* SSR을 위한 Color Scheme Script */}
            <ColorSchemeScript defaultColorScheme="auto" />

            {/* 전역 에러 경계 */}
            <ErrorBoundary onReset={handleErrorReset}>
                {/* Mantine Provider (Notifications 포함) */}
                <MantineProviders>
                    {/* Context Providers */}
                    <ContextProviders queryClient={queryClient}>
                        {/* 앱 콘텐츠 */}
                        <AppRouter />
                    </ContextProviders>
                </MantineProviders>
            </ErrorBoundary>
        </>
    );
});

App.displayName = 'App';

export default App;