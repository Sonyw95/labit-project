import {memo, useCallback, useMemo} from "react";
import {ActionIcon, Box, Group, Text} from "@mantine/core";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled, IconShare} from "@tabler/icons-react";

const PostActions = memo(({
                              post,
                              isLiked,
                              isBookmarked,
                              onToggleLike,
                              onShare,
                              onToggleBookmark,
                              isLikeLoading = false
                          }) => {
    const { themeColors } = useTheme();

    const styles = useMemo(() => ({
        container: {
            position: 'sticky',
            bottom: '2rem',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3rem'
        },
        actionGroup: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: '50px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
        actionButton: {
            '&:hover': {
                backgroundColor: themeColors.hover
            }
        },
        likeCount: {
            color: themeColors.subText,
            fontWeight: 500
        }
    }), [themeColors]);

    const handleToggleLike = useCallback(() => {
        if (onToggleLike) {
            onToggleLike();
        }
    }, [onToggleLike]);

    const handleShare = useCallback(() => {
        if (onShare) {
            onShare();
        }
    }, [onShare]);

    const handleToggleBookmark = useCallback(() => {
        if (onToggleBookmark) {
            onToggleBookmark();
        }
    }, [onToggleBookmark]);

    return (
        <Box style={styles.container}>
            <Group
                gap="lg"
                p="md"
                style={styles.actionGroup}
            >
                <Group gap="xs">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        onClick={handleToggleLike}
                        loading={isLikeLoading}
                        color={isLiked ? 'red' : 'gray'}
                        style={styles.actionButton}
                    >
                        {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                    </ActionIcon>
                    <Text size="sm" style={styles.likeCount}>
                        {post.likeCount}
                    </Text>
                </Group>

                <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={handleShare}
                    c={themeColors.subText}
                    style={styles.actionButton}
                >
                    <IconShare size={20} />
                </ActionIcon>

                <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={handleToggleBookmark}
                    color={isBookmarked ? themeColors.primary : 'gray'}
                    style={styles.actionButton}
                >
                    {isBookmarked ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
                </ActionIcon>
            </Group>
        </Box>
    );
});
export default PostActions;