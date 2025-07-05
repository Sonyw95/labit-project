import React, { useState, useEffect } from 'react';
import {
    AppShell,
    useMantineColorScheme,
} from '@mantine/core';

// 스타일 imports
import '../styles/animation.css';
import CustomLoader from "@/components/CustomLoader.jsx";
import Navbar from "@/components/Navbar.jsx";
import Header from "@/components/Header.jsx";
import {Outlet} from "react-router-dom";
import MobileDrawer from "@/components/MobileDrawer.jsx";
import {navigationItems, popularTags} from "@/constants/data.js";
import useScrollToTop from "@/hooks/useScrollToTop.js";

const MainPageLayout = () => {
    console.log('Main')
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { colorScheme,toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    useScrollToTop();
    // 로딩 효과 시뮬레이션
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setProgress((prevProgress) => {
    //             if (prevProgress >= 100) {
    //                 clearInterval(timer);
    //                 setTimeout(() => setLoading(false), 500);
    //                 return 100;
    //             }
    //             return prevProgress + Math.random() * 15;
    //         });
    //     }, 200);
    //
    //     return () => clearInterval(timer);
    // }, []);
    //
    //
    //
    // if (loading) {
    //     return (
    //         <Box
    //             style={{
    //                 height: '100vh',
    //                 background: dark ? '#0d1117' : '#f8fafc',
    //                 overflow: 'hidden',
    //             }}
    //         >
    //             <CustomLoader progress={progress} dark={dark} />
    //         </Box>
    //     );
    // }

    return (
        <AppShell
            header={{ height: 70 , offset: true}}
            navbar={{
                width: 280,
                breakpoint: 'lg',
                collapsed: { mobile: true },
            }}
            // padding="md"
            style={{
                background: dark ? '#1a1a1a' : '#f8fafc',
            }}
        >
            <Header
                drawerOpened={drawerOpened}
                setDrawerOpened={setDrawerOpened}
                // userProfile={userProfile}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                toggleColorScheme={toggleColorScheme}
                dark={dark}
            />

            <MobileDrawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                navigationItems={navigationItems}
                popularTags={popularTags}
                // userProfile={userProfile}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                dark={dark}
            />
            <Navbar
                navigationItems={navigationItems}
                popularTags={popularTags}
                dark={dark}
            />
            <AppShell.Main h='100%'>
                <Outlet context={{
                    loading,
                    dark
                }}/>
            </AppShell.Main>
        </AppShell>
    );
};

export default MainPageLayout;