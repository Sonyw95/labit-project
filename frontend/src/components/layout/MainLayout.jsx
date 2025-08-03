import React, {memo, useEffect, useState} from 'react';
import {
    AppShell, Center, Loader, ScrollArea,
} from '@mantine/core';
import { Outlet} from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "../../stores/authStore.js";
import useNavigationStore from "@/stores/navigationStore.js";
import {useRouteAuthGuard} from "@/hooks/useRouteAuthGuard.js";
import {useMemorySafeAuth} from "@/hooks/useMemorySafeAuth.js";

const MainLayout = memo(() => {
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, themeColors } = useTheme();

    // Auth store 사용
    const {
        isAuthenticated,
        isAdmin,
        isLoading,
        isInitialized, // 새로 추가
        user,
        setInitialized,
    } = useAuthStore();

    // Navigation Store 사용
    const { fetchNavigationTree } = useNavigationStore();

    // 커스텀 훅들 - 초기화 완료 후에만 실행
    useRouteAuthGuard(); // 라우트 변경 시 토큰 검증
    useMemorySafeAuth(); // 메모리 안전 인증 관리

    // 앱 초기화 처리
    useEffect(() => {
        // persist 로딩이 완료되었지만 아직 초기화되지 않은 경우
        if (!isInitialized && !isLoading) {
            console.log('수동 초기화 실행');
            const timer = setTimeout(() => {
                setInitialized();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isInitialized, isLoading, setInitialized]);

    // 네비게이션 데이터 로드 (초기화 완료 후)
    useEffect(() => {
        fetchNavigationTree();
        console.log('네비게이션 트리 로드');

        if ( isAdmin || isInitialized && isAuthenticated ) {
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
        <AppShell
            header={{height: 60, offset: true}}
            style={{
                backgroundColor: themeColors.background,
            }}
        >
            {/*Header - user 정보를 prop으로 전달*/}
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

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                <Outlet/>
            </ScrollArea>

        </AppShell>
    );
});

export default MainLayout;