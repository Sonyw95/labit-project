// 고성능 Mantine 테마 설정
import {createTheme, rem} from "@mantine/core";

const theme = createTheme({
    // 기본 설정
    primaryColor: 'blue',
    primaryShade: { light: 6, dark: 8 },

    // 폰트 최적화
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyMonospace: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',

    // 폰트 크기 체계
    fontSizes: {
        xs: rem(10),
        sm: rem(12),
        md: rem(14),
        lg: rem(16),
        xl: rem(20),
    },

    // 간격 체계
    spacing: {
        xs: rem(4),
        sm: rem(8),
        md: rem(16),
        lg: rem(24),
        xl: rem(32),
    },

    // 반지름 체계
    radius: {
        xs: rem(2),
        sm: rem(4),
        md: rem(8),
        lg: rem(12),
        xl: rem(16),
    },

    // 커스텀 색상
    colors: {
        brand: [
            '#e3f2fd',
            '#bbdefb',
            '#90caf9',
            '#64b5f6',
            '#42a5f5',
            '#2196f3',
            '#1e88e5',
            '#1976d2',
            '#1565c0',
            '#0d47a1',
        ],
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
        ],
    },

    // 컴포넌트 기본값 최적화
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
            },
            styles: (theme) => ({
                root: {
                    fontWeight: 500,
                    transition: 'all 0.15s ease',

                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },

                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
            }),
        },

        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'xs',
            },
            styles: (theme) => ({
                root: {
                    transition: 'box-shadow 0.15s ease',

                    '&:hover': {
                        boxShadow: theme.shadows.sm,
                    },
                },
            }),
        },

        Card: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
                padding: 'md',
            },
        },

        Modal: {
            defaultProps: {
                centered: true,
                overlayProps: { backgroundOpacity: 0.55, blur: 3 },
            },
        },

        ActionIcon: {
            defaultProps: {
                variant: 'subtle',
                radius: 'md',
            },
        },
    },

    // 전역 스타일
    globalStyles: (theme) => ({
        '*, *::before, *::after': {
            boxSizing: 'border-box',
        },

        body: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            lineHeight: theme.lineHeight,
        },

        // 스크롤바 스타일링
        '::-webkit-scrollbar': {
            width: 8,
        },

        '::-webkit-scrollbar-track': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        },

        '::-webkit-scrollbar-thumb': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
            borderRadius: 4,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
            },
        },

        // 포커스 스타일 최적화
        '*:focus': {
            outline: 'none',
        },

        '*:focus-visible': {
            outline: `2px solid ${theme.colors[theme.primaryColor][theme.primaryShade]}`,
            outlineOffset: 2,
        },
    }),
});

export default theme;