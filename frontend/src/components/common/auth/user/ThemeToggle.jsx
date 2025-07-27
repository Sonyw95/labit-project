import React, { memo, useMemo, useCallback } from 'react';
import { Menu, Text, Box, Group, Switch } from '@mantine/core';
import { IconPalette, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";

const ThemeToggle = memo(({ onToggle }) => {
    const { dark, velogColors, toggleColorScheme } = useTheme();

    // 메뉴 아이템 스타일 메모이제이션
    const menuItemStyles = useMemo(() => ({
        borderRadius: '8px',
        color: velogColors.text,
        '&:hover': {
            backgroundColor: velogColors.hover,
        }
    }), [velogColors]);

    // 텍스트 스타일 메모이제이션
    const textStyles = useMemo(() => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }), []);

    // 스위치 스타일 메모이제이션
    const switchStyles = useMemo(() => ({
        track: {
            backgroundColor: dark ? velogColors.primary : velogColors.border,
        }
    }), [dark, velogColors]);

    // 토글 핸들러 메모이제이션
    const handleToggle = useCallback((e) => {
        e.stopPropagation(); // 메뉴 닫힘 방지
        toggleColorScheme();
        if (onToggle) {
            onToggle();
        }
    }, [toggleColorScheme, onToggle]);

    return (
        <Menu.Item
            leftSection={
                <IconPalette
                    size={16}
                    color={velogColors.subText}
                    aria-hidden="true"
                />
            }
            onClick={handleToggle}
            style={menuItemStyles}
            aria-label={`테마를 ${dark ? '라이트' : '다크'} 모드로 변경`}
        >
            <Group justify="space-between" w="100%">
                <Box>
                    <Text
                        size="sm"
                        fw={500}
                        c={velogColors.text}
                        style={textStyles}
                    >
                        다크 모드
                    </Text>
                    <Text
                        size="xs"
                        c={velogColors.subText}
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
    );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;