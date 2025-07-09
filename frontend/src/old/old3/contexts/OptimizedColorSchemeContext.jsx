import { createContext, useContext, useMemo } from 'react';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

// 1. 색상 값용 Context (읽기 전용)
const ColorSchemeValueContext = createContext();

// 2. 색상 액션용 Context (변경 함수들)
const ColorSchemeActionsContext = createContext();

export const OptimizedColorSchemeProvider = ({ children }) => {
    const { setColorScheme, clearColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', {
        getInitialValueInEffect: true
    });

    // 액션들은 한 번만 생성되어 변경되지 않음
    const actions = useMemo(() => ({
        setColorScheme,
        clearColorScheme,
        toggleColorScheme: () => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
    }), [setColorScheme, clearColorScheme, computedColorScheme]);

    // 값만 필요한 컴포넌트는 이 Context만 구독
    const colorValue = useMemo(() => ({
        colorScheme: computedColorScheme,
        isDark: computedColorScheme === 'dark'
    }), [computedColorScheme]);

    return (
        <ColorSchemeActionsContext.Provider value={actions}>
            <ColorSchemeValueContext.Provider value={colorValue}>
                {children}
            </ColorSchemeValueContext.Provider>
        </ColorSchemeActionsContext.Provider>
    );
};

// 색상 값만 필요한 컴포넌트용 (토글 시 리렌더링됨)
export const useColorSchemeValue = () => {
    const context = useContext(ColorSchemeValueContext);
    if (!context) {
        throw new Error('useColorSchemeValue must be used within OptimizedColorSchemeProvider');
    }
    return context;
};

// 액션만 필요한 컴포넌트용 (토글 시 리렌더링 안됨)
export const useColorSchemeActions = () => {
    const context = useContext(ColorSchemeActionsContext);
    if (!context) {
        throw new Error('useColorSchemeActions must be used within OptimizedColorSchemeProvider');
    }
    return context;
};