import {
    ActionIcon,
    AppShell, Avatar, Badge, Box, Button, Divider,
    Group, NavLink, rem, ScrollArea, Stack,
    Text, ThemeIcon, UnstyledButton, Drawer
} from "@mantine/core";
import Logo from "@/components/Logo.jsx";
import {
    IconArticle, IconBookmark,
    IconBrandGithub,
    IconBrandLinkedin, IconChevronRight, IconCode,
    IconHome, IconLogout,
    IconSettings,
    IconSparkles, IconTags, IconTrendingUp, IconUser, IconPalette, IconSun, IconMoon, IconLogin, IconDevicesCode
} from "@tabler/icons-react";
import {FaJava} from "react-icons/fa";
import { NavLink as Links} from "react-router-dom";
import {SiSpring} from "react-icons/si";


const NavBar = (props) => {
    const{ dark, opened, setOpened, loginInfo } = props;

    // 네비게이션 메뉴 아이템
    const navigationItems = [
        { icon: IconHome, label: '홈', href: '/home',  requiredNav: true,
            subLinks: []
        },
        { icon: IconDevicesCode, label: '기술', href: '/post', requiredNav: false,
            subLinks: [
                {
                    icon: FaJava, label: 'Java', href: '/post/java', badge: '10', requiredNav: true, subLinks: []
                },
                {
                    icon: SiSpring, label: 'Spring', href: '/post/spring', badge: '10', requiredNav: true, subLinks: []
                }
            ]
        },
        { icon: IconTags, label: '태그', href: '/tag', requiredNav: true,
            subLinks: []
        },
        // { icon: IconTrendingUp, label: '인기글', href: '/trending', hasLinks: false, requiredNav: true, subLinks: [] },
        // { icon: IconBookmark, label: '북마크', href: '/bookmarks', hasLinks: false, requiredNav: true, subLinks: [] },
        { icon: IconUser, label: '소개', href: '/about', requiredNav: true,
            subLinks: []
        },
    ];


    // 인기 태그
    const popularTags = [
        { name: 'React', count: 15, color: 'blue' },
        { name: 'Spring Boot', count: 12, color: 'green' },
        { name: 'Java', count: 18, color: 'orange' },
        { name: 'TypeScript', count: 8, color: 'indigo' },
        { name: 'AWS', count: 6, color: 'yellow' },
    ];

    const MobileNav = () => {
        return (
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                size="xs"
                position="left"
                title={
                    <Group gap="xs">
                        <ThemeIcon
                            size="md"
                            radius="md"
                            style={{
                                background: '#4c6ef5',
                            }}
                        >
                            <IconCode size={16} />
                        </ThemeIcon>
                        <Box>
                            <Text
                                size="md"
                                fw={700}
                                style={{
                                    color: dark ? '#ffffff' : '#1e293b',
                                }}
                            >
                                LABit
                            </Text>
                        </Box>
                    </Group>
                }
                overlayProps={{
                    backgroundOpacity: 0.3,
                    blur: 4,
                }}
                transitionProps={{
                    transition: 'slide-right',
                    duration: 300,
                    timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                styles={{
                    header: {
                        background: dark ? '#0a0a0a' : '#ffffff',
                        borderBottom: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                        padding: rem(16),
                    },
                    content: {
                        background: dark ? '#0a0a0a' : '#ffffff',
                    },
                    close: {
                        color: dark ? '#ffffff' : '#1e293b',
                        '&:hover': {
                            background: dark ? '#2a2a2a' : '#f3f4f6',
                        }
                    }
                }}
            >
                <Stack gap="lg" style={{ padding: rem(8) }}>
                    {/* User Profile Section */}
                    {/*{isLoggedIn && (*/}
                    {/*    <Box*/}
                    {/*        style={{*/}
                    {/*            padding: rem(16),*/}
                    {/*            background: dark ? '#1a1a1a' : '#f8fafc',*/}
                    {/*            borderRadius: rem(12),*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Group gap="md">*/}
                    {/*            <Avatar*/}
                    {/*                src={userProfile.avatar}*/}
                    {/*                size={48}*/}
                    {/*                radius="xl"*/}
                    {/*                style={{*/}
                    {/*                    border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,*/}
                    {/*                }}*/}
                    {/*            />*/}
                    {/*            <Box style={{ flex: 1, minWidth: 0 }}>*/}
                    {/*                <Text*/}
                    {/*                    fw={600}*/}
                    {/*                    size="sm"*/}
                    {/*                    style={{ color: dark ? '#ffffff' : '#1e293b' }}*/}
                    {/*                    truncate*/}
                    {/*                >*/}
                    {/*                    {userProfile.name}*/}
                    {/*                </Text>*/}
                    {/*                <Text*/}
                    {/*                    size="xs"*/}
                    {/*                    style={{ color: dark ? '#999999' : '#64748b' }}*/}
                    {/*                    truncate*/}
                    {/*                >*/}
                    {/*                    {userProfile.email}*/}
                    {/*                </Text>*/}
                    {/*                <Badge*/}
                    {/*                    size="xs"*/}
                    {/*                    style={{*/}
                    {/*                        background: dark ? '#2a2a2a' : '#e2e8f0',*/}
                    {/*                        color: dark ? '#ffffff' : '#475569',*/}
                    {/*                        marginTop: rem(4),*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    {userProfile.role}*/}
                    {/*                </Badge>*/}
                    {/*            </Box>*/}
                    {/*        </Group>*/}
                    {/*    </Box>*/}
                    {/*)}*/}

                    {/* Navigation Items */}
                    <Stack gap="xs">
                        {navigationItems.map((item) => (
                            <UnstyledButton
                                key={item.href}
                                onClick={() => setOpened(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: rem(16),
                                    borderRadius: rem(12),
                                    background: item.active
                                        ? (dark ? '#1a1a1a' : '#f3f4f6')
                                        : 'transparent',
                                    border: `1px solid ${item.active
                                        ? (dark ? '#2a2a2a' : '#e2e8f0')
                                        : 'transparent'}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: dark ? '#1a1a1a' : '#f8fafc',
                                        transform: 'translateX(4px)',
                                    }
                                }}
                            >
                                <Group gap="md">
                                    <ThemeIcon
                                        size="md"
                                        radius="md"
                                        variant={item.active ? 'filled' : 'light'}
                                        style={{
                                            background: item.active
                                                ? '#4c6ef5'
                                                : (dark ? '#2a2a2a' : '#f1f5f9'),
                                            color: item.active
                                                ? '#ffffff'
                                                : (dark ? '#ffffff' : '#64748b'),
                                        }}
                                    >
                                        <item.icon size={18} />
                                    </ThemeIcon>
                                    <Text
                                        size="md"
                                        fw={item.active ? 600 : 500}
                                        style={{
                                            color: dark ? '#ffffff' : '#1e293b',
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </Group>
                                {item.badge && (
                                    <Badge
                                        size="sm"
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                        }}
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                                {item.active && (
                                    <IconSparkles size={16} style={{ color: '#4c6ef5' }} />
                                )}
                            </UnstyledButton>
                        ))}
                    </Stack>

                    <Divider style={{ borderColor: dark ? '#2a2a2a' : '#e2e8f0' }} />

                    {/* Popular Tags */}
                    <Box>
                        <Text
                            size="sm"
                            fw={600}
                            mb="md"
                            style={{
                                color: dark ? '#ffffff' : '#1e293b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}
                        >
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
                                        width: '100%',
                                        padding: rem(12),
                                        borderRadius: rem(8),
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: dark ? '#1a1a1a' : '#f8fafc',
                                        }
                                    }}
                                >
                                    <Badge
                                        size="sm"
                                        style={{
                                            background: tag.color === 'blue' ? '#3b82f6' :
                                                tag.color === 'green' ? '#10b981' :
                                                    tag.color === 'orange' ? '#f59e0b' :
                                                        tag.color === 'indigo' ? '#6366f1' :
                                                            '#eab308',
                                            color: 'white'
                                        }}
                                    >
                                        {tag.name}
                                    </Badge>
                                    <Text
                                        size="sm"
                                        style={{ color: dark ? '#666666' : '#64748b' }}
                                    >
                                        {tag.count}
                                    </Text>
                                </UnstyledButton>
                            ))}
                        </Stack>
                    </Box>

                    <Divider style={{ borderColor: dark ? '#2a2a2a' : '#e2e8f0' }} />

                    {/* Settings & Actions */}
                    {/*<Stack gap="xs">*/}
                    {/*    <UnstyledButton*/}
                    {/*        onClick={toggleColorScheme}*/}
                    {/*        style={{*/}
                    {/*            display: 'flex',*/}
                    {/*            alignItems: 'center',*/}
                    {/*            justifyContent: 'space-between',*/}
                    {/*            width: '100%',*/}
                    {/*            padding: rem(16),*/}
                    {/*            borderRadius: rem(12),*/}
                    {/*            transition: 'all 0.2s ease',*/}
                    {/*            '&:hover': {*/}
                    {/*                background: dark ? '#1a1a1a' : '#f8fafc',*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Group gap="md">*/}
                    {/*            <ThemeIcon*/}
                    {/*                size="md"*/}
                    {/*                radius="md"*/}
                    {/*                variant="light"*/}
                    {/*                style={{*/}
                    {/*                    background: dark ? '#2a2a2a' : '#f1f5f9',*/}
                    {/*                    color: dark ? '#ffffff' : '#64748b',*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                <IconPalette size={18} />*/}
                    {/*            </ThemeIcon>*/}
                    {/*            <Text*/}
                    {/*                size="md"*/}
                    {/*                fw={500}*/}
                    {/*                style={{*/}
                    {/*                    color: dark ? '#ffffff' : '#1e293b',*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                테마 변경*/}
                    {/*            </Text>*/}
                    {/*        </Group>*/}
                    {/*        <ActionIcon*/}
                    {/*            variant="subtle"*/}
                    {/*            size="sm"*/}
                    {/*            style={{*/}
                    {/*                color: dark ? '#4c6ef5' : '#339af0',*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            {dark ? <IconSun size={16} /> : <IconMoon size={16} />}*/}
                    {/*        </ActionIcon>*/}
                    {/*    </UnstyledButton>*/}

                    {/*    /!* Social Links *!/*/}
                    {/*    <Group justify="center" mt="md">*/}
                    {/*        <ActionIcon*/}
                    {/*            component="a"*/}
                    {/*            href="https://github.com"*/}
                    {/*            variant="light"*/}
                    {/*            size="lg"*/}
                    {/*            radius="md"*/}
                    {/*            style={{*/}
                    {/*                background: dark ? '#2a2a2a' : '#f1f5f9',*/}
                    {/*                color: dark ? '#ffffff' : '#64748b',*/}
                    {/*                '&:hover': {*/}
                    {/*                    background: dark ? '#3a3a3a' : '#e2e8f0',*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <IconBrandGithub size={20} />*/}
                    {/*        </ActionIcon>*/}
                    {/*        <ActionIcon*/}
                    {/*            component="a"*/}
                    {/*            href="https://linkedin.com"*/}
                    {/*            variant="light"*/}
                    {/*            size="lg"*/}
                    {/*            radius="md"*/}
                    {/*            style={{*/}
                    {/*                background: dark ? '#2a2a2a' : '#f1f5f9',*/}
                    {/*                color: dark ? '#ffffff' : '#64748b',*/}
                    {/*                '&:hover': {*/}
                    {/*                    background: dark ? '#3a3a3a' : '#e2e8f0',*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <IconBrandLinkedin size={20} />*/}
                    {/*        </ActionIcon>*/}
                    {/*        <ActionIcon*/}
                    {/*            variant="light"*/}
                    {/*            size="lg"*/}
                    {/*            radius="md"*/}
                    {/*            style={{*/}
                    {/*                background: dark ? '#2a2a2a' : '#f1f5f9',*/}
                    {/*                color: dark ? '#ffffff' : '#64748b',*/}
                    {/*                '&:hover': {*/}
                    {/*                    background: dark ? '#3a3a3a' : '#e2e8f0',*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <IconSettings size={20} />*/}
                    {/*        </ActionIcon>*/}
                    {/*    </Group>*/}

                    {/*    /!* Login/Logout Button *!/*/}
                    {/*    {isLoggedIn ? (*/}
                    {/*        <Button*/}
                    {/*            leftSection={<IconLogout size={16} />}*/}
                    {/*            onClick={() => {*/}
                    {/*                setIsLoggedIn(false);*/}
                    {/*                setOpened(false);*/}
                    {/*            }}*/}
                    {/*            variant="outline"*/}
                    {/*            fullWidth*/}
                    {/*            style={{*/}
                    {/*                borderColor: '#ef4444',*/}
                    {/*                color: '#ef4444',*/}
                    {/*                marginTop: rem(16),*/}
                    {/*                '&:hover': {*/}
                    {/*                    background: 'rgba(239, 68, 68, 0.05)',*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            로그아웃*/}
                    {/*        </Button>*/}
                    {/*    ) : (*/}
                    {/*        <Stack gap="sm" mt="md">*/}
                    {/*            <Button*/}
                    {/*                leftSection={<IconLogin size={16} />}*/}
                    {/*                onClick={() => {*/}
                    {/*                    setIsLoggedIn(true);*/}
                    {/*                    setOpened(false);*/}
                    {/*                }}*/}
                    {/*                fullWidth*/}
                    {/*                style={{*/}
                    {/*                    background: '#4c6ef5',*/}
                    {/*                    '&:hover': {*/}
                    {/*                        background: '#3b82f6',*/}
                    {/*                    }*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                로그인*/}
                    {/*            </Button>*/}
                    {/*            <Button*/}
                    {/*                variant="outline"*/}
                    {/*                fullWidth*/}
                    {/*                style={{*/}
                    {/*                    borderColor: dark ? '#2a2a2a' : '#e2e8f0',*/}
                    {/*                    color: dark ? '#ffffff' : '#475569',*/}
                    {/*                    '&:hover': {*/}
                    {/*                        background: dark ? '#1a1a1a' : '#f8fafc',*/}
                    {/*                    }*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                회원가입*/}
                    {/*            </Button>*/}
                    {/*        </Stack>*/}
                    {/*    )}*/}
                    {/*</Stack>*/}
                </Stack>
            </Drawer>
        )
    }

    const DesktopNav = () =>{
        return (
            <AppShell.Navbar p="md" style={{
                background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 네비바
                borderRight: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,  // 어두운 보더
            }}>
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

                <ScrollArea grow my="md" component={AppShell.Section}>
                    <Stack gap="xs">
                        {navigationItems.map((item) => (
                            <Navigated key={item.href} item={item} />
                        ))}
                    </Stack>
                </ScrollArea>

                <AppShell.Section >
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
                                        background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
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
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
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
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
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
                                    background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                                }
                            }}
                        >
                            <IconSettings size={18} />
                        </ActionIcon>
                    </Group>
                </AppShell.Section>
            </AppShell.Navbar>
        )
    }

    const Navigated = ({item}) => {
        const Icon = item.icon;
        return (
            <NavLink
                component={Links}
                to={ item.href }
                label={item.label}
                leftSection={
                    <Icon
                        size={18}
                        style={{
                            transition: 'all 0.3s ease',
                        }}
                    />
                }
                rightSection={
                    item.badge ? (
                        <Badge size="xs" style={{ background: '#ef4444', color: 'white' }}>
                            {item.badge}
                        </Badge>
                    ) : item.active ? (
                        <IconSparkles size={14} style={{ color: '#4c6ef5' }} />
                    ) : item.requiredNav ? null :  <IconChevronRight size={14} stroke={1.5} />
                }
                active={item.active}
                style={{
                    borderRadius: rem(8),
                    padding: rem(12),
                    marginBottom: rem(4),
                    background: item.active
                        && (dark ? '#21262d' : '#f3f4f6'),  // 어두운 활성 배경
                    border: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: dark ? '#21262d' : '#f3f4f6',  // 어두운 호버 색상
                        transform: 'translateX(4px)',
                    }
                }}
            >
                { item.subLinks.length > 0 && item.subLinks.map( (sub) => (
                    <Navigated item={sub} key={sub.href}/>
                ))}
            </NavLink>
        )
    }
    return (
        <>
            {MobileNav()}
            {DesktopNav()}
        </>
    )
}

export default NavBar;