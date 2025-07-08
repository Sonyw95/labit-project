
// ========================================
// contexts/ThemeContext.jsx - 고급 테마 컨텍스트
// ========================================
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { MantineProvider, createTheme, mergeMantineTheme } from '@mantine/core';
import {trendColors, trendGradients} from "@/utils/colorHeplers.js";
import {useLocalStorage} from "@/hooks/useLocalStorage.js";
import {useMountedState} from "@/hooks/useMountedState.js";

const ThemeContext = createContext(undefined);

// 액션 타입
const THEME_ACTIONS = {
    SET_COLOR_SCHEME: 'SET_COLOR_SCHEME',
    SET_PRIMARY_COLOR: 'SET_PRIMARY_COLOR',
    SET_RADIUS: 'SET_RADIUS',
    SET_FONT_FAMILY: 'SET_FONT_FAMILY',
    SET_FONT_SIZE: 'SET_FONT_SIZE',
    SET_COMPACT_MODE: 'SET_COMPACT_MODE',
    SET_CUSTOM_THEME: 'SET_CUSTOM_THEME',
    RESET_THEME: 'RESET_THEME',
};

// 초기 상태
const initialState = {
    colorScheme: 'auto',
    primaryColor: 'blue',
    radius: 'md',
    fontFamily: 'system',
    fontSize: 'md',
    compactMode: false,
    customColors: {},
    customTheme: null,
};

// 테마 리듀서
const themeReducer = (state, action) => {
    switch (action.type) {
        case THEME_ACTIONS.SET_COLOR_SCHEME:
            return { ...state, colorScheme: action.payload };

        case THEME_ACTIONS.SET_PRIMARY_COLOR:
            return { ...state, primaryColor: action.payload };

        case THEME_ACTIONS.SET_RADIUS:
            return { ...state, radius: action.payload };

        case THEME_ACTIONS.SET_FONT_FAMILY:
            return { ...state, fontFamily: action.payload };

        case THEME_ACTIONS.SET_FONT_SIZE:
            return { ...state, fontSize: action.payload };

        case THEME_ACTIONS.SET_COMPACT_MODE:
            return { ...state, compactMode: action.payload };

        case THEME_ACTIONS.SET_CUSTOM_THEME:
            return { ...state, customTheme: action.payload };

        case THEME_ACTIONS.RESET_THEME:
            return { ...initialState, colorScheme: state.colorScheme };

        default:
            return state;
    }
};

