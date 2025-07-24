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
    Box,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconHeart,
    IconHeartFilled,
    IconEye,
    IconMessageCircle,
    IconCalendar,
    IconTag,
} from '@tabler/icons-react';

const PostCard = memo(({ post }) => {
    const { colorScheme } = useMantineColorScheme();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
        cardBg: colorScheme === 'dark' ? '#1E1F25' : '#FFFFFF',
    };

    // 날짜 포맷팅 (메모이제이션으로 리렌더링 방지)
    const formattedDate = useMemo(() => {
        const date = new Date(post.publishedDate || post.createdDate);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return '오늘';
        } else if (diffInDays === 1) {
            return '1일 전';
        } else if (diffInDays < 7) {
            return `${diffInDays}일 전`;
        }

        return date.toLocaleDateString('ko-KR', {
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
        const maxLength = post.thumbnailUrl ? 120 : 250; // 길이 조정 (150→120, 300→250)
        return post.summary.length > maxLength
            ? `${post.summary.substring(0, maxLength)}...`
            : post.summary;
    }, [post.summary, post.thumbnailUrl]);

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
            shadow="none"
            radius="md"
            withBorder={false}
            style={{
                cursor: 'pointer',
                height: '400px', // 높이 축소 480px → 400px
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: colorScheme === 'dark'
                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                        : '0 8px 25px rgba(0, 0, 0, 0.08)',
                }
            }}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : '0 8px 25px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <Stack gap="sm" style={{ height: '100%' }}>
                {/* 썸네일 이미지 - 있을 때만 표시 */}
                {post.thumbnailUrl && (
                    <Card.Section>
                        <Box style={{ overflow: 'hidden' }}>
                            <Image
                                src={post.thumbnailUrl}
                                alt={post.title}
                                height={160} // 이미지 높이 축소 200px → 160px
                                fit="cover"
                                fallbackSrc="https://via.placeholder.com/400x160?text=No+Image"
                                style={{
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            />
                        </Box>
                    </Card.Section>
                )}

                <Box p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* 제목 */}
                    <Text
                        fw={700}
                        size="xl"
                        lineClamp={2}
                        mb="xs"
                        style={{
                            color: velogColors.text,
                            lineHeight: 1.4,
                            letterSpacing: '-0.01em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            minHeight: '2.4rem', // 제목 높이 조정 (2.8rem → 2.4rem)
                        }}
                    >
                        {post.title}
                    </Text>

                    {/* 요약 */}
                    <Text
                        size="md"
                        c={velogColors.subText}
                        lineClamp={post.thumbnailUrl ? 2 : 6} // 라인 수 조정 (3→2, 8→6)
                        mb="md"
                        style={{
                            flex: 1,
                            lineHeight: 1.6,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {truncatedSummary || '요약이 없습니다.'}
                    </Text>

                    {/* 태그 영역 - 항상 동일한 높이 유지 */}
                    <Box style={{ minHeight: '28px', display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                        {tags.length > 0 ? (
                            <Group gap="xs">
                                {tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="light"
                                        size="sm"
                                        style={{
                                            backgroundColor: `${velogColors.primary}15`,
                                            color: velogColors.primary,
                                            border: 'none',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </Group>
                        ) : (
                            <Box /> // 빈 공간 유지
                        )}
                    </Box>

                    {/* 하단 정보 */}
                    <Group justify="space-between" mt="auto">
                        {/* 작성자 정보 */}
                        <Group
                            gap="sm"
                            onClick={handleAuthorClick}
                            style={{
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: velogColors.hover,
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = velogColors.hover;
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
                                    border: `2px solid ${velogColors.border}`
                                }}
                            />
                            <Box>
                                <Text
                                    size="sm"
                                    fw={600}
                                    c={velogColors.text}
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    {post.author.nickname}
                                </Text>
                                <Group gap="xs" c={velogColors.subText}>
                                    <IconCalendar size={12} />
                                    <Text size="xs">{formattedDate}</Text>
                                </Group>
                            </Box>
                        </Group>

                        {/* 통계 정보 */}
                        <Group gap="md">
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={handleLikeClick}
                                color={post.isLiked ? 'red' : 'gray'}
                                style={{
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: post.isLiked ? '#FFE8E8' : velogColors.hover,
                                    }
                                }}
                            >
                                <Group gap={4}>
                                    {post.isLiked ? (
                                        <IconHeartFilled size={14} />
                                    ) : (
                                        <IconHeart size={14} />
                                    )}
                                    <Text size="xs" fw={500} c={velogColors.subText}>
                                        {post.likeCount}
                                    </Text>
                                </Group>
                            </ActionIcon>

                            <Group gap={4} c={velogColors.subText}>
                                <IconEye size={14} />
                                <Text size="xs" fw={500}>{post.viewCount}</Text>
                            </Group>

                            <Group gap={4} c={velogColors.subText}>
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