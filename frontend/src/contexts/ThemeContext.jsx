import React, {createContext, useContext, useMemo} from 'react';
import {useMantineColorScheme} from "@mantine/core";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// 테마 설정 기본값
const defaultTheme = {
    colorScheme: 'light',
    primaryColor: '#4c6ef5',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
    },
    shadows: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    breakpoints: {
        xs: 480,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1536,
    },
};

export const ThemeProvider = ({ children}) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = useMemo(() => colorScheme === 'dark', [colorScheme]);
    const colors = dark ? '#df9f20' : '#ffaa00';
    const value = {
        dark,
        colors,
        toggleColorScheme,
    };
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
