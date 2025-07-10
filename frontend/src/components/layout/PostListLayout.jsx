import {useParams} from "react-router-dom";
import {Box, Button, Center, Container, Grid, Group, rem, Stack, Text, Title} from "@mantine/core";
import React, {memo} from "react";
import {useTheme} from "@/hooks/useTheme.js";
import {RECENT_POSTS} from "@/constants/data.js";
import PostList from "@/components/blog/PostList.jsx";

const PostListLayout = memo(() => {
    const { dark } = useTheme();
    const { category } =useParams();
        // const customStats = [
        //     { icon: IconBookOff, label: '총 게시글', value: '42', color: '#3b82f6' },
        //     { icon: IconUsers, label: '월간 독자', value: '1.2K', color: '#10b981' },
        //     { icon: IconHeart, label: '총 좋아요', value: '350', color: '#ef4444' },
        //     { icon: IconEye, label: '총 조회수', value: '25.6K', color: '#f59e0b' },
        //     { icon: IconMessage, label: '댓글', value: '128', color: '#8b5cf6' },
        //     { icon: IconCode, label: '기술 스택', value: '15+', color: '#06b6d4' },
        // ];

        return (
            <PostList/>
        )
    }
)
export default PostListLayout