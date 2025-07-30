import { rem } from "@mantine/core";

// 헤더 스타일 생성 함수
export const getHeaderStyles = (themeColors) => ({
    header: {
        border: 'none',
        height: '64px',
    },
    logoText: {
        color: themeColors.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        letterSpacing: '-0.02em',
        lineHeight: 1,
    },
    logoBox: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            opacity: 0.8
        }
    }
});

// 액션 버튼 스타일 생성 함수
export const getActionButtonStyles = (themeColors) => ({
    search: {
        color: themeColors.subText,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: themeColors.hover,
            color: themeColors.text,
        }
    },
    darkMode: {
        color: themeColors.subText,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: themeColors.hover,
            color: themeColors.text,
        }
    },
    edit: {
        backgroundColor: themeColors.primary,
        color: 'white',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#0CA678',
        }
    }
});

// 모달 스타일 생성 함수
export const getModalStyles = (themeColors) => ({
    content: {
        backgroundColor: themeColors.background,
    },
    header: {
        backgroundColor: themeColors.background,
        borderBottom: `1px solid ${themeColors.border}`,
        paddingBottom: rem(16),
    },
    body: {
        padding: 0,
        maxHeight: '60vh',
    }
});