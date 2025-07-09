import {useComputedColorScheme} from '@mantine/core';
import {useCallback} from "react";

export const useTheme = () => {
    const { colorScheme, toggleColorScheme } = useComputedColorScheme();

    // 실제 colorScheme 값은 CSS에서 data-mantine-color-scheme 속성으로 처리
    const getCurrentScheme = useCallback(() => {
        if (typeof document === 'undefined') {
            return 'light';
        }
        return document.documentElement.getAttribute('data-mantine-color-scheme') || 'light';
    }, []);

    const dark = getCurrentScheme === 'dark';

    const getThemeColor = (lightColor, darkColor) => {
        return dark ? darkColor : lightColor;
    };

    const getBackgroundColor = () => {
        return dark ? '#0d1117' : '#f8fafc';
    };

    const getCardBackgroundColor = () => {
        return dark ? '#161b22' : '#ffffff';
    };

    const getBorderColor = () => {
        return dark ? '#21262d' : '#e5e7eb';
    };

    const getHoverColor = () => {
        return dark ? '#21262d' : '#f3f4f6';
    };

    return {
        dark,
        colorScheme,
        toggleColorScheme,
        getThemeColor,
        getBackgroundColor,
        getCardBackgroundColor,
        getBorderColor,
        getHoverColor,
        getCurrentScheme,
    };
};
