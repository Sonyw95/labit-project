import React, {memo, useState} from 'react';
import {
    Menu,
    Avatar,
    Text,
    Group,
    Badge,
    UnstyledButton,
    Stack,
    Box,
    Indicator,
    LoadingOverlay,
    Switch,
} from '@mantine/core';
import {
    IconUser,
    IconLogout,
    IconChevronDown,
    IconSun,
    IconMoon,
    IconPalette,
} from '@tabler/icons-react';
import {useLogout, useUserInfo} from "@/hooks/api/useApi.js";
import UserSettings from "./UserSettings.jsx";
import {useDisclosure} from "@mantine/hooks";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const getRoleBadgeColor = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'red';
        case 'ADMIN': return 'orange';
        default: return 'blue';
    }
};

const getRoleLabel = (role) => {
    switch (role) {
        case 'SUPER_ADMIN':
        case 'ADMIN': return '주인장';
        default: return '일반사용자';
    }
};

const UserMenu = memo((() => {
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { data: user, isLoading } = useUserInfo();
    const logoutMutation = useLogout();
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
    const { dark, toggleColorScheme } = useTheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: dark ? '#ECECEC' : '#212529',
        subText: dark ? '#ADB5BD' : '#495057',
        background: dark ? '#1A1B23' : '#FFFFFF',
        border: dark ? '#2B2D31' : '#E9ECEF',
        hover: dark ? '#2B2D31' : '#F8F9FA',
    };

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (isLoading) {
        return <Avatar size="md" />;
    }

    return (
        <>
            <Menu
                width={300}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
                styles={{
                    dropdown: {
                        backgroundColor: velogColors.background,
                        border: `1px solid ${velogColors.border}`,
                        borderRadius: '12px',
                        boxShadow: dark
                            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                            : '0 10px 40px rgba(0, 0, 0, 0.1)',
                        padding: '0.5rem',
                    }
                }}
            >
                <Menu.Target>
                    <UnstyledButton
                        style={{
                            padding: '8px',
                            borderRadius: '20px',
                            transition: 'all 0.2s ease',
                            backgroundColor: 'transparent',
                            border: 'none',
                            '&:hover': {
                                backgroundColor: velogColors.hover,
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = velogColors.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        aria-label="유저 정보"
                    >
                        <LoadingOverlay
                            visible={logoutMutation.isPending}
                            zIndex={1000}
                            overlayProps={{ radius: 'sm', blur: 2 }}
                            loaderProps={{ color: velogColors.primary, type: 'bars' }}
                        />
                        <Group gap="sm">
                            <Indicator
                                inline
                                size={12}
                                offset={7}
                                position="bottom-end"
                                color={user.isOnline ? velogColors.primary : "gray"}
                                withBorder
                            >
                                <Avatar
                                    src={user.profileImage}
                                    alt={user.nickname}
                                    radius="xl"
                                    size="md"
                                    style={{
                                        border: `2px solid ${velogColors.border}`
                                    }}
                                />
                            </Indicator>

                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    size="sm"
                                    fw={600}
                                    truncate
                                    c={velogColors.text}
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    {user.nickname}
                                </Text>
                                <Text
                                    size="xs"
                                    c={velogColors.subText}
                                    truncate
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    {getRoleLabel(user.role)}
                                </Text>
                            </Box>

                            {user.notifications > 0 && (
                                <Badge
                                    size="sm"
                                    variant="filled"
                                    color="red"
                                    circle
                                    style={{
                                        backgroundColor: '#FF6B6B',
                                    }}
                                >
                                    {user.notifications}
                                </Badge>
                            )}

                            <IconChevronDown
                                size={16}
                                color={velogColors.subText}
                                style={{
                                    transform: userMenuOpened ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 200ms ease',
                                }}
                            />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <UserDropdownContent
                        user={user}
                        openSettings={openSettings}
                        handleLogout={handleLogout}
                        dark={dark}
                        toggleColorScheme={toggleColorScheme}
                        velogColors={velogColors}
                    />
                </Menu.Dropdown>
            </Menu>
            <UserSettings
                opened={settingsOpened}
                onClose={closeSettings}
                user={user}
            />
        </>
    );
}))

const UserDropdownContent = memo(({ user, openSettings, handleLogout, dark, toggleColorScheme, velogColors }) => {
    return (
        <Stack gap="xs">
            {/* 사용자 정보 헤더 */}
            <Group
                p="md"
                style={{
                    backgroundColor: velogColors.hover,
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                }}
            >
                <Avatar
                    src={user.profileImage}
                    size="lg"
                    radius="md"
                    style={{
                        border: `2px solid ${velogColors.border}`
                    }}
                />
                <Box style={{ flex: 1 }}>
                    <Text
                        fw={600}
                        size="md"
                        c={velogColors.text}
                        style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {user.nickname}
                    </Text>
                    <Text
                        size="sm"
                        c={velogColors.subText}
                        style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {user.email}
                    </Text>
                    <Badge
                        size="xs"
                        color={getRoleBadgeColor(user.role)}
                        variant="light"
                        mt="xs"
                        style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {getRoleLabel(user.role)}
                    </Badge>
                </Box>
            </Group>

            <Menu.Divider style={{ borderColor: velogColors.border }} />

            {/* 메뉴 아이템들 */}
            <Menu.Item
                leftSection={<IconUser size={16} color={velogColors.subText} />}
                onClick={() => openSettings(true)}
                style={{
                    borderRadius: '8px',
                    color: velogColors.text,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '&:hover': {
                        backgroundColor: velogColors.hover,
                    }
                }}
            >
                <Box>
                    <Text size="sm" fw={500} c={velogColors.text}>프로필 설정</Text>
                    <Text size="xs" c={velogColors.subText}>계정 정보 및 개인정보 관리</Text>
                </Box>
            </Menu.Item>

            <Menu.Divider style={{ borderColor: velogColors.border }} />

            <Menu.Item
                leftSection={<IconPalette size={16} color={velogColors.subText} />}
                onClick={toggleColorScheme}
                style={{
                    borderRadius: '8px',
                    color: velogColors.text,
                    '&:hover': {
                        backgroundColor: velogColors.hover,
                    }
                }}
            >
                <Group justify="space-between" w="100%">
                    <Box>
                        <Text
                            size="sm"
                            fw={500}
                            c={velogColors.text}
                            style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                        >
                            다크 모드
                        </Text>
                        <Text
                            size="xs"
                            c={velogColors.subText}
                            style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                        >
                            테마 설정
                        </Text>
                    </Box>
                    <Switch
                        size="sm"
                        checked={dark}
                        onLabel={<IconMoon size={12} />}
                        offLabel={<IconSun size={12} />}
                        styles={{
                            track: {
                                backgroundColor: dark ? velogColors.primary : velogColors.border,
                            }
                        }}
                    />
                </Group>
            </Menu.Item>

            <Menu.Divider style={{ borderColor: velogColors.border }} />

            <Menu.Item
                leftSection={<IconLogout size={16} color="#FF6B6B" />}
                color="red"
                onClick={handleLogout}
                style={{
                    borderRadius: '8px',
                    color: '#FF6B6B',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '&:hover': {
                        backgroundColor: '#FFE8E8',
                    }
                }}
            >
                <Text
                    size="sm"
                    fw={500}
                    c="#FF6B6B"
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    로그아웃
                </Text>
            </Menu.Item>
        </Stack>
    );
})

export default UserMenu;