import React, { memo, useState, useCallback, useMemo } from 'react';
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
import { useLogout } from "@/hooks/api/useApi.js";
import UserSettings from "./UserSettings.jsx";
import { useDisclosure } from "@mantine/hooks";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import {NavLink} from "react-router-dom";
import useAuthStore from "../../../../stores/authStore.js";

// 역할별 배지 색상 유틸리티 함수 - 메모이제이션 불필요 (순수 함수)
const getRoleBadgeColor = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'red';
        case 'ADMIN': return 'orange';
        default: return 'blue';
    }
};

// 역할별 라벨 유틸리티 함수 - 메모이제이션 불필요 (순수 함수)
const getRoleLabel = (role) => {
    switch (role) {
        case 'SUPER_ADMIN':
        case 'ADMIN': return '주인장';
        default: return '일반사용자';
    }
};

const UserMenu = memo(() => {
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { user, isLoading } = useAuthStore();

    const logoutMutation = useLogout();
    const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
    const { dark, themeColors, toggleColorScheme } = useTheme();

    // 메뉴 드롭다운 스타일 메모이제이션
    const menuStyles = useMemo(() => ({
        dropdown: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: '12px',
            boxShadow: dark
                ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                : '0 10px 40px rgba(0, 0, 0, 0.1)',
            padding: '0.5rem',
        }
    }), [themeColors, dark]);

    // 사용자 버튼 스타일 메모이제이션
    const userButtonStyles = useMemo(() => ({
        padding: '8px',
        borderRadius: '20px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        border: 'none',
    }), []);

    // 텍스트 스타일 메모이제이션
    const textStyles = useMemo(() => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }), []);

    // 사용자 정보 헤더 스타일 메모이제이션
    const headerStyles = useMemo(() => ({
        backgroundColor: themeColors.hover,
        borderRadius: '8px',
        marginBottom: '0.5rem'
    }), [themeColors.hover]);

    // 메뉴 아이템 스타일 메모이제이션
    const menuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: themeColors.text,
        ...textStyles,
        '&:hover': {
            backgroundColor: themeColors.hover,
        }
    }), [themeColors, textStyles]);

    // 로그아웃 버튼 스타일 메모이제이션
    const logoutStyles = useMemo(() => ({
        borderRadius: '8px',
        color: '#FF6B6B',
        ...textStyles,
        '&:hover': {
            backgroundColor: '#FFE8E8',
        }
    }), [textStyles]);

    // 스위치 스타일 메모이제이션
    const switchStyles = useMemo(() => ({
        track: {
            backgroundColor: dark ? themeColors.primary : themeColors.border,
        }
    }), [dark, themeColors]);

    // 이벤트 핸들러들 메모이제이션
    const handleLogout = useCallback(() => {
        logoutMutation.mutate();
    }, [logoutMutation]);

    const handleOpenSettings = useCallback(() => {
        openSettings();
    }, [openSettings]);

    const handleMenuOpen = useCallback(() => {
        setUserMenuOpened(true);
    }, []);

    const handleMenuClose = useCallback(() => {
        setUserMenuOpened(false);
    }, []);

    // 호버 이벤트 핸들러 메모이제이션
    const handleButtonMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
    }, [themeColors.hover]);

    const handleButtonMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }, []);

    // 쉐브론 아이콘 스타일 메모이제이션
    const chevronStyles = useMemo(() => ({
        transform: userMenuOpened ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
    }), [userMenuOpened]);

    // 로딩 상태일 때 간단한 아바타 표시
    if (isLoading) {
        return <Avatar size="md" aria-label="사용자 정보 로딩 중" />;
    }

    // 사용자 정보가 없는 경우
    if (!user) {
        return <Avatar size="md" aria-label="사용자 정보 없음" />;
    }

    return (
        <>
            <Menu
                width={300}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={handleMenuClose}
                onOpen={handleMenuOpen}
                opened={userMenuOpened}
                withinPortal
                styles={menuStyles}
                // closeOnItemClick={false}
                // closeOnClickOutside={true}
                // closeOnEscape={true}
                // trapFocus={true}
                aria-label="사용자 메뉴"
            >
                <Menu.Target>
                    <UnstyledButton
                        style={userButtonStyles}
                        onMouseEnter={handleButtonMouseEnter}
                        onMouseLeave={handleButtonMouseLeave}
                        aria-label={`${user.nickname} 사용자 메뉴 ${userMenuOpened ? '닫기' : '열기'}`}
                        aria-expanded={userMenuOpened}
                        aria-haspopup="menu"
                    >
                        <LoadingOverlay
                            visible={logoutMutation.isPending}
                            zIndex={1000}
                            overlayProps={{ radius: 'sm', blur: 2 }}
                            loaderProps={{ color: themeColors.primary, type: 'bars' }}
                        />

                        <Group gap="sm">
                            <Indicator
                                inline
                                size={12}
                                offset={7}
                                position="bottom-end"
                                color={user.isOnline ? themeColors.primary : "gray"}
                                withBorder
                                aria-label={user.isOnline ? "온라인" : "오프라인"}
                            >
                                <Avatar
                                    src={user.profileImage}
                                    alt={`${user.nickname}의 프로필 이미지`}
                                    radius="xl"
                                    size="md"
                                    style={{
                                        border: `2px solid ${themeColors.border}`
                                    }}
                                />
                            </Indicator>

                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    size="sm"
                                    fw={600}
                                    truncate
                                    c={themeColors.text}
                                    style={textStyles}
                                    aria-label={`사용자: ${user.nickname}`}
                                >
                                    {user.nickname}
                                </Text>
                                <Text
                                    size="xs"
                                    c={themeColors.subText}
                                    truncate
                                    style={textStyles}
                                    aria-label={`역할: ${getRoleLabel(user.role)}`}
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
                                    aria-label={`${user.notifications}개의 새 알림`}
                                >
                                    {user.notifications}
                                </Badge>
                            )}

                            <IconChevronDown
                                size={16}
                                color={themeColors.subText}
                                style={chevronStyles}
                                aria-hidden="true"
                            />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <UserDropdownContent
                        user={user}
                        openSettings={handleOpenSettings}
                        handleLogout={handleLogout}
                        toggleColorScheme={toggleColorScheme}
                        dark={dark}
                        themeColors={themeColors}
                        headerStyles={headerStyles}
                        menuItemStyles={menuItemStyles}
                        logoutStyles={logoutStyles}
                        switchStyles={switchStyles}
                        textStyles={textStyles}
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
});

