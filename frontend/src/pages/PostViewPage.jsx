import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
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
} from '@mantine/core';
import {
    IconHeart,
    IconShare,
    IconBookmark,
    IconEdit,
    IconTrash,
    IconDots,
    IconEye,
    IconCalendar,
    IconTag,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { usePost, useDeletePost, useTogglePostLike } from '../../hooks/usePostApi';
import { useCommentsByPost } from '../../hooks/useCommentApi';
import useAuthStore from '../../store/authStore';
import CommentSection from '../../components/Comment/CommentSection';

function PostViewPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    // API 훅
    const { data: post, isLoading, error } = usePost(postId);
    const { data: comments } = useCommentsByPost(postId);
    const deletePostMutation = useDeletePost();
    const toggleLikeMutation = useTogglePostLike();

    // 포스트 삭제
    const handleDeletePost = async () => {
        try {
            await deletePostMutation.mutateAsync(postId);
            notifications.show({
                title: '포스트 삭제',
                message: '포스트가 삭제되었습니다.',
                color: 'green',
            });
            navigate('/posts');
        } catch (error) {
            notifications.show({
                title: '삭제 실패',
                message: '포스트 삭제 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
        setDeleteModalOpened(false);
    };

    // 좋아요 토글
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            notifications.show({
                title: '로그인 필요',
                message: '좋아요를 누르려면 로그인이 필요합니다.',
                color: 'yellow',
            });
            return;
        }

        try {
            await toggleLikeMutation.mutateAsync(postId);
        } catch (error) {
            notifications.show({
                title: '오류 발생',
                message: '좋아요 처리 중 오류가 발생했습니다.',
                color: 'red',
            });
        }
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
            navigator.clipboard.writeText(window.location.href);
            notifications.show({
                title: '링크 복사',
                message: '포스트 링크가 클립보드에 복사되었습니다.',
                color: 'blue',
            });
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

    if (isLoading) {
        return (
            <Center h="50vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (error || !post) {
        return (
            <Container>
                <Text c="red" ta="center">
                    포스트를 불러올 수 없습니다.
                </Text>
            </Container>
        );
    }

    return (
        <Container size="lg">
            <Stack spacing="xl">
                {/* 포스트 헤더 */}
                <Paper shadow="sm" p="xl">
                    <Stack spacing="md">
                        {/* 카테고리 배지 */}
                        {post.category && (
                            <Badge variant="light" size="lg">
                                {post.category.label}
                            </Badge>
                        )}

                        {/* 제목 */}
                        <Text size="2rem" fw={700} lh={1.2}>
                            {post.title}
                        </Text>

                        {/* 요약 */}
                        {post.summary && (
                            <Text size="lg" c="dimmed">
                                {post.summary}
                            </Text>
                        )}

                        {/* 메타 정보 */}
                        <Group justify="space-between">
                            <Group>
                                <Avatar
                                    src={post.author.profileImage}
                                    alt={post.author.nickname}
                                    size="md"
                                />
                                <div>
                                    <Text fw={500}>{post.author.nickname}</Text>
                                    <Group spacing="xs" c="dimmed">
                                        <IconCalendar size={14} />
                                        <Text size="sm">
                                            {formatDate(post.publishedDate || post.createdDate)}
                                        </Text>
                                        <IconEye size={14} />
                                        <Text size="sm">{post.viewCount}</Text>
                                    </Group>
                                </div>
                            </Group>

                            <Group>
                                {/* 액션 버튼들 */}
                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    onClick={handleToggleLike}
                                    loading={toggleLikeMutation.isLoading}
                                >
                                    <IconHeart size={20} />
                                </ActionIcon>
                                <Text size="sm">{post.likeCount}</Text>

                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    onClick={handleShare}
                                >
                                    <IconShare size={20} />
                                </ActionIcon>

                                <ActionIcon variant="light" size="lg">
                                    <IconBookmark size={20} />
                                </ActionIcon>

                                {/* 작성자/관리자 메뉴 */}
                                {(isAuthor || isAdmin) && (
                                    <Menu shadow="md" width={200}>
                                        <Menu.Target>
                                            <ActionIcon variant="light" size="lg">
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
                        </Group>

                        {/* 태그 */}
                        {post.tags && post.tags.length > 0 && (
                            <Group spacing="xs">
                                <IconTag size={16} />
                                {post.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" size="sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </Group>
                        )}
                    </Stack>
                </Paper>

                {/* 썸네일 이미지 */}
                {post.thumbnailUrl && (
                    <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        height={400}
                        fit="cover"
                        radius="md"
                    />
                )}

                {/* 포스트 내용 */}
                <Paper shadow="sm" p="xl">
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        style={{
                            lineHeight: 1.8,
                            fontSize: '16px',
                        }}
                    />
                </Paper>

                <Divider />

                {/* 댓글 섹션 */}
                <CommentSection postId={postId} comments={comments} />

                {/* 삭제 확인 모달 */}
                <Modal
                    opened={deleteModalOpened}
                    onClose={() => setDeleteModalOpened(false)}
                    title="포스트 삭제"
                    centered
                >
                    <Stack>
                        <Text>정말로 이 포스트를 삭제하시겠습니까?</Text>
                        <Text size="sm" c="dimmed">
                            삭제된 포스트는 복구할 수 없습니다.
                        </Text>

                        <Group justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpened(false)}
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
    );
}

export default PostViewPage;