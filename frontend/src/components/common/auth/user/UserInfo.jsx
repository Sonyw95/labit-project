import React, { memo, useMemo } from 'react';
import { Text, Box, Badge } from '@mantine/core';
import { useTheme } from "@/contexts/ThemeContext.jsx";

// 역할별 배지 색상 유틸리티 함수
const getRoleBadgeColor = (role) => {
    switch (role) {
        case 'SUPER_ADMIN': return 'red';
        case 'ADMIN': return 'orange';
        default: return 'blue';
    }
};

// 역할별 라벨 유틸리티 함수
const getRoleLabel = (role) => {
    switch (role) {
        case 'SUPER_ADMIN':
        case 'ADMIN': return '주인장';
        default: return '일반사용자';
    }
};

const UserInfo = memo(({
                           user,
                           showEmail = false,
                           showRole = true,
                           layout = "vertical" // "vertical" | "horizontal"
                       }) => {
    const { velogColors } = useTheme();

    // 텍스트 스타일 메모이제이션
    const textStyles = useMemo(() => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }), []);

    // 닉네임 스타일
    const nicknameStyles = useMemo(() => ({
        ...textStyles,
        color: velogColors.text,
    }), [textStyles, velogColors.text]);

    // 서브 텍스트 스타일
    const subTextStyles = useMemo(() => ({
        ...textStyles,
        color: velogColors.subText,
    }), [textStyles, velogColors.subText]);

    // 배지 스타일
    const badgeStyles = useMemo(() => ({
        fontFamily: textStyles.fontFamily,
    }), [textStyles.fontFamily]);

    if (layout === "horizontal") {
        return (
            <Box style={{ flex: 1, minWidth: 0 }}>
                <Text
                    size="sm"
                    fw={600}
                    truncate
                    style={nicknameStyles}
                    aria-label={`사용자: ${user.nickname}`}
                >
                    {user.nickname}
                </Text>
                {showRole && (
                    <Text
                        size="xs"
                        truncate
                        style={subTextStyles}
                        aria-label={`역할: ${getRoleLabel(user.role)}`}
                    >
                        {getRoleLabel(user.role)}
                    </Text>
                )}
            </Box>
        );
    }

    return (
        <Box style={{ flex: 1 }}>
            <Text
                fw={600}
                size="md"
                style={nicknameStyles}
                aria-label={`사용자: ${user.nickname}`}
            >
                {user.nickname}
            </Text>
            {showEmail && (
                <Text
                    size="sm"
                    style={subTextStyles}
                    aria-label={`이메일: ${user.email}`}
                >
                    {user.email}
                </Text>
            )}
            {showRole && (
                <Badge
                    size="xs"
                    color={getRoleBadgeColor(user.role)}
                    variant="light"
                    mt="xs"
                    style={badgeStyles}
                    aria-label={`역할: ${getRoleLabel(user.role)}`}
                >
                    {getRoleLabel(user.role)}
                </Badge>
            )}
        </Box>
    );
});

UserInfo.displayName = 'UserInfo';

export default UserInfo;