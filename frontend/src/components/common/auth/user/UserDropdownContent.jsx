import React, { memo, useMemo, useCallback } from 'react';
import { Stack, Group, Box, Text, Menu } from '@mantine/core';
import { IconUser, IconLogout } from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import UserAvatar from './UserAvatar';
import UserInfo from './UserInfo';
import ThemeToggle from './ThemeToggle';

const UserDropdownContent = memo(({
                                      user,
                                      openSettings,
                                      handleLogout
                                  }) => {
    const { themeColors } = useTheme();

    // 사용자 정보 헤더 스타일 메모이제이션
    const headerStyles = useMemo(() => ({
        backgroundColor: themeColors.hover,
        borderRadius: '8px',
        marginBottom: '0.5rem'
    }), [themeColors.hover]);

    // 메뉴 구분선 스타일 메모이제이션
    const dividerStyles = useMemo(() => ({
        borderColor: themeColors.border
    }), [themeColors.border]);

    // 일반 메뉴 아이템 스타일 메모이제이션
    const menuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: themeColors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '&:hover': {
            backgroundColor: themeColors.hover,
        }
    }), [themeColors]);

    // 로그아웃 메뉴 아이템 스타일 메모이제이션
    const logoutMenuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: '#FF6B6B',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '&:hover': {
            backgroundColor: '#FFE8E8',
        }
    }), []);

    // 텍스트 스타일 메모이제이션
    const textStyles = useMemo(() => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }), []);

    // 설정 열기 핸들러 메모이제이션
    const handleOpenSettings = useCallback(() => {
        openSettings();
    }, [openSettings]);

    // 테마 토글 핸들러 메모이제이션
    const handleThemeToggle = useCallback(() => {
        // 테마 토글 후 추가 로직이 필요한 경우 여기에 작성
    }, []);

    return (
        <Stack gap="xs" role="menu" aria-label="사용자 메뉴">
            {/* 사용자 정보 헤더 */}
            <Group
                p="md"
                style={headerStyles}
                role="banner"
                aria-label="사용자 정보"
            >
                <UserAvatar
                    user={user}
                    size="lg"
                    showOnlineStatus={false}
                />

                <UserInfo
                    user={user}
                    showEmail={true}
                    showRole={true}
                    layout="vertical"
                />
            </Group>

            <Menu.Divider style={dividerStyles} />

            {/* 프로필 설정 메뉴 */}
            <Menu.Item
                leftSection={
                    <IconUser
                        size={16}
                        color={themeColors.subText}
                        aria-hidden="true"
                    />
                }
                onClick={handleOpenSettings}
                style={menuItemStyles}
                role="menuitem"
                aria-label="프로필 설정 열기"
            >
                <Box>
                    <Text
                        size="sm"
                        fw={500}
                        c={themeColors.text}
                        style={textStyles}
                    >
                        프로필 설정
                    </Text>
                    <Text
                        size="xs"
                        c={themeColors.subText}
                        style={textStyles}
                    >
                        계정 정보 및 개인정보 관리
                    </Text>
                </Box>
            </Menu.Item>

            <Menu.Divider style={dividerStyles} />

            {/* 테마 토글 */}
            <ThemeToggle onToggle={handleThemeToggle} />

            <Menu.Divider style={dividerStyles} />

            {/* 로그아웃 메뉴 */}
            <Menu.Item
                leftSection={
                    <IconLogout
                        size={16}
                        color="#FF6B6B"
                        aria-hidden="true"
                    />
                }
                color="red"
                onClick={handleLogout}
                style={logoutMenuItemStyles}
                role="menuitem"
                aria-label="로그아웃"
            >
                <Text
                    size="sm"
                    fw={500}
                    c="#FF6B6B"
                    style={textStyles}
                >
                    로그아웃
                </Text>
            </Menu.Item>
        </Stack>
    );
});

UserDropdownContent.displayName = 'UserDropdownContent';

export default UserDropdownContent;