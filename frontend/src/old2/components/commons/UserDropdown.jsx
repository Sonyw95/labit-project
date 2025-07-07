import React, {  } from 'react';
import {
    Menu,
    UnstyledButton,
    Group,
    Avatar,
    Text,
    rem,
    Switch,
    Badge,
} from '@mantine/core';
import {
    IconChevronDown,
    IconUser,
    IconSettings,
    IconLogout,
    IconLogin,
    IconUserPlus,
    IconMoon,
    IconSun,
    IconBell,
    IconShield,
    IconHeart,
    IconCreditCard,
} from '@tabler/icons-react';
import {useAuth} from "@/context/AuthContext.jsx";
import {useTheme} from "@/old/hooks/useTheme.js";
import {useToggle} from "@mantine/hooks";

const UserDropdown = ({ onSettingsClick, onLoginClick, onRegisterClick }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const { colorScheme, toggleColorScheme } = useTheme();
    const [opened, { toggle }] = useToggle(false);

    // 인증되지 않은 사용자용 메뉴
    const UnauthenticatedMenu = () => (
        <Menu shadow="lg" width={220} position="bottom-end" opened={opened} onChange={toggle}>
            <Menu.Target>
                <UnstyledButton
                    style={{
                        padding: rem(8),
                        borderRadius: rem(8),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'var(--mantine-color-gray-1)',
                        }
                    }}
                >
                    <Group gap="xs">
                        <Avatar size={32} radius="md" />
                        <IconChevronDown size={16} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown style={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: rem(12),
            }}>
                <Menu.Item
                    leftSection={<IconLogin size={16} />}
                    onClick={onLoginClick}
                >
                    로그인
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconUserPlus size={16} />}
                    onClick={onRegisterClick}
                >
                    회원가입
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                    rightSection={
                        <Switch
                            checked={colorScheme === 'dark'}
                            onChange={toggleColorScheme}
                            size="sm"
                        />
                    }
                    onClick={toggleColorScheme}
                >
                    다크 모드
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    // 인증된 사용자용 메뉴
    const AuthenticatedMenu = () => (
        <Menu shadow="lg" width={280} position="bottom-end" opened={opened} onChange={toggle}>
            <Menu.Target>
                <UnstyledButton
                    style={{
                        padding: rem(8),
                        borderRadius: rem(12),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'var(--mantine-color-gray-1)',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <Group gap="sm">
                        <Avatar
                            src={user?.avatar}
                            size={36}
                            radius="md"
                            style={{
                                border: '2px solid var(--mantine-color-blue-6)',
                            }}
                        />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <Text size="sm" fw={600} lineClamp={1}>
                                {user?.name || '사용자'}
                            </Text>
                            <Text size="xs" c="dimmed" lineClamp={1}>
                                {user?.email}
                            </Text>
                        </div>
                        <IconChevronDown size={16} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown style={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: rem(16),
                padding: rem(8),
            }}>
                {/* 사용자 정보 헤더 */}
                <div style={{
                    padding: rem(12),
                    marginBottom: rem(8),
                    borderRadius: rem(8),
                    backgroundColor: 'var(--mantine-color-blue-0)',
                }}>
                    <Group>
                        <Avatar
                            src={user?.avatar}
                            size={48}
                            radius="md"
                        />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={600}>
                                {user?.name || '사용자'}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {user?.email}
                            </Text>
                            <Group gap="xs" mt="xs">
                                <Badge size="xs" color="green">
                                    활성
                                </Badge>
                                <Badge size="xs" variant="light">
                                    {user?.role || 'Member'}
                                </Badge>
                            </Group>
                        </div>
                    </Group>
                </div>

                <Menu.Item
                    leftSection={<IconUser size={16} />}
                    onClick={onSettingsClick}
                    style={{ borderRadius: rem(8) }}
                >
                    내 프로필
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconSettings size={16} />}
                    onClick={onSettingsClick}
                    style={{ borderRadius: rem(8) }}
                >
                    계정 설정
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconBell size={16} />}
                    rightSection={
                        <Badge size="xs" color="red">
                            3
                        </Badge>
                    }
                    style={{ borderRadius: rem(8) }}
                >
                    알림
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconHeart size={16} />}
                    style={{ borderRadius: rem(8) }}
                >
                    즐겨찾기
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={<IconShield size={16} />}
                    style={{ borderRadius: rem(8) }}
                >
                    보안 설정
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconCreditCard size={16} />}
                    style={{ borderRadius: rem(8) }}
                >
                    결제 정보
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                    rightSection={
                        <Switch
                            checked={colorScheme === 'dark'}
                            onChange={toggleColorScheme}
                            size="sm"
                        />
                    }
                    onClick={toggleColorScheme}
                    style={{ borderRadius: rem(8) }}
                >
                    다크 모드
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    color="red"
                    onClick={logout}
                    style={{ borderRadius: rem(8) }}
                >
                    로그아웃
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    return isAuthenticated ? <AuthenticatedMenu /> : <UnauthenticatedMenu />;
};

export default UserDropdown;