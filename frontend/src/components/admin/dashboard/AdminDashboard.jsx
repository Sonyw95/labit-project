import React, { useMemo } from 'react';
import {
    Grid,
    SimpleGrid,
    Stack,
    Box,
} from '@mantine/core';
import {
    IconUsers,
    IconFileText,
    IconFolder,
    IconEye,
} from '@tabler/icons-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import {useAdminActivityLogs, useAdminDashboardStats, useAdminSystemStatus} from "@/hooks/api/useApi.js";
import SystemAlert from "@/components/admin/dashboard/SystemAlert.jsx";
import StatisticsCard from "@/components/admin/dashboard/StatisticsCard.jsx";
import SystemStatusCard from "@/components/admin/dashboard/SystemStatusCard.jsx";
import ActivityLogsCard from "@/components/admin/dashboard/ActivityLogsCard.jsx";

// 분리된 컴포넌트들 import

const AdminDashboard = () => {
    const { dark, velogColors } = useTheme();

    // API hooks
    const {
        data: stats,
        isLoading: statsLoading,
        refetch: refetchStats
    } = useAdminDashboardStats();

    const {
        data: systemStatus,
        isLoading: statusLoading
    } = useAdminSystemStatus();

    const {
        data: activityLogs,
        isLoading: logsLoading
    } = useAdminActivityLogs(10);

    // 기본값이 포함된 데이터 처리 - API 실패 시 fallback
    const dashboardStats = useMemo(() => stats || {
        users: { total: 1245, growth: 12.5 },
        posts: { total: 876, growth: 8.3 },
        assets: { total: 2341, growth: -2.1 },
        views: { total: 45678, growth: 15.7 },
    }, [stats]);

    const systemStatusData = useMemo(() => systemStatus || {
        status: 'healthy',
        services: [
            { name: 'Database', status: 'healthy', uptime: '99.9%' },
            { name: 'File Server', status: 'warning', uptime: '98.5%' },
            { name: 'Cache', status: 'healthy', uptime: '100%' },
            { name: 'Search Engine', status: 'healthy', uptime: '99.8%' },
        ],
        resources: {
            cpu: 45,
            memory: 67,
            disk: 23,
            network: 12,
        }
    }, [systemStatus]);

    const activityLogsData = useMemo(() => activityLogs || [
        { id: 1, user: 'admin', action: '네비게이션 메뉴 수정', timestamp: '2024-01-20T10:30:00Z', status: 'success' },
        { id: 2, user: 'editor', action: '새 포스트 작성', timestamp: '2024-01-20T10:25:00Z', status: 'success' },
        { id: 3, user: 'admin', action: '에셋 폴더 생성', timestamp: '2024-01-20T10:20:00Z', status: 'success' },
        { id: 4, user: 'user1', action: '파일 업로드 시도', timestamp: '2024-01-20T10:15:00Z', status: 'failed' },
        { id: 5, user: 'admin', action: '시스템 설정 변경', timestamp: '2024-01-20T10:10:00Z', status: 'success' },
    ], [activityLogs]);

    // 통계 카드 설정 - 아이콘과 색상만 정의
    const statisticsCards = useMemo(() => [
        {
            title: '총 사용자',
            value: dashboardStats.users.total,
            growth: dashboardStats.users.growth,
            icon: IconUsers,
            color: '#339AF0', // info 색상 직접 정의
        },
        {
            title: '총 포스트',
            value: dashboardStats.posts.total,
            growth: dashboardStats.posts.growth,
            icon: IconFileText,
            color: velogColors.success,
        },
        {
            title: '총 에셋',
            value: dashboardStats.assets.total,
            growth: dashboardStats.assets.growth,
            icon: IconFolder,
            color: velogColors.warning,
        },
        {
            title: '총 조회수',
            value: dashboardStats.views.total,
            growth: dashboardStats.views.growth,
            icon: IconEye,
            color: velogColors.primary,
        },
    ], [dashboardStats, velogColors]);

    // 로딩 상태 처리
    if (statsLoading || statusLoading) {
        return (
            <Box
                style={{
                    color: velogColors.text,
                    backgroundColor: velogColors.background,
                    padding: '2rem'
                }}
                role="status"
                aria-live="polite"
            >
                <Stack align="center" gap="lg">
                    <Box
                        style={{
                            width: '40px',
                            height: '40px',
                            border: `3px solid ${velogColors.border}`,
                            borderTop: `3px solid ${velogColors.primary}`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}
                        aria-hidden="true"
                    />
                    <Box component="span">대시보드 데이터를 불러오는 중...</Box>
                </Stack>
            </Box>
        );
    }

    return (
        <Box
            style={{ backgroundColor: velogColors.background }}
            role="main"
            aria-labelledby="dashboard-title"
        >
            {/* 스크린 리더를 위한 숨겨진 제목 */}
            <Box
                component="h1"
                id="dashboard-title"
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
            >
                관리자 대시보드
            </Box>

            <Stack gap="2rem">
                {/* 시스템 경고 - 최상단에 배치 */}
                <SystemAlert
                    systemStatus={systemStatusData.status}
                    velogColors={velogColors}
                />

                {/* 통계 카드들 */}
                <section aria-labelledby="statistics-section">
                    <Box
                        component="h2"
                        id="statistics-section"
                        style={{
                            position: 'absolute',
                            left: '-10000px',
                            width: '1px',
                            height: '1px',
                            overflow: 'hidden'
                        }}
                    >
                        통계 정보
                    </Box>
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, lg: 4 }}
                        spacing="lg"
                    >
                        {statisticsCards.map((card, index) => (
                            <StatisticsCard
                                key={`stat-${index}-${card.title}`}
                                {...card}
                                velogColors={velogColors}
                                dark={dark}
                            />
                        ))}
                    </SimpleGrid>
                </section>

                {/* 시스템 상태 & 활동 로그 */}
                <section aria-labelledby="details-section">
                    <Box
                        component="h2"
                        id="details-section"
                        style={{
                            position: 'absolute',
                            left: '-10000px',
                            width: '1px',
                            height: '1px',
                            overflow: 'hidden'
                        }}
                    >
                        시스템 상태 및 활동 로그
                    </Box>
                    <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <SystemStatusCard
                                systemStatusData={systemStatusData}
                                velogColors={velogColors}
                                dark={dark}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <ActivityLogsCard
                                activityLogsData={activityLogsData}
                                velogColors={velogColors}
                                dark={dark}
                                refetchStats={refetchStats}
                                logsLoading={logsLoading}
                            />
                        </Grid.Col>
                    </Grid>
                </section>
            </Stack>

            {/* CSS-in-JS로 스피너 애니메이션 추가 */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Box>
    );
};

export default AdminDashboard;