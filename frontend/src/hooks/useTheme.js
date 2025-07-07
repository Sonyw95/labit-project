import { useMantineColorScheme } from '@mantine/core';

export const useTheme = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

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
    };
};
