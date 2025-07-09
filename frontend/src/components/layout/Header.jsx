import React from 'react';
import {
    Group,
    Text,
    ActionIcon,
    Burger,
} from '@mantine/core';
import {
    IconSearch,
    IconBell
} from '@tabler/icons-react';
import Logo from '../common/Logo';
import {useTheme} from "@/hooks/useTheme.js";

const Header = ({ drawerOpened, setDrawerOpened }) => {
    const { dark } = useTheme();
    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <Burger
                    opened={drawerOpened}
                    onClick={setDrawerOpened}
                    hiddenFrom="lg"
                    size="sm"
                />
                <Group gap="xs">
                    <Logo size="lg" radius="md" />
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
            </Group>
        </Group>
    );
};

export default Header;
