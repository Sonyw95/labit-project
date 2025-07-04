import React from 'react';
import {
    Container,
    Title,
    Stack,
    Card,
    Group,
    Image,
    Box,
    Text,
    ActionIcon,
    rem, Button, Grid, Center,
} from '@mantine/core';
import {
    IconChevronRight,
    IconSparkles,
} from '@tabler/icons-react';
import PostCard from "@/components/PostCard.jsx";

const PostList = ({   posts,
                      loading = false,
                      dark
                  }) => (
    <Container size="lg"  >
        <Grid gutter='lg'>
            {posts.map((post, index) => (
                <Grid.Col key={post.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <PostCard post={post} index={index} dark={dark} loading={loading}/>
                </Grid.Col>
            ))}
        </Grid>
    </Container>
);

export default PostList;