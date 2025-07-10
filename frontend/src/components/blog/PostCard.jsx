import {
    Text,
    Badge,
    Box,
    Card,
    Group,
    Stack,
    Transition,
    Avatar,
    ActionIcon,
    Image,
    Tooltip, Skeleton
} from "@mantine/core";
import {IconBookmark, IconChevronRight, IconEye, IconHeart, IconShare} from "@tabler/icons-react";
import React, {memo, useState} from "react";

const categoryColors = {
    "디자인": "violet",
    "개발": "blue",
    "AI/ML": "orange",
    "프레임워크": "green",
    "클라우드": "cyan",
    "보안": "red"
};

function PostCard({ post, index, dark, loading = true }) {
    const [isHovered, setIsHovered] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

    const isLiked = likedPosts.has(post.id);
    const isBookmarked = bookmarkedPosts.has(post.id);

    const formatNumber = (num) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)  }K`;
        }
        return num.toString();
    };
    const handleBookmark = (postId) => {
        setBookmarkedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };
    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };
    const handleShare = async (post) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: `${window.location.origin  }/posts/${post.id}`,
                });
            } catch (error) {
                console.log('Sharing cancelled');
            }
        } else {
            // Fallback to clipboard
            await navigator.clipboard.writeText(`${window.location.origin  }/posts/${post.id}`);
        }
    };
    const LoadingSkeleton = () => (
        <Card radius="xl" p="md">
            <Skeleton height={180} radius="md" mb="md" />
            <Stack gap="sm">
                <Group justify="space-between">
                    <Skeleton height={12} width="30%" />
                    <Skeleton height={20} radius="xl" width={20} />
                </Group>
                <Skeleton height={20} width="85%" />
                <Skeleton height={16} width="95%" />
                <Skeleton height={16} width="70%" />
                <Group justify="space-between" mt="xs">
                    <Skeleton height={12} width="20%" />
                    <Group gap="xs">
                        <Skeleton height={24} width={24} radius="xl" />
                        <Skeleton height={24} width={24} radius="xl" />
                        <Skeleton height={24} width={24} radius="xl" />
                    </Group>
                </Group>
            </Stack>
        </Card>
    );

    return (
        <Transition
            mounted
            transition="slide-up"
            duration={300}
            timingFunction="ease-out"
            enterDelay={index * 100}
        > {
            loading ? <LoadingSkeleton /> : (styles) => (
                <Card
                    style={{
                        ...styles,
                        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: isHovered
                            ? dark
                                ? '0 25px 50px -12px rgba(200, 200, 200, 0.05), 0 0 0 1px rgba(200, 200, 200, 0.2)'
                                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            : dark
                                ? '0 25px 50px -12px rgba(64, 64, 64, 0.05), 0 0 0 1px rgba(64, 64, 64, 0.2)'
                                : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                        background: dark
                            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: dark
                            ? '1px solid rgba(64, 64, 64, 0.1)'
                            : '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    p={0}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* 이미지 섹션 */}
                    <Box style={{ position: 'relative', overflow: 'hidden' }}>
                        <Image
                            src={post.image}
                            alt={post.title}
                            height={200}
                            style={{
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                            }}
                            fallbackSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
                        />

                        {/* 그라디언트 오버레이 */}
                        <Box
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: dark
                                    ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)'
                                    : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
                                pointerEvents: 'none'
                            }}
                        />

                        {/*카테고리 배지*/}
                        <Badge
                            color={categoryColors[post.category]}
                            variant="filled"
                            size="sm"
                            style={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backdropFilter: 'blur(10px)',
                                background: `rgba(var(--mantine-color-${categoryColors[post.category]}-6-rgb), 0.9)`,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            {post.category}
                        </Badge>

                        {/* /!*북마크 버튼*!/*/}
                        <ActionIcon
                            variant="filled"
                            size="md"
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                backdropFilter: 'blur(10px)',
                                background: isBookmarked
                                    ? 'var(--mantine-color-yellow-6)'
                                    : (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBookmark(post.id);
                            }}
                        >
                            <IconBookmark size={16} />
                        </ActionIcon>
                    </Box>

                    {/* 콘텐츠 섹션 */}
                    <Stack gap="md" p="lg">
                        {/* 제목 */}
                        <Text
                            size="lg"
                            fw={700}
                            lineClamp={2}
                            style={{
                                backgroundImage: dark
                                    ? 'linear-gradient(135deg, var(--mantine-color-white) 0%, var(--mantine-color-gray-3) 100%)'
                                    : 'linear-gradient(135deg, var(--mantine-color-text) 0%, var(--mantine-color-dimmed) 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                // color: 'transparent',
                                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
                            }}
                        >
                            {post.title}
                        </Text>

                        {/* 요약 */}
                        <Text
                            size="sm"
                            c="dimmed"
                            lineClamp={2}
                            style={{ lineHeight: 1.6 }}
                        >
                            {post.excerpt}
                        </Text>

                        {/* 태그 */}
                        <Group gap="xs">
                            {post.tags.map((tag, tagIndex) => (
                                <Badge
                                    key={tagIndex}
                                    variant="light"
                                    size="xs"
                                    color={categoryColors[post.category]}
                                    style={{
                                        background: dark
                                            ? `rgba(var(--mantine-color-${categoryColors[post.category]}-9-rgb), 0.3)`
                                            : `rgba(var(--mantine-color-${categoryColors[post.category]}-1-rgb), 0.5)`,
                                        border: dark
                                            ? `1px solid rgba(var(--mantine-color-${categoryColors[post.category]}-6-rgb), 0.5)`
                                            : `1px solid rgba(var(--mantine-color-${categoryColors[post.category]}-3-rgb), 0.3)`,
                                        backdropFilter: 'blur(5px)'
                                    }}
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </Group>

                        {/* 작성자 정보 및 메타데이터 */}
                        <Group justify="space-between" align="center">
                            <Group gap="xs">
                                <Avatar
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    size="sm"
                                    style={{
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Stack gap={2}>
                                    <Text size="xs" fw={500}>{post.author.name}</Text>
                                    <Text size="xs" c="dimmed">{post.readTime} 읽기</Text>
                                </Stack>
                            </Group>

                            {/* 인터랙션 버튼들 */}
                            <Group gap="xs">
                                <Group gap={4}>
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        color={isLiked ? "red" : "gray"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLike(post.id);
                                        }}
                                        style={{
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                backgroundColor: isLiked
                                                    ? 'rgba(239, 68, 68, 0.1)'
                                                    : (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                                            }
                                        }}
                                    >
                                        <IconHeart size={14}   style={{
                                            fill: isLiked ? 'currentColor' : 'none',
                                        }} />
                                    </ActionIcon>
                                    {(isLiked || post.likes > 0) && (
                                        <Text
                                            size="xs"
                                            c={dark ? 'gray.5' : 'gray.6'}
                                            fw={500}
                                        >
                                            {formatNumber(post.likes + (isLiked ? 1 : 0))}
                                        </Text>
                                    )}
                                </Group>

                                <Group gap="lg">
                                    <Group gap="xs">
                                        <IconEye
                                            size={16}
                                            color={dark ? '#666666' : '#94a3b8'}
                                        />
                                        <Text
                                            size="xs"
                                            c={dark ? 'gray.5' : 'gray.6'}
                                            fw={600}
                                        >
                                            {post.views}
                                        </Text>
                                    </Group>
                                </Group>

                                <Tooltip label="공유하기">
                                    <ActionIcon
                                        variant="subtle"
                                        ize="sm"
                                        color="gray"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare(post).then(r =>{ console.log(r)} );
                                        }}>
                                        <IconShare size={14} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>

                        {/* 읽기 더보기 버튼 */}
                        <Group
                            justify="space-between"
                            align="center"
                            style={{
                                marginTop: 'auto',
                                paddingTop: '8px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <Text size="xs" c="dimmed">{post.createdAt}</Text>
                            <Group gap={4} c="blue">
                                <Text size="sm" fw={500}>자세히 보기</Text>
                                <IconChevronRight
                                    size={16}
                                    style={{
                                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </Group>
                        </Group>
                    </Stack>
                </Card>
            )
        }
        </Transition>
    )
}
export default memo(PostCard);