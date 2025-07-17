import React, { useState} from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';

// 스타일 imports
import '../styles/animation.css';
import {useTheme} from "@/hooks/useTheme.js";
import Header from "@/components/layout/Header.jsx";
import {backgroundBlur} from "@/utils/backgroundBlur.js";
// import Navbar from "@/components/layout/Navbar.jsx";
// import {NAVIGATION_ITEMS, POPULAR_TAGS} from "@/constants/data.js";
// import MobileNav from "@/components/layout/MobileNav.jsx";
import {Outlet} from "react-router-dom";
import NavigationTree from "@/components/NavigationTree.jsx";

const MainPageLayout = () => {
    console.log('Main')
    const [drawerOpened, setDrawerOpened] = useState(false);
    const {dark} = useTheme();

    return (
        <AppShell
            header={{height: 60, offset: true}}
            navbar={{
                width: 280,
                breakpoint: 'lg',
                collapsed: {mobile: true},
            }}
            // padding="md"
            style={{
                background: dark ? '#1a1a1a' : '#f8fafc',
            }}
        >
            <AppShell.Header
                ml={{lg: 'var(--app-shell-navbar-width, 280px)'}}
                style={{
                    background: dark ? '#161b22' : '#ffffff',
                    borderBottom: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                    ...backgroundBlur({ color:dark ? '#161b22' : '#ffffff', alpha: 0.7})
                }}>
                <Header
                    drawerOpened={drawerOpened}
                    setDrawerOpened={setDrawerOpened}
                />
            </AppShell.Header>


            {/*<MobileNav*/}
            {/*    opened={drawerOpened}*/}
            {/*    onClose={() => setDrawerOpened(false)}*/}
            {/*    navigationItems={NAVIGATION_ITEMS}*/}
            {/*    popularTags={POPULAR_TAGS}*/}
            {/*/>*/}
            <AppShell.Navbar p="md" style={{
                background: dark ? '#161b22' : '#ffffff',
                borderRight: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                height: '100vh',
                zIndex: 100
            }}>
                <NavigationTree />
                {/*<Navbar*/}
                {/*    navigationItems={navigationItems}*/}
                {/*    isLoading={navLoading}*/}
                {/*    error={navError}*/}
                {/*    popularTags={POPULAR_TAGS}*/}
                {/*/>*/}
            </AppShell.Navbar>

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                <Outlet
                />
            </ScrollArea>
        </AppShell>
    );
};

export default MainPageLayout;