import { rem } from "@mantine/core";

// 헤더 스타일 생성 함수
export const getHeaderStyles = (velogColors) => ({
    header: {
        border: 'none',
        height: '64px',
    },
    logoText: {
        color: velogColors.text,
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
export const getActionButtonStyles = (velogColors) => ({
    search: {
        color: velogColors.subText,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: velogColors.hover,
            color: velogColors.text,
        }
    },
    darkMode: {
        color: velogColors.subText,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: velogColors.hover,
            color: velogColors.text,
        }
    },
    edit: {
        backgroundColor: velogColors.primary,
        color: 'white',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#0CA678',
        }
    }
});

// 모달 스타일 생성 함수
export const getModalStyles = (velogColors) => ({
    content: {
        backgroundColor: velogColors.background,
    },
    header: {
        backgroundColor: velogColors.background,
        borderBottom: `1px solid ${velogColors.border}`,
        paddingBottom: rem(16),
    },
    body: {
        padding: 0,
        maxHeight: '60vh',
    }
});