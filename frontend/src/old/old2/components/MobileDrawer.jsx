import React from 'react';
import {
    Drawer,
    Stack,
    Group,
    Text,
    Box,
    ThemeIcon,
    Avatar,
    Badge,
    UnstyledButton,
    Divider,
    Button,
    ActionIcon,
    rem,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconCode,
    IconPalette,
    IconBrandGithub,
    IconBrandLinkedin,
    IconSettings,
    IconLogout,
    IconLogin,

} from '@tabler/icons-react';
import NavItem from "@/components/NavItem.jsx";
const MobileDrawer= ({
                         opened,
                         onClose,
                         navigationItems,
                         popularTags,
                         userProfile,
                         isLoggedIn,
                         setIsLoggedIn,
                         pathname,
                         dark,
                     }) => {
    const { toggleColorScheme } = useMantineColorScheme();

    return (
        <Drawer
            keepMounted={false}
            opened={opened}
            onClose={onClose}
            // hidden="xl"
            hiddenFrom="lg"
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
                    background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 네비바
                    borderBottom: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    padding: rem(16),
                },
                content: {
                    background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 네비바
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
                {isLoggedIn && (
                    <Box
                        style={{
                            padding: rem(16),
                            background: dark ? '#1a1a1a' : '#f8fafc',
                            borderRadius: rem(12),
                        }}
                    >
                        {/*<Group gap="md">*/}
                        {/*    <Avatar*/}
                        {/*        src={userProfile.avatar}*/}
                        {/*        size={48}*/}
                        {/*        radius="xl"*/}
                        {/*        style={{*/}
                        {/*            border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*    <Box style={{ flex: 1, minWidth: 0 }}>*/}
                        {/*        <Text*/}
                        {/*            fw={600}*/}
                        {/*            size="sm"*/}
                        {/*            style={{ color: dark ? '#ffffff' : '#1e293b' }}*/}
                        {/*            truncate*/}
                        {/*        >*/}
                        {/*            {userProfile.name}*/}
                        {/*        </Text>*/}
                        {/*        <Text*/}
                        {/*            size="xs"*/}
                        {/*            style={{ color: dark ? '#999999' : '#64748b' }}*/}
                        {/*            truncate*/}
                        {/*        >*/}
                        {/*            {userProfile.email}*/}
                        {/*        </Text>*/}
                        {/*        <Badge*/}
                        {/*            size="xs"*/}
                        {/*            style={{*/}
                        {/*                background: dark ? '#2a2a2a' : '#e2e8f0',*/}
                        {/*                color: dark ? '#ffffff' : '#475569',*/}
                        {/*                marginTop: rem(4),*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {userProfile.role}*/}
                        {/*        </Badge>*/}
                        {/*    </Box>*/}
                        {/*</Group>*/}
                    </Box>
                )}

                {/* Navigation Items */}
                <NavItem navigationItems={navigationItems} dark={dark} onClose={onClose} pathname={pathname}/>
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
                <Stack gap="xs">
                    <UnstyledButton
                        onClick={toggleColorScheme}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: rem(16),
                            borderRadius: rem(12),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: dark ? '#1a1a1a' : '#f8fafc',
                            }
                        }}
                    >
                        <Group gap="md">
                            <ThemeIcon
                                size="md"
                                radius="md"
                                variant="light"
                                style={{
                                    background: dark ? '#2a2a2a' : '#f1f5f9',
                                    color: dark ? '#ffffff' : '#64748b',
                                }}
                            >
                                <IconPalette size={18} />
                            </ThemeIcon>
                            <Text
                                size="md"
                                fw={500}
                                style={{
                                    color: dark ? '#ffffff' : '#1e293b',
                                }}
                            >
                                테마 변경
                            </Text>
                        </Group>
                    </UnstyledButton>

                    {/* Social Links */}
                    <Group justify="center" mt="md">
                        <ActionIcon
                            component="a"
                            href="https://github.com"
                            variant="light"
                            size="lg"
                            radius="md"
                            style={{
                                background: dark ? '#2a2a2a' : '#f1f5f9',
                                color: dark ? '#ffffff' : '#64748b',
                                '&:hover': {
                                    background: dark ? '#3a3a3a' : '#e2e8f0',
                                }
                            }}
                        >
                            <IconBrandGithub size={20} />
                        </ActionIcon>
                        <ActionIcon
                            component="a"
                            href="https://linkedin.com"
                            variant="light"
                            size="lg"
                            radius="md"
                            style={{
                                background: dark ? '#2a2a2a' : '#f1f5f9',
                                color: dark ? '#ffffff' : '#64748b',
                                '&:hover': {
                                    background: dark ? '#3a3a3a' : '#e2e8f0',
                                }
                            }}
                        >
                            <IconBrandLinkedin size={20} />
                        </ActionIcon>
                        <ActionIcon
                            variant="light"
                            size="lg"
                            radius="md"
                            style={{
                                background: dark ? '#2a2a2a' : '#f1f5f9',
                                color: dark ? '#ffffff' : '#64748b',
                                '&:hover': {
                                    background: dark ? '#3a3a3a' : '#e2e8f0',
                                }
                            }}
                        >
                            <IconSettings size={20} />
                        </ActionIcon>
                    </Group>

                    {/* Login/Logout Button */}
                    {isLoggedIn ? (
                        <Button
                            leftSection={<IconLogout size={16} />}
                            onClick={() => {
                                setIsLoggedIn(false);
                                onClose();
                            }}
                            variant="outline"
                            fullWidth
                            style={{
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                marginTop: rem(16),
                                '&:hover': {
                                    background: 'rgba(239, 68, 68, 0.05)',
                                }
                            }}
                        >
                            로그아웃
                        </Button>
                    ) : (
                        <Stack gap="sm" mt="md">
                            <Button
                                leftSection={<IconLogin size={16} />}
                                onClick={() => {
                                    setIsLoggedIn(true);
                                    onClose();
                                }}
                                fullWidth
                                style={{
                                    background: '#4c6ef5',
                                    '&:hover': {
                                        background: '#3b82f6',
                                    }
                                }}
                            >
                                로그인
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                style={{
                                    borderColor: dark ? '#2a2a2a' : '#e2e8f0',
                                    color: dark ? '#ffffff' : '#475569',
                                    '&:hover': {
                                        background: dark ? '#1a1a1a' : '#f8fafc',
                                    }
                                }}
                            >
                                회원가입
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Drawer>
    );
};

export default MobileDrawer;