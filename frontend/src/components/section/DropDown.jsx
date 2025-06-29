import React, {useState} from 'react';
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
    Divider, TextInput, PasswordInput, Alert,
} from '@mantine/core';
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconChevronDown, IconAlertCircle,
} from '@tabler/icons-react';
import {useLoginMutation} from "../../hooks/useAuth.js";
import {useAuthStore} from "../../store/authStore.js";

// 카카오톡 아이콘 SVG 컴포넌트
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
// 사용자 드롭다운 메뉴 컴포넌트
export default function  UserDropdown (props) {
    const { dark } = props;
    const [credentials, setCredentials] = useState({ userEmail: '', password: '' });
    const { error, clearError, loginWithKakao, isLoading,isAuthenticated, user } = useAuthStore();
    console.log(user);
    const loginMutation = useLoginMutation();

    const handleKakaoLogin = async () => {
        clearError();
        try {
            await loginWithKakao();
            // 로그인 성공 시 페이지 새로고침 또는 리다이렉트
            window.location.href = '/home';
        } catch (error) {
            console.error('Kakao login failed:', error);
        }
    };
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        clearError();
        try {
            const resp = await loginMutation.mutateAsync(credentials, type);
            console.log(resp);
            window.location.href = '/home';
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

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
                        {isAuthenticated ? (
                            <>
                                <Avatar
                                    src={user.profileImage}
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
                {isAuthenticated ? (
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
                                    src={user.profileImage}
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
                                        {user.nickname}
                                    </Text>
                                    <Text
                                        size="xs"
                                        style={{ color: dark ? '#999999' : '#64748b' }}
                                        truncate
                                    >
                                        {user.email}
                                    </Text>
                                    <Badge
                                        size="xs"
                                        style={{
                                            background: dark ? '#2a2a2a' : '#e2e8f0',
                                            color: dark ? '#ffffff' : '#475569',
                                            marginTop: rem(4),
                                        }}
                                    >
                                        {user.roles[0]}
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
                        {/*/!* Login State *!/*/}
                        <Box style={{ padding: rem(8) }}>
                            <Stack gap="sm">
                                <form onSubmit={(e) => handleSubmit(e, 'normal')}>
                                    <TextInput
                                        label='이메일'
                                        placeholder='이메일을 입력하세요.'
                                        value={credentials.userEmail}
                                        onChange={(e) => {setCredentials({...credentials, userEmail: e.target.value})}}
                                        required
                                        mb='md'
                                    />
                                    <PasswordInput
                                        label='비밀번호'
                                        placeholder='비밀번호를 입력하세요.'
                                        value={credentials.password}
                                        onChange={(e) => {setCredentials({...credentials, password: e.target.value})}}
                                        required
                                        mb='md'
                                    />
                                    {error && (
                                        <Alert
                                            icon={<IconAlertCircle size={16}/>}
                                            title="로그인 오류"
                                            color="red"
                                            mb="md"
                                        >
                                            {error}
                                        </Alert>
                                    )}
                                    <Button
                                        type='submit'
                                        leftSection={<IconLogin size={16} />}
                                        fullWidth
                                        size="sm"
                                        style={{
                                            background: dark ? '#4c6ef5' : '#339af0',
                                            borderRadius: rem(8),
                                            '&:hover': {
                                                background: dark ? '#3b82f6' : '#2563eb',
                                            }
                                        }}
                                    >
                                        {loginMutation.isPending ? '로그인중....    ' : '로그인'}
                                    </Button>
                                </form>
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
                                onClick={(e) => handleSubmit(e, 'kakao')}
                                style={{
                                    borderColor: dark ? '#2a2a2a' : '#e2e8f0',
                                    margin: `${rem(16)} 0`,
                                    color: dark ? '#666666' : '#94a3b8'
                                }}
                            />
                            <Button
                                leftSection={<KakaoIcon size={16} />}
                                fullWidth
                                size="sm"
                                radius="md"
                                onClick={handleKakaoLogin}
                                loading={isLoading}
                                style={{
                                    backgroundColor: '#FEE500',
                                    color: '#000000',
                                    border: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isLoading ? '로그인중....' : '카카오톡으로 로그인'}
                            </Button>
                        </Box>
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}