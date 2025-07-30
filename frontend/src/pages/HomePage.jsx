// HomePage.jsx - DB에서 관리자 정보를 조회하는 버전
import { memo, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Stack,
    Box,
    Divider,
} from '@mantine/core';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import AuthHeroSection from "@/components/section/home/AuthHeroSection.jsx";
import PostSection from "@/components/section/home/PostSection.jsx";
import CTASection from "@/components/section/home/CTASection.jsx";
import { postService } from "@/api/postService.js";
import { adminService } from "@/api/adminService.js";
import useAuthStore from "@/stores/authStore.js";

// HomePage 메인 컴포넌트
const HomePage = memo(() => {
    const navigate = useNavigate();
    const { themeColors } = useTheme();

    // Zustand store에서 관리자 정보 관련 상태 가져오기
    const {
        adminInfo: storedAdminInfo,
        setAdminInfo,
        setAdminInfoLoading,
        setAdminInfoError,
        shouldRefreshAdminInfo,
        getAdminInfoLoading,
        getAdminInfoError
    } = useAuthStore();

    // 관리자 정보 조회 쿼리
    const {
        data: adminInfoFromAPI,
        isLoading: adminInfoLoading,
        error: adminInfoError,
        refetch: refetchAdminInfo
    } = useQuery({
        queryKey: ['admin', 'info'],
        queryFn: adminService.getAdminInfo,
        staleTime: 10 * 60 * 1000, // 10분간 fresh
        cacheTime: 30 * 60 * 1000, // 30분간 캐시
        retry: 2,
        enabled: !storedAdminInfo || shouldRefreshAdminInfo(), // store에 없거나 오래된 경우에만 호출
        onSuccess: (data) => {
            setAdminInfo(data); // API 응답을 store에 저장
        },
        onError: (error) => {
            console.error('관리자 정보 조회 실패:', error);
            setAdminInfoError(error.message || '관리자 정보를 불러올 수 없습니다.');
        }
    });

    // 최신 포스트 조회
    const { data: latestPosts, isLoading: latestLoading } = useInfiniteQuery({
        queryKey: ['posts', 'latest'],
        queryFn: () => postService.getPosts({ page: 0, size: 6 }),
        getNextPageParam: () => undefined, // 첫 페이지만
        staleTime: 5 * 60 * 1000,
    });

    // store 로딩 상태 동기화
    useEffect(() => {
        setAdminInfoLoading(adminInfoLoading);
    }, [adminInfoLoading, setAdminInfoLoading]);

    // 포스트 목록을 메모이제이션
    const latestPostsList = useMemo(() => {
        return latestPosts?.pages?.[0]?.content || [];
    }, [latestPosts]);

    // 실제 사용할 관리자 정보 (store 우선, 없으면 API 데이터)
    const adminInfo = useMemo(() => {
        return storedAdminInfo || adminInfoFromAPI;
    }, [storedAdminInfo, adminInfoFromAPI]);

    // 조회수 증가 함수
    const incrementViews = useCallback(async () => {
        try {
            await adminService.incrementViews();
            console.log('조회수 증가 완료');
        } catch (error) {
            console.error('조회수 증가 실패:', error);
        }
    }, []);

    // 컴포넌트 마운트 시 조회수 증가 (한 번만)
    useEffect(() => {
        const hasIncrementedViews = sessionStorage.getItem('admin-views-incremented');
        if (!hasIncrementedViews) {
            incrementViews();
            sessionStorage.setItem('admin-views-incremented', 'true');
        }
    }, [incrementViews]);

    // 스타일 객체를 메모이제이션
    const containerStyle = useMemo(() => ({
        backgroundColor: themeColors.background,
        minHeight: '100vh'
    }), [themeColors.background]);

    // 네비게이션 핸들러들을 useCallback으로 메모이제이션
    const handleNavigateToAllPosts = useCallback(() => {
        navigate('/posts');
    }, [navigate]);

    const handleNavigateToAbout = useCallback(() => {
        navigate('/about');
    }, [navigate]);

    // 관리자 정보 새로고침 핸들러
    const handleRefreshAdminInfo = useCallback(() => {
        refetchAdminInfo();
    }, [refetchAdminInfo]);

    // 로딩 상태 체크
    const isAdminInfoLoading = adminInfoLoading || getAdminInfoLoading();
    const adminError = adminInfoError || getAdminInfoError();

    return (
        <Box style={containerStyle}>
            <Container size="xl" py="3rem">
                <Stack gap="4rem">
                    {/* Hero Section - Admin 명함 */}
                    <AuthHeroSection
                        adminInfo={adminInfo}
                        isLoading={isAdminInfoLoading}
                        error={adminError}
                        onRefresh={handleRefreshAdminInfo}
                    />

                    {/* 최신 포스트 섹션 */}
                    <PostSection
                        posts={latestPostsList}
                        isLoading={latestLoading}
                        onNavigateToAllPosts={handleNavigateToAllPosts}
                    />

                    <Divider color={themeColors.border} />

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

HomePage.displayName = 'HomePage';

export default HomePage;