import {memo} from 'react';
import {
    Grid,
    Transition,
    Box,
} from '@mantine/core';
import PostCard from "@/components/section/post/PostCard.jsx";

const PostList = memo(({posts= [],  span={
        sm: 6,      // 태블릿: 2개씩
        md: 6,      // 중간 화면: 2개씩
        lg: 4,      // 데스크톱: 3개씩
        xl: 3       // 큰 화면: 3개씩
    }}) => {
    console.log(posts)
        return (
            <>
                <Grid gutter="md">
                    {posts.map((post, index) => (
                        <Grid.Col
                            key={`${post.id}-${index}`}
                            style={{ display: 'flex' }}
                            span={span}
                        >
                            <Transition
                                mounted
                                transition="fade-up"
                                duration={300}
                                timingFunction="ease"
                            >
                                {(styles) => (
                                    <Box style={{ ...styles, display: 'flex' , width: '100%'}}>
                                        <PostCard post={post} />
                                    </Box>
                                )}
                            </Transition>
                        </Grid.Col>
                    ))}
                </Grid>

            </>
        )
    }
)
export default PostList;