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
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconUserPlus,
    IconChevronDown,
    IconMail,
    IconBell,
    IconBookmark,
    IconEdit,
    IconShield, IconBrandKakoTalk,
} from '@tabler/icons-react';
import {useAuth} from "@/context/AuthContext.jsx";
import {useToast} from "@/components/Toast.jsx";

// Hooks and Context
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
const UserDropdown = () => {

    const {user, isAuthenticated, login, register, logout} = useAuth();
    const {success, error: showError} = useToast();
    const {colorScheme} = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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

    // 카카오 로그인 처리
    const handleKakaoLogin = async () => {
        //     try {
        //         // 카카오 SDK 초기화 및 로그인 처리
        //         if (window.Kakao) {
        //             window.Kakao.Auth.login({
        //                 success: async (response) => {
        //                     try {
        //                         // 카카오 사용자 정보 가져오기
        //                         window.Kakao.API.request({
        //                             url: '/v2/user/me',
        //                             success: async (userInfo) => {
        //                                 // 백엔드로 카카오 토큰 전송하여 로그인 처리
        //                                 const loginResponse = await fetch('/api/auth/kakao', {
        //                                     method: 'POST',
        //                                     headers: {
        //                                         'Content-Type': 'application/json',
        //                                     },
        //                                     body: JSON.stringify({
        //                                         accessToken: response.access_token,
        //                                         userInfo: userInfo,
        //                                     }),
        //                                 });
        //
        //                                 if (loginResponse.ok) {
        //                                     const userData = await loginResponse.json();
        //                                     // Auth Context에 사용자 정보 저장
        //                                     await login(userData);
        //                                     success('카카오 로그인 성공!');
        //                                     setLoginModalOpen(false);
        //                                 } else {
        //                                     throw new Error('카카오 로그인 처리 중 오류가 발생했습니다.');
        //                                 }
        //                             },
        //                             fail: (error) => {
        //                                 showError('카카오 사용자 정보를 가져오는데 실패했습니다.');
        //                             },
        //                         });
        //                     } catch (err) {
        //                         showError('카카오 로그인 처리 중 오류가 발생했습니다.');
        //                     }
        //                 },
        //                 fail: (error) => {
        //                     showError('카카오 로그인에 실패했습니다.');
        //                 },
        //             });
        //         } else {
        //             showError('카카오 SDK가 로드되지 않았습니다.');
        //         }
        //     } catch (err) {
        //         showError('카카오 로그인 중 오류가 발생했습니다.');
        //     }
    };

// 이메일 로그인 처리
    const handleEmailLogin = async (e) => {
        e.preventDefault();

        // try {
        //     await login({
        //         email: loginForm.email,
        //         password: loginForm.password,
        //     });
        //
        //     success('로그인 성공!');
        //     setLoginModalOpen(false);
        //     setLoginForm({ email: '', password: '' });
        // } catch (err) {
        //     showError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        // }
    };

// 회원가입 처리
    const handleRegister = async (e) => {
        // e.preventDefault();
        //
        // if (registerForm.password !== registerForm.confirmPassword) {
        //     showError('비밀번호가 일치하지 않습니다.');
        //     return;
        // }
        //
        // if (registerForm.password.length < 8) {
        //     showError('비밀번호는 최소 8자 이상이어야 합니다.');
        //     return;
        // }
        //
        // try {
        //     await register({
        //         name: registerForm.name,
        //         email: registerForm.email,
        //         password: registerForm.password,
        //     });
        //
        //     success('회원가입이 완료되었습니다!');
        //     setRegisterModalOpen(false);
        //     setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
        // } catch (err) {
        //     showError('회원가입에 실패했습니다.');
        // }
    };

// 로그아웃 처리
    const handleLogout = async () => {
        // setIsLoggingOut(true);
        //
        // try {
        //     await logout();
        //     success('로그아웃되었습니다.');
        // } catch (err) {
        //     showError('로그아웃 중 오류가 발생했습니다.');
        // } finally {
        //     setIsLoggingOut(false);
        // }
    };

// 로그인되지 않은 상태
    if (!isAuthenticated) {
        return (
            <>
                <Group gap="xs">
                    <Button
                        variant="light"
                        size="sm"
                        onClick={() => setLoginModalOpen(true)}
                        leftSection={<IconLogin size={16}/>}
                    >
                        로그인
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setRegisterModalOpen(true)}
                        leftSection={<IconUserPlus size={16}/>}
                        bg='rgb(255,170,0)'
                    >
                        회원가입
                    </Button>
                </Group>

                {/* 로그인 모달 */}
                <Modal
                    opened={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    title="로그인"
                    centered
                    size="sm"
                >
                    <form onSubmit={handleEmailLogin}>
                        <Stack gap="md">
                            {/* 카카오 로그인 버튼 */}
                            <Button
                                fullWidth
                                leftSection={<KakaoIcon size={18}/>}
                                onClick={handleKakaoLogin}
                                style={{
                                    background: '#FEE500',
                                    color: '#000000',
                                    border: 'none',
                                    '&:hover': {
                                        background: '#FDD700',
                                    }
                                }}
                            >
                                카카오로 로그인
                            </Button>

                            <Divider label="또는" labelPosition="center"/>

                            {/* 이메일 로그인 */}
                            <TextInput
                                label="이메일"
                                placeholder="email@example.com"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                                leftSection={<IconMail size={16}/>}
                                required
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="비밀번호를 입력하세요"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                required
                            />

                            <Button type="submit" fullWidth>
                                로그인
                            </Button>

                            <Text size="sm" ta="center" c="dimmed">
                                계정이 없으신가요?{' '}
                                <Text
                                    span
                                    c="blue"
                                    style={{cursor: 'pointer'}}
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

                {/* 회원가입 모달 */}
                <Modal
                    opened={registerModalOpen}
                    onClose={() => setRegisterModalOpen(false)}
                    title="회원가입"
                    centered
                    size="sm"
                >
                    <form onSubmit={handleRegister}>
                        <Stack gap="md">
                            {/* 카카오 회원가입 */}
                            <Button
                                fullWidth
                                leftSection={<KakaoIcon size={18}/>}
                                onClick={handleKakaoLogin}
                                style={{
                                    background: '#FEE500',
                                    color: '#000000',
                                    border: 'none',
                                    '&:hover': {
                                        background: '#FDD700',
                                    }
                                }}
                            >
                                카카오로 시작하기
                            </Button>

                            <Divider label="또는" labelPosition="center"/>

                            {/* 이메일 회원가입 */}
                            <TextInput
                                label="이름"
                                placeholder="이름을 입력하세요"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                                leftSection={<IconUser size={16}/>}
                                required
                            />

                            <TextInput
                                label="이메일"
                                placeholder="email@example.com"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                                leftSection={<IconMail size={16}/>}
                                type="email"
                                required
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="8자 이상 입력하세요"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                required
                            />

                            <PasswordInput
                                label="비밀번호 확인"
                                placeholder="비밀번호를 다시 입력하세요"
                                value={registerForm.confirmPassword}
                                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                                required
                            />

                            <Button type="submit" fullWidth>
                                회원가입
                            </Button>

                            <Text size="sm" ta="center" c="dimmed">
                                이미 계정이 있으신가요?{' '}
                                <Text
                                    span
                                    c="blue"
                                    style={{cursor: 'pointer'}}
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

// 로그인된 상태
    return (
        <Menu shadow="md" width={280} position="bottom-end">
            <Menu.Target>
                <UnstyledButton
                    style={{
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: dark ? '#21262d' : '#f3f4f6',
                        }
                    }}
                >
                    <Group gap="xs">
                        <Avatar
                            src={user?.avatar}
                            name={user?.name}
                            size="sm"
                            style={{
                                border: `2px solid ${dark ? '#4c6ef5' : '#339af0'}`,
                            }}
                        />
                        <Box visibleFrom="sm">
                            <Group gap="xs">
                                <Text size="sm" fw={500}>
                                    {user?.name}
                                </Text>
                                <IconChevronDown size={14}/>
                            </Group>
                        </Box>
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                {/* 사용자 정보 헤더 */}
                <Box p="sm" style={{
                    background: dark ? '#21262d' : '#f8fafc',
                    borderRadius: '6px',
                    margin: '8px',
                    marginBottom: '12px',
                }}>
                    <Group gap="sm">
                        <Avatar
                            src={user?.avatar}
                            name={user?.name}
                            size="md"
                        />
                        <Stack gap="xs" style={{flex: 1}}>
                            <Text size="sm" fw={600}>
                                {user?.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {user?.email}
                            </Text>
                            {user?.role && (
                                <Badge size="xs" variant="light">
                                    {user.role}
                                </Badge>
                            )}
                        </Stack>
                    </Group>
                </Box>

                {/* 메뉴 아이템들 */}
                <Menu.Item
                    leftSection={<IconUser size={16}/>}
                    onClick={() => window.location.href = '/profile'}
                >
                    프로필 보기
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconBookmark size={16}/>}
                    onClick={() => window.location.href = '/bookmarks'}
                >
                    북마크
                </Menu.Item>

                {/*<Menu.Item*/}
                {/*    leftSection={<IconBell size={16}/>}*/}
                {/*    onClick={() => window.location.href = '/notifications'}*/}
                {/*    rightSection={*/}
                {/*        user?.unreadNotifications > 0 && (*/}
                {/*            <Badge size="xs" color="red" variant="filled">*/}
                {/*                {user.unreadNotifications > 99 ? '99+' : user.unreadNotifications}*/}
                {/*            </Badge>*/}
                {/*        )*/}
                {/*    }*/}
                {/*>*/}
                {/*    알림*/}
                {/*</Menu.Item>*/}

                <Menu.Divider/>

                <Menu.Item
                    leftSection={<IconSettings size={16}/>}
                    onClick={() => window.location.href = '/settings'}
                >
                    설정
                </Menu.Item>

                {user?.role === 'admin' && (
                    <Menu.Item
                        leftSection={<IconShield size={16}/>}
                        onClick={() => window.location.href = '/admin'}
                    >
                        관리자 패널
                    </Menu.Item>
                )}

                <Menu.Divider/>

                <Menu.Item
                    leftSection={<IconLogout size={16}/>}
                    onClick={handleLogout}
                    color="red"
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default UserDropdown;