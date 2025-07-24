import React from 'react';
import {
    Grid,
    Card,
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
    Timeline, Button,
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
import {useAdminActivityLogs, useAdminDashboardStats, useAdminSystemStatus} from "../../hooks/api/useApi.js";

const AdminDashboard = () => {
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy': return 'green';
            case 'warning': return 'yellow';
            case 'error': return 'red';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy': return <IconCheck size={16} />;
            case 'warning': return <IconAlertCircle size={16} />;
            case 'error': return <IconX size={16} />;
            default: return <IconClock size={16} />;
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR');
    };

    // 샘플 데이터 (실제로는 API에서 받아올 데이터)
    const sampleStats = stats || {
        users: { total: 1245, growth: 12.5 },
        posts: { total: 876, growth: 8.3 },
        assets: { total: 2341, growth: -2.1 },
        views: { total: 45678, growth: 15.7 },
    };

    const sampleSystemStatus = systemStatus || {
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
    };

    const sampleActivityLogs = activityLogs || [
        { id: 1, user: 'admin', action: '네비게이션 메뉴 수정', timestamp: '2024-01-20T10:30:00Z', status: 'success' },
        { id: 2, user: 'editor', action: '새 포스트 작성', timestamp: '2024-01-20T10:25:00Z', status: 'success' },
        { id: 3, user: 'admin', action: '에셋 폴더 생성', timestamp: '2024-01-20T10:20:00Z', status: 'success' },
        { id: 4, user: 'user1', action: '파일 업로드 시도', timestamp: '2024-01-20T10:15:00Z', status: 'failed' },
        { id: 5, user: 'admin', action: '시스템 설정 변경', timestamp: '2024-01-20T10:10:00Z', status: 'success' },
    ];

    return (
        <Stack spacing="xl">
            {/* 통계 카드들 */}
            <SimpleGrid cols={4} spacing="lg">
                <Card shadow="xs" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>
                            총 사용자
                        </Text>
                        <IconUsers size={20} color="blue" />
                    </Group>
                    <Text fw={700} size="xl">
                        {sampleStats.users.total.toLocaleString()}
                    </Text>
                    <Group gap="xs" mt="xs">
                        {sampleStats.users.growth > 0 ? (
                            <IconTrendingUp size={14} color="green" />
                        ) : (
                            <IconTrendingDown size={14} color="red" />
                        )}
                        <Text
                            size="xs"
                            c={sampleStats.users.growth > 0 ? 'green' : 'red'}
                            fw={500}
                        >
                            {Math.abs(sampleStats.users.growth)}%
                        </Text>
                        <Text size="xs" c="dimmed">
                            지난 달 대비
                        </Text>
                    </Group>
                </Card>

                <Card shadow="xs" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>
                            총 포스트
                        </Text>
                        <IconFileText size={20} color="green" />
                    </Group>
                    <Text fw={700} size="xl">
                        {sampleStats.posts.total.toLocaleString()}
                    </Text>
                    <Group gap="xs" mt="xs">
                        {sampleStats.posts.growth > 0 ? (
                            <IconTrendingUp size={14} color="green" />
                        ) : (
                            <IconTrendingDown size={14} color="red" />
                        )}
                        <Text
                            size="xs"
                            c={sampleStats.posts.growth > 0 ? 'green' : 'red'}
                            fw={500}
                        >
                            {Math.abs(sampleStats.posts.growth)}%
                        </Text>
                        <Text size="xs" c="dimmed">
                            지난 달 대비
                        </Text>
                    </Group>
                </Card>

                <Card shadow="xs" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>
                            총 에셋
                        </Text>
                        <IconFolder size={20} color="orange" />
                    </Group>
                    <Text fw={700} size="xl">
                        {sampleStats.assets.total.toLocaleString()}
                    </Text>
                    <Group gap="xs" mt="xs">
                        {sampleStats.assets.growth > 0 ? (
                            <IconTrendingUp size={14} color="green" />
                        ) : (
                            <IconTrendingDown size={14} color="red" />
                        )}
                        <Text
                            size="xs"
                            c={sampleStats.assets.growth > 0 ? 'green' : 'red'}
                            fw={500}
                        >
                            {Math.abs(sampleStats.assets.growth)}%
                        </Text>
                        <Text size="xs" c="dimmed">
                            지난 달 대비
                        </Text>
                    </Group>
                </Card>

                <Card shadow="xs" padding="lg" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                        <Text size="sm" c="dimmed" fw={500}>
                            총 조회수
                        </Text>
                        <IconEye size={20} color="violet" />
                    </Group>
                    <Text fw={700} size="xl">
                        {sampleStats.views.total.toLocaleString()}
                    </Text>
                    <Group gap="xs" mt="xs">
                        {sampleStats.views.growth > 0 ? (
                            <IconTrendingUp size={14} color="green" />
                        ) : (
                            <IconTrendingDown size={14} color="red" />
                        )}
                        <Text
                            size="xs"
                            c={sampleStats.views.growth > 0 ? 'green' : 'red'}
                            fw={500}
                        >
                            {Math.abs(sampleStats.views.growth)}%
                        </Text>
                        <Text size="xs" c="dimmed">
                            지난 달 대비
                        </Text>
                    </Group>
                </Card>
            </SimpleGrid>

            <Grid>
                {/* 시스템 상태 */}
                <Grid.Col span={6}>
                    <Card shadow="xs" padding="lg" radius="md" withBorder h="400px">
                        <Group justify="apart" mb="lg">
                            <Text fw={600} size="lg">시스템 상태</Text>
                            <Badge
                                color={getStatusColor(sampleSystemStatus.status)}
                                leftSection={getStatusIcon(sampleSystemStatus.status)}
                            >
                                {sampleSystemStatus.status === 'healthy' ? '정상' : '문제 있음'}
                            </Badge>
                        </Group>

                        <Stack spacing="md">
                            {sampleSystemStatus.services.map((service, index) => (
                                <Group key={index} justify="apart">
                                    <Group>
                                        <Box
                                            w={8}
                                            h={8}
                                            bg={getStatusColor(service.status)}
                                            style={{ borderRadius: '50%' }}
                                        />
                                        <Text fw={500}>{service.name}</Text>
                                    </Group>
                                    <Text size="sm" c="dimmed">
                                        {service.uptime}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>

                        <Text fw={600} mt="xl" mb="md">리소스 사용량</Text>
                        <Stack spacing="sm">
                            <Box>
                                <Group justify="apart" mb="xs">
                                    <Text size="sm">CPU</Text>
                                    <Text size="sm">{sampleSystemStatus.resources.cpu}%</Text>
                                </Group>
                                <Progress value={sampleSystemStatus.resources.cpu} color="blue" />
                            </Box>
                            <Box>
                                <Group justify="apart" mb="xs">
                                    <Text size="sm">메모리</Text>
                                    <Text size="sm">{sampleSystemStatus.resources.memory}%</Text>
                                </Group>
                                <Progress value={sampleSystemStatus.resources.memory} color="green" />
                            </Box>
                            <Box>
                                <Group justify="apart" mb="xs">
                                    <Text size="sm">디스크</Text>
                                    <Text size="sm">{sampleSystemStatus.resources.disk}%</Text>
                                </Group>
                                <Progress value={sampleSystemStatus.resources.disk} color="orange" />
                            </Box>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* 최근 활동 로그 */}
                <Grid.Col span={6}>
                    <Card shadow="xs" padding="lg" radius="md" withBorder h="400px">
                        <Group justify="apart" mb="lg">
                            <Text fw={600} size="lg">최근 활동</Text>
                            <Tooltip label="새로고침">
                                <ActionIcon
                                    variant="subtle"
                                    onClick={refetchStats}
                                    loading={logsLoading}
                                >
                                    <IconRefresh size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <Box style={{ maxHeight: 300, overflowY: 'auto' }}>
                            <Timeline active={sampleActivityLogs.length} bulletSize={24} lineWidth={2}>
                                {sampleActivityLogs.slice(0, 5).map((log) => (
                                    <Timeline.Item
                                        key={log.id}
                                        bullet={
                                            log.status === 'success' ? (
                                                <IconCheck size={12} />
                                            ) : (
                                                <IconX size={12} />
                                            )
                                        }
                                        title={
                                            <Group gap="xs">
                                                <Text fw={500} size="sm">
                                                    {log.action}
                                                </Text>
                                                <Badge
                                                    size="xs"
                                                    color={log.status === 'success' ? 'green' : 'red'}
                                                >
                                                    {log.status}
                                                </Badge>
                                            </Group>
                                        }
                                    >
                                        <Text c="dimmed" size="xs">
                                            {log.user} • {formatDate(log.timestamp)}
                                        </Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Box>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* 시스템 경고 */}
            {sampleSystemStatus.status !== 'healthy' && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                >
                    <Group justify="apart">
                        <div>
                            <Text fw={500}>시스템 문제 감지</Text>
                            <Text size="sm">
                                일부 서비스에 문제가 발생했습니다. 시스템 관리자에게 문의하세요.
                            </Text>
                        </div>
                        <Button variant="outline" color="red" size="sm">
                            자세히 보기
                        </Button>
                    </Group>
                </Alert>
            )}
        </Stack>
    );
};

export default AdminDashboard;