import React, { useState } from 'react';
import {
    AppShell, ScrollArea,
    useMantineColorScheme,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import Header from "@/components/main/Header.jsx";
import {NavigationMenu} from "@/components/main/navigation/NavigationMenu.jsx";
// import MobileDrawer from "@/components/main/MobileDrawer.jsx";

// Import components (these would be separate files in a real project)
// import { CustomLoader } from './CustomLoader';
// import { NavigationMenu } from './NavigationMenu';
// import { HeroSection } from './HeroSection';
// import { RecentPosts } from './RecentPosts';
// import { useLoadingEffect } from './hooks/useLoadingEffect';

const MainLayout = () => {
    const [navOpened, setNavOpened] = useState(false);
    // const { loading } = useLoadingEffect();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    //
    // if (loading) {
    //     return <CustomLoader isDark={isDark} />;
    // }

    return (
        <AppShell
            header={{height: 60, offset: true}}
            navbar={{
                width: 280,
                breakpoint: 'lg',
                collapsed: {mobile: true},
            }}
            style={{
                background: isDark ? '#1a1a1a' : '#f8fafc',
            }}
        >
            {/* Header */}
            <Header isDark={isDark} navOpened={navOpened} setNavOpened={setNavOpened} toggleColorScheme={toggleColorScheme} />

            <NavigationMenu isDark={isDark} />

            {/*<MobileDrawer/>*/}

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                <Outlet/>
            </ScrollArea>
        </AppShell>
    );
};

export default MainLayout;