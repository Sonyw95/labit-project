import React, {useState} from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "../../stores/authStore.js";

const MainLayout = () => {
    console.log('MainLayout');
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, velogColors } = useTheme();

    // 새로운 auth store 사용 - 더 이상 별도의 user info 요청 불필요
    const {
        user,
        isAuthenticated,
        isAdmin,
        isLoading
    } = useAuthStore();

    // Context에서 사용자 정보를 직접 사용
    // user 정보는 이미 토큰에서 추출되어 store에 저장되어 있음

    return (
        <AppShell
            header={{height: 60, offset: true}}
            style={{
                backgroundColor: velogColors.background,
            }}
        >
            {/* Header - user 정보를 prop으로 전달 */}
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
};

export default MainLayout;