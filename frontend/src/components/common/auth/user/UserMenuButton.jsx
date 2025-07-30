import React, { memo, useMemo, useCallback } from 'react';
import { Group, Badge, UnstyledButton, LoadingOverlay } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import UserAvatar from './UserAvatar.jsx';
import UserInfo from './UserInfo.jsx';

const UserMenuButton = memo(({
                                 user,
                                 userMenuOpened,
                                 isLogoutLoading
                             }) => {
    const { themeColors } = useTheme();

    // 버튼 스타일 메모이제이션
    const buttonStyles = useMemo(() => ({
        padding: '8px',
        borderRadius: '20px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
            backgroundColor: themeColors.hover,
        }
    }), [themeColors.hover]);

    // 로딩 오버레이 props 메모이제이션
    const loadingOverlayProps = useMemo(() => ({
        visible: isLogoutLoading,
        zIndex: 1000,
        overlayProps: { radius: 'sm', blur: 2 },
        loaderProps: { color: themeColors.primary, type: 'bars' }
    }), [isLogoutLoading, themeColors.primary]);

    // 알림 배지 스타일 메모이제이션
    const notificationBadgeStyles = useMemo(() => ({
        backgroundColor: '#FF6B6B',
    }), []);

    // 호버 이벤트 핸들러 메모이제이션
    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
    }, [themeColors.hover]);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }, []);

    // 쉐브론 아이콘 스타일 메모이제이션
    const chevronStyles = useMemo(() => ({
        transform: userMenuOpened ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
    }), [userMenuOpened]);

    return (
        <UnstyledButton
            style={buttonStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={`${user.nickname} 사용자 메뉴 ${userMenuOpened ? '닫기' : '열기'}`}
            aria-expanded={userMenuOpened}
            aria-haspopup="menu"
        >
            <LoadingOverlay {...loadingOverlayProps} />

            <Group gap="sm">
                <UserAvatar
                    user={user}
                    showOnlineStatus={true}
                    size="md"
                />

                <UserInfo
                    user={user}
                    layout="horizontal"
                    showRole={true}
                />

                {user.notifications > 0 && (
                    <Badge
                        size="sm"
                        variant="filled"
                        color="red"
                        circle
                        style={notificationBadgeStyles}
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
    );
});

UserMenuButton.displayName = 'UserMenuButton';

export default UserMenuButton;