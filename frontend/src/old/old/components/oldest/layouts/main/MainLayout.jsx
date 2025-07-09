import React, { useState, useEffect } from 'react';
import {
    AppShell,
    useMantineColorScheme,
} from '@mantine/core';

import LoadOverlay from "@/components/layouts/overlay/LoadOverlay.jsx";
import Header from "@/components/section/Header.jsx";
import NavBar from "@/components/section/NavBar.jsx";
import {Outlet} from "react-router-dom";
import {useAuthStore} from "@/store/authStore.js";


const MainLayout = () => {

    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const dark = colorScheme === 'dark';
    const { checkAuthToken } = useAuthStore();

// 컴포넌트 마운트 시 인증 토큰 확인
    useEffect(() => {
        checkAuthToken();
    }, [checkAuthToken]);

    // 로딩 효과 시뮬레이션
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                const value = prevProgress + Math.random() * 15
                if (prevProgress >= 100 || value >= 100 ) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return value;
            });
        }, 200);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return (
            <LoadOverlay dark={dark} progress={progress}/>
        );
    }
    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 280,
                breakpoint: 'lg',
                collapsed: { mobile: true },
            }}
            // padding="md"
            style={{
                background: dark ? '#21262d' : '#f8fafc',  // 매우 어두운 배경
            }}
        >
            <Header dark={dark} opened={opened}  setOpened={setOpened}  toggleColorScheme={toggleColorScheme}  />
            <NavBar dark={dark} opened={opened}  setOpened={setOpened}  />
            <AppShell.Main h='100%'>
                <Outlet context={{
                    loading,
                    dark
                }}/>
            </AppShell.Main>
        </AppShell>
    );
};

export default MainLayout;