// 드롭다운 컨텐츠 컴포넌트 - 분리하되 같은 파일에 유지
const UserDropdownContent = memo(({
                                      user,
                                      openSettings,
                                      handleLogout,
                                      toggleColorScheme,
                                      dark,
                                      themeColors,
                                      headerStyles,
                                      menuItemStyles,
                                      logoutStyles,
                                      switchStyles,
                                      textStyles
                                  }) => {
    // 구분선 스타일 메모이제이션
    const dividerStyles = useMemo(() => ({
        borderColor: themeColors.border
    }), [themeColors.border]);

    return (
        <Stack gap="xs" role="menu" aria-label="사용자 메뉴">
            {/* 사용자 정보 헤더 */}
            <Group
                p="md"
                style={headerStyles}
                role="banner"
                aria-label="사용자 정보"
            >
                <Avatar
                    src={user.profileImage}
                    size="lg"
                    radius="md"
                    style={{
                        border: `2px solid ${themeColors.border}`
                    }}
                    alt={`${user.nickname}의 프로필 이미지`}
                />
                <Box style={{ flex: 1 }}>
                    <Text
                        fw={600}
                        size="md"
                        c={themeColors.text}
                        style={textStyles}
                        aria-label={`사용자: ${user.nickname}`}
                    >
                        {user.nickname}
                    </Text>
                    <Text
                        size="sm"
                        c={themeColors.subText}
                        style={textStyles}
                        aria-label={`이메일: ${user.email}`}
                    >
                        {user.email}
                    </Text>
                    <Badge
                        size="xs"
                        color={getRoleBadgeColor(user.role)}
                        variant="light"
                        mt="xs"
                        style={textStyles}
                        aria-label={`역할: ${getRoleLabel(user.role)}`}
                    >
                        {getRoleLabel(user.role)}
                    </Badge>
                </Box>
            </Group>

            <Menu.Divider style={dividerStyles} />

            {/* 프로필 설정 메뉴 */}
            <Menu.Item
                component={NavLink}
                to="/user/settings"
                leftSection={
                    <IconUser
                        size={16}
                        color={themeColors.subText}
                        aria-hidden="true"
                    />
                }
                // onClick={openSettings}
                style={menuItemStyles}
                role="menuitem"
                aria-label="프로필 설정 열기"
            >
                <Box>
                    <Text size="sm" fw={500} c={themeColors.text} style={textStyles}>
                        프로필 설정
                    </Text>
                    <Text size="xs" c={themeColors.subText} style={textStyles}>
                        계정 정보 및 개인정보 관리
                    </Text>
                </Box>
            </Menu.Item>

            <Menu.Divider style={dividerStyles} />

            {/* 테마 토글 */}
            <Menu.Item
                leftSection={
                    <IconPalette
                        size={16}
                        color={themeColors.subText}
                        aria-hidden="true"
                    />
                }
                onClick={toggleColorScheme}
                style={menuItemStyles}
                role="menuitem"
                aria-label={`테마를 ${dark ? '라이트' : '다크'} 모드로 변경`}
            >
                <Group justify="space-between" w="100%">
                    <Box>
                        <Text
                            size="sm"
                            fw={500}
                            c={themeColors.text}
                            style={textStyles}
                        >
                            다크 모드
                        </Text>
                        <Text
                            size="xs"
                            c={themeColors.subText}
                            style={textStyles}
                        >
                            테마 설정
                        </Text>
                    </Box>
                    <Switch
                        size="sm"
                        checked={dark}
                        onChange={() => {}} // 실제 변경은 onClick에서 처리
                        onLabel={<IconMoon size={12} aria-hidden="true" />}
                        offLabel={<IconSun size={12} aria-hidden="true" />}
                        styles={switchStyles}
                        tabIndex={-1} // 메뉴 아이템의 포커스를 사용
                        aria-hidden="true" // 메뉴 아이템의 aria-label을 사용
                    />
                </Group>
            </Menu.Item>

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
                style={logoutStyles}
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


export default UserMenu;