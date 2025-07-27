import React, {useEffect, useState} from 'react';
import {
    AppShell, ScrollArea,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import Header from "@/components/main/header/Header.jsx";
import {useTheme} from "../../contexts/ThemeContext.jsx";
import MobileDrawer from "../main/MobileDrawer.jsx";
import useAuthStore from "@/stores/authStore.js";
import {useUserInfo} from "@/hooks/api/useApi.js";


const MainLayout = () => {
    console.log('MainLayout')
    const [navOpened, setNavOpened] = useState(false);
    const { dark, toggleColorScheme, velogColors } = useTheme();
    const {setUser, isAuthenticated } = useAuthStore();
    const { data } = useUserInfo();

    useEffect(() => {
        if( isAuthenticated ){
            setUser(data);
        }
    }, [data, isAuthenticated, setUser]);

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
                backgroundColor: velogColors.background,
            }}
        >
            {/* Header */}
            <Header isDark={dark} navOpened={navOpened} setNavOpened={setNavOpened} toggleColorScheme={toggleColorScheme} />

            {/*<NavigationMenu isDark={dark} logo="/upload/images/logo.png"/>*/}

            <MobileDrawer opened={navOpened} onClose={setNavOpened} toggleColorScheme={toggleColorScheme}/>

            <ScrollArea component={AppShell.Main} h={200} scrollbars="y">
                <Outlet/>
            </ScrollArea>

        </AppShell>
    );
};

export default MainLayout;