// 2025 트렌드 테마 생성
const createTrendTheme = (themeState) => {
    const baseTheme = createTheme({
        colorScheme: themeState.colorScheme === 'auto' ? 'light' : themeState.colorScheme,
        primaryColor: themeState.primaryColor,
        defaultRadius: themeState.radius,
        fontFamily: themeState.fontFamily === 'system'
            ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            : themeState.fontFamily,

        // 2025 트렌드: Low Light 색상 적용
        colors: {
            ...trendColors,
            dark: [
                '#f0f6fc', // 0: 가장 밝은 텍스트
                '#e4e5e7', // 1: 밝은 텍스트
                '#c9cccf', // 2: 중간 텍스트
                '#8b949e', // 3: 어두운 텍스트
                '#6e7681', // 4: 더 어두운 텍스트
                '#484f58', // 5: 배경과 대비되는 텍스트
                '#30363d', // 6: 호버 배경
                '#21262d', // 7: 카드 배경
                '#161b22', // 8: 네비바/헤더 배경
                '#0d1117', // 9: 가장 어두운 배경
            ],
        },

        // 2025 트렌드: 부드러운 그림자와 둥근 모서리
        shadows: {
            xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
            sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        },

        // 컴포넌트별 기본 props 설정
        components: {
            Button: {
                defaultProps: {
                    radius: themeState.radius,
                    size: themeState.compactMode ? 'sm' : 'md',
                },
                styles: {
                    root: {
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },

            Card: {
                defaultProps: {
                    radius: themeState.radius,
                    shadow: 'sm',
                },
                styles: {
                    root: {
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
            },

            Paper: {
                defaultProps: {
                    radius: themeState.radius,
                },
            },

            Modal: {
                styles: {
                    content: {
                        backdropFilter: 'blur(20px)',
                    },
                },
            },

            Popover: {
                styles: {
                    dropdown: {
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },

        // 2025 트렌드: 커스텀 CSS 변수
        other: {
            gradients: trendGradients,
            animations: {
                fadeIn: 'fadeIn 0.3s ease-out',
                slideIn: 'slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bounce: 'bounce 0.6s ease-out',
            },
        },
    });

    // 커스텀 테마가 있으면 병합
    if (themeState.customTheme) {
        return mergeMantineTheme(baseTheme, themeState.customTheme);
    }

    return baseTheme;
};

// ThemeProvider 컴포넌트
export const CustomThemeProvider = ({ children }) => {
    console.log("ThemeProvider Render")
    const [state, dispatch] = useReducer(themeReducer, initialState);
    const [storedTheme, setStoredTheme] = useLocalStorage('theme-settings', null);
    const isMounted = useMountedState();

    // 색상 스키마 설정
    const setColorScheme = useCallback((colorScheme) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_COLOR_SCHEME, payload: colorScheme });
    }, [isMounted]);

    // 기본 색상 설정
    const setPrimaryColor = useCallback((color) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_PRIMARY_COLOR, payload: color });
    }, [isMounted]);

    // 반지름 설정
    const setRadius = useCallback((radius) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_RADIUS, payload: radius });
    }, [isMounted]);

    // 폰트 설정
    const setFontFamily = useCallback((fontFamily) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_FONT_FAMILY, payload: fontFamily });
    }, [isMounted]);

    // 컴팩트 모드 설정
    const setCompactMode = useCallback((compactMode) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_COMPACT_MODE, payload: compactMode });
    }, [isMounted]);

    // 커스텀 테마 설정
    const setCustomTheme = useCallback((customTheme) => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.SET_CUSTOM_THEME, payload: customTheme });
    }, [isMounted]);

    // 테마 리셋
    const resetTheme = useCallback(() => {
        if (!isMounted()) {
            return;
        }
        dispatch({ type: THEME_ACTIONS.RESET_THEME });
    }, [isMounted]);

    // 로컬스토리지에서 테마 설정 복원
    useEffect(() => {
        if (storedTheme && isMounted()) {
            Object.entries(storedTheme).forEach(([key, value]) => {
                switch (key) {
                    case 'colorScheme':
                        setColorScheme(value);
                        break;
                    case 'primaryColor':
                        setPrimaryColor(value);
                        break;
                    case 'radius':
                        setRadius(value);
                        break;
                    case 'fontFamily':
                        setFontFamily(value);
                        break;
                    case 'compactMode':
                        setCompactMode(value);
                        break;
                    case 'customTheme':
                        setCustomTheme(value);
                        break;
                }
            });
        }
    }, [storedTheme, isMounted, setColorScheme, setPrimaryColor, setRadius, setFontFamily, setCompactMode, setCustomTheme]);

    // 테마 설정 변경 시 로컬스토리지에 저장
    // useEffect(() => {
    //     if (isMounted()) {
    //         setStoredTheme(state);
    //     }
    // }, [state, setStoredTheme, isMounted]);

    const theme = createTrendTheme(state);

    const value = {
        ...state,
        setColorScheme,
        setPrimaryColor,
        setRadius,
        setFontFamily,
        setCompactMode,
        setCustomTheme,
        resetTheme,
        theme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <MantineProvider defaultColorScheme="auto" suppressHydrationWarning>
                {children}
            </MantineProvider>
        </ThemeContext.Provider>
    );
};

// useCustomTheme 훅
export const useCustomTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useCustomTheme must be used within a CustomThemeProvider');
    }
    return context;
};