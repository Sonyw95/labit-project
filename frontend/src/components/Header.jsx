import React from 'react';
import {
    AppShell,
    Burger,
    Group,
    Text,
    ActionIcon,
    ThemeIcon,
} from '@mantine/core';
import {
    IconSearch,
    IconBell,
    IconSun,
    IconMoon,
} from '@tabler/icons-react';
import Logo from "@/components/Logo.jsx";

const Header = ({ opened, setDrawerOpened, dark, toggleColorScheme }) => (
    <AppShell.Header
        ml={{lg: 'var(--app-shell-navbar-width, 280px)'}}
        style={{
        background: dark ? '#161b22' : '#ffffff',
        borderBottom: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
    }}>
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <Burger
                    opened={opened}
                    onClick={() => setDrawerOpened(!opened)}
                    hiddenFrom="lg"
                    size="sm"
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
                        {/*<IconCode size={18} />*/}
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
                    variant="subtle"
                    size="lg"
                    radius="md"
                    style={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: dark ? '#21262d' : '#f3f4f6',
                        }
                    }}
                >
                    <IconSearch size={18} />
                </ActionIcon>
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    radius="md"
                    style={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: dark ? '#21262d' : '#f3f4f6',
                        }
                    }}
                >
                    <IconBell size={18} />
                </ActionIcon>
                <ActionIcon
                    variant="light"
                    size="lg"
                    radius="md"
                    onClick={toggleColorScheme}
                    style={{
                        background: dark ? '#21262d' : '#f3f4f6',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: dark ? '#30363d' : '#e5e7eb',
                        }
                    }}
                >
                    {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
            </Group>
        </Group>
    </AppShell.Header>
);

export default Header;