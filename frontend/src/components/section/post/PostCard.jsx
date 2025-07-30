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
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useNavigate} from "react-router-dom";

const PostCard = memo(({ post }) => {
    // const { colorScheme } = useMantineColorScheme();
    //
    // // velog 스타일 색상
    // const themeColors = {
    //     primary: '#12B886',
    //     text: dark ? '#ECECEC' : '#212529',
    //     subText: dark ? '#ADB5BD' : '#495057',
    //     background: dark ? '#1A1B23' : '#FFFFFF',
    //     border: dark ? '#2B2D31' : '#E9ECEF',
    //     hover: dark ? '#2B2D31' : '#F8F9FA',
    //     cardBg: dark ? '#1E1F25' : '#FFFFFF',
    // };
    const {dark,  themeColors} = useTheme();
    const navigate = useNavigate();

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
        const maxLength = post.thumbnailUrl ? 100 : 200; // 길이 조정
        return post.summary.length > maxLength
            ? `${post.summary.substring(0, maxLength)}...`
            : post.summary;
    }, [post.summary, post.thumbnailUrl]);

    const handleCardClick = () => {
        navigate(`/post/view/${post.id}`)
        console.log('Navigate to post:', post.id );
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
                width:'100%',
                cursor: 'pointer',
                minHeight: post.thumbnailUrl ? '450px' : '380px', // 최소 높이로 변경
                backgroundColor: themeColors.cardBg,
                border: `1px solid ${themeColors.border}`,
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: dark
                        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                        : '0 8px 25px rgba(0, 0, 0, 0.08)',
                }
            }}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = dark
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
                                height={160} // 이미지 높이 축소
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

                <Box p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {/* 제목 */}
                    <Text
                        fw={700}
                        size="xl"
                        lineClamp={2}
                        mb="xs"
                        style={{
                            color: themeColors.text,
                            lineHeight: 1.4,
                            letterSpacing: '-0.01em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            minHeight: '2.4rem',
                        }}
                    >
                        {post.title}
                    </Text>

                    {/* 요약 - flex 속성 제거하고 고정 높이 설정 */}
                    <Text
                        size="md"
                        c={themeColors.subText}
                        lineClamp={post.thumbnailUrl ? 2 : 4}
                        mb="md"
                        style={{
                            lineHeight: 1.6,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            height: post.thumbnailUrl ? '3.2rem' : '6.4rem', // 고정 높이 설정
                            overflow: 'hidden',
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
                                            backgroundColor: `${themeColors.primary}15`,
                                            color: themeColors.primary,
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

                    {/* 하단 정보 - margin-top auto로 항상 하단에 고정 */}
                    <Group
                        justify="space-between"
                        mt="auto"
                        align="flex-start"
                        style={{
                            flexShrink: 0,
                            gap: '0.5rem',
                            minHeight: '50px',
                        }}
                        wrap="wrap" // 모바일에서 줄바꿈 허용
                    >
                        {/* 작성자 정보 */}
                        <Group
                            gap="sm"
                            onClick={handleAuthorClick}
                            style={{
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                transition: 'background-color 0.2s ease',
                                flex: '1 1 auto',
                                minWidth: '120px',
                                '&:hover': {
                                    backgroundColor: themeColors.hover,
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = themeColors.hover;
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
                                    border: `2px solid ${themeColors.border}`,
                                    flexShrink: 0
                                }}
                            />
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    size="sm"
                                    fw={600}
                                    c={themeColors.text}
                                    truncate
                                    style={{
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    }}
                                >
                                    {post.author.nickname}
                                </Text>
                                <Group gap="xs" c={themeColors.subText}>
                                    <IconCalendar size={12} style={{ flexShrink: 0 }} />
                                    <Text
                                        size="xs"
                                        truncate
                                        style={{ flex: 1, minWidth: 0 }}
                                    >
                                        {formattedDate}
                                    </Text>
                                </Group>
                            </Box>
                        </Group>

                        {/* 통계 정보 */}
                        <Group gap="xs" style={{ flexShrink: 0 }}>
                            <Group gap="xs" style={{ flexShrink: 0 }}>
                                <ActionIcon
                                    variant="subtle"
                                    size="xs"
                                    onClick={handleLikeClick}
                                    color={post.isLiked ? 'red' : 'gray'}
                                    style={{
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: post.isLiked ? '#FFE8E8' : themeColors.hover,
                                        }
                                    }}
                                >
                                    {post.isLiked ? (
                                        <IconHeartFilled size={12} />
                                    ) : (
                                        <IconHeart size={12} />
                                    )}
                                </ActionIcon>
                                <Text
                                    size="xs"
                                    fw={500}
                                    c={themeColors.subText}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {post.likeCount}
                                </Text>
                            </Group>

                            <Group gap="xs" c={themeColors.subText} style={{ flexShrink: 0 }}>
                                <IconEye size={12} />
                                <Text
                                    size="xs"
                                    fw={500}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {post.viewCount}
                                </Text>
                            </Group>

                            <Group gap="xs" c={themeColors.subText} style={{ flexShrink: 0 }}>
                                <IconMessageCircle size={12} />
                                <Text
                                    size="xs"
                                    fw={500}
                                    style={{ whiteSpace: 'nowrap' }}
                                >
                                    {post.commentCount}
                                </Text>
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