import { useMemo } from 'react';
import { useMantineColorScheme } from '@mantine/core';

export const useOptimizedColorScheme = () => {
    const { colorScheme, toggleColorScheme, setColorScheme } = useMantineColorScheme();

    // 자주 사용되는 값들을 메모이제이션
    const isDark = useMemo(() => colorScheme === 'dark', [colorScheme]);
    const isLight = useMemo(() => colorScheme === 'light', [colorScheme]);

    return {
        colorScheme,
        isDark,
        isLight,
        toggleColorScheme,
        setColorScheme,
    };
};
