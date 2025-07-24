import React, { useState } from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import Header from "@/components/main/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import NavigationMenu from "@/components/main/navigation/NavigationMenu.jsx";
// import MobileDrawer from "@/components/main/MobileDrawer.jsx";


const MainLayout = () => {
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme } = useTheme();


    // const { loading } = useLoadingEffect();
    // if (loading) {
    //     return <CustomLoader isDark={isDark} />;
    // }

    return (
        <AppShell
            header={{height: 60, offset: true}}
            // navbar={{
            //     width: 280,
            //     breakpoint: 'lg',
            //     collapsed: {mobile: true},
            // }}
            style={{
                background: dark ? '#1A1B23' : '#FFFFFF',
            }}
        >
            {/* Header */}
            <Header isDark={dark} navOpened={navOpened} setNavOpened={setNavOpened} toggleColorScheme={toggleColorScheme} />

            {/*<NavigationMenu isDark={dark} logo="/upload/images/logo.png"/>*/}

            {/*<MobileDrawer/>*/}

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                <Outlet/>
            </ScrollArea>

        </AppShell>
    );
};

export default MainLayout;