import React, { useState, useEffect } from 'react';
import { AppShell, useMantineColorScheme } from '@mantine/core';
import CustomLoader from "@/components/loading/index.jsx";
import Header from "@/components/header/index.jsx";
import Navbar from "@/components/navBar/index.jsx";
import {Outlet} from "react-router-dom";
import MobileDrawer from "@/components/drawer/mobile/index.jsx";
import {FaJava} from "react-icons/fa";
import {SiSpring} from "react-icons/si";

// 네비게이션 메뉴 아이템
 const navigationItems = [
     { icon: 'IconHome', label: '홈', href: '/home',  requiredNav: true,
         subLinks: []
     },
     { icon: 'IconDevicesCode', label: '기술', href: '/post', requiredNav: false,
         subLinks: [
             {
                 icon: 'IconCoffee', label: 'Java', href: '/post/java', badge: '10', requiredNav: true, subLinks: []
             },
             {
                 icon: 'IconCoffee', label: 'Spring', href: '/post/spring', badge: '10', requiredNav: true, subLinks: []
             }
         ]
     },
     { icon: 'IconTags', label: '태그', href: '/tag', requiredNav: true,
         subLinks: []
     },
     // { icon: IconTrendingUp, label: '인기글', href: '/trending', hasLinks: false, requiredNav: true, subLinks: [] },
     // { icon: IconBookmark, label: '북마크', href: '/bookmarks', hasLinks: false, requiredNav: true, subLinks: [] },
     { icon: 'IconUser', label: '소개', href: '/about', requiredNav: true,
         subLinks: []
     },
 ];
// 인기 태그
const popularTags= [
    { name: 'React', count: 15, color: 'blue' },
    { name: 'Spring Boot', count: 12, color: 'green' },
    { name: 'Java', count: 18, color: 'orange' },
    { name: 'TypeScript', count: 8, color: 'indigo' },
    { name: 'AWS', count: 6, color: 'yellow' },
];
// 사용자 프로필 (데모용)
const userProfile = {
    name: 'LABit',
    email: 'labit@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'Full Stack Developer'
};

const TechBlogLayout = () => {
    const [opened, setOpened] = useState(false);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    // 로딩 효과 시뮬레이션
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prevProgress + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return <CustomLoader progress={progress} dark={dark} />;
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
                background: dark ? '#000000' : '#f8fafc',
            }}
        >
            <Header
                drawerOpened={drawerOpened}
                setDrawerOpened={setDrawerOpened}
                userProfile={userProfile}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                dark={dark}
            />

            <MobileDrawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                navigationItems={navigationItems}
                popularTags={popularTags}
                userProfile={userProfile}
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

export default TechBlogLayout;