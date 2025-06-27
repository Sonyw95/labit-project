import React, { useState, useEffect } from 'react';
import {
    AppShell,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconCode,
} from '@tabler/icons-react';
import LoadOverlay from "@/components/layouts/overlay/LoadOverlay.jsx";
import Header from "@/components/section/Header.jsx";
import NavBar from "@/components/section/NavBar.jsx";
import {Outlet, useNavigate} from "react-router-dom";

const MainLayout = () => {
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const dark = colorScheme === 'dark';

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
                background: dark ? '#0d1117' : '#f8fafc',  // 매우 어두운 배경
            }}
        >
            <Header dark={dark} opened={opened}  setOpened={setOpened}  toggleColorScheme={toggleColorScheme} loginInfo={{isLoggedIn, setIsLoggedIn} } />
            <NavBar dark={dark} opened={opened}  setOpened={setOpened} loginInfo={{isLoggedIn, setIsLoggedIn} } />
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