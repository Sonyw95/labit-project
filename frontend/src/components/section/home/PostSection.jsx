// PostsSection 컴포넌트 (추후 별도 파일로 분리 가능)
import React, {memo, useCallback, useMemo} from "react";
import {Box, Button, Center, Container, Group, Loader, Stack, Text} from "@mantine/core";
import PostList from "@/components/section/post/PostList.jsx";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {IconArrowRight, IconClock} from "@tabler/icons-react";

const PostSection = memo(({
                              posts = [],
                              isLoading = false,
                              onNavigateToAllPosts
                          }) => {
    const {velogColors} = useTheme();

    // 스타일 객체들을 메모이제이션
    const styles = useMemo(() => ({
        sectionTitle: {
            color: velogColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        viewAllButton: {
            color: velogColors.primary,
            '&:hover': {
                backgroundColor: `${velogColors.primary}15`,
            }
        },
        loadingContainer: {
            backgroundColor: velogColors.background,
            minHeight: '400px'
        },
        loadingText: {
            color: velogColors.subText
        }
    }), [velogColors]);

    // 네비게이션 핸들러를 useCallback으로 메모이제이션
    const handleNavigateToAllPosts = useCallback(() => {
        if (onNavigateToAllPosts) {
            onNavigateToAllPosts();
        }
    }, [onNavigateToAllPosts]);

    // 로딩 컴포넌트를 메모이제이션
    const LoadingComponent = useMemo(() => (
        <Box style={styles.loadingContainer}>
            <Container size="xl" py="xl">
                <Center h={400}>
                    <Stack align="center" gap="lg">
                        <Loader size="lg" color={velogColors.primary}/>
                        <Text size="lg" style={styles.loadingText}>
                            포스트를 불러오는 중...
                        </Text>
                    </Stack>
                </Center>
            </Container>
        </Box>
    ), [styles.loadingContainer, styles.loadingText, velogColors.primary]);

    return (
        <Stack gap="xl">
            <Group justify="space-between" align="center">
                <Group gap="sm">
                    <IconClock size={24} color={velogColors.primary}/>
                    <Text size="2rem" fw={700} style={styles.sectionTitle}>
                        최신 포스트
                    </Text>
                </Group>
                {/*<Button*/}
                {/*    variant="subtle"*/}
                {/*    rightSection={<IconArrowRight size={16}/>}*/}
                {/*    onClick={handleNavigateToAllPosts}*/}
                {/*    style={styles.viewAllButton}*/}
                {/*    aria-label="전체 보기 버튼"*/}
                {/*>*/}
                {/*    전체 보기*/}
                {/*</Button>*/}
            </Group>

            {isLoading ? (
                LoadingComponent
            ) : (
                <PostList
                    posts={posts.slice(0, 6)}
                    span={{base: 12, sm: 6, lg: 4}}
                />
            )}
        </Stack>
    );
});

PostSection.displayName = 'PostsSection';

export default PostSection