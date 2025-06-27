import React, {} from 'react';
import {
    Group,
    Text,
    Avatar,
    Badge,
    Button,
    Box,
    ThemeIcon,
    Stack,
    UnstyledButton,
    rem,
    Menu,
    Divider,
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconChevronDown,
} from '@tabler/icons-react';

// 사용자 프로필 (데모용)
const userProfile = {
    name: 'LABit',
    email: 'labit@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'Full Stack Developer'
};

// 사용자 드롭다운 메뉴 컴포넌트
export default function  UserDropdown (props) {
    const {dark, isLoggedIn, setIsLoggedIn} = props;
    return(
        <Menu
            shadow="lg"
            width={280}
            position="bottom-end"
            offset={8}
            transitionProps={{ transition: 'scale-y', duration: 200 }}
        >
            <Menu.Target>
                <UnstyledButton
                    style={{
                        padding: rem(8),
                        // background: dark ? '#1a1a1a' : 'rgba(255, 255, 255, 0.8)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: rem(8),
                        '&:hover': {
                            background: dark ? '#2a2a2a' : '#f8fafc',
                            borderColor: dark ? '#3a3a3a' : '#cbd5e1',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <Group gap="xs" wrap="nowrap">
                        {isLoggedIn ? (
                            <>
                                <Avatar
                                    src={userProfile.avatar}
                                    size={32}
                                    radius="xl"
                                    style={{
                                        border: `2px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                                    }}
                                />

                            </>
                        ) : (
                            <Group gap="xs">
                                <ThemeIcon
                                    size={32}
                                    radius="xl"
                                    style={{
                                        background: dark ? '#2a2a2a' : '#f1f5f9',
                                        color: dark ? '#ffffff' : '#64748b',
                                    }}
                                >
                                    <IconUser size={16} />
                                </ThemeIcon>
                                <Text
                                    size="sm"
                                    fw={500}
                                    style={{ color: dark ? '#ffffff' : '#1e293b' }}
                                    visibleFrom="sm"
                                >
                                    로그인
                                </Text>
                            </Group>
                        )}
                        <IconChevronDown
                            size={14}
                            style={{
                                color: dark ? '#666666' : '#94a3b8',
                                transition: 'transform 0.2s ease'
                            }}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown
                style={{
                    background: dark ? '#161b22' : '#ffffff',  // 매우 어두운 헤더
                    border: `1px solid ${dark ? '#2a2a2a' : '#e2e8f0'}`,
                    borderRadius: rem(16),
                    padding: rem(8),
                    boxShadow: dark
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
            >
                {isLoggedIn ? (
                    <>
                        {/* User Profile Header */}
                        <Box
                            style={{
                                padding: rem(12),
                                background: dark ? '#1a1a1a' : '#f8fafc',
                                borderRadius: rem(12),
                                marginBottom: rem(8),
                            }}
                        >
                            <Group gap="md">
                                <Avatar
                                    src={userProfile.avatar}
                                    size={48}
                                    radius="xl"
                                    style={{
                                        border: `3px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                                    }}
                                />
                                <Box style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        fw={600}
                                        size="sm"
                                        style={{ color: dark ? '#ffffff' : '#1e293b' }}
                                        truncate
                                    >
                                        {userProfile.name}
                                    </Text>
                                    <Text
                                        size="xs"
                                        style={{ color: dark ? '#999999' : '#64748b' }}
                                        truncate
                                    >
                                        {userProfile.email}
                                    </Text>
                                    <Badge
                                        size="xs"
                                        style={{
                                            background: dark ? '#2a2a2a' : '#e2e8f0',
                                            color: dark ? '#ffffff' : '#475569',
                                            marginTop: rem(4),
                                        }}
                                    >
                                        {userProfile.role}
                                    </Badge>
                                </Box>
                            </Group>
                        </Box>

                        <Divider style={{ borderColor: dark ? '#2a2a2a' : '#e2e8f0', margin: `${rem(8)} 0` }} />

                         {/*Menu Items*/}
                        <Menu.Item
                            leftSection={<IconUser size={16} />}
                            style={{
                                borderRadius: rem(8),
                                padding: rem(12),
                                color: dark ? '#ffffff' : '#1e293b',
                                '&:hover': {
                                    background: dark ? '#2a2a2a' : '#f1f5f9',
                                }
                            }}
                        >
                            프로필 설정
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<IconSettings size={16} />}
                            style={{
                                borderRadius: rem(8),
                                padding: rem(12),
                                color: dark ? '#ffffff' : '#1e293b',
                                '&:hover': {
                                    background: dark ? '#2a2a2a' : '#f1f5f9',
                                }
                            }}
                        >
                            계정 설정
                        </Menu.Item>

                        <Divider style={{ borderColor: dark ? '#2a2a2a' : '#e2e8f0', margin: `${rem(8)} 0` }} />

                        <Menu.Item
                            leftSection={<IconLogout size={16} />}
                            onClick={() => setIsLoggedIn(false)}
                            style={{
                                borderRadius: rem(8),
                                padding: rem(12),
                                color: '#ef4444',
                                '&:hover': {
                                    background: dark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                                }
                            }}
                        >
                            로그아웃
                        </Menu.Item>
                    </>
                ) : (
                    <>
                        {/* Login State */}
                        <Box style={{ padding: rem(8) }}>
                            <Text
                                size="sm"
                                fw={600}
                                mb="md"
                                style={{
                                    color: dark ? '#ffffff' : '#1e293b',
                                    textAlign: 'center'
                                }}
                            >
                                LABit에 오신 것을 환영합니다
                            </Text>

                            <Stack gap="sm">
                                <Button
                                    leftSection={<IconLogin size={16} />}
                                    fullWidth
                                    size="sm"
                                    onClick={() => setIsLoggedIn(true)}
                                    style={{
                                        background: dark ? '#4c6ef5' : '#339af0',
                                        borderRadius: rem(8),
                                        '&:hover': {
                                            background: dark ? '#3b82f6' : '#2563eb',
                                        }
                                    }}
                                >
                                    로그인
                                </Button>

                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    style={{
                                        borderColor: dark ? '#2a2a2a' : '#e2e8f0',
                                        color: dark ? '#ffffff' : '#475569',
                                        borderRadius: rem(8),
                                        '&:hover': {
                                            background: dark ? '#2a2a2a' : '#f8fafc',
                                        }
                                    }}
                                >
                                    회원가입
                                </Button>
                            </Stack>

                            <Divider
                                label="또는"
                                labelPosition="center"
                                style={{
                                    borderColor: dark ? '#2a2a2a' : '#e2e8f0',
                                    margin: `${rem(16)} 0`,
                                    color: dark ? '#666666' : '#94a3b8'
                                }}
                            />

                        </Box>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}