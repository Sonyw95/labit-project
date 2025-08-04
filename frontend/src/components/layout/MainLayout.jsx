
import React, { memo, useEffect, useState, useRef, createContext, useContext } from 'react';
import {
    AppShell, Center, Loader, ScrollArea, Text
} from '@mantine/core';
import { Outlet } from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "../../stores/authStore.js";
import useNavigationStore from "@/stores/navigationStore.js";
import { useRouteAuthGuard } from "@/hooks/useRouteAuthGuard.js";
import { useMemorySafeAuth } from "@/hooks/useMemorySafeAuth.js";

// ScrollArea Context 생성
const ScrollAreaContext = createContext(null);

export const useScrollArea = () => {
    const context = useContext(ScrollAreaContext);
    if (!context) {
        console.warn('useScrollArea must be used within ScrollAreaProvider');
        return { scrollToElement: () => {} };
    }
    return context;
};

const MainLayout = memo(() => {
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, themeColors } = useTheme();
    const scrollAreaRef = useRef(null);

    // Auth store 사용
    const {
        isAuthenticated,
        isAdmin,
        isLoading,
        isInitialized,
        user,
        setInitialized,
    } = useAuthStore();

    // Navigation Store 사용
    const { fetchNavigationTree } = useNavigationStore();

    // 커스텀 훅들
    useRouteAuthGuard();
    useMemorySafeAuth();

    // 스크롤 제어 함수
    const scrollToElement = (element, options = {}) => {
        if (!element || !scrollAreaRef.current) return false;

        try {
            const viewport = scrollAreaRef.current;
            const elementRect = element.getBoundingClientRect();
            const viewportRect = viewport.getBoundingClientRect();

            // 요소가 뷰포트 밖에 있는지 확인
            const isOutOfView =
                elementRect.bottom > viewportRect.bottom ||
                elementRect.top < viewportRect.top;

            if (isOutOfView) {
                // ScrollArea 내에서의 상대 위치 계산
                const elementTop = element.offsetTop;
                const viewportHeight = viewport.clientHeight;
                const elementHeight = element.offsetHeight;

                // 요소가 중앙에 오도록 계산
                const scrollTop = elementTop - (viewportHeight / 2) + (elementHeight / 2);

                viewport.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: options.smooth !== false ? 'smooth' : 'auto'
                });

                return true;
            }
            return false;
        } catch (error) {
            console.warn('ScrollArea scroll failed:', error);

            // 폴백: 기본 scrollIntoView
            try {
                element.scrollIntoView({
                    behavior: options.smooth !== false ? 'smooth' : 'auto',
                    block: 'center'
                });
                return true;
            } catch (fallbackError) {
                console.error('All scroll methods failed:', fallbackError);
                return false;
            }
        }
    };

    // 앱 초기화 처리
    useEffect(() => {
        if (!isInitialized && !isLoading) {
            console.log('수동 초기화 실행');
            const timer = setTimeout(() => {
                setInitialized();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isInitialized, isLoading, setInitialized]);

    // 네비게이션 데이터 로드
    useEffect(() => {
        fetchNavigationTree();
        console.log('네비게이션 트리 로드');

        if (isAdmin || (isInitialized && isAuthenticated)) {
            // Additional logic if needed
        }
    }, [isAdmin, isInitialized, isAuthenticated, fetchNavigationTree]);

    // 초기화 중이거나 로딩 중이면 로딩 표시
    if (!isInitialized || isLoading) {
        return (
            <Center h="100vh">
                <div style={{ textAlign: 'center' }}>
                    <Loader size="lg" />
                    <Text mt="md">초기화 중...</Text>
                </div>
            </Center>
        );
    }

    return (
        <ScrollAreaContext.Provider value={{ scrollToElement, scrollAreaRef }}>
            <AppShell
                header={{ height: 60, offset: true }}
                style={{
                    backgroundColor: themeColors.background,
                }}
            >
                <Header
                    isDark={dark}
                    navOpened={navOpened}
                    setNavOpened={setNavOpened}
                    toggleColorScheme={toggleColorScheme}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    isLoading={isLoading}
                />

                <MobileDrawer
                    opened={navOpened}
                    onClose={setNavOpened}
                    toggleColorScheme={toggleColorScheme}
                    user={user}
                    isAuthenticated={isAuthenticated}
                />

                {/* ScrollArea 높이 개선 및 ref 추가 */}
                <ScrollArea
                    component={AppShell.Main}
                    h="calc(100vh - 60px)" // Header 높이 제외한 전체 높이
                    scrollbars="y"
                    viewportRef={scrollAreaRef}
                    type="auto"
                    offsetScrollbars
                    scrollbarSize={8}
                    scrollHideDelay={1000}
                    style={{
                        backgroundColor: themeColors.background
                    }}
                >
                    <Outlet />
                </ScrollArea>
            </AppShell>
        </ScrollAreaContext.Provider>
    );
});

export default MainLayout;