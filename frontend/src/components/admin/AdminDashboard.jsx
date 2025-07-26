import React, { useMemo, useCallback } from 'react';
import {
    Grid,
    Text,
    Group,
    Badge,
    Progress,
    SimpleGrid,
    Stack,
    Alert,
    ActionIcon,
    Tooltip,
    Box,
    Timeline,
    Button,
    useMantineColorScheme,
    rem,
} from '@mantine/core';
import {
    IconUsers,
    IconFileText,
    IconFolder,
    IconEye,
    IconTrendingUp,
    IconTrendingDown,
    IconRefresh,
    IconAlertCircle,
    IconCheck,
    IconX,
    IconClock,
} from '@tabler/icons-react';
import { useAdminActivityLogs, useAdminDashboardStats, useAdminSystemStatus } from "../../hooks/api/useApi.js";

const AdminDashboard = () => {
    const { colorScheme } = useMantineColorScheme();

    // velog 스타일 색상 팔레트
    const velogColors = useMemo(() => ({
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#FFFFFF',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
        success: '#12B886',
        error: '#FA5252',
        warning: '#FD7E14',
        info: '#339AF0',
        cardBg: colorScheme === 'dark' ? '#242529' : '#FFFFFF',
    }), [colorScheme]);

    // API hooks (기존 유지)
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

    // 유틸리티 함수들 - useCallback으로 메모이제이션
    const getStatusColor = useCallback((status) => {
        switch (status) {
            case 'healthy': return velogColors.success;
            case 'warning': return velogColors.warning;
            case 'error': return velogColors.error;
            default: return velogColors.subText;
        }
    }, [velogColors]);

    const getStatusIcon = useCallback((status) => {
        switch (status) {
            case 'healthy': return <IconCheck size={16} />;
            case 'warning': return <IconAlertCircle size={16} />;
            case 'error': return <IconX size={16} />;
            default: return <IconClock size={16} />;
        }
    }, []);

    const formatBytes = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleString('ko-KR');
    }, []);

    // 데이터 처리 - 메모이제이션
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

    // 통계 카드 설정 - 메모이제이션
    const statisticsCards = useMemo(() => [
        {
            title: '총 사용자',
            value: dashboardStats.users.total,
            growth: dashboardStats.users.growth,
            icon: IconUsers,
            color: velogColors.info,
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

    // 리소스 설정 - 메모이제이션
    const resourceConfigs = useMemo(() => [
        { name: 'CPU', value: systemStatusData.resources.cpu, color: velogColors.info },
        { name: '메모리', value: systemStatusData.resources.memory, color: velogColors.success },
        { name: '디스크', value: systemStatusData.resources.disk, color: velogColors.warning },
    ], [systemStatusData.resources, velogColors]);

    // 통계 카드 컴포넌트
    const StatisticsCard = useCallback(({ title, value, growth, icon: Icon, color }) => (
        <Box
            p="xl"
            style={{
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                borderRadius: rem(12),
                boxShadow: colorScheme === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
        >
            <Group justify="space-between" mb="md">
                <Text
                    size="sm"
                    fw={500}
                    style={{ color: velogColors.subText }}
                >
                    {title}
                </Text>
                <Icon size={24} style={{ color }} />
            </Group>

            <Text
                fw={700}
                size="2rem"
                style={{
                    color: velogColors.text,
                    lineHeight: 1.2,
                    marginBottom: rem(12)
                }}
            >
                {value.toLocaleString()}
            </Text>

            <Group gap="xs">
                {growth > 0 ? (
                    <IconTrendingUp size={16} style={{ color: velogColors.success }} />
                ) : (
                    <IconTrendingDown size={16} style={{ color: velogColors.error }} />
                )}
                <Text
                    size="sm"
                    fw={500}
                    style={{
                        color: growth > 0 ? velogColors.success : velogColors.error
                    }}
                >
                    {Math.abs(growth)}%
                </Text>
                <Text
                    size="sm"
                    style={{ color: velogColors.subText }}
                >
                    지난 달 대비
                </Text>
            </Group>
        </Box>
    ), [velogColors, colorScheme]);

    // 시스템 상태 카드 컴포넌트
    const SystemStatusCard = useMemo(() => (
        <Box
            p="xl"
            style={{
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                borderRadius: rem(12),
                boxShadow: colorScheme === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                height: rem(450),
            }}
        >
            <Group justify="space-between" mb="xl">
                <Text
                    fw={700}
                    size="lg"
                    style={{ color: velogColors.text }}
                >
                    시스템 상태
                </Text>
                <Badge
                    size="md"
                    radius="md"
                    variant="filled"
                    style={{
                        backgroundColor: getStatusColor(systemStatusData.status),
                        color: 'white',
                    }}
                    leftSection={getStatusIcon(systemStatusData.status)}
                >
                    {systemStatusData.status === 'healthy' ? '정상' : '문제 있음'}
                </Badge>
            </Group>
            <Box style={{    maxHeight: rem(320),
                overflowY: 'auto',
                paddingRight: rem(8),}}>
                <Stack gap="lg" mb="xl">
                    {systemStatusData.services.map((service, index) => (
                        <Group key={index} justify="space-between">
                            <Group gap="sm">
                                <Box
                                    w={10}
                                    h={10}
                                    style={{
                                        backgroundColor: getStatusColor(service.status),
                                        borderRadius: '50%',
                                    }}
                                />
                                <Text
                                    fw={500}
                                    style={{ color: velogColors.text }}
                                >
                                    {service.name}
                                </Text>
                            </Group>
                            <Text
                                size="sm"
                                style={{ color: velogColors.subText }}
                            >
                                {service.uptime}
                            </Text>
                        </Group>
                    ))}
                </Stack>

                <Text
                    fw={600}
                    mb="lg"
                    style={{ color: velogColors.text }}
                >
                    리소스 사용량
                </Text>
                <Stack gap="md">
                    {resourceConfigs.map((resource, index) => (
                        <Box key={index}>
                            <Group justify="space-between" mb="xs">
                                <Text
                                    size="sm"
                                    style={{ color: velogColors.text }}
                                >
                                    {resource.name}
                                </Text>
                                <Text
                                    size="sm"
                                    fw={500}
                                    style={{ color: velogColors.text }}
                                >
                                    {resource.value}%
                                </Text>
                            </Group>
                            <Progress
                                value={resource.value}
                                size="md"
                                radius="md"
                                style={{
                                    backgroundColor: velogColors.border,
                                }}
                                styles={{
                                    bar: {
                                        backgroundColor: resource.color,
                                    }
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>

        </Box>
    ), [systemStatusData, getStatusColor, getStatusIcon, resourceConfigs, velogColors, colorScheme]);

    // 활동 로그 카드 컴포넌트
    const ActivityLogsCard = useMemo(() => (
        <Box
            p="xl"
            style={{
                backgroundColor: velogColors.cardBg,
                border: `1px solid ${velogColors.border}`,
                borderRadius: rem(12),
                boxShadow: colorScheme === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                height: rem(450),
            }}
        >
            <Group justify="space-between" mb="xl">
                <Text
                    fw={700}
                    size="lg"
                    style={{ color: velogColors.text }}
                >
                    최근 활동
                </Text>
                <Tooltip label="새로고침">
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        onClick={refetchStats}
                        loading={logsLoading}
                        style={{
                            color: velogColors.subText,
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = velogColors.hover;
                            e.currentTarget.style.color = velogColors.text;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = velogColors.subText;
                        }}
                    >
                        <IconRefresh size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>

            <Box
                style={{
                    maxHeight: rem(320),
                    overflowY: 'auto',
                    paddingRight: rem(8),
                }}
            >
                <Timeline
                    active={activityLogsData.length}
                    bulletSize={24}
                    lineWidth={2}
                    styles={{
                        itemBody: {
                            paddingBottom: rem(16),
                        },
                        itemBullet: {
                            backgroundColor: velogColors.cardBg,
                            border: `2px solid ${velogColors.border}`,
                        }
                    }}
                >
                    {activityLogsData.slice(0, 5).map((log) => (
                        <Timeline.Item
                            key={log.id}
                            bullet={
                                <Box
                                    style={{
                                        color: log.status === 'success'
                                            ? velogColors.success
                                            : velogColors.error,
                                    }}
                                >
                                    {log.status === 'success' ? (
                                        <IconCheck size={14} />
                                    ) : (
                                        <IconX size={14} />
                                    )}
                                </Box>
                            }
                            title={
                                <Group gap="sm" wrap="nowrap">
                                    <Text
                                        fw={500}
                                        size="sm"
                                        style={{
                                            color: velogColors.text,
                                            flex: 1,
                                        }}
                                    >
                                        {log.action}
                                    </Text>
                                    <Badge
                                        size="xs"
                                        radius="md"
                                        variant="filled"
                                        style={{
                                            backgroundColor: log.status === 'success'
                                                ? velogColors.success
                                                : velogColors.error,
                                            color: 'white',
                                        }}
                                    >
                                        {log.status}
                                    </Badge>
                                </Group>
                            }
                        >
                            <Text
                                size="xs"
                                style={{ color: velogColors.subText }}
                            >
                                {log.user} • {formatDate(log.timestamp)}
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Box>
        </Box>
    ), [activityLogsData, velogColors, colorScheme, refetchStats, logsLoading, formatDate]);

    // 시스템 경고 알림
    const SystemAlert = useMemo(() => {
        if (systemStatusData.status === 'healthy') return null;

        return (
            <Alert
                icon={<IconAlertCircle size={18} />}
                color="red"
                variant="light"
                radius="md"
                styles={{
                    root: {
                        backgroundColor: `${velogColors.error}10`,
                        border: `1px solid ${velogColors.error}30`,
                    },
                    message: {
                        color: velogColors.text,
                    }
                }}
            >
                <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                        <Text
                            fw={600}
                            style={{ color: velogColors.text }}
                        >
                            시스템 문제 감지
                        </Text>
                        <Text
                            size="sm"
                            style={{ color: velogColors.text }}
                        >
                            일부 서비스에 문제가 발생했습니다. 시스템 관리자에게 문의하세요.
                        </Text>
                    </Stack>
                    <Button
                        variant="outline"
                        aria-label="자세히"
                        size="sm"
                        radius="md"
                        style={{
                            borderColor: velogColors.error,
                            color: velogColors.error,
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${velogColors.error}15`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        자세히 보기
                    </Button>
                </Group>
            </Alert>
        );
    }, [systemStatusData.status, velogColors]);

    return (
        <Box style={{ backgroundColor: velogColors.background }}>
            <Stack gap="2rem">
                {/* 통계 카드들 */}
                <SimpleGrid
                    cols={{ base: 1, sm: 2, lg: 4 }}
                    spacing="lg"
                >
                    {statisticsCards.map((card, index) => (
                        <StatisticsCard key={index} {...card} />
                    ))}
                </SimpleGrid>

                {/* 시스템 상태 & 활동 로그 */}
                <Grid gutter="lg">
                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        {SystemStatusCard}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        {ActivityLogsCard}
                    </Grid.Col>
                </Grid>

                {/* 시스템 경고 */}
                {SystemAlert}
            </Stack>
        </Box>
    );
};

export default AdminDashboard;