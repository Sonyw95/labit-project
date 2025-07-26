import { memo, useMemo, useCallback } from 'react';
import {
    Box,
    Stack,
    Text,
    Group,
    Badge,
    Avatar,
    Menu,
    ActionIcon
} from '@mantine/core';
import {
    IconDots,
    IconEdit,
    IconTrash,
    IconCalendar,
    IconEye,
    IconTag,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@/contexts/ThemeContext.jsx";

const PostHeader = memo(({
                             post,
                             isAuthor,
                             isAdmin,
                             onDeletePost,
                             formatDate
                         }) => {
    const navigate = useNavigate();
    const { velogColors } = useTheme();

    const styles = useMemo(() => ({
        categoryBadge: {
            backgroundColor: `${velogColors.primary}15`,
            color: velogColors.primary,
            border: `1px solid ${velogColors.primary}30`
        },
        title: {
            color: velogColors.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.5px'
        },
        summary: {
            color: velogColors.subText,
            marginTop: '1rem'
        },
        avatar: {
            border: `2px solid ${velogColors.border}`
        },
        authorName: {
            color: velogColors.text
        },
        metaText: {
            color: velogColors.subText
        },
        actionButton: {
            color: velogColors.subText,
            '&:hover': {
                backgroundColor: velogColors.hover
            }
        },
        tagBadge: {
            color: velogColors.subText,
            borderColor: velogColors.border,
            backgroundColor: 'transparent'
        }
    }), [velogColors]);

    const handleEditClick = useCallback(() => {
        navigate(`/posts/${post.id}/edit`);
    }, [navigate, post.id]);

    const handleDeleteClick = useCallback(() => {
        if (onDeletePost) {
            onDeletePost();
        }
    }, [onDeletePost]);

    return (
        <Box>
            <Stack gap="lg">
                {post.category && (
                    <Badge
                        variant="light"
                        size="md"
                        color={velogColors.primary}
                        style={styles.categoryBadge}
                    >
                        {post.category.label}
                    </Badge>
                )}

                <Text
                    size="3rem"
                    fw={800}
                    lh={1.2}
                    style={styles.title}
                >
                    {post.title}
                </Text>

                {post.summary && (
                    <Text
                        size="xl"
                        lh={1.6}
                        style={styles.summary}
                    >
                        {post.summary}
                    </Text>
                )}

                <Group justify="space-between" mt="xl">
                    <Group gap="md">
                        <Avatar
                            src={post.author.profileImage}
                            alt={post.author.nickname}
                            size="lg"
                            style={styles.avatar}
                        />
                        <Box>
                            <Text fw={600} size="lg" style={styles.authorName}>
                                {post.author.nickname}
                            </Text>
                            <Group gap="md" mt={4} style={styles.metaText}>
                                <Group gap="xs">
                                    <IconCalendar size={16} />
                                    <Text size="sm">
                                        {formatDate(post.publishedDate || post.createdDate)}
                                    </Text>
                                </Group>
                                <Group gap="xs">
                                    <IconEye size={16} />
                                    <Text size="sm">{post.viewCount}회</Text>
                                </Group>
                            </Group>
                        </Box>
                    </Group>

                    {(isAuthor || isAdmin) && (
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    style={styles.actionButton}
                                >
                                    <IconDots size={20} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconEdit size={16} />}
                                    onClick={handleEditClick}
                                >
                                    수정
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash size={16} />}
                                    color="red"
                                    onClick={handleDeleteClick}
                                >
                                    삭제
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>

                {post.tags && post.tags.length > 0 && (
                    <Group gap="xs" mt="md">
                        <IconTag size={16} color={velogColors.subText} />
                        {post.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                size="sm"
                                color="gray"
                                style={styles.tagBadge}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                )}
            </Stack>
        </Box>
    );
});

export default PostHeader;
