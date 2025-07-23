import {memo, useState} from 'react';
import {
    Stack,
    Text,
    Paper,
    Textarea,
    Button,
    Group,
    Alert,
    Divider,
} from '@mantine/core';
import { IconMessageCircle, IconSend } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import useAuthStore from "../../stores/authStore.js";
import {useCreateComment} from "@/hooks/api/useApi.js";
import CommentItem from "./CommentItem.jsx";
import {showToast} from "../advanced/Toast.jsx";

const CommentSection = memo(({ postId, comments = [] }) => {
    const { isAuthenticated } = useAuthStore();
    const createCommentMutation = useCreateComment();

    const [isWriting, setIsWriting] = useState(false);

    // 댓글 작성 폼
    const form = useForm({
        initialValues: {
            content: '',
        },
        validate: {
            content: (value) => (!value.trim() ? '댓글 내용을 입력해주세요.' : null),
        },
    });

    // 댓글 작성
    const handleSubmitComment = async (values) => {
        if (!isAuthenticated) {
            showToast.warning("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다.");
            return;
        }

        try {
            await createCommentMutation.mutateAsync({
                postId: parseInt(postId, 10),
                content: values.content,
            });

            form.reset();
            setIsWriting(false);

            showToast.success("댓글 작성 완료", '댓글이 성공적으로 작성되었습니다.');

        } catch (error) {
            showToast.error("댓글 작성 실패", '댓글이 작성 중 오류가 발생했습니다.');
        }
    };

    return (
        <Stack spacing="lg">
            {/* 댓글 헤더 */}
            <Group justify="space-between">
                <Group spacing="xs">
                    <IconMessageCircle size={20} />
                    <Text fw={600} size="lg">
                        댓글 {comments.length}개
                    </Text>
                </Group>
            </Group>

            {/* 댓글 작성 영역 */}
            <Paper withBorder p="md">
                {!isAuthenticated ? (
                    <Alert color="blue" title="로그인이 필요합니다">
                        댓글을 작성하려면 로그인해주세요.
                    </Alert>
                ) : (
                    <form onSubmit={form.onSubmit(handleSubmitComment)}>
                        <Stack spacing="md">
                            <Textarea
                                placeholder="댓글을 입력하세요..."
                                minRows={isWriting ? 4 : 2}
                                autosize
                                {...form.getInputProps('content')}
                                onFocus={() => setIsWriting(true)}
                            />

                            {isWriting && (
                                <Group justify="flex-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsWriting(false);
                                            form.reset();
                                        }}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        type="submit"
                                        leftSection={<IconSend size={16} />}
                                        loading={createCommentMutation.isLoading}
                                    >
                                        댓글 작성
                                    </Button>
                                </Group>
                            )}
                        </Stack>
                    </form>
                )}
            </Paper>

            <Divider />

            {/* 댓글 목록 */}
            <Stack spacing="md">
                {comments.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                        첫 번째 댓글을 작성해보세요!
                    </Text>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                        />
                    ))
                )}
            </Stack>
        </Stack>
    );
})

export default CommentSection;