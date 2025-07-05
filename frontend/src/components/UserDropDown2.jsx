import React, { useState } from 'react';
import {
    Menu,
    Avatar,
    Button,
    Group,
    Text,
    Divider,
    Stack,
    Badge,
    Modal,
    TextInput,
    PasswordInput,
    useMantineColorScheme,
    UnstyledButton,
    Box,
    Indicator,
    rem,
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconChevronDown,
    IconMail,
    IconBell,
    IconBookmark,
    IconEdit,
    IconShield,
    IconTrendingUp,
    IconRocket,
    IconArrowRight,
} from '@tabler/icons-react';
import {useAuth} from "../context/AuthContext.jsx";
import {useToast} from "./Toast.jsx";

const KakaoIcon = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3Z"/>
    </svg>
);
// Hooks and Context
const UserDropdown = () => {
    const { user, isAuthenticated, login, register, logout } = useAuth();
    const { success, error: showError } = useToast();
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // 로그인 폼 상태
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    // 회원가입 폼 상태
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Modern haptic feedback
    const triggerHapticFeedback = (type = 'light') => {
        if (navigator.vibrate) {
            const patterns = {
                light: [5],
                medium: [10],
                heavy: [15],
            };
            navigator.vibrate(patterns[type]);
        }
    };

    // 카카오 로그인 처리
    const handleKakaoLogin = async () => {
        triggerHapticFeedback('medium');

        try {
            if (window.Kakao) {
                window.Kakao.Auth.login({
                    success: async (response) => {
                        try {
                            window.Kakao.API.request({
                                url: '/v2/user/me',
                                success: async (userInfo) => {
                                    const loginResponse = await fetch('/api/auth/kakao', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            accessToken: response.access_token,
                                            userInfo: userInfo,
                                        }),
                                    });

                                    if (loginResponse.ok) {
                                        const userData = await loginResponse.json();
                                        await login(userData);
                                        success('카카오 로그인 성공!');
                                        setLoginModalOpen(false);
                                    } else {
                                        throw new Error('카카오 로그인 처리 중 오류가 발생했습니다.');
                                    }
                                },
                                fail: (error) => {
                                    showError('카카오 사용자 정보를 가져오는데 실패했습니다.');
                                },
                            });
                        } catch (err) {
                            showError('카카오 로그인 처리 중 오류가 발생했습니다.');
                        }
                    },
                    fail: (error) => {
                        showError('카카오 로그인에 실패했습니다.');
                    },
                });
            } else {
                showError('카카오 SDK가 로드되지 않았습니다.');
            }
        } catch (err) {
            showError('카카오 로그인 중 오류가 발생했습니다.');
        }
    };

    // 이메일 로그인 처리
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        triggerHapticFeedback('light');

        try {
            await login({
                email: loginForm.email,
                password: loginForm.password,
            });

            success('로그인 성공!');
            setLoginModalOpen(false);
            setLoginForm({ email: '', password: '' });
        } catch (err) {
            showError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
    };

    // 회원가입 처리
    const handleRegister = async (e) => {
        e.preventDefault();
        triggerHapticFeedback('light');

        if (registerForm.password !== registerForm.confirmPassword) {
            showError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (registerForm.password.length < 8) {
            showError('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        try {
            await register({
                name: registerForm.name,
                email: registerForm.email,
                password: registerForm.password,
            });

            success('회원가입이 완료되었습니다!');
            setRegisterModalOpen(false);
            setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            showError('회원가입에 실패했습니다.');
        }
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        setIsLoggingOut(true);
        triggerHapticFeedback('medium');

        try {
            await logout();
            success('로그아웃되었습니다.');
        } catch (err) {
            showError('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Modern Button Component
    const ModernButton = ({ children, onClick, variant = "primary", fullWidth = false, size='sm', ...props }) => {
        const getButtonStyles = () => {
            const baseStyles = {
                // height: rem(48),
                // borderRadius: rem(12),
                // fontWeight: 600,
                // fontSize: rem(14),
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: rem(8),
                // width: fullWidth ? '100%' : 'auto',
                padding: '0 24px',
            };

            switch (variant) {
                case 'primary':
                    return {
                        ...baseStyles,
                        background: dark
                            ? '#ffffff'
                            : '#000000',
                        color: dark ? '#000000' : '#ffffff',
                        '&:hover': {
                            background: dark ? '#f5f5f5' : '#1a1a1a',
                            transform: 'translateY(-1px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        }
                    };
                case 'kakao':
                    return {
                        ...baseStyles,
                        background: '#FEE500',
                        color: '#000000',
                        '&:hover': {
                            background: '#FFD700',
                            transform: 'translateY(-1px)',
                        }
                    };
                case 'outline':
                    return {
                        ...baseStyles,
                        background: 'transparent',
                        color: dark ? '#ffffff' : '#000000',
                        border: `1px solid ${dark ? '#333333' : '#e0e0e0'}`,
                        '&:hover': {
                            background: dark ? '#1a1a1a' : '#f5f5f5',
                            borderColor: dark ? '#444444' : '#d0d0d0',
                        }
                    };
                default:
                    return baseStyles;
            }
        };

        return (
            <Button
                onClick={onClick}
                {...props}
                size={size}
                styles={{
                    root: getButtonStyles(),
                }}
            >
                {children}
            </Button>
        );
    };

    // Modern Input Component
    const ModernInput = ({ label, leftIcon, type = "text", ...props }) => (
        <Stack gap={rem(6)}>
            <Text size="sm" fw={500} c={dark ? '#ffffff' : '#000000'}>
                {label}
            </Text>
            {type === 'password' ? (
                <PasswordInput
                    {...props}
                    leftSection={leftIcon}
                    styles={{
                        input: {
                            background: dark ? '#1a1a1a' : '#f8f9fa',
                            border: `1px solid ${dark ? '#333333' : '#e9ecef'}`,
                            borderRadius: rem(8),
                            height: rem(44),
                            fontSize: rem(14),
                            color: dark ? '#ffffff' : '#000000',
                            '&:focus': {
                                borderColor: dark ? '#ffffff' : '#000000',
                                background: dark ? '#0a0a0a' : '#ffffff',
                            },
                            '&::placeholder': {
                                color: dark ? '#666666' : '#999999',
                            }
                        }
                    }}
                />
            ) : (
                <TextInput
                    {...props}
                    type={type}
                    leftSection={leftIcon}
                    styles={{
                        input: {
                            background: dark ? '#1a1a1a' : '#f8f9fa',
                            border: `1px solid ${dark ? '#333333' : '#e9ecef'}`,
                            borderRadius: rem(8),
                            height: rem(44),
                            fontSize: rem(14),
                            color: dark ? '#ffffff' : '#000000',
                            '&:focus': {
                                borderColor: dark ? '#ffffff' : '#000000',
                                background: dark ? '#0a0a0a' : '#ffffff',
                            },
                            '&::placeholder': {
                                color: dark ? '#666666' : '#999999',
                            }
                        }
                    }}
                />
            )}
        </Stack>
    );

    // 로그인되지 않은 상태
    if (!isAuthenticated) {
        return (
            <>
                <Group gap={rem(8)}>
                    <ModernButton
                        variant="outline"
                        size="sm"
                        onClick={() => setLoginModalOpen(true)}
                        leftSection={<IconLogin size={16} />}
                    >
                        로그인
                    </ModernButton>
                    <ModernButton
                        variant="primary"
                        size="sm"
                        onClick={() => setRegisterModalOpen(true)}
                        leftSection={<IconRocket size={16} />}
                    >
                        시작하기
                    </ModernButton>
                </Group>

                {/* Modern Login Modal */}
                <Modal
                    opened={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    title={
                        <Text size="xl" fw={700} c={dark ? '#ffffff' : '#000000'}>
                            로그인
                        </Text>
                    }
                    centered
                    size="sm"
                    radius={rem(16)}
                    styles={{
                        content: {
                            background: dark ? '#0a0a0a' : '#ffffff',
                            border: `1px solid ${dark ? '#1a1a1a' : '#f0f0f0'}`,
                        },
                        header: {
                            background: 'transparent',
                            borderBottom: 'none',
                            paddingBottom: 0,
                        },
                        body: {
                            padding: rem(32),
                            paddingTop: rem(24),
                        }
                    }}
                >
                    <form onSubmit={handleEmailLogin}>
                        <Stack gap={rem(24)}>
                            {/* Kakao Login */}
                            <ModernButton
                                variant="kakao"
                                fullWidth
                                leftSection={<KakaoIcon size={20} />}
                                onClick={handleKakaoLogin}
                            >
                                카카오로 계속하기
                            </ModernButton>

                            <Divider
                                label="또는"
                                labelPosition="center"
                                styles={{
                                    label: {
                                        color: dark ? '#666666' : '#999999',
                                        fontSize: rem(12),
                                        fontWeight: 500,
                                    },
                                    root: {
                                        borderColor: dark ? '#1a1a1a' : '#f0f0f0',
                                    }
                                }}
                            />

                            {/* Email Login */}
                            <ModernInput
                                label="이메일"
                                placeholder="your@email.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                leftIcon={<IconMail size={16} />}
                                type="email"
                                required
                            />

                            <ModernInput
                                label="비밀번호"
                                placeholder="비밀번호를 입력하세요"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                type="password"
                                required
                            />

                            <ModernButton variant="primary" type="submit" fullWidth>
                                로그인
                            </ModernButton>

                            <Text size="sm" ta="center" c={dark ? '#999999' : '#666666'}>
                                계정이 없으신가요?{' '}
                                <Text
                                    span
                                    fw={600}
                                    c={dark ? '#ffffff' : '#000000'}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => {
                                        setLoginModalOpen(false);
                                        setRegisterModalOpen(true);
                                    }}
                                >
                                    회원가입
                                </Text>
                            </Text>
                        </Stack>
                    </form>
                </Modal>

                {/* Modern Register Modal */}
                <Modal
                    opened={registerModalOpen}
                    onClose={() => setRegisterModalOpen(false)}
                    title={
                        <Text size="xl" fw={700} c={dark ? '#ffffff' : '#000000'}>
                            회원가입
                        </Text>
                    }
                    centered
                    size="sm"
                    radius={rem(16)}
                    styles={{
                        content: {
                            background: dark ? '#0a0a0a' : '#ffffff',
                            border: `1px solid ${dark ? '#1a1a1a' : '#f0f0f0'}`,
                        },
                        header: {
                            background: 'transparent',
                            borderBottom: 'none',
                            paddingBottom: 0,
                        },
                        body: {
                            padding: rem(32),
                            paddingTop: rem(24),
                        }
                    }}
                >
                    <form onSubmit={handleRegister}>
                        <Stack gap={rem(20)}>
                            {/* Kakao Register */}
                            <ModernButton
                                variant="kakao"
                                fullWidth
                                leftSection={<KakaoIcon size={20} />}
                                onClick={handleKakaoLogin}
                            >
                                카카오로 시작하기
                            </ModernButton>

                            <Divider
                                label="또는"
                                labelPosition="center"
                                styles={{
                                    label: {
                                        color: dark ? '#666666' : '#999999',
                                        fontSize: rem(12),
                                        fontWeight: 500,
                                    },
                                    root: {
                                        borderColor: dark ? '#1a1a1a' : '#f0f0f0',
                                    }
                                }}
                            />

                            <ModernInput
                                label="이름"
                                placeholder="이름을 입력하세요"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                leftIcon={<IconUser size={16} />}
                                required
                            />

                            <ModernInput
                                label="이메일"
                                placeholder="your@email.com"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                leftIcon={<IconMail size={16} />}
                                type="email"
                                required
                            />

                            <ModernInput
                                label="비밀번호"
                                placeholder="8자 이상 입력하세요"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                type="password"
                                required
                            />

                            <ModernInput
                                label="비밀번호 확인"
                                placeholder="비밀번호를 다시 입력하세요"
                                value={registerForm.confirmPassword}
                                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                                type="password"
                                required
                            />

                            <ModernButton variant="primary" type="submit" fullWidth>
                                계정 만들기
                            </ModernButton>

                            <Text size="sm" ta="center" c={dark ? '#999999' : '#666666'}>
                                이미 계정이 있으신가요?{' '}
                                <Text
                                    span
                                    fw={600}
                                    c={dark ? '#ffffff' : '#000000'}
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => {
                                        setRegisterModalOpen(false);
                                        setLoginModalOpen(true);
                                    }}
                                >
                                    로그인
                                </Text>
                            </Text>
                        </Stack>
                    </form>
                </Modal>
            </>
        );
    }

    // 로그인된 상태 - Modern Design
    return (
        <Menu
            shadow="lg"
            width={300}
            position="bottom-end"
            radius={rem(12)}
            styles={{
                dropdown: {
                    background: dark ? '#0a0a0a' : '#ffffff',
                    border: `1px solid ${dark ? '#1a1a1a' : '#f0f0f0'}`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: dark
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }
            }}
        >
            <Menu.Target>
                <UnstyledButton
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        padding: rem(8),
                        borderRadius: rem(50),
                        background: isHovered
                            ? (dark ? '#1a1a1a' : '#f5f5f5')
                            : 'transparent',
                        transition: 'all 0.2s ease',
                        border: `1px solid ${isHovered ? (dark ? '#333333' : '#e0e0e0') : 'transparent'}`,
                    }}
                >
                    <Group gap={rem(8)}>
                        <Indicator
                            inline
                            size={8}
                            offset={2}
                            position="bottom-end"
                            color="green"
                            withBorder
                            disabled={!user?.isOnline}
                        >
                            <Avatar
                                src={user?.avatar}
                                name={user?.name}
                                size={32}
                                radius="xl"
                                style={{
                                    border: `2px solid ${dark ? '#333333' : '#e0e0e0'}`,
                                }}
                            />
                        </Indicator>
                        <Box visibleFrom="sm">
                            <Group gap={rem(4)}>
                                <Text size="sm" fw={500} c={dark ? '#ffffff' : '#000000'} lineClamp={1}>
                                    {user?.name}
                                </Text>
                                <IconChevronDown
                                    size={12}
                                    style={{
                                        color: dark ? '#666666' : '#999999',
                                        transition: 'transform 0.2s ease',
                                        transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            </Group>
                        </Box>
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {/* User Info Header */}
                <Box p={rem(16)} style={{ borderBottom: `1px solid ${dark ? '#1a1a1a' : '#f0f0f0'}` }}>
                    <Group gap={rem(12)}>
                        <Avatar
                            src={user?.avatar}
                            name={user?.name}
                            size={48}
                            radius="xl"
                            style={{
                                border: `2px solid ${dark ? '#333333' : '#e0e0e0'}`,
                            }}
                        />
                        <Stack gap={rem(2)} style={{ flex: 1 }}>
                            <Text size="md" fw={600} c={dark ? '#ffffff' : '#000000'} lineClamp={1}>
                                {user?.name}
                            </Text>
                            <Text size="xs" c={dark ? '#999999' : '#666666'} lineClamp={1}>
                                {user?.email}
                            </Text>
                            {user?.role && (
                                <Badge
                                    size="xs"
                                    radius="sm"
                                    style={{
                                        background: dark ? '#1a1a1a' : '#f5f5f5',
                                        color: dark ? '#ffffff' : '#000000',
                                        border: `1px solid ${dark ? '#333333' : '#e0e0e0'}`,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                    }}
                                >
                                    {user.role}
                                </Badge>
                            )}
                        </Stack>
                    </Group>
                </Box>

                {/* Menu Items */}
                <Stack gap={rem(4)} p={rem(8)}>
                    {[
                        {
                            icon: IconUser,
                            label: '프로필',
                            href: '/profile',
                        },
                        {
                            icon: IconEdit,
                            label: '글 작성',
                            href: '/posts/create',
                        },
                        {
                            icon: IconBookmark,
                            label: '북마크',
                            href: '/bookmarks',
                        },
                        {
                            icon: IconBell,
                            label: '알림',
                            href: '/notifications',
                            badge: user?.unreadNotifications > 0 && (
                                <Badge
                                    size="xs"
                                    color="red"
                                    variant="filled"
                                    style={{
                                        background: '#ef4444',
                                        minWidth: rem(16),
                                        height: rem(16),
                                        borderRadius: rem(8),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: rem(10),
                                        fontWeight: 600,
                                    }}
                                >
                                    {user.unreadNotifications > 99 ? '99+' : user.unreadNotifications}
                                </Badge>
                            )
                        },
                        {
                            icon: IconTrendingUp,
                            label: '통계',
                            href: '/analytics',
                        },
                        {
                            icon: IconSettings,
                            label: '설정',
                            href: '/settings',
                        }
                    ].map((item, index) => (
                        <UnstyledButton
                            key={index}
                            onClick={() => window.location.href = item.href}
                            style={{
                                width: '100%',
                                padding: rem(12),
                                borderRadius: rem(8),
                                transition: 'all 0.15s ease',
                                background: 'transparent',
                                '&:hover': {
                                    background: dark ? '#1a1a1a' : '#f5f5f5',
                                }
                            }}
                        >
                            <Group gap={rem(12)} justify="space-between">
                                <Group gap={rem(12)}>
                                    <item.icon
                                        size={18}
                                        style={{ color: dark ? '#ffffff' : '#000000' }}
                                    />
                                    <Text size="sm" fw={500} c={dark ? '#ffffff' : '#000000'}>
                                        {item.label}
                                    </Text>
                                </Group>
                                <Group gap={rem(8)}>
                                    {item.badge && item.badge}
                                    <IconArrowRight
                                        size={14}
                                        style={{ color: dark ? '#666666' : '#999999' }}
                                    />
                                </Group>
                            </Group>
                        </UnstyledButton>
                    ))}

                    {/* Admin Panel */}
                    {user?.role === 'admin' && (
                        <>
                            <Divider
                                style={{
                                    borderColor: dark ? '#1a1a1a' : '#f0f0f0',
                                    margin: `${rem(8)} 0`,
                                }}
                            />
                            <UnstyledButton
                                onClick={() => window.location.href = '/admin'}
                                style={{
                                    width: '100%',
                                    padding: rem(12),
                                    borderRadius: rem(8),
                                    background: dark ? '#1a1a1a' : '#f8f9fa',
                                    border: `1px solid ${dark ? '#333333' : '#e9ecef'}`,
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                        background: dark ? '#2a2a2a' : '#f0f0f0',
                                    }
                                }}
                            >
                                <Group gap={rem(12)}>
                                    <IconShield
                                        size={18}
                                        style={{ color: dark ? '#ffffff' : '#000000' }}
                                    />
                                    <Text size="sm" fw={600} c={dark ? '#ffffff' : '#000000'}>
                                        관리자 패널
                                    </Text>
                                </Group>
                            </UnstyledButton>
                        </>
                    )}
                </Stack>

                <Divider
                    style={{
                        borderColor: dark ? '#1a1a1a' : '#f0f0f0',
                        margin: `${rem(8)} 0`,
                    }}
                />

                {/* Logout */}
                <Box p={rem(8)}>
                    <UnstyledButton
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        style={{
                            width: '100%',
                            padding: rem(12),
                            borderRadius: rem(8),
                            background: 'transparent',
                            border: `1px solid ${dark ? '#333333' : '#e0e0e0'}`,
                            transition: 'all 0.15s ease',
                            opacity: isLoggingOut ? 0.6 : 1,
                            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                            '&:hover': {
                                background: isLoggingOut ? 'transparent' : (dark ? '#1a1a1a' : '#f5f5f5'),
                                borderColor: isLoggingOut ? (dark ? '#333333' : '#e0e0e0') : '#ef4444',
                            }
                        }}
                    >
                        <Group gap={rem(12)} justify="center">
                            <IconLogout
                                size={16}
                                style={{ color: dark ? '#ffffff' : '#000000' }}
                            />
                            <Text size="sm" fw={500} c={dark ? '#ffffff' : '#000000'}>
                                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                            </Text>
                        </Group>
                    </UnstyledButton>
                </Box>
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserDropdown;