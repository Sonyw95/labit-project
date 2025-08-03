import React, {memo, useEffect, useState} from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "../../stores/authStore.js";
import useNavigationStore from "@/stores/navigationStore.js";

const MainLayout = memo(() => {
    const location = useLocation();
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, themeColors } = useTheme();
    const [validationError, setValidationError] = useState(false);

    // Auth store 사용
    const {
        isAuthenticated,
        isAdmin,
        isLoading,
        user,
        validateStoredTokens,
        logout
    } = useAuthStore();

    // Navigation Store 사용
    const { fetchNavigationTree } = useNavigationStore();

    // 라우트 변경 시 토큰 검증
    useEffect(() => {
        const validateOnRouteChange = async () => {
            if (isAuthenticated) {
                try {
                    setValidationError(false);
                    console.log('라우트 변경 감지, 토큰 검증 중:', location.pathname);
                    await validateStoredTokens();
                } catch (error) {
                    console.error('토큰 검증 실패:', error);
                    setValidationError(true);
                    logout();
                }
            }
        };
        validateOnRouteChange();
    }, [location.pathname, isAuthenticated, validateStoredTokens, logout]);

    // 컴포넌트 마운트 시 네비게이션 데이터 로드
    useEffect(() => {
        if (isAuthenticated && !validationError) {
            fetchNavigationTree();
            console.log('네비게이션 트리 로드');
        }
    }, [isAdmin, fetchNavigationTree, isAuthenticated, validationError]);

    // 로딩 중이면 로딩 표시
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                로딩중...
            </div>
        );
    }

    // 인증되지 않았거나 검증 에러가 있으면 로그인 페이지로 리다이렉트
    if (validationError) {
        return <Navigate to="/home" state={{ from: location }} replace />;
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