// import {
//     Text,
//     Badge,
//     Box,
//     Card,
//     Group,
//     Stack,
//     Transition,
//     Avatar,
//     ActionIcon,
//     Image,
//     Tooltip, Skeleton
// } from "@mantine/core";
// import {IconBookmark, IconChevronRight, IconEye, IconHeart, IconShare} from "@tabler/icons-react";
// import React, {memo, useState} from "react";
//
// const categoryColors = {
//     "디자인": "violet",
//     "개발": "blue",
//     "AI/ML": "orange",
//     "프레임워크": "green",
//     "클라우드": "cyan",
//     "보안": "red"
// };
//
// function PostCard({ post, index, dark, loading = true }) {
//     const [isHovered, setIsHovered] = useState(false);
//     const [likedPosts, setLikedPosts] = useState(new Set());
//     const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
//
//     const isLiked = likedPosts.has(post.id);
//     const isBookmarked = bookmarkedPosts.has(post.id);
//
//     const formatNumber = (num) => {
//         if (num >= 1000) {
//             return `${(num / 1000).toFixed(1)  }K`;
//         }
//         return num.toString();
//     };
//     const handleBookmark = (postId) => {
//         setBookmarkedPosts(prev => {
//             const newSet = new Set(prev);
//             if (newSet.has(postId)) {
//                 newSet.delete(postId);
//             } else {
//                 newSet.add(postId);
//             }
//             return newSet;
//         });
//     };
//     const handleLike = (postId) => {
//         setLikedPosts(prev => {
//             const newSet = new Set(prev);
//             if (newSet.has(postId)) {
//                 newSet.delete(postId);
//             } else {
//                 newSet.add(postId);
//             }
//             return newSet;
//         });
//     };
//     const handleShare = async (post) => {
//         if (navigator.share) {
//             try {
//                 await navigator.share({
//                     title: post.title,
//                     text: post.excerpt,
//                     url: `${window.location.origin  }/posts/${post.id}`,
//                 });
//             } catch (error) {
//                 console.log('Sharing cancelled');
//             }
//         } else {
//             // Fallback to clipboard
//             await navigator.clipboard.writeText(`${window.location.origin  }/posts/${post.id}`);
//         }
//     };
//     const LoadingSkeleton = () => (
//         <Card radius="xl" p="md">
//             <Skeleton height={180} radius="md" mb="md" />
//             <Stack gap="sm">
//                 <Group justify="space-between">
//                     <Skeleton height={12} width="30%" />
//                     <Skeleton height={20} radius="xl" width={20} />
//                 </Group>
//                 <Skeleton height={20} width="85%" />
//                 <Skeleton height={16} width="95%" />
//                 <Skeleton height={16} width="70%" />
//                 <Group justify="space-between" mt="xs">
//                     <Skeleton height={12} width="20%" />
//                     <Group gap="xs">
//                         <Skeleton height={24} width={24} radius="xl" />
//                         <Skeleton height={24} width={24} radius="xl" />
//                         <Skeleton height={24} width={24} radius="xl" />
//                     </Group>
//                 </Group>
//             </Stack>
//         </Card>
//     );
//
//     return (
//         <Transition
//             mounted
//             transition="slide-up"
//             duration={300}
//             timingFunction="ease-out"
//             enterDelay={index * 100}
//         > {
//             loading ? <LoadingSkeleton /> : (styles) => (
//                 <Card
//                     style={{
//                         ...styles,
//                         transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
//                         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                         cursor: 'pointer',
//                         borderRadius: '24px',
//                         overflow: 'hidden',
//                         boxShadow: isHovered
//                             ? dark
//                                 ? '0 25px 50px -12px rgba(200, 200, 200, 0.05), 0 0 0 1px rgba(200, 200, 200, 0.2)'
//                                 : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
//                             : dark
//                                 ? '0 25px 50px -12px rgba(64, 64, 64, 0.05), 0 0 0 1px rgba(64, 64, 64, 0.2)'
//                                 : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
//                         background: dark
//                             ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%)'
//                             : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
//                         backdropFilter: 'blur(20px)',
//                         border: dark
//                             ? '1px solid rgba(64, 64, 64, 0.1)'
//                             : '1px solid rgba(255, 255, 255, 0.2)'
//                     }}
//                     p={0}
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                 >
//                     {/* 이미지 섹션 */}
//                     <Box style={{ position: 'relative', overflow: 'hidden' }}>
//                         <Image
//                             src={post.image}
//                             alt={post.title}
//                             height={200}
//                             style={{
//                                 transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//                                 transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
//                                 filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
//                             }}
//                             fallbackSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
//                         />
//
//                         {/* 그라디언트 오버레이 */}
//                         <Box
//                             style={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 bottom: 0,
//                                 background: dark
//                                     ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)'
//                                     : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
//                                 pointerEvents: 'none'
//                             }}
//                         />
//
//                         {/*카테고리 배지*/}
//                         <Badge
//                             color={categoryColors[post.category]}
//                             variant="filled"
//                             size="sm"
//                             style={{
//                                 position: 'absolute',
//                                 top: 12,
//                                 left: 12,
//                                 backdropFilter: 'blur(10px)',
//                                 background: `rgba(var(--mantine-color-${categoryColors[post.category]}-6-rgb), 0.9)`,
//                                 border: '1px solid rgba(255, 255, 255, 0.2)',
//                                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
//                             }}
//                         >
//                             {post.category}
//                         </Badge>
//
//                         {/* /!*북마크 버튼*!/*/}
//                         <ActionIcon
//                             variant="filled"
//                             size="md"
//                             style={{
//                                 position: 'absolute',
//                                 top: 12,
//                                 right: 12,
//                                 backdropFilter: 'blur(10px)',
//                                 background: isBookmarked
//                                     ? 'var(--mantine-color-yellow-6)'
//                                     : (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
//                                 border: '1px solid rgba(255, 255, 255, 0.2)',
//                                 transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//                                 transition: 'all 0.2s ease'
//                             }}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleBookmark(post.id);
//                             }}
//                         >
//                             <IconBookmark size={16} />
//                         </ActionIcon>
//                     </Box>
//
//                     {/* 콘텐츠 섹션 */}
//                     <Stack gap="md" p="lg">
//                         {/* 제목 */}
//                         <Text
//                             size="lg"
//                             fw={700}
//                             lineClamp={2}
//                             style={{
//                                 backgroundImage: dark
//                                     ? 'linear-gradient(135deg, var(--mantine-color-white) 0%, var(--mantine-color-gray-3) 100%)'
//                                     : 'linear-gradient(135deg, var(--mantine-color-text) 0%, var(--mantine-color-dimmed) 100%)',
//                                 backgroundClip: 'text',
//                                 WebkitBackgroundClip: 'text',
//                                 // color: 'transparent',
//                                 fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
//                             }}
//                         >
//                             {post.title}
//                         </Text>
//
//                         {/* 요약 */}
//                         <Text
//                             size="sm"
//                             c="dimmed"
//                             lineClamp={2}
//                             style={{ lineHeight: 1.6 }}
//                         >
//                             {post.excerpt}
//                         </Text>
//
//                         {/* 태그 */}
//                         <Group gap="xs">
//                             {post.tags.map((tag, tagIndex) => (
//                                 <Badge
//                                     key={tagIndex}
//                                     variant="light"
//                                     size="xs"
//                                     color={categoryColors[post.category]}
//                                     style={{
//                                         background: dark
//                                             ? `rgba(var(--mantine-color-${categoryColors[post.category]}-9-rgb), 0.3)`
//                                             : `rgba(var(--mantine-color-${categoryColors[post.category]}-1-rgb), 0.5)`,
//                                         border: dark
//                                             ? `1px solid rgba(var(--mantine-color-${categoryColors[post.category]}-6-rgb), 0.5)`
//                                             : `1px solid rgba(var(--mantine-color-${categoryColors[post.category]}-3-rgb), 0.3)`,
//                                         backdropFilter: 'blur(5px)'
//                                     }}
//                                 >
//                                     #{tag}
//                                 </Badge>
//                             ))}
//                         </Group>
//
//                         {/* 작성자 정보 및 메타데이터 */}
//                         <Group justify="space-between" align="center">
//                             <Group gap="xs">
//                                 <Avatar
//                                     src={post.author.avatar}
//                                     alt={post.author.name}
//                                     size="sm"
//                                     style={{
//                                         border: '2px solid rgba(255, 255, 255, 0.2)',
//                                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//                                     }}
//                                 />
//                                 <Stack gap={2}>
//                                     <Text size="xs" fw={500}>{post.author.name}</Text>
//                                     <Text size="xs" c="dimmed">{post.readTime} 읽기</Text>
//                                 </Stack>
//                             </Group>
//
//                             {/* 인터랙션 버튼들 */}
//                             <Group gap="xs">
//                                 <Group gap={4}>
//                                     <ActionIcon
//                                         variant="subtle"
//                                         size="sm"
//                                         color={isLiked ? "red" : "gray"}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleLike(post.id);
//                                         }}
//                                         style={{
//                                             transition: 'all 0.2s ease',
//                                             '&:hover': {
//                                                 transform: 'scale(1.1)',
//                                                 backgroundColor: isLiked
//                                                     ? 'rgba(239, 68, 68, 0.1)'
//                                                     : (dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
//                                             }
//                                         }}
//                                     >
//                                         <IconHeart size={14}   style={{
//                                             fill: isLiked ? 'currentColor' : 'none',
//                                         }} />
//                                     </ActionIcon>
//                                     {(isLiked || post.likes > 0) && (
//                                         <Text
//                                             size="xs"
//                                             c={dark ? 'gray.5' : 'gray.6'}
//                                             fw={500}
//                                         >
//                                             {formatNumber(post.likes + (isLiked ? 1 : 0))}
//                                         </Text>
//                                     )}
//                                 </Group>
//
//                                 <Group gap="lg">
//                                     <Group gap="xs">
//                                         <IconEye
//                                             size={16}
//                                             color={dark ? '#666666' : '#94a3b8'}
//                                         />
//                                         <Text
//                                             size="xs"
//                                             c={dark ? 'gray.5' : 'gray.6'}
//                                             fw={600}
//                                         >
//                                             {post.views}
//                                         </Text>
//                                     </Group>
//                                 </Group>
//
//                                 <Tooltip label="공유하기">
//                                     <ActionIcon
//                                         variant="subtle"
//                                         ize="sm"
//                                         color="gray"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleShare(post).then(r =>{ console.log(r)} );
//                                         }}>
//                                         <IconShare size={14} />
//                                     </ActionIcon>
//                                 </Tooltip>
//                             </Group>
//                         </Group>
//
//                         {/* 읽기 더보기 버튼 */}
//                         <Group
//                             justify="space-between"
//                             align="center"
//                             style={{
//                                 marginTop: 'auto',
//                                 paddingTop: '8px',
//                                 borderTop: '1px solid rgba(255, 255, 255, 0.1)'
//                             }}
//                         >
//                             <Text size="xs" c="dimmed">{post.createdAt}</Text>
//                             <Group gap={4} c="blue">
//                                 <Text size="sm" fw={500}>자세히 보기</Text>
//                                 <IconChevronRight
//                                     size={16}
//                                     style={{
//                                         transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
//                                         transition: 'transform 0.2s ease'
//                                     }}
//                                 />
//                             </Group>
//                         </Group>
//                     </Stack>
//                 </Card>
//             )
//         }
//         </Transition>
//     )
// }
// export default memo(PostCard);



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
const PostCard = memo(({
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

PostCard.displayName = 'PostCard';
export default PostCard;

// export default { PostCard, PostMeta, PostActions, PostStatusBadge };