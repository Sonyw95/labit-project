import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';
import { storage } from '../utils/storage';

const ThemeContext = createContext();

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COLOR_SCHEME':
            return { ...state, colorScheme: action.payload };
        case 'SET_PRIMARY_COLOR':
            return { ...state, primaryColor: action.payload };
        case 'SET_FONT_SIZE':
            return { ...state, fontSize: action.payload };
        case 'SET_COMPACT_MODE':
            return { ...state, compactMode: action.payload };
        case 'SET_REDUCED_MOTION':
            return { ...state, reducedMotion: action.payload };
        case 'RESET_SETTINGS':
            return initialState;
        default:
            return state;
    }
};

const initialState = {
    colorScheme: 'auto',
    primaryColor: 'blue',
    fontSize: 'md',
    compactMode: false,
    reducedMotion: false
};

export const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, initialState);
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    // 설정 로드
    useEffect(() => {
        const savedSettings = storage.local.get('theme_settings', {});
        Object.entries(savedSettings).forEach(([key, value]) => {
            if (key in initialState) {
                dispatch({ type: `SET_${key.toUpperCase()}`, payload: value });
            }
        });
    }, []);

    // 설정 저장
    useEffect(() => {
        storage.local.set('theme_settings', state);
    }, [state]);

    const updateColorScheme = (scheme) => {
        dispatch({ type: 'SET_COLOR_SCHEME', payload: scheme });
        setColorScheme(scheme);
    };

    const updatePrimaryColor = (color) => {
        dispatch({ type: 'SET_PRIMARY_COLOR', payload: color });
    };

    const updateFontSize = (size) => {
        dispatch({ type: 'SET_FONT_SIZE', payload: size });
    };

    const toggleCompactMode = () => {
        dispatch({ type: 'SET_COMPACT_MODE', payload: !state.compactMode });
    };

    const toggleReducedMotion = () => {
        dispatch({ type: 'SET_REDUCED_MOTION', payload: !state.reducedMotion });
    };

    const resetSettings = () => {
        dispatch({ type: 'RESET_SETTINGS' });
        storage.local.remove('theme_settings');
    };

    const value = {
        ...state,
        colorScheme,
        updateColorScheme,
        updatePrimaryColor,
        updateFontSize,
        toggleCompactMode,
        toggleReducedMotion,
        resetSettings
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
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