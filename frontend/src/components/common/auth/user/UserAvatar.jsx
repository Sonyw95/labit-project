import React, { memo, useMemo } from 'react';
import { Avatar, Indicator } from '@mantine/core';
import { useTheme } from "@/contexts/ThemeContext.jsx";

const UserAvatar = memo(({
                             user,
                             size = "md",
                             showOnlineStatus = false,
                             borderStyle = true
                         }) => {
    const { velogColors } = useTheme();

    // 아바타 스타일 메모이제이션
    const avatarStyles = useMemo(() => ({
        border: borderStyle ? `2px solid ${velogColors.border}` : 'none'
    }), [velogColors.border, borderStyle]);

    // 온라인 상태 표시가 필요한 경우
    if (showOnlineStatus) {
        return (
            <Indicator
                inline
                size={12}
                offset={7}
                position="bottom-end"
                color={user.isOnline ? velogColors.primary : "gray"}
                withBorder
                aria-label={user.isOnline ? "온라인" : "오프라인"}
            >
                <Avatar
                    src={user.profileImage}
                    alt={`${user.nickname}의 프로필 이미지`}
                    radius="xl"
                    size={size}
                    style={avatarStyles}
                />
            </Indicator>
        );
    }

    return (
        <Avatar
            src={user.profileImage}
            alt={`${user.nickname}의 프로필 이미지`}
            radius={size === "lg" ? "md" : "xl"}
            size={size}
            style={avatarStyles}
        />
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;