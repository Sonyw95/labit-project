import React, {memo, useEffect, useState} from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "../../stores/authStore.js";
import useNavigationStore from "@/stores/navigationStore.js";

const MainLayout = memo(() => {
    console.log('MainLayout');
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, themeColors } = useTheme();

    // 새로운 auth store 사용 - 더 이상 별도의 user info 요청 불필요
    const {
        user,
        isAuthenticated,
        isAdmin,
        isLoading
    } = useAuthStore();

    // Navigation Store 사용
    const { fetchNavigationTree } = useNavigationStore();
    // 컴포넌트 마운트 시 네비게이션 데이터 로드
    useEffect(() => {
        // 네비게이션 트리 초기 로드
        fetchNavigationTree();
    }, [user, fetchNavigationTree]);

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