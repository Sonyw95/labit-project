import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Container,
    Stack,
    Group,
    Text,
    Badge,
    Avatar,
    ActionIcon,
    Button,
    Paper,
    Box,
    Image,
    Divider,
    Textarea,
    Alert,
    BackgroundImage,
    Affix,
    Transition,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    nprogress,
    NavigationProgress,
    startNavigationProgress,
    completeNavigationProgress,
} from '@mantine/nprogress';
import {
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconBookmark,
    IconBookmarkFilled,
    IconMessageCircle,
    IconArrowUp,
    IconCalendar,
    IconClock,
    IconEye,
    IconSend,
    IconFlag,
    IconTrash,
} from '@tabler/icons-react';
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useTheme} from "../../hooks/useTheme.js";
import {showToast} from "../common/Toast.jsx";
import {formatters} from "../../utils/formatters.js";
import {apiClient} from "../../services/apiClient.js";
import {useScrollPosition} from "../../hooks/useScrollPosition.js";

// 코멘트 컴포넌트
const Comment = memo(({
                          comment,
                          onReply,
                          onLike,
                          onReport,
                          onDelete,
                          level = 0
                      }) => {
    const { user: currentUser } = useAuth();
    const { dark } = useTheme();

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReply = useCallback(async () => {
        if (!replyContent.trim()) {
            return;
        }

        setLoading(true);
        try {
            await onReply(comment.id, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
            showToast.success('성공', '댓글이 등록되었습니다.');
        } catch (error) {
            showToast.error('오류', '댓글 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [comment.id, replyContent, onReply]);

    const handleLike = useCallback(() => {
        onLike(comment.id);
    }, [comment.id, onLike]);

    const canDelete = currentUser?.id === comment.author.id;
    const isLiked = comment.likes?.includes(currentUser?.id);

    return (
        <Box ml={rem(level * 20)}>
            <Paper
                p="md"
                withBorder
                style={{
                    background: dark ? '#161b22' : '#ffffff',
                    border: `1px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                }}
            >
                <Stack gap="sm">
                    {/* 댓글 헤더 */}
                    <Group justify="space-between">
                        <Group gap="xs">
                            <Avatar
                                src={comment.author.avatar}
                                size="sm"
                                radius="xl"
                            >
                                {comment.author.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack gap={2}>
                                <Text size="sm" fw={500}>
                                    {comment.author.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {formatters.relativeTime(comment.createdAt)}
                                </Text>
                            </Stack>

                            {comment.author.id === comment.post?.authorId && (
                                <Badge size="xs" color="blue" variant="light">
                                    작성자
                                </Badge>
                            )}
                        </Group>

                        <Group gap="xs">
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={() => onReport(comment.id)}
                            >
                                <IconFlag size={14} />
                            </ActionIcon>

                            {canDelete && (
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    color="red"
                                    onClick={() => onDelete(comment.id)}
                                >
                                    <IconTrash size={14} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Group>

                    {/* 댓글 내용 */}
                    <Text size="sm" style={{ lineHeight: 1.6 }}>
                        {comment.content}
                    </Text>

                    {/* 댓글 액션 */}
                    <Group gap="lg">
                        <Group gap="xs">
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                color={isLiked ? 'red' : 'gray'}
                                onClick={handleLike}
                            >
                                {isLiked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
                            </ActionIcon>
                            <Text size="xs" c="dimmed">
                                {comment.likesCount || 0}
                            </Text>
                        </Group>

                        <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconMessageCircle size={12} />}
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            답글
                        </Button>
                    </Group>

                    {/* 답글 폼 */}
                    {showReplyForm && (
                        <Stack gap="xs">
                            <Textarea
                                placeholder="답글을 입력하세요..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                minRows={2}
                                maxRows={4}
                            />
                            <Group gap="xs">
                                <Button
                                    size="xs"
                                    onClick={handleReply}
                                    loading={loading}
                                    leftSection={<IconSend size={12} />}
                                >
                                    답글 등록
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    onClick={() => setShowReplyForm(false)}
                                >
                                    취소
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Stack>
            </Paper>

            {/* 대댓글 */}
            {comment.replies && comment.replies.length > 0 && (
                <Stack gap="xs" mt="xs">
                    {comment.replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            onReport={onReport}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
});

Comment.displayName = 'Comment';

// 댓글 섹션 컴포넌트
const CommentsSection = memo(({ postId, comments, onAddComment }) => {
    const { user, isAuthenticated } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!newComment.trim()) {
            return;
        }
        if (!isAuthenticated) {
            showToast.error('오류', '로그인이 필요합니다.');
            return;
        }

        setLoading(true);
        try {
            await onAddComment(newComment);
            setNewComment('');
            showToast.success('성공', '댓글이 등록되었습니다.');
        } catch (error) {
            showToast.error('오류', '댓글 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [newComment, isAuthenticated, onAddComment]);

    return (
        <Stack gap="md">
            <Group justify="space-between">
                <Text size="lg" fw={600}>
                    댓글 {comments.length}개
                </Text>
            </Group>

            {/* 댓글 작성 폼 */}
            {isAuthenticated ? (
                <Paper p="md" withBorder>
                    <Stack gap="md">
                        <Group gap="xs">
                            <Avatar src={user?.avatar} size="sm" radius="xl">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Text size="sm" fw={500}>
                                {user?.name}
                            </Text>
                        </Group>

                        <Textarea
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            minRows={3}
                            maxRows={8}
                        />

                        <Group justify="flex-end">
                            <Button
                                onClick={handleSubmit}
                                loading={loading}
                                leftSection={<IconSend size={14} />}
                                disabled={!newComment.trim()}
                            >
                                댓글 등록
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            ) : (
                <Alert color="blue" variant="light">
                    댓글을 작성하려면 로그인이 필요합니다.
                </Alert>
            )}

            {/* 댓글 목록 */}
            <Stack gap="md">
                {comments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onReply={async (commentId, content) => {
                            // 대댓글 등록 로직
                            // eslint-disable-next-line no-useless-catch
                            try {
                                await apiClient.comments.create(postId, {
                                    content,
                                    parentId: commentId
                                });
                                // 댓글 목록 재로드 로직 필요
                            } catch (error) {
                                throw error;
                            }
                        }}
                        onLike={async (commentId) => {
                            // 댓글 좋아요 로직
                            try {
                                await apiClient.comments.like(commentId);
                                // 댓글 상태 업데이트 로직 필요
                            } catch (error) {
                                showToast.error('오류', '요청을 처리할 수 없습니다.');
                            }
                        }}
                        onReport={async (commentId) => {
                            // 댓글 신고 로직
                            showToast.info('신고', '신고가 접수되었습니다.');
                        }}
                        onDelete={async (commentId) => {
                            // 댓글 삭제 로직
                            try {
                                await apiClient.comments.delete(commentId);
                                showToast.success('삭제', '댓글이 삭제되었습니다.');
                                // 댓글 목록 재로드 로직 필요
                            } catch (error) {
                                showToast.error('오류', '댓글 삭제에 실패했습니다.');
                            }
                        }}
                    />
                ))}
            </Stack>
        </Stack>
    );
});

CommentsSection.displayName = 'CommentsSection';

// PostView 메인 컴포넌트
const PostView = memo(({ postId }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [post, setPost] = useState({
        title: "2025년 웹 디자인 트렌드: 미래를 이끄는 혁신적인 디자인 패러다임",
        subtitle: "AI 기반 개인화, 지속가능한 디자인, 그리고 몰입형 사용자 경험의 시대",
        bannerImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=600&fit=crop",
        author: {
            name: "김디자이너",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
            bio: "UX/UI 디자이너이자 웹 트렌드 전문가",
            followers: "12.5K"
        },
        publishedAt: "2025-06-25",
        readTime: "12분",
        views: 3420,
        likes: 234,
        category: "디자인",
        tags: ["웹디자인", "2025트렌드", "UI/UX", "사용자경험"]
    });
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    const { scrollPosition } = useScrollPosition();
    const { user, isAuthenticated } = useAuth();

    // 포스트 데이터 로드
    // useEffect(() => {
    //     const loadPost = async () => {
    //         try {
    //             startNavigationProgress();
    //
    //             const [postResponse, commentsResponse] = await Promise.all([
    //                 apiClient.posts.getById(postId),
    //                 apiClient.comments.getByPost(postId)
    //             ]);
    //
    //             setPost(postResponse.data);
    //             setComments(commentsResponse.data);
    //
    //             // 사용자 상호작용 상태 확인
    //             if (isAuthenticated) {
    //                 setIsLiked(postResponse.data.likes?.includes(user?.id));
    //                 setIsBookmarked(postResponse.data.bookmarks?.includes(user?.id));
    //             }
    //
    //             completeNavigationProgress();
    //         } catch (error) {
    //             showToast.error('오류', '포스트를 불러올 수 없습니다.');
    //             completeNavigationProgress();
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     if (postId) {
    //         loadPost();
    //     }
    // }, [postId, user?.id, isAuthenticated]);

    // 읽기 진행률 계산
    useEffect(() => {
        const calculateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const progress = Math.min((scrollPosition / documentHeight) * 100, 100);
            setReadingProgress(progress);

            // nprogress 업데이트
            nprogress.set(progress);
        };

        calculateProgress();
    }, [scrollPosition]);

    // 좋아요 토글
    const handleLike = useCallback(async () => {
        if (!isAuthenticated) {
            showToast.error('오류', '로그인이 필요합니다.');
            return;
        }

        try {
            if (isLiked) {
                await apiClient.posts.unlike(postId);
                setIsLiked(false);
                setPost(prev => ({
                    ...prev,
                    likesCount: prev.likesCount - 1
                }));
            } else {
                await apiClient.posts.like(postId);
                setIsLiked(true);
                setPost(prev => ({
                    ...prev,
                    likesCount: prev.likesCount + 1
                }));
            }
        } catch (error) {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        }
    }, [postId, isLiked, isAuthenticated]);

    // 북마크 토글
    const handleBookmark = useCallback(async () => {
        if (!isAuthenticated) {
            showToast.error('오류', '로그인이 필요합니다.');
            return;
        }

        try {
            if (isBookmarked) {
                await apiClient.posts.unbookmark(postId);
                setIsBookmarked(false);
            } else {
                await apiClient.posts.bookmark(postId);
                setIsBookmarked(true);
            }
        } catch (error) {
            showToast.error('오류', '요청을 처리할 수 없습니다.');
        }
    }, [postId, isBookmarked, isAuthenticated]);

    // 공유하기
    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt || post.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('공유가 취소되었습니다.');
            }
        } else {
            // 폴백: 클립보드에 복사
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast.success('성공', '링크가 클립보드에 복사되었습니다.');
            } catch (error) {
                showToast.error('오류', '링크 복사에 실패했습니다.');
            }
        }
    }, [post]);

    // 댓글 추가
    const handleAddComment = useCallback(async (content) => {
        const response = await apiClient.comments.create(postId, { content });
        setComments(prev => [...prev, response.data]);
    }, [postId]);

    // 맨 위로 스크롤
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!loading) {
        return (
            <Container size="md">
                <Stack gap="md">
                    {/* 로딩 스켈레톤 */}
                    <Box h={300} style={{ background: dark ? '#21262d' : '#f1f3f4', borderRadius: rem(8) }} />
                    <Box h={40} style={{ background: dark ? '#21262d' : '#f1f3f4', borderRadius: rem(4) }} />
                    <Box h={20} w="60%" style={{ background: dark ? '#21262d' : '#f1f3f4', borderRadius: rem(4) }} />
                    <Box h={200} style={{ background: dark ? '#21262d' : '#f1f3f4', borderRadius: rem(4) }} />
                </Stack>
            </Container>
        );
    }

    if (!post) {
        return (
            <Container size="md">
                <Alert color="red" variant="light">
                    포스트를 찾을 수 없습니다.
                </Alert>
            </Container>
        );
    }
    return (
        <>
            {/* 읽기 진행률 표시 */}
            <NavigationProgress />

            <Container size="xl">
                <Stack gap="xl">
                    {/* 배너 이미지 */}
                    {post.bannerImage && (
                        <BackgroundImage src={post.bannerImage} h={400} radius="md" >
                            <Box
                                h="100%"
                                style={{
                                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: rem(32),
                                }}
                            >
                                <Stack gap="xs" style={{ color: 'white' }}>
                                    <Group gap="xs">
                                        {post.tags && post.tags.map(tag => (
                                            <Badge key={tag} color="blue" variant="filled">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </Group>

                                    <Text size="xl" fw={700} style={{ fontSize: rem(32) }}>
                                        {post.title}
                                    </Text>
                                </Stack>
                            </Box>
                        </BackgroundImage>
                    )}

                    {/* 포스트 헤더 */}
                    <Stack gap="md">
                        {!post.bannerImage && (
                            <Stack gap="xs">
                                <Group gap="xs">
                                    {post.tags && post.tags.map(tag => (
                                        <Badge key={tag} color="blue" variant="light">
                                            {tag}
                                        </Badge>
                                    ))}
                                </Group>

                                <Text size="xl" fw={700} style={{ fontSize: rem(32) }}>
                                    {post.title}
                                </Text>
                            </Stack>
                        )}

                        {/* 포스트 메타 정보 */}
                        <Group justify="space-between">
                            <Group gap="md">
                                <Group gap="xs">
                                    <Avatar src={post.author?.avatar} size="sm" radius="xl">
                                        {post.author?.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <Stack gap={2}>
                                        <Text size="sm" fw={500}>
                                            {post.author?.name}
                                        </Text>
                                        <Group gap="xs" style={{ fontSize: rem(12), color: dark ? '#8b949e' : '#6b7280' }}>
                                            <Group gap={4}>
                                                <IconCalendar size={12} />
                                                <Text size="xs">
                                                    {formatters.date(post.publishedAt || post.createdAt)}
                                                </Text>
                                            </Group>
                                            <Text size="xs">•</Text>
                                            <Group gap={4}>
                                                <IconClock size={12} />
                                                <Text size="xs">
                                                    {/*{formatters.readingTime(post.content)}*/}
                                                </Text>
                                            </Group>
                                            <Text size="xs">•</Text>
                                            <Group gap={4}>
                                                <IconEye size={12} />
                                                <Text size="xs">
                                                    {formatters.number(post.viewsCount || 0)}
                                                </Text>
                                            </Group>
                                        </Group>
                                    </Stack>
                                </Group>
                            </Group>

                            {/* 액션 버튼들 */}
                            <Group gap="xs">
                                <ActionIcon
                                    variant="light"
                                    color={isLiked ? 'red' : 'gray'}
                                    onClick={handleLike}
                                    size="lg"
                                >
                                    {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                                </ActionIcon>

                                <ActionIcon
                                    variant="light"
                                    color={isBookmarked ? 'yellow' : 'gray'}
                                    onClick={handleBookmark}
                                    size="lg"
                                >
                                    {isBookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
                                </ActionIcon>

                                <ActionIcon
                                    variant="light"
                                    onClick={handleShare}
                                    size="lg"
                                >
                                    <IconShare size={18} />
                                </ActionIcon>
                            </Group>
                        </Group>

                        {/* 좋아요 및 조회수 */}
                        <Group gap="lg">
                            <Group gap="xs">
                                <IconHeart size={16} style={{ color: '#ef4444' }} />
                                <Text size="sm" c="dimmed">
                                    {formatters.number(post.likesCount || 0)}명이 좋아합니다
                                </Text>
                            </Group>

                            <Group gap="xs">
                                <IconEye size={16} style={{ color: dark ? '#8b949e' : '#6b7280' }} />
                                <Text size="sm" c="dimmed">
                                    {formatters.number(post.viewsCount || 0)}회 조회
                                </Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Divider />

                    {/* 포스트 내용 */}
                    <Box
                        style={{
                            '& pre': {
                                background: dark ? '#161b22' : '#f6f8fa',
                                border: `1px solid ${dark ? '#30363d' : '#d0d7de'}`,
                                borderRadius: rem(6),
                                padding: rem(16),
                                overflow: 'auto',
                            },
                            '& code': {
                                background: dark ? '#161b22' : '#f6f8fa',
                                padding: '2px 4px',
                                borderRadius: rem(3),
                                fontSize: '0.875em',
                            },
                            '& blockquote': {
                                borderLeft: `4px solid #4c6ef5`,
                                paddingLeft: rem(16),
                                margin: `${rem(16)} 0`,
                                fontStyle: 'italic',
                                color: dark ? '#8b949e' : '#6b7280',
                            },
                            '& img': {
                                maxWidth: '100%',
                                height: 'auto',
                                borderRadius: rem(8),
                            },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                                marginTop: rem(24),
                                marginBottom: rem(16),
                                lineHeight: 1.25,
                            },
                            '& p': {
                                lineHeight: 1.6,
                                marginBottom: rem(16),
                            },
                            '& ul, & ol': {
                                paddingLeft: rem(24),
                                marginBottom: rem(16),
                            },
                            '& li': {
                                marginBottom: rem(4),
                            },
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <Divider />

                    {/* 포스트 하단 정보 */}
                    <Group justify="space-between">
                        <Group gap="xs">
                            <Text size="sm" c="dimmed">
                                마지막 수정:
                            </Text>
                            <Text size="sm">
                                {formatters.relativeTime(post.updatedAt)}
                            </Text>
                        </Group>

                        {post.category && (
                            <Group gap="xs">
                                <Text size="sm" c="dimmed">
                                    카테고리:
                                </Text>
                                <Badge variant="light">
                                    {post.category}
                                </Badge>
                            </Group>
                        )}
                    </Group>

                    {/* 관련 포스트 */}
                    {post.relatedPosts && post.relatedPosts.length > 0 && (
                        <Stack gap="md">
                            <Text size="lg" fw={600}>
                                관련 포스트
                            </Text>

                            <Group>
                                {post.relatedPosts.slice(0, 3).map(relatedPost => (
                                    <Paper
                                        key={relatedPost.id}
                                        p="md"
                                        withBorder
                                        style={{
                                            flex: 1,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                            }
                                        }}
                                    >
                                        <Stack gap="xs">
                                            {relatedPost.bannerImage && (
                                                <Image
                                                    src={relatedPost.bannerImage}
                                                    h={120}
                                                    radius="sm"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            )}

                                            <Text size="sm" fw={500} lineClamp={2}>
                                                {relatedPost.title}
                                            </Text>

                                            <Text size="xs" c="dimmed" lineClamp={2}>
                                                {relatedPost.excerpt}
                                            </Text>

                                            <Group gap="xs">
                                                <Text size="xs" c="dimmed">
                                                    {formatters.relativeTime(relatedPost.publishedAt)}
                                                </Text>
                                                <Text size="xs" c="dimmed">•</Text>
                                                <Text size="xs" c="dimmed">
                                                    {formatters.readingTime(relatedPost.content)}
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Group>
                        </Stack>
                    )}

                    <Divider />

                    {/* 댓글 섹션 */}
                    <CommentsSection
                        postId={postId}
                        comments={comments}
                        onAddComment={handleAddComment}
                    />
                </Stack>
            </Container>

            {/* 맨 위로 가기 버튼 */}
            <Affix position={{ bottom: rem(20), right: rem(20) }}>
                <Transition transition="slide-up" mounted={scrollPosition > 200}>
                    {(transitionStyles) => (
                        <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="filled"
                            color="blue"
                            onClick={scrollToTop}
                            style={{
                                ...transitionStyles,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }}
                        >
                            <IconArrowUp size={18} />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    );
});

PostView.displayName = 'PostView';

export default PostView;