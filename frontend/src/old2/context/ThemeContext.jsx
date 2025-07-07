import React, { createContext, useContext, useCallback } from 'react';
import { MantineProvider, createTheme, useMantineColorScheme } from '@mantine/core';
import {useLocalStorage} from "@mantine/hooks";
import {ColorHelper} from "@/utils/helpers.js";

const ThemeContext = createContext();

// 2025 트렌드를 반영한 커스텀 테마
const createCustomTheme = (colorScheme) => createTheme({
    colorScheme,
    primaryColor: 'blue',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontFamilyMonospace: 'JetBrains Mono, Consolas, Monaco, Courier New, monospace',
    headings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontWeight: '600',
    },
    radius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
    shadows: {
        xs: '0 1px 3px rgba(0, 0, 0, 0.12)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
        md: '0 4px 16px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 32px rgba(0, 0, 0, 0.15)',
        xl: '0 16px 64px rgba(0, 0, 0, 0.15)',
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
            styles: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        Card: {
            defaultProps: {
                radius: 'lg',
                shadow: 'sm',
            },
            styles: {
                root: {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
        TextInput: {
            defaultProps: {
                radius: 'md',
            },
            styles: {
                input: {
                    transition: 'all 0.2s ease',
                    '&:focus': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
    },
});

export const ThemeProvider = ({ children }) => {
    const [preferences, setPreferences] = useLocalStorage('theme-preferences', {
        primaryColor: 'blue',
        fontSize: 'md',
        compactMode: false,
        animations: true,
    });

    const { colorScheme, toggleColorScheme, setColorScheme } = useMantineColorScheme();

    const updatePreferences = useCallback((updates) => {
        setPreferences(prev => ({ ...prev, ...updates }));
    }, [setPreferences]);

    const resetToDefaults = useCallback(() => {
        setPreferences({
            primaryColor: 'blue',
            fontSize: 'md',
            compactMode: false,
            animations: true,
        });
        setColorScheme('light');
    }, [setPreferences, setColorScheme]);

    const value = {
        colorScheme,
        toggleColorScheme,
        setColorScheme,
        preferences,
        updatePreferences,
        resetToDefaults,
        colors: ColorHelper.palette,
        darkTheme: ColorHelper.darkTheme,
    };

    const theme = createCustomTheme(colorScheme);

    return (
        <ThemeContext.Provider value={value}>
            <MantineProvider theme={theme}>
                {children}
            </MantineProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};