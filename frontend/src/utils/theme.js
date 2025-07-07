import {useEffect, useState} from "react";

export const themeColors = {
    primary: '#4c6ef5',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    dark: {
        background: '#0d1117',
        surface: '#161b22',
        border: '#21262d',
        hover: '#30363d',
        text: '#f0f6fc',
        textSecondary: '#8b949e',
    },
    light: {
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e5e7eb',
        hover: '#f3f4f6',
        text: '#1e293b',
        textSecondary: '#6b7280',
    }
};

export const getTechColor = (tech) => {
    const colors = {
        Java: '#f59e0b',
        Spring: '#10b981',
        React: '#3b82f6',
        TypeScript: '#6366f1',
        AWS: '#eab308',
    };
    return colors[tech] || themeColors.primary;
};

// 이벤트 핸들러 유틸리티
export const createClickHandler = (callback, ...args) => {
    return (event) => {
        event.preventDefault();
        callback(...args);
    };
};

// 반응형 유틸리티
export const breakpoints = {
    xs: '576px',
    sm: '768px',
    md: '992px',
    lg: '1200px',
    xl: '1400px',
};

export const useResponsive = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: windowSize.width < 768,
        isTablet: windowSize.width >= 768 && windowSize.width < 992,
        isDesktop: windowSize.width >= 992,
        windowSize,
    };
};