import React from 'react';
import {
    Group,
    Text,
    ActionIcon,
    Burger, useMantineColorScheme,
} from '@mantine/core';
import {
    IconSearch,
    IconBell
} from '@tabler/icons-react';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import UserDropdown from "@/components/layout/UserDropdown.jsx";
import {useSelectiveColorScheme} from "@/hooks/useSelectiveColorScheme.js";

const Header = ({ opened, onToggle }) => {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    // const isDark = useSelectiveColorScheme(state => state.isDark);
    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <Burger
                    opened={opened}
                    onClick={onToggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Group gap="xs">
                    <Logo size="lg" radius="md" />
                    <div>
                        <Text
                            size="lg"
                            fw={700}
                            style={{
                                color: isDark ? '#ffffff' : '#1e293b',
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
                            background: isDark ? '#21262d' : '#f3f4f6',
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
                            background: isDark ? '#21262d' : '#f3f4f6',
                        }
                    }}
                >
                    <IconBell size={18} />
                </ActionIcon>
                <ThemeToggle />
                <UserDropdown onNavSettingsOpen={() =>{console.log('Click')}}/>
            </Group>
        </Group>
    );
};

export default Header;
