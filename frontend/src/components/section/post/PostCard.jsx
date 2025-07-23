import {memo, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mantine/core';
import {
    IconHeart,
    IconEye,
    IconMessageCircle,
    IconCalendar,
    IconTag,
} from '@tabler/icons-react';

const PostCard = memo(({ post }) => {
    const navigate = useNavigate();

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
        navigate(`/posts/${post.id}`);
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        // TODO: 작성자 프로필 페이지로 이동
        console.log('Author clicked:', post.author.id);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        // TODO: 좋아요 토글 기능
        console.log('Like clicked:', post.id);
    };

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer', height: '100%' }}
            onClick={handleCardClick}
        >
            <Stack spacing="md" style={{ height: '100%' }}>
                {/* 썸네일 이미지 */}
                {post.thumbnailUrl && (
                    <Card.Section>
                        <Image
                            src={post.thumbnailUrl}
                            alt={post.title}
                            height={200}
                            fit="cover"
                            fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
                        />
                    </Card.Section>
                )}

                {/* 카테고리 배지 */}
                {post.category && (
                    <Group justify="space-between">
                        <Badge variant="light" size="sm">
                            {post.category.label}
                        </Badge>
                        {post.isFeatured && (
                            <Badge color="yellow" variant="filled" size="sm">
                                추천
                            </Badge>
                        )}
                    </Group>
                )}

                {/* 제목 */}
                <Text fw={600} size="lg" lineClamp={2}>
                    {post.title}
                </Text>

                {/* 요약 */}
                {truncatedSummary && (
                    <Text size="sm" c="dimmed" lineClamp={3} style={{ flex: 1 }}>
                        {truncatedSummary}
                    </Text>
                )}

                {/* 태그 */}
                {tags.length > 0 && (
                    <Group spacing="xs">
                        <IconTag size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                        {tags.map((tag, index) => (
                            <Badge key={index} variant="outline" size="xs">
                                {tag}
                            </Badge>
                        ))}
                    </Group>
                )}

                {/* 하단 정보 */}
                <Card.Section inheritPadding py="xs">
                    <Group justify="space-between">
                        {/* 작성자 정보 */}
                        <Group spacing="xs" onClick={handleAuthorClick}>
                            <Avatar
                                src={post.author.profileImage}
                                size="sm"
                                alt={post.author.nickname}
                            />
                            <div>
                                <Text size="sm" fw={500}>
                                    {post.author.nickname}
                                </Text>
                                <Group spacing="xs" c="dimmed">
                                    <IconCalendar size={12} />
                                    <Text size="xs">{formattedDate}</Text>
                                </Group>
                            </div>
                        </Group>

                        {/* 통계 정보 */}
                        <Group spacing="md">
                            <Tooltip label="좋아요">
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    onClick={handleLikeClick}
                                >
                                    <Group spacing={4}>
                                        <IconHeart size={14} />
                                        <Text size="xs">{post.likeCount}</Text>
                                    </Group>
                                </ActionIcon>
                            </Tooltip>

                            <Group spacing={4} c="dimmed">
                                <IconEye size={14} />
                                <Text size="xs">{post.viewCount}</Text>
                            </Group>

                            <Group spacing={4} c="dimmed">
                                <IconMessageCircle size={14} />
                                <Text size="xs">{post.commentCount}</Text>
                            </Group>
                        </Group>
                    </Group>
                </Card.Section>
            </Stack>
        </Card>
    );
});

PostCard.displayName = 'PostCard';

export default PostCard;