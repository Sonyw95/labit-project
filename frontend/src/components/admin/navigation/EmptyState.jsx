import {memo, useMemo} from "react";
import {Box, rem, Text} from "@mantine/core";
import {useTheme} from "@/contexts/ThemeContext.jsx";

const AdminEmptyState = memo(() => {
    const { themeColors } = useTheme();

    const styles = useMemo(() => ({
        container: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(12),
            textAlign: 'center',
        },
        icon: {
            color: themeColors.subText,
            opacity: 0.5
        },
        title: {
            color: themeColors.text
        },
        description: {
            color: themeColors.subText
        }
    }), [themeColors]);

    return (
        <Box
            p="3rem"
            style={styles.container}
            role="status"
            aria-label="네비게이션 메뉴 없음"
        >
            <IconFolder
                size={64}
                style={styles.icon}
                aria-hidden="true"
            />
            <Text
                size="lg"
                mt="md"
                fw={500}
                style={styles.title}
            >
                등록된 네비게이션 메뉴가 없습니다
            </Text>
            <Text
                size="sm"
                mt="xs"
                style={styles.description}
            >
                새 메뉴를 추가해보세요
            </Text>
        </Box>
    );
});

AdminEmptyState.displayName = 'AdminEmptyState';

export default AdminEmptyState;