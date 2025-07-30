// CTASection 컴포넌트 (추후 별도 파일로 분리 가능)
import {memo, useCallback, useMemo} from "react";
import {Box, Button, Group, Stack, Text} from "@mantine/core";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const CTASection = memo(({
                             onNavigateToAllPosts,
                             onNavigateToAbout
                         }) => {
    const { themeColors } = useTheme();

    // 스타일 객체들을 메모이제이션
    const styles = useMemo(() => ({
        container: {
            backgroundColor: themeColors.section,
            borderRadius: '16px',
            border: `1px solid ${themeColors.border}`,
            textAlign: 'center'
        },
        title: {
            color: themeColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        subtitle: {
            color: themeColors.subText,
        },
        primaryButton: {
            backgroundColor: themeColors.primary,
            '&:hover': {
                backgroundColor: '#0CA678'
            }
        },
        outlineButton: {
            borderColor: themeColors.border,
            color: themeColors.text,
            '&:hover': {
                backgroundColor: themeColors.hover,
                borderColor: themeColors.primary,
            }
        }
    }), [themeColors]);

    // 이벤트 핸들러들을 useCallback으로 메모이제이션
    const handleNavigateToAllPosts = useCallback(() => {
        if (onNavigateToAllPosts) {
            onNavigateToAllPosts();
        }
    }, [onNavigateToAllPosts]);

    const handleNavigateToAbout = useCallback(() => {
        if (onNavigateToAbout) {
            onNavigateToAbout();
        }
    }, [onNavigateToAbout]);

    return (
        <Box p="3rem" style={styles.container}>
            <Stack gap="lg" align="center">
                <Text size="1.5rem" fw={700} style={styles.title}>
                    더 많은 개발 이야기가 궁금하신가요?
                </Text>
                <Text size="lg" style={styles.subtitle}>
                    새로운 포스트가 업데이트될 때마다 알림을 받아보세요!
                </Text>
                <Group gap="md">
                    <Button
                        size="lg"
                        onClick={handleNavigateToAllPosts}
                        style={styles.primaryButton}
                        aria-label="모든 포스트 보기 버튼"
                    >
                        모든 포스트 보기
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleNavigateToAbout}
                        style={styles.outlineButton}
                        aria-label="어바웃 버튼"
                    >
                        About
                    </Button>
                </Group>
            </Stack>
        </Box>
    );
});

CTASection.displayName = 'CTASection';

export default CTASection;