import { memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Stack,
    Box,
    Divider,
} from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from "../api/service.js";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import AuthHeroSection from "@/components/section/home/AuthHeroSection.jsx";
import PostSection from "@/components/section/home/PostSection.jsx";
import CTASection from "@/components/section/home/CTASection.jsx";



// MainPage 메인 컴포넌트
const MainPage = memo(() => {
    console.log('Main');
    const navigate = useNavigate();
    const { velogColors } = useTheme();
    // 최신 포스트 조회
    const { data: latestPosts, isLoading: latestLoading } = useInfiniteQuery({
        queryKey: ['posts', 'latest'],
        queryFn: () => postService.getPosts({ page: 0, size: 6 }),
        getNextPageParam: () => undefined, // 첫 페이지만
        staleTime: 5 * 60 * 1000,
    });

    // 포스트 목록을 메모이제이션 (데이터가 변경될 때만 재계산)
    const latestPostsList = useMemo(() => {
        return latestPosts?.pages?.[0]?.content || [];
    }, [latestPosts]);

    // 관리자 정보를 메모이제이션 (totalPosts 의존성 제거로 최적화)
    const adminInfo = useMemo(() => ({
        name: "김개발자",
        role: "Full Stack Developer",
        bio: "안녕하세요! 웹 개발과 새로운 기술에 관심이 많은 개발자입니다. React, Node.js, Spring Boot를 주로 사용하며, 사용자 경험을 중시하는 서비스를 만들고 있습니다.",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&auto=format&q=80",
        location: "Seoul, Korea",
        email: "developer@example.com",
        github: "https://github.com/developer",
        totalViews: "12.5K"
    }), []); // 상수 데이터이므로 의존성 배열 비움

    // 스타일 객체를 메모이제이션
    const containerStyle = useMemo(() => ({
        backgroundColor: velogColors.background,
        minHeight: '100vh'
    }), [velogColors.background]);

    // 네비게이션 핸들러들을 useCallback으로 메모이제이션
    const handleNavigateToAllPosts = useCallback(() => {
        navigate('/posts');
    }, [navigate]);

    const handleNavigateToAbout = useCallback(() => {
        navigate('/about');
    }, [navigate]);

    return (
        <Box style={containerStyle}>
            <Container size="xl" py="3rem">
                <Stack gap="4rem">
                    {/* Hero Section - Admin 명함 */}
                    <AuthHeroSection adminInfo={adminInfo} />

                    {/* 최신 포스트 섹션 */}
                    <PostSection
                        posts={latestPostsList}
                        isLoading={latestLoading}
                        onNavigateToAllPosts={handleNavigateToAllPosts}
                    />

                    <Divider color={velogColors.border} />

                    {/* CTA 섹션 */}
                    <CTASection
                        onNavigateToAllPosts={handleNavigateToAllPosts}
                        onNavigateToAbout={handleNavigateToAbout}
                    />
                </Stack>
            </Container>
        </Box>
    );
});

MainPage.displayName = 'MainPage';

export default MainPage;