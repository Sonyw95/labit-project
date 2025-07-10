
import React, { memo, useCallback, useState, useMemo } from 'react';
import {
    Card,
    Group,
    Box,
    Title,
    Text,
    ActionIcon,
    Badge,
    Avatar,
    Menu,
    Skeleton,
    Overlay,
    Tooltip,
    Stack,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconCalendar,
    IconClock,
    IconEye,
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconBookmark,
    IconBookmarkFilled,
    IconDots,
    IconEdit,
    IconTrash,
    IconPin,
    IconEyeOff,
    IconExternalLink,
} from '@tabler/icons-react';
import {formatters} from "@/utils/formatters.js";
import {useAuth} from "@/contexts/AuthContext.jsx";
import {showToast} from "@/components/common/Toast.jsx";
import LazyImage from "@/components/common/LazyImage.jsx";
import {useTheme} from "@/hooks/useTheme.js";

// 포스트 상태 배지 컴포넌트
const PostStatusBadge = memo(({ status, isPinned, isHidden }) => {
    const badges = [];
    if (isPinned) {
        badges.push(
            <Badge key="pinned" color="blue" variant="light" size="xs">
                <Group gap={4}>
                    <IconPin size={10} />
                    고정
                </Group>
            </Badge>
        );
    }

    if (isHidden) {
        badges.push(
            <Badge key="hidden" color="gray" variant="light" size="xs">
                <Group gap={4}>
                    <IconEyeOff size={10} />
                    비공개
                </Group>
            </Badge>
        );
    }

    if (status === 'draft') {
        badges.push(
            <Badge key="draft" color="orange" variant="light" size="xs">
                임시저장
            </Badge>
        );
    }

    if (status === 'featured') {
        badges.push(
            <Badge key="featured" color="grape" variant="light" size="xs">
                추천
            </Badge>
        );
    }

    return badges.length > 0 ? <Group gap="xs">{badges}</Group> : null;
});

PostStatusBadge.displayName = 'PostStatusBadge';

// 포스트 메타 정보 컴포넌트
const PostMeta = memo(({ post, compact = false }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const metaItems = [
        {
            icon: IconCalendar,
            value: formatters.relativeTime(post.publishedAt || post.createdAt),
            tooltip: formatters.date(post.publishedAt || post.createdAt, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        },
        {
            icon: IconClock,
            value: formatters.readingTime(post.content || ''),
            tooltip: '예상 읽기 시간',
        },
        {
            icon: IconEye,
            value: formatters.number(post.viewsCount || 0),
            tooltip: '조회수',
        },
    ];

    if (compact) {
        return (
            <Group gap="xs" style={{ fontSize: rem(11), color: dark ? '#8b949e' : '#6b7280' }}>
                {metaItems.map((item, index) => (
                    <Tooltip key={index} label={item.tooltip} withArrow>
                        <Group gap={4}>
                            <item.icon size={12} />
                            <Text size="xs" c="dimmed">
                                {item.value}
                            </Text>
                        </Group>
                    </Tooltip>
                ))}
            </Group>
        );
    }

    return (
        <Group gap="xs">
            {metaItems.map((item, index) => (
                <Tooltip key={index} label={item.tooltip} withArrow>
                    <Group gap={4}>
                        <item.icon size={14} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                        <Text size="xs" c="dimmed">
                            {item.value}
                        </Text>
                    </Group>
                </Tooltip>
            ))}
        </Group>
    );
});

PostMeta.displayName = 'PostMeta';

// 포스트 액션 버튼들
const PostActions = memo(({ post, onLike, onBookmark, onShare, compact = false }) => {
    const { user, isAuthenticated } = useAuth();

    // const isLiked = useMemo(() =>
    //         post.likes?.includes(user?.id) || false,
    //     [post.likes, user?.id]
    // );
    const isLiked = false;

    // const isBookmarked = useMemo(() =>
    //         post.bookmarks?.includes(user?.id) || false,
    //     [post.bookmarks, user?.id]
    // );
    const isBookmarked = false;

    const handleLike = useCallback(() => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '로그인 후 이용해주세요.');
            return;
        }
        onLike?.(post.id, !isLiked);
    }, [isAuthenticated, onLike, post.id, isLiked]);

    const handleBookmark = useCallback(() => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '로그인 후 이용해주세요.');
            return;
        }
        onBookmark?.(post.id, !isBookmarked);
    }, [isAuthenticated, onBookmark, post.id, isBookmarked]);

    const handleShare = useCallback(() => {
        onShare?.(post);
    }, [onShare, post]);

    const actions = [
        {
            icon: isLiked ? IconHeartFilled : IconHeart,
            color: isLiked ? 'red' : 'gray',
            count: post.likesCount || 0,
            onClick: handleLike,
            tooltip: isLiked ? '좋아요 취소' : '좋아요',
        },
        {
            icon: isBookmarked ? IconBookmarkFilled : IconBookmark,
            color: isBookmarked ? 'yellow' : 'gray',
            onClick: handleBookmark,
            tooltip: isBookmarked ? '북마크 제거' : '북마크 추가',
        },
        {
            icon: IconShare,
            color: 'gray',
            onClick: handleShare,
            tooltip: '공유하기',
        },
    ];

    return (
        <Group gap={compact ? "xs" : "lg"}>
            {actions.map((action, index) => (
                <Group key={index} gap={4}>
                    <Tooltip label={action.tooltip} withArrow>
                        <ActionIcon
                            variant="subtle"
                            size={compact ? "sm" : "md"}
                            color={action.color}
                            onClick={action.onClick}
                        >
                            <action.icon size={compact ? 14 : 16} />
                        </ActionIcon>
                    </Tooltip>
                    {action.count !== undefined && (
                        <Text size="xs" c="dimmed">
                            {formatters.number(action.count)}
                        </Text>
                    )}
                </Group>
            ))}
        </Group>
    );
});

