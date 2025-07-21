import {Button, Card, Group, Stack, Text} from "@mantine/core";
import {useDeletePost} from "@/hooks/api/useApi.js";

function PostList({ posts }) {
    const deletePostMutation = useDeletePost();

    const handleDeletePost = (postId) => {
        deletePostMutation.mutate(postId);
    };

    if (!posts?.length) {
        return (
            <Card shadow="sm" padding="lg">
                <Text>포스트가 없습니다.</Text>
            </Card>
        );
    }

    return (
        <Stack>
            {posts.map(post => (
                <Card key={post.id} shadow="sm" padding="lg">
                    <Text weight={500} size="lg">{post.title}</Text>
                    <Text size="sm" color="dimmed" lineClamp={3}>
                        {post.content}
                    </Text>
                    <Group position="right" mt="md">
                        <Button variant="light" size="xs">
                            수정
                        </Button>
                        <Button
                            variant="light"
                            color="red"
                            size="xs"
                            onClick={() => handleDeletePost(post.id)}
                            loading={deletePostMutation.isLoading}
                        >
                            삭제
                        </Button>
                    </Group>
                </Card>
            ))}
        </Stack>
    );
}

export default PostList;