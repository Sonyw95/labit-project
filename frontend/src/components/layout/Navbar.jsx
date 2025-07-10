import React, {memo} from 'react';
import {
    AppShell,
    Group,
    Text,
    ScrollArea,
    Badge,
    ActionIcon,
    Stack, Box,
} from '@mantine/core';
import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconSettings,
} from '@tabler/icons-react';
import Logo from '../common/Logo';
import {NavLink} from "react-router-dom";
import TagItem from "@/components/layout/TagItem.jsx";
import NavigationItem from "@/components/layout/NavigationItem.jsx";
import {useTheme} from "@/hooks/useTheme.js";

const Navbar = memo(({  navigationItems, popularTags }) => {
    console.log('Nav')
    const { dark } = useTheme();
    return (
        <>
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
                <NavigationItem navigationItems={navigationItems}/>
            </AppShell.Section>

            <AppShell.Section>
                <Text size="xs" fw={600} mb="xs" c="dimmed" tt="uppercase">
                    인기 태그
                </Text>
                <Stack gap="xs">
                    {popularTags.map((tag) => (
                        <TagItem key={tag.name} tag={tag} />
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
                        component={NavLink}
                        to='/settings/blog'
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
        </>
    )
}
)
export default Navbar;