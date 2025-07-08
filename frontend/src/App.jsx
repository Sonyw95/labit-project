
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './App.css'

import {ColorSchemeScript} from "@mantine/core";
import {Router} from "@/Router.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Helmet from "@/components/common/Helmet.jsx";
import {CustomThemeProvider} from "@/contexts/ThemeContext.jsx";
import {ToastProvider} from "@/contexts/ToastContext.jsx";
import {AuthProvider} from "@/contexts/AuthContext.jsx";
import {BlogProvider} from "@/contexts/BlogContext.jsx";
import { apiClient } from './api/apiClient';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5분
            gcTime: 10 * 60 * 1000,   // 10분
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});
// Provider 설정 배열
const createProviders = () => [
    // QueryClient Provider
    ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    ),

    // Custom Theme Provider
    ({ children }) => (
        <CustomThemeProvider>
            {children}
        </CustomThemeProvider>
    ),

    // Toast Provider
    ({ children }) => (
        <ToastProvider maxToasts={5}>
            {children}
        </ToastProvider>
    ),

    // Auth Provider
    ({ children }) => (
        <AuthProvider apiClient={apiClient}>
            {children}
        </AuthProvider>
    ),

    // Blog Provider
    ({ children }) => (
        <BlogProvider    apiClient={apiClient}>
            {children}
        </BlogProvider>
    ),
];
import React, {memo} from 'react';
import {OptimizedColorSchemeProvider} from "@/contexts/OptimizedColorSchemeContext.jsx";
import {useRenderOptimization} from "@/hooks/useRenderOptimization.js";

// Provider들을 체인으로 연결하는 유틸리티 컴포넌트
const ProviderTree = ({ children, providers }) => {
    return providers.reduceRight(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
    );
};
const ColorSchemeWrapper = memo(({ children }) => {
    return (
        <OptimizedColorSchemeProvider>
            {children}
        </OptimizedColorSchemeProvider>
    );
});
const AppContent = memo(() => {
    const { renderCount } = useRenderOptimization('AppContent');

    return (
        <>
            <Helmet>
                <Router/>
            </Helmet>
            {import.meta.env.NODE_ENV !== 'development' && (
                <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                    Renders: {renderCount}
                </div>
            )}
        </>
    );
});
function App() {
    const providers = createProviders();
    return (
        <>
            <ColorSchemeScript defaultColorScheme="auto" />
            <ProviderTree providers={providers}>
                <ColorSchemeWrapper>
                    <AppContent/>
                </ColorSchemeWrapper>

            </ProviderTree>
        </>
    );
}

export default App
