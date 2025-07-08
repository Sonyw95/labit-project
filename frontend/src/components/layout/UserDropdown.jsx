// ========================================
// components/layout/UserDropdown.jsx - 사용자 드롭다운 컴포넌트
// ========================================
import React, { useState, useCallback } from 'react';
import {
    Menu,
    Avatar,
    Group,
    Text,
    ActionIcon,
    Button,
    Divider,
    Badge,
    Box,
    UnstyledButton,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconChevronDown,
    IconBell,
    IconMoon,
    IconSun,
    IconPalette,
    IconShield,
    IconHeart
} from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';
// import { useCustomTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import UserSettings from '../settings/UserSettings';

const UserDropdown = ({ onNavSettingsOpen }) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { user, isAuthenticated, login, loginWithKakao, logout } = useAuth();
    // const { theme } = useCustomTheme();
    const toast = useToast();
    const dark = colorScheme === 'dark';

    const [userSettingsOpened, setUserSettingsOpened] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // 2025 트렌드: Glassmorphism 스타일
    const getDropdownStyles = () => ({
        dropdown: {
            background: dark
                ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
            borderRadius: '16px',
            boxShadow: dark
                ? '0 20px 64px rgba(0, 0, 0, 0.4)'
                : '0 20px 64px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            minWidth: '280px',
        }
    });

    // 로그아웃 핸들러
    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            toast.success('성공적으로 로그아웃되었습니다.');
        } catch (error) {
            toast.error('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setIsLoggingOut(false);
        }
    }, [logout, toast]);

    // 로그인 핸들러
    const handleLogin = useCallback(async () => {
        // 로그인 모달이나 페이지로 리다이렉트
        window.location.href = '/login';
    }, []);

    // 카카오 로그인 핸들러
    const handleKakaoLogin = useCallback(async () => {
        try {
            await loginWithKakao();
            toast.success('카카오 로그인이 완료되었습니다.');
        } catch (error) {
            toast.error('카카오 로그인에 실패했습니다.');
        }
    }, [loginWithKakao, toast]);

    // 인증되지 않은 사용자용 드롭다운
    const renderGuestDropdown = () => (
        <Menu
            shadow="lg"
            width={280}
            position="bottom-end"
            offset={8}
            styles={getDropdownStyles}
        >
            <Menu.Target>
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    radius="xl"
                    style={{
                        background: dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                        border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: dark ? 'rgba(48, 54, 61, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <IconUser size={20} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Box p="md" style={{ textAlign: 'center' }}>
                    <Text size="sm" fw={600} mb="xs">
                        계정에 로그인하세요
                    </Text>
                    <Text size="xs" c="dimmed" mb="md">
                        더 많은 기능을 이용할 수 있습니다
                    </Text>

                    <Group gap="xs">
                        <Button
                            fullWidth
                            variant="filled"
                            leftSection={<IconLogin size={16} />}
                            onClick={handleLogin}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                            }}
                        >
                            로그인
                        </Button>
                    </Group>

                    <Button
                        fullWidth
                        variant="light"
                        mt="xs"
                        onClick={handleKakaoLogin}
                        style={{
                            background: '#FEE500',
                            color: '#000000',
                            border: 'none',
                            '&:hover': {
                                background: '#FFEB3B',
                            }
                        }}
                    >
                        카카오로 시작하기
                    </Button>
                </Box>

                <Divider />

                <Menu.Item
                    leftSection={<IconPalette size={16} />}
                    rightSection={dark ? <IconSun size={16} /> : <IconMoon size={16} />}
                    onClick={toggleColorScheme}
                >
                    {dark ? '라이트 모드' : '다크 모드'}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    // 인증된 사용자용 드롭다운
    const renderUserDropdown = () => (
        <Menu
            shadow="lg"
            width={300}
            position="bottom-end"
            offset={8}
            styles={getDropdownStyles}
        >
            <Menu.Target>
                <UnstyledButton
                    style={{
                        borderRadius: '50px',
                        padding: '4px',
                        background: dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                        border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: dark ? 'rgba(48, 54, 61, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <Group gap="xs" px="sm" py="xs">
                        <Avatar
                            src={user?.avatar}
                            size={32}
                            radius="xl"
                            style={{
                                border: `2px solid ${dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                            }}
                        />
                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" fw={600} truncate>
                                {user?.name || '사용자'}
                            </Text>
                            <Text size="xs" c="dimmed" truncate>
                                {user?.email}
                            </Text>
                        </Box>
                        <IconChevronDown size={16} style={{ color: dark ? '#8b949e' : '#64748b' }} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {/* 사용자 정보 헤더 */}
                <Box p="md" style={{
                    background: dark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                    borderRadius: '12px',
                    margin: '4px',
                    marginBottom: '8px',
                }}>
                    <Group gap="md">
                        <Avatar
                            src={user?.avatar}
                            size={48}
                            radius="xl"
                            style={{
                                border: `3px solid ${dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                            }}
                        />
                        <Box style={{ flex: 1 }}>
                            <Group gap="xs" mb="xs">
                                <Text size="sm" fw={600}>
                                    {user?.name || '사용자'}
                                </Text>
                                {user?.isPremium && (
                                    <Badge size="xs" color="gold" variant="light">
                                        Premium
                                    </Badge>
                                )}
                            </Group>
                            <Text size="xs" c="dimmed">
                                {user?.email}
                            </Text>
                            {user?.bio && (
                                <Text size="xs" c="dimmed" lineClamp={1} mt="xs">
                                    {user.bio}
                                </Text>
                            )}
                        </Box>
                    </Group>
                </Box>

                <Divider />

                {/* 메뉴 항목들 */}
                <Menu.Item
                    leftSection={<IconUser size={16} />}
                    onClick={() => setUserSettingsOpened(true)}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    <Group justify="space-between">
                        <span>프로필 설정</span>
                        <Text size="xs" c="dimmed">⌘,</Text>
                    </Group>
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconSettings size={16} />}
                    onClick={onNavSettingsOpen}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    네비게이션 설정
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconBell size={16} />}
                    rightSection={
                        <Badge size="xs" color="red" variant="filled">
                            3
                        </Badge>
                    }
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    알림
                </Menu.Item>

                <Divider my="xs" />

                {/* 테마 토글 */}
                <Menu.Item
                    leftSection={<IconPalette size={16} />}
                    rightSection={dark ? <IconSun size={16} /> : <IconMoon size={16} />}
                    onClick={toggleColorScheme}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    {dark ? '라이트 모드' : '다크 모드'}
                </Menu.Item>

                {/* 보안 메뉴 */}
                <Menu.Item
                    leftSection={<IconShield size={16} />}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    보안 설정
                </Menu.Item>

                <Divider my="xs" />

                {/* 하단 액션들 */}
                <Menu.Item
                    leftSection={<IconHeart size={16} />}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    <Group justify="space-between">
                        <span>후원하기</span>
                        <Badge size="xs" color="pink" variant="light">
                            New
                        </Badge>
                    </Group>
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    color="red"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    style={{
                        borderRadius: '8px',
                        margin: '2px 4px',
                    }}
                >
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    return (
        <>
            {isAuthenticated ? renderUserDropdown() : renderGuestDropdown()}

            {/* 사용자 설정 모달 */}
            <UserSettings
                opened={userSettingsOpened}
                onClose={() => setUserSettingsOpened(false)}
            />
        </>
    );
};

export default UserDropdown;