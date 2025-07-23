import {memo, useMemo} from 'react';
import {
    Card,
    Image,
    Text,
    Badge,
    Group,
    Avatar,
    ActionIcon,
    Stack,
    Tooltip,
    Box,
    rem,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import {
    IconHeart,
    IconEye,
    IconMessageCircle,
    IconCalendar,
    IconTag,
    IconTrendingUp,
} from '@tabler/icons-react';

const PostCard = memo(({ post }) => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    // 날짜 포맷팅 (메모이제이션으로 리렌더링 방지)
    const formattedDate = useMemo(() => {
        const date = new Date(post.publishedDate || post.createdDate);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }, [post.publishedDate, post.createdDate]);

    // 태그 배열 생성 (메모이제이션)
    const tags = useMemo(() => {
        if (!post.tags || post.tags.length === 0) {
            return [];
        }
        return post.tags.slice(0, 3); // 최대 3개만 표시
    }, [post.tags]);

    // 요약 텍스트 자르기
    const truncatedSummary = useMemo(() => {
        if (!post.summary) {
            return '';
        }
        return post.summary.length > 120
            ? `${post.summary.substring(0, 120)}...`
            : post.summary;
    }, [post.summary]);

    const handleCardClick = () => {
        console.log('Navigate to post:', post.id);
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        console.log('Author clicked:', post.author.id);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        console.log('Like clicked:', post.id);
    };

    return (
        <Card
            shadow="sm"
            radius="xl"
            withBorder={false}
            style={{
                cursor: 'pointer',
                height: '100%',
                background: colorScheme === 'dark'
                    ? `linear-gradient(145deg, ${theme.colors.dark[7]}, ${theme.colors.dark[6]})`
                    : `linear-gradient(145deg, ${theme.white}, ${theme.colors.gray[0]})`,
                border: colorScheme === 'dark'
                    ? `1px solid ${theme.colors.dark[4]}`
                    : `1px solid ${theme.colors.gray[2]}`,
                transition: 'all 0.3s ease',
                overflow: 'hidden'
            }}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                    ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                    : '0 12px 40px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                    ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                    : '0 4px 20px rgba(0, 0, 0, 0.05)';
            }}
        >
            <Stack gap="md" style={{ height: '100%', position: 'relative' }}>
                {/* 썸네일 이미지 */}
                {post.thumbnailUrl && (
                    <Card.Section>
                        <Box pos="relative" style={{ overflow: 'hidden' }}>
                            <Image
                                src={post.thumbnailUrl}
                                alt={post.title}
                                height={220}
                                fit="cover"
                                fallbackSrc="https://via.placeholder.com/400x220?text=No+Image"
                                style={{
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            />

                            {/* Featured Badge Overlay */}
                            {post.isFeatured && (
                                <Badge
                                    variant="filled"
                                    color="orange"
                                    size="sm"
                                    leftSection={<IconTrendingUp size={12} />}
                                    style={{
                                        position: 'absolute',
                                        top: rem(12),
                                        right: rem(12),
                                        fontWeight: 600,
                                        textTransform: 'none'
                                    }}
                                >
                                    추천
                                </Badge>
                            )}

                            {/* Category Badge Overlay */}
                            {post.category && (
                                <Badge
                                    variant="filled"
                                    size="sm"
                                    style={{
                                        position: 'absolute',
                                        top: rem(12),
                                        left: rem(12),
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    {post.category.label}
                                </Badge>
                            )}
                        </Box>
                    </Card.Section>
                )}

                <Box p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* 제목 */}
                    <Text
                        fw={700}
                        size="lg"
                        lineClamp={2}
                        mb="sm"
                        style={{
                            color: colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[9],
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em'
                        }}
                    >
                        {post.title}
                    </Text>

                    {/* 요약 */}
                    {truncatedSummary && (
                        <Text
                            size="sm"
                            c="dimmed"
                            lineClamp={3}
                            mb="md"
                            style={{
                                flex: 1,
                                lineHeight: 1.6,
                                color: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[6]
                            }}
                        >
                            {truncatedSummary}
                        </Text>
                    )}

                    {/* 태그 */}
                    {tags.length > 0 && (
                        <Group gap="xs" mb="md">
                            <IconTag
                                size={14}
                                style={{
                                    color: colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[5]
                                }}
                            />
                            {tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="light"
                                    size="xs"
                                    color="gray"
                                    style={{
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </Group>
                    )}

                    {/* 하단 정보 */}
                    <Group justify="space-between" mt="auto">
                        {/* 작성자 정보 */}
                        <Group
                            gap="xs"
                            onClick={handleAuthorClick}
                            style={{
                                cursor: 'pointer',
                                padding: rem(4),
                                borderRadius: rem(8),
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                                    ? theme.colors.dark[5]
                                    : theme.colors.gray[1];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <Avatar
                                src={post.author.profileImage}
                                size="sm"
                                alt={post.author.nickname}
                                style={{
                                    border: colorScheme === 'dark'
                                        ? `2px solid ${theme.colors.dark[4]}`
                                        : `2px solid ${theme.colors.gray[2]}`
                                }}
                            />
                            <Box>
                                <Text size="sm" fw={600}>
                                    {post.author.nickname}
                                </Text>
                                <Group gap="xs" c="dimmed">
                                    <IconCalendar size={12} />
                                    <Text size="xs">{formattedDate}</Text>
                                </Group>
                            </Box>
                        </Group>

                        {/* 통계 정보 */}
                        <Group gap="lg">
                            <Tooltip label="좋아요" position="top">
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={handleLikeClick}
                                    style={{
                                        borderRadius: rem(8),
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.colors.red[1];
                                        e.currentTarget.style.color = theme.colors.red[6];
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'inherit';
                                    }}
                                >
                                    <Group gap={4}>
                                        <IconHeart size={14} />
                                        <Text size="xs" fw={500}>{post.likeCount}</Text>
                                    </Group>
                                </ActionIcon>
                            </Tooltip>

                            <Group gap={4} c="dimmed">
                                <IconEye size={14} />
                                <Text size="xs" fw={500}>{post.viewCount}</Text>
                            </Group>

                            <Group gap={4} c="dimmed">
                                <IconMessageCircle size={14} />
                                <Text size="xs" fw={500}>{post.commentCount}</Text>
                            </Group>
                        </Group>
                    </Group>
                </Box>
            </Stack>
        </Card>
    );
});

PostCard.displayName = 'PostCard';

export default PostCard;
