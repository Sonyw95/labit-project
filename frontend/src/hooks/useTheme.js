// hooks/useTheme.js
import { useMantineColorScheme } from '@mantine/core';
import { THEME_COLORS } from '../constants/data';
import {useMemo} from "react";

export const useTheme = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = useMemo(() => colorScheme === 'dark', [colorScheme]);

    const colors = dark ? '#df9f20' : '#ffaa00';

    return {
        dark,
        colors,
        toggleColorScheme,
        primary: THEME_COLORS.primary,
        primaryHover: THEME_COLORS.primaryHover,
    };
};