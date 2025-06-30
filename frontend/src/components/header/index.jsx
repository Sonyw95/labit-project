import React from 'react';
import {
    AppShell,
    Burger,
    Group,
    Text,
    ThemeIcon,
    ActionIcon,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconCode,
    IconMoon, IconSun,
} from '@tabler/icons-react';
import UserDropdown from "@/components/userDropDown/index.jsx";
import Logo from "@/components/logo/index.jsx";
const Header = ({
                    drawerOpened,
                    setDrawerOpened,
                    userProfile,
                    isLoggedIn,
                    setIsLoggedIn,
                    dark,
                }) => {
    const { toggleColorScheme } = useMantineColorScheme();
    return (
        <AppShell.Header
            style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 헤더
                borderBottom: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}
        >
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Burger
                        opened={drawerOpened}
                        onClick={() => setDrawerOpened(!drawerOpened)}
                        hiddenFrom="lg"
                        size="sm"
                        style={{
                            color: dark ? '#ffffff' : '#1e293b',
                        }}
                    />
                    <Group gap="xs">
                        <ThemeIcon
                            size="lg"
                            radius="md"
                            style={{
                                background: '#4c6ef5',
                                boxShadow: 'none',
                            }}
                        >
                            <Logo
                                isLogo
                                radius="xl"
                                size="sm"
                                dark={dark}
                                href="/home"
                            />
                        </ThemeIcon>
                        <div>
                            <Text
                                size="lg"
                                fw={700}
                                style={{
                                    color: dark ? '#ffffff' : '#1e293b',
                                }}
                            >
                                LABit
                            </Text>
                            <Text size="xs" c="dimmed">
                                기술과 성장의 기록
                            </Text>
                        </div>
                    </Group>
                </Group>

                <Group gap="xs">
                    <ActionIcon
                        variant="light"
                        size="lg"
                        radius="md"
                        onClick={toggleColorScheme}
                        style={{
                            background: dark ? '#21262d' : '#f3f4f6',  // 어두운 배경
                            border: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: dark ? '#30363d' : '#e5e7eb',  // 어두운 호버 색상
                            }
                        }}
                    >
                        {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                    </ActionIcon>
                    <UserDropdown
                        userProfile={userProfile}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        dark={dark}
                    />
                </Group>
            </Group>
        </AppShell.Header>
    );
};

export default Header;