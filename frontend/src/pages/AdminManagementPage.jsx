import React, { useState } from 'react';
import {
    Container,
    Tabs,
    Title,
    Paper,
    Group,
    Badge,
    Text,
    LoadingOverlay,
    Alert,
    ActionIcon,
    Tooltip, Box,
} from '@mantine/core';
import {
    IconDashboard,
    IconNavigation,
    IconFolder,
    IconRefresh,
    IconAlertCircle,
} from '@tabler/icons-react';
import {useAdminDashboardStats, useAdminSystemStatus} from "../hooks/api/useApi.js";
import NavigationManagement from "../components/admin/NavigationManagement.jsx";
import AssetManagement from "../components/admin/AssetManagement.jsx";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";

const AdminManagementPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const {
        data: dashboardStats,
        isLoading: statsLoading,
        refetch: refetchStats
    } = useAdminDashboardStats();

    const {
        data: systemStatus,
        isLoading: statusLoading
    } = useAdminSystemStatus();

    const handleRefreshData = () => {
        refetchStats();
    };

    const tabs = [
        {
            value: 'dashboard',
            label: '대시보드',
            icon: IconDashboard,
            component: AdminDashboard,
        },
        {
            value: 'navigation',
            label: '네비게이션 관리',
            icon: IconNavigation,
            component: NavigationManagement,
        },
        {
            value: 'assets',
            label: '에셋 관리',
            icon: IconFolder,
            component: AssetManagement,
        },
    ];

    return (
        <Container size="xl" py="xl">
            <Paper shadow="sm" p="md" radius="md" mb="xl">
                <Group justify="space-between" mb="lg">
                    <Box>
                        <Title order={1} size="h2" mb="xs">
                            관리자 페이지
                        </Title>
                        <Text c="dimmed" size="sm">
                            시스템 관리 및 콘텐츠 관리를 위한 관리자 도구
                        </Text>
                    </Box>

                    <Group>
                        {systemStatus && (
                            <Badge
                                color={systemStatus.status === 'healthy' ? 'green' : 'red'}
                                variant="filled"
                                leftSection={
                                    systemStatus.status !== 'healthy' &&
                                    <IconAlertCircle size={12} />
                                }
                            >
                                시스템 {systemStatus.status === 'healthy' ? '정상' : '오류'}
                            </Badge>
                        )}

                        <Tooltip label="데이터 새로고침">
                            <ActionIcon
                                variant="subtle"
                                onClick={handleRefreshData}
                                loading={statsLoading || statusLoading}
                            >
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                {systemStatus?.status !== 'healthy' && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        color="red"
                        variant="light"
                        mb="md"
                    >
                        시스템에 문제가 발생했습니다. 시스템 관리자에게 문의하세요.
                    </Alert>
                )}
            </Paper>

            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="outline"
                radius="md"
            >
                <Tabs.List grow mb="xl">
                    {tabs.map((tab) => (
                        <Tabs.Tab
                            key={tab.value}
                            value={tab.value}
                            leftSection={<tab.icon size={16} />}
                        >
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {tabs.map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value}>
                        <Paper shadow="xs" p="lg" radius="md" pos="relative">
                            <LoadingOverlay
                                visible={statsLoading || statusLoading}
                                overlayProps={{ blur: 2 }}
                            />
                            <tab.component />
                        </Paper>
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Container>
    );
};

export default AdminManagementPage;