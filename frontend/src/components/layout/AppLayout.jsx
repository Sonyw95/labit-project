import React, {useState} from 'react';
import {
    AppShell, ScrollArea
} from '@mantine/core';
import Header from './Header';
import Navigation from './Navigation';
import { animations } from '@/utils/animations.js';
import {BackgroundBlur} from "@/utils/backgroundBlur.js";
import {NAVIGATION_ITEMS, POPULAR_TAGS} from "@/utils/constants.js";
import {useSelectiveColorScheme} from "@/hooks/useSelectiveColorScheme.js";

const AppLayout = ({ children, loading = false }) => {
    const isDark = useSelectiveColorScheme(state => state.isDark);
    const [opened, setOpened] = useState(false);

    // if (loading) {
    //     return (
    //         <Box
    //             style={{
    //                 height: '100vh',
    //                 background: dark ? '#0d1117' : '#f8fafc',
    //                 overflow: 'hidden',
    //             }}
    //         >
    //             {children}
    //             <style>{animations}</style>
    //         </Box>
    //     );
    // }

    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 280,
                breakpoint: 'lg',
                collapsed: { mobile: true },
            }}
            style={{
                background: isDark ? '#0d1117' : '#f8fafc',
            }}
        >
            <AppShell.Header
                ml={{lg: 'var(--app-shell-navbar-width, 280px)'}}
                style={{
                    background: isDark ? '#161b22' : '#ffffff',
                    borderBottom: `1px solid ${isDark ? '#21262d' : '#e5e7eb'}`,
                    ...BackgroundBlur({ color:isDark ? '#161b22' : '#ffffff', alpha: 0.7})
                }}>
                <Header opened={opened} onToggle={() => setOpened(!opened)} />
            </AppShell.Header>

            <AppShell.Navbar p="md" style={{
                background: isDark ? '#161b22' : '#ffffff',
                borderRight: `1px solid ${isDark ? '#21262d' : '#e5e7eb'}`,
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                height: '100vh',
                zIndex: 100
            }}>
                <Navigation popularTags={POPULAR_TAGS} navigationItems={NAVIGATION_ITEMS}/>
            </AppShell.Navbar>

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                {children}
            </ScrollArea>

            <style>{animations}</style>
        </AppShell>
    );
};

export default AppLayout;