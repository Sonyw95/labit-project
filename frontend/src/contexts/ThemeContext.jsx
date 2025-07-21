import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {useLocalStorage} from "@/hooks/useLocalStorage.js";

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

export const ThemeProvider = ({ children, initialTheme = {} }) => {
    const [themeSettings, setThemeSettings] = useLocalStorage('theme-settings', {
        ...defaultTheme,
        ...initialTheme,
    });

    // 시스템 다크 모드 감지
    const [systemDarkMode, setSystemDarkMode] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setSystemDarkMode(e.matches);

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    // 실제 다크 모드 상태 계산
    const isDark = themeSettings.colorScheme === 'auto'
        ? systemDarkMode
        : themeSettings.colorScheme === 'dark';

    // 테마 색상 계산
    const getColors = useCallback(() => {
        const baseColors = {
            primary: themeSettings.primaryColor,
            gray: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
            }
        };

        if (isDark) {
            return {
                ...baseColors,
                background: '#0d1117',
                surface: '#161b22',
                border: '#21262d',
                text: {
                    primary: '#f0f6fc',
                    secondary: '#8b949e',
                    disabled: '#6e7681',
                },
                gray: {
                    50: '#21262d',
                    100: '#30363d',
                    200: '#373e47',
                    300: '#444c56',
                    400: '#545d68',
                    500: '#656d76',
                    600: '#768390',
                    700: '#8b949e',
                    800: '#c9d1d9',
                    900: '#f0f6fc',
                }
            };
        }

        return {
            ...baseColors,
            background: '#ffffff',
            surface: '#f8fafc',
            border: '#e5e7eb',
            text: {
                primary: '#1f2937',
                secondary: '#6b7280',
                disabled: '#9ca3af',
            }
        };
    }, [isDark, themeSettings.primaryColor]);

    // 테마 업데이트 함수들
    const toggleColorScheme = useCallback(() => {
        setThemeSettings(prev => ({
            ...prev,
            colorScheme: prev.colorScheme === 'light'
                ? 'dark'
                : prev.colorScheme === 'dark'
                    ? 'auto'
                    : 'light'
        }));
    }, [setThemeSettings]);

    const setColorScheme = useCallback((scheme) => {
        setThemeSettings(prev => ({ ...prev, colorScheme: scheme }));
    }, [setThemeSettings]);

    const setPrimaryColor = useCallback((color) => {
        setThemeSettings(prev => ({ ...prev, primaryColor: color }));
    }, [setThemeSettings]);

    const updateTheme = useCallback((updates) => {
        setThemeSettings(prev => ({ ...prev, ...updates }));
    }, [setThemeSettings]);

    const resetTheme = useCallback(() => {
        setThemeSettings(defaultTheme);
    }, [setThemeSettings]);

    // 현재 테마 객체
    const theme = {
        ...themeSettings,
        isDark,
        systemDarkMode,
        colors: getColors(),
    };

    const value = {
        theme,
        toggleColorScheme,
        setColorScheme,
        setPrimaryColor,
        updateTheme,
        resetTheme,
        isDark,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