PostActions.displayName = 'PostActions';

// 포스트 메뉴 컴포넌트
const PostMenu = memo(({ post, onEdit, onDelete, onTogglePin, onToggleVisibility }) => {
    const { user } = useAuth();
    const canEdit = user?.id === post.author?.id || user?.role === 'admin';

    if (!canEdit) {
        return null;
    }

    return (
        <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                    <IconDots size={16} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => onEdit?.(post)}
                >
                    수정
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconPin size={14} />}
                    onClick={() => onTogglePin?.(post.id, !post.isPinned)}
                >
                    {post.isPinned ? '고정 해제' : '상단 고정'}
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconEyeOff size={14} />}
                    onClick={() => onToggleVisibility?.(post.id, !post.isHidden)}
                >
                    {post.isHidden ? '공개로 변경' : '비공개로 변경'}
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={() => onDelete?.(post)}
                >
                    삭제
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
});

PostMenu.displayName = 'PostMenu';

// 메인 PostCard 컴포넌트
const PostCard2 = memo(({
                           post,
                           variant = 'default', // 'default', 'compact', 'featured'
                           showImage = true,
                           showAuthor = true,
                           showActions = true,
                           showMenu = true,
                           onPostClick,
                           onAuthorClick,
                           onLike,
                           onBookmark,
                           onShare,
                           onEdit,
                           onDelete,
                           onTogglePin,
                           onToggleVisibility,
                           ...props
                       }) => {
    const { dark } = useTheme();

    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // 포스트 클릭 핸들러
    const handlePostClick = useCallback(() => {
        onPostClick?.(post);
    }, [onPostClick, post]);

    // 작성자 클릭 핸들러
    const handleAuthorClick = useCallback((e) => {
        e.stopPropagation();
        onAuthorClick?.(post.author);
    }, [onAuthorClick, post.author]);

    // 이미지 로드 완료
    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    // 이미지 로드 에러
    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    // 변형에 따른 스타일 설정
    const cardStyles = useMemo(() => {
        const baseStyle = {
            background: dark ? '#161b22' : '#ffffff',
            border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
        };

        switch (variant) {
            case 'compact':
                return {
                    ...baseStyle,
                    padding: rem(12),
                };
            case 'featured':
                return {
                    ...baseStyle,
                    background: dark ? '#1a1f26' : '#f8fafc',
                    border: `2px solid ${dark ? '#4c6ef5' : '#3b82f6'}`,
                    boxShadow: dark
                        ? '0 4px 12px rgba(76, 110, 245, 0.15)'
                        : '0 4px 12px rgba(59, 130, 246, 0.15)',
                };
            default:
                return baseStyle;
        }
    }, [variant, dark]);

    // 호버 스타일
    const hoverStyles = useMemo(() => ({
        transform: 'translateY(-2px)',
        borderColor: dark ? '#4c6ef5' : '#3b82f6',
        boxShadow: dark
            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.1)',
    }), [dark]);


    // 컴팩트 버전
    if (variant === 'compact') {
        return (
            <Card
                padding="sm"
                radius="md"
                withBorder
                style={cardStyles}
                onClick={handlePostClick}
                {...props}
                styles={{
                    root: {
                        '&:hover': hoverStyles,
                    },
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Box style={{ flex: 1, minWidth: 0 }}>
                        <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                                <Title order={4} size="h5" lineClamp={2} style={{ flex: 1 }}>
                                    {post.title}
                                </Title>
                                {showMenu && (
                                    <PostMenu
                                        post={post}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onTogglePin={onTogglePin}
                                        onToggleVisibility={onToggleVisibility}
                                    />
                                )}
                            </Group>

                            <PostStatusBadge
                                status={post.status}
                                isPinned={post.isPinned}
                                isHidden={post.isHidden}
                            />

                            <Group justify="space-between" wrap="nowrap">
                                <PostMeta post={post} compact />
                                {showActions && (
                                    <PostActions
                                        post={post}
                                        onLike={onLike}
                                        onBookmark={onBookmark}
                                        onShare={onShare}
                                        compact
                                    />
                                )}
                            </Group>
                        </Stack>
                    </Box>

                    {showImage && post.bannerImage && (
                        <Box style={{ flexShrink: 0, marginLeft: rem(12) }}>
                            <LazyImage
                                src={post.bannerImage}
                                alt={post.title}
                                width={80}
                                height={60}
                                style={{ borderRadius: rem(4), objectFit: 'cover' }}
                                placeholder={
                                    <Skeleton width={80} height={60} radius="sm" />
                                }
                                fallback={
                                    <Box
                                        style={{
                                            width: 80,
                                            height: 60,
                                            borderRadius: rem(4),
                                            background: dark ? '#21262d' : '#f1f3f4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconExternalLink size={16} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                    </Box>
                                }
                            />
                        </Box>
                    )}
                </Group>
            </Card>
        );
    }

    // 기본 및 특별 버전
    return (
        <Card
            padding="lg"
            radius="md"
            withBorder
            style={cardStyles}
            onClick={handlePostClick}
            {...props}
            styles={{
                root: {
                    '&:hover': hoverStyles,
                },
            }}
        >
            {/* 특별 포스트 오버레이 */}
            {variant === 'featured' && (
                <Box
                    style={{
                        position: 'absolute',
                        top: rem(12),
                        left: rem(12),
                        zIndex: 1,
                    }}
                >
                    <Badge color="blue" variant="filled" size="sm">
                        추천 포스트
                    </Badge>
                </Box>
            )}

            <Group align="flex-start" gap="md" wrap="nowrap">
                {/* 이미지 섹션 */}
                {showImage && post.bannerImage && (
                    <Box style={{ flexShrink: 0, position: 'relative' }}>
                        <LazyImage
                            src={post.bannerImage}
                            alt={post.title}
                            width={200}
                            height={120}
                            style={{
                                borderRadius: rem(8),
                                objectFit: 'cover',
                                display: imageError ? 'none' : 'block',
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            placeholder={
                                <Skeleton width={200} height={120} radius="md" />
                            }
                        />

                        {imageError && (
                            <Box
                                style={{
                                    width: 200,
                                    height: 120,
                                    borderRadius: rem(8),
                                    background: dark ? '#21262d' : '#f1f3f4',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                                }}
                            >
                                <IconExternalLink size={24} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                            </Box>
                        )}

                        {imageLoading && (
                            <Overlay opacity={0.6} color="#000" blur={2}>
                                <Skeleton width={200} height={120} radius="md" />
                            </Overlay>
                        )}
                    </Box>
                )}

                {/* 콘텐츠 섹션 */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Stack gap="sm">
                        {/* 헤더 */}
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                            <Stack gap="xs" style={{ flex: 1 }}>
                                <Group gap="xs" wrap="nowrap">
                                    <Title order={3} size="h4" lineClamp={2} style={{ flex: 1 }}>
                                        {post.title}
                                    </Title>
                                </Group>

                                <PostStatusBadge
                                    status={post.status}
                                    isPinned={post.isPinned}
                                    isHidden={post.isHidden}
                                />
                            </Stack>

                            {showMenu && (
                                <PostMenu
                                    post={post}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onTogglePin={onTogglePin}
                                    onToggleVisibility={onToggleVisibility}
                                />
                            )}
                        </Group>

                        {/* 요약 */}
                        {post.excerpt && (
                            <Text size="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.6 }}>
                                {post.excerpt}
                            </Text>
                        )}

                        {/* 태그 */}
                        {post.tags && post.tags.length > 0 && (
                            <Group gap="xs">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                        key={tag}
                                        size="xs"
                                        variant="light"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // 태그 클릭 핸들러 추가 가능
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                    <Badge size="xs" variant="outline" c="dimmed">
                                        +{post.tags.length - 3}
                                    </Badge>
                                )}
                            </Group>
                        )}

                        {/* 하단 메타 정보 */}
                        <Group justify="space-between" align="center" wrap="nowrap">
                            <Group gap="md" style={{ flex: 1 }}>
                                {/* 작성자 정보 */}
                                {showAuthor && post.author && (
                                    <Group gap="xs" style={{ cursor: 'pointer' }} onClick={handleAuthorClick}>
                                        <Avatar
                                            src={post.author.avatar}
                                            size="sm"
                                            radius="xl"
                                            style={{
                                                border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                                            }}
                                        >
                                            {post.author.name?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                        <Stack gap={2}>
                                            <Text size="xs" fw={500}>
                                                {post.author.name}
                                            </Text>
                                        </Stack>
                                    </Group>
                                )}

                                {/* 메타 정보 */}
                                <PostMeta post={post} />
                            </Group>

                            {/* 액션 버튼들 */}
                            {showActions && (
                                <PostActions
                                    post={post}
                                    onLike={onLike}
                                    onBookmark={onBookmark}
                                    onShare={onShare}
                                />
                            )}
                        </Group>
                    </Stack>
                </Box>
            </Group>
        </Card>
    );
});

PostCard2.displayName = 'PostCard';
export default PostCard2;
