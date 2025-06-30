import React from 'react';
import {
    AppShell,
    Group,
    Text,
    ScrollArea,
    Badge,
    ActionIcon,
    Stack,
    UnstyledButton,
    rem, Divider,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconSettings,
} from '@tabler/icons-react';
import Logo from "@/components/logo/index.jsx";
import NavLinkLayout from "@/components/NavLinkLayout.jsx";


const Navbar = ({ navigationItems, popularTags, dark }) => {
    return (
        <AppShell.Navbar
            p="md"
            style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 네비바
                borderRight: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}
        >
            <AppShell.Section>
                <Group mb="md">
                    <Logo
                        isLogo={false}
                        radius="xl"
                        size="lg"
                        style={{
                            border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                            boxShadow: 'none', // 플랫 디자인: 그림자 제거
                        }}
                        dark={dark}
                    />
                    <div style={{ flex: 1 }}>
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
                    </div>
                </Group>
            </AppShell.Section>

            <Divider/>
            <ScrollArea grow my="md" component={AppShell.Section}>
                <Stack gap="xs">
                    <NavLinkLayout navigationItems={navigationItems} dark={dark} />
                </Stack>
            </ScrollArea>

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
                                    background: dark ? '#1a1a1a' : '#f3f4f6',
                                }
                            }}
                        >
                            <Group gap="xs">
                                <Badge size="xs" style={{
                                    background: tag.color === 'blue' ? '#3b82f6' :
                                        tag.color === 'green' ? '#10b981' :
                                            tag.color === 'orange' ? '#f59e0b' :
                                                tag.color === 'indigo' ? '#6366f1' :
                                                    '#eab308',
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
                                background: dark ? '#1a1a1a' : '#f3f4f6',
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
                                background: dark ? '#1a1a1a' : '#f3f4f6',
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
                                background: dark ? '#1a1a1a' : '#f3f4f6',
                            }
                        }}
                    >
                        <IconSettings size={18} />
                    </ActionIcon>
                </Group>
            </AppShell.Section>
        </AppShell.Navbar>
    );
};

export default Navbar;