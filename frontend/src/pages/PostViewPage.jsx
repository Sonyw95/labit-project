import {memo, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Stack,
    Text,
    Group,
    Badge,
    ActionIcon,
    Button,
    Divider,
    Image,
    Avatar,
    Menu,
    Modal,
    Loader,
    Center,
    Box,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconBookmark,
    IconBookmarkFilled,
    IconEdit,
    IconTrash,
    IconDots,
    IconEye,
    IconCalendar,
    IconTag,
} from '@tabler/icons-react';
import useAuthStore from "../stores/authStore.js";
import {useCommentsByPost, useDeletePost, usePost, useTogglePostLike} from "../hooks/api/useApi.js";
import {showToast} from "../components/advanced/Toast.jsx";
import CommentSection from "../components/section/CommentSection.jsx";

const PostViewPage = memo(() => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { colorScheme } = useMantineColorScheme();

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // API 훅
    const { data: post, isLoading, error } = usePost(postId);
    const { data: comments } = useCommentsByPost(postId);
    const deletePostMutation = useDeletePost();
    const toggleLikeMutation = useTogglePostLike();

    // velog 스타일 색상
    const velogColors = {
        primary: '#12B886', // velog 시그니처 녹색
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
    };

    // 포스트 삭제
    const handleDeletePost = async () => {
        try {
            await deletePostMutation.mutateAsync(postId);
            showToast.success('포스트 삭제', '포스트 삭제가 되었습니다..')
            navigate('/posts');
        } catch (error) {
            showToast.error('삭제 실패', '포스트 삭제 중 오류가 발생했습니다.')
        }
        setDeleteModalOpened(false);
    };

    // 좋아요 토글
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '좋아요를 누르려면 로그인이 필요합니다.')
            return;
        }
        try {
            await toggleLikeMutation.mutateAsync(postId);
        } catch (error) {
            showToast.error("오류 발생", "좋아요 처리 중 오류가 발생했습니다.")
        }
    };

    // 북마크 토글
    const handleToggleBookmark = () => {
        if (!isAuthenticated) {
            showToast.warning('로그인 필요', '북마크를 사용하려면 로그인이 필요합니다.')
            return;
        }
        setIsBookmarked(!isBookmarked);
        showToast.success('북마크', isBookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.');
    };

    // 공유하기
    const handleShare = async () => {
        try {
            await navigator.share({
                title: post.title,
                text: post.summary,
                url: window.location.href,
            });
        } catch (error) {
            // Web Share API를 지원하지 않는 경우 클립보드에 복사
            await navigator.clipboard.writeText(window.location.href);
            showToast.success("링크 복사", "포스트 링크가 클립보드에 복사되었습니다")
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // 작성자 여부 확인
    const isAuthor = user && post && user.id === post.author.id;
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
    const isLiked = post?.isLiked;

    if (isLoading) {
        return (
            <Center h="50vh">
                <Loader size="lg" color={velogColors.primary} />
            </Center>
        );
    }

    if (error || !post) {
        return (
            <Container size="md">
                <Center py="xl">
                    <Text c="red" ta="center" size="lg">
                        포스트를 불러올 수 없습니다.
                    </Text>
                </Center>
            </Container>
        );
    }

    return (
        <Box bg={velogColors.background} style={{ minHeight: '100vh' }}>
            <Container size="md" py="xl">
                <Stack gap="xl">
                    {/* 포스트 헤더 */}
                    <Box>
                        <Stack gap="lg">
                            {/* 카테고리 배지 */}
                            {post.category && (
                                <Badge
                                    variant="light"
                                    size="md"
                                    color={velogColors.primary}
                                    style={{
                                        backgroundColor: `${velogColors.primary}15`,
                                        color: velogColors.primary,
                                        border: `1px solid ${velogColors.primary}30`
                                    }}
                                >
                                    {post.category.label}
                                </Badge>
                            )}

                            {/* 제목 - velog 스타일 대형 제목 */}
                            <Text
                                size="3rem"
                                fw={800}
                                lh={1.2}
                                c={velogColors.text}
                                style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                {post.title}
                            </Text>

                            {/* 요약 */}
                            {post.summary && (
                                <Text
                                    size="xl"
                                    c={velogColors.subText}
                                    lh={1.6}
                                    style={{ marginTop: '1rem' }}
                                >
                                    {post.summary}
                                </Text>
                            )}

                            {/* 메타 정보 */}
                            <Group justify="space-between" mt="xl">
                                <Group gap="md">
                                    <Avatar
                                        src={post.author.profileImage}
                                        alt={post.author.nickname}
                                        size="lg"
                                        style={{ border: `2px solid ${velogColors.border}` }}
                                    />
                                    <Box>
                                        <Text fw={600} size="lg" c={velogColors.text}>
                                            {post.author.nickname}
                                        </Text>
                                        <Group gap="md" c={velogColors.subText} mt={4}>
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

                                {/* 작성자/관리자 메뉴 */}
                                {(isAuthor || isAdmin) && (
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <ActionIcon
                                                variant="subtle"
                                                size="lg"
                                                c={velogColors.subText}
                                                style={{
                                                    '&:hover': {
                                                        backgroundColor: velogColors.hover
                                                    }
                                                }}
                                            >
                                                <IconDots size={20} />
                                            </ActionIcon>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                leftSection={<IconEdit size={16} />}
                                                onClick={() => navigate(`/posts/${postId}/edit`)}
                                            >
                                                수정
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconTrash size={16} />}
                                                color="red"
                                                onClick={() => setDeleteModalOpened(true)}
                                            >
                                                삭제
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                )}
                            </Group>

                            {/* 태그 */}
                            {post.tags && post.tags.length > 0 && (
                                <Group gap="xs" mt="md">
                                    <IconTag size={16} color={velogColors.subText} />
                                    {post.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            color="gray"
                                            style={{
                                                color: velogColors.subText,
                                                borderColor: velogColors.border,
                                                backgroundColor: 'transparent'
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </Group>
                            )}
                        </Stack>
                    </Box>

                    {/* 썸네일 이미지 */}
                    {post.thumbnailUrl && (
                        <Image
                            src={post.thumbnailUrl}
                            alt={post.title}
                            height={400}
                            fit="cover"
                            radius="md"
                            style={{
                                border: `1px solid ${velogColors.border}`,
                                marginTop: '2rem'
                            }}
                        />
                    )}

                    {/* 포스트 내용 - velog 스타일 */}
                    <Box py="xl">
                        <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            style={{
                                lineHeight: 1.8,
                                fontSize: '18px',
                                color: velogColors.text,
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                maxWidth: '100%',
                                wordBreak: 'break-word',
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    color: velogColors.text,
                                    fontWeight: '700',
                                    marginTop: '2.5rem',
                                    marginBottom: '1rem',
                                },
                                '& p': {
                                    marginBottom: '1.5rem',
                                    lineHeight: '1.8',
                                },
                                '& code': {
                                    backgroundColor: velogColors.hover,
                                    padding: '0.2rem 0.4rem',
                                    borderRadius: '4px',
                                    fontSize: '0.9em',
                                    color: velogColors.primary,
                                },
                                '& pre': {
                                    backgroundColor: velogColors.hover,
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    overflow: 'auto',
                                    marginBottom: '1.5rem',
                                },
                                '& blockquote': {
                                    borderLeft: `4px solid ${velogColors.primary}`,
                                    paddingLeft: '1rem',
                                    marginLeft: 0,
                                    fontStyle: 'italic',
                                    color: velogColors.subText,
                                },
                                '& a': {
                                    color: velogColors.primary,
                                    textDecoration: 'none',
                                },
                                '& a:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                        />
                    </Box>

                    {/* 액션 버튼들 - velog 스타일 하단 고정 */}
                    <Box
                        style={{
                            position: 'sticky',
                            bottom: '2rem',
                            zIndex: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '3rem'
                        }}
                    >
                        <Group
                            gap="lg"
                            p="md"
                            style={{
                                backgroundColor: velogColors.background,
                                border: `1px solid ${velogColors.border}`,
                                borderRadius: '50px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Group gap="xs">
                                <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    onClick={handleToggleLike}
                                    loading={toggleLikeMutation.isLoading}
                                    color={isLiked ? 'red' : 'gray'}
                                    style={{
                                        '&:hover': {
                                            backgroundColor: velogColors.hover
                                        }
                                    }}
                                >
                                    {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                                </ActionIcon>
                                <Text size="sm" c={velogColors.subText} fw={500}>
                                    {post.likeCount}
                                </Text>
                            </Group>

                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={handleShare}
                                c={velogColors.subText}
                                style={{
                                    '&:hover': {
                                        backgroundColor: velogColors.hover
                                    }
                                }}
                            >
                                <IconShare size={20} />
                            </ActionIcon>

                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={handleToggleBookmark}
                                color={isBookmarked ? velogColors.primary : 'gray'}
                                style={{
                                    '&:hover': {
                                        backgroundColor: velogColors.hover
                                    }
                                }}
                            >
                                {isBookmarked ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
                            </ActionIcon>
                        </Group>
                    </Box>

                    {/* 구분선 */}
                    <Divider
                        my="xl"
                        color={velogColors.border}
                        style={{ marginTop: '4rem' }}
                    />

                    {/* 댓글 섹션 */}
                    <CommentSection postId={postId} comments={comments} />

                    {/* 삭제 확인 모달 */}
                    <Modal
                        opened={deleteModalOpened}
                        onClose={() => setDeleteModalOpened(false)}
                        title={
                            <Text fw={600} size="lg" c={velogColors.text}>
                                포스트 삭제
                            </Text>
                        }
                        centered
                        styles={{
                            content: {
                                backgroundColor: velogColors.background,
                            },
                            header: {
                                backgroundColor: velogColors.background,
                                borderBottom: `1px solid ${velogColors.border}`,
                            }
                        }}
                    >
                        <Stack gap="lg">
                            <Text c={velogColors.text}>
                                정말로 이 포스트를 삭제하시겠습니까?
                            </Text>
                            <Text size="sm" c={velogColors.subText}>
                                삭제된 포스트는 복구할 수 없습니다.
                            </Text>

                            <Group justify="flex-end" gap="md">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModalOpened(false)}
                                    color="gray"
                                    style={{
                                        borderColor: velogColors.border,
                                        color: velogColors.subText
                                    }}
                                >
                                    취소
                                </Button>
                                <Button
                                    color="red"
                                    onClick={handleDeletePost}
                                    loading={deletePostMutation.isLoading}
                                >
                                    삭제
                                </Button>
                            </Group>
                        </Stack>
                    </Modal>
                </Stack>
            </Container>
        </Box>
    );
});

export default PostViewPage;