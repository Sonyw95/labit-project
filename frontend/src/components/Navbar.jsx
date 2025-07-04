import React from 'react';
import {
    AppShell,
    Group,
    Text,
    NavLink,
    ScrollArea,
    Badge,
    ActionIcon,
    Stack,
    UnstyledButton,
    rem, Box,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconSettings,
    IconSparkles,
} from '@tabler/icons-react';
import Logo from './Logo';
import {getTagColor} from '../utils/helpers';
import NavItem from "@/components/NavItem.jsx";

const Navbar = ({ dark, navigationItems, popularTags }) => (
    <AppShell.Navbar p="md" style={{
        background: dark ? '#161b22' : '#ffffff',
        borderRight: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
    }}>
        <AppShell.Section>
            <Group mb="md">
                <Logo
                    radius="xl"
                    size="lg"
                    style={{
                        border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                        boxShadow: 'none',
                    }}
                    isLogo={false}
                />
                <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>
                        LABit
                    </Text>
                    <Text size="xs" c="dimmed">
                        Full Stack Developer
                    </Text>
                    <Badge
                        size="xs"
                        style={{
                            background: '#10b981',
                            color: 'white',
                            marginTop: 4,
                        }}
                    >
                        4년 9개월차
                    </Badge>
                </Box>
            </Group>
        </AppShell.Section>

        <AppShell.Section grow my="md" component={ScrollArea}>
            <NavItem navigationItems={navigationItems}/>
        </AppShell.Section>

        <AppShell.Section>
            <Text size="xs" fw={600} mb="xs" c="dimmed" tt="uppercase">
                인기 태그
            </Text>
            <Stack gap="xs">
                {popularTags.map((tag) => (
                    <UnstyledButton
                        key={tag.name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: rem(8),
                            borderRadius: rem(6),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: dark ? '#21262d' : '#f3f4f6',
                            }
                        }}
                    >
                        <Group gap="xs">
                            <Badge size="xs" style={{
                                background: getTagColor(tag.color),
                                color: 'white'
                            }}>
                                {tag.name}
                            </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                            {tag.count}
                        </Text>
                    </UnstyledButton>
                ))}
            </Stack>
        </AppShell.Section>

        <AppShell.Section mt="md">
            <Group>
                <ActionIcon
                    component="a"
                    href="https://github.com"
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
                    <IconBrandGithub size={18} />
                </ActionIcon>
                <ActionIcon
                    component="a"
                    href="https://linkedin.com"
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
                    <IconBrandLinkedin size={18} />
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
                    <IconSettings size={18} />
                </ActionIcon>
            </Group>
        </AppShell.Section>
    </AppShell.Navbar>
);

export default Navbar;