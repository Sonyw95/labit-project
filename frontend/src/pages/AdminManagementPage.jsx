import React, {useState, useMemo, useCallback, memo} from 'react';
import {
    Container,
    Tabs,
    Title,
    Group,
    Badge,
    Text,
    LoadingOverlay,
    Alert,
    ActionIcon,
    Tooltip,
    Box,
    Stack,
    useMantineColorScheme,
    rem,
} from '@mantine/core';
import {
    IconDashboard,
    IconNavigation,
    IconFolder,
    IconRefresh,
    IconAlertCircle, IconUser,
} from '@tabler/icons-react';
import { useAdminDashboardStats, useAdminSystemStatus } from "../hooks/api/useApi.js";
import NavigationManagement from "../components/admin/navigation/NavigationManagement.jsx";
import AssetManagement from "../components/admin/asset/AssetManagement.jsx";
// import AdminDashboard from "../components/admin/dashboard/AdminDashboard.jsx";
import AdminEdit from "../components/admin/AdminEdit.jsx";

const AdminManagementPage = memo(() => {
    console.log("ADMIN MANAGE MENT PAGE")
    const { colorScheme } = useMantineColorScheme();
    const [activeTab, setActiveTab] = useState('info');

    // velog 스타일 색상
    const themeColors = useMemo(() => ({
        primary: '#12B886',
        text: colorScheme === 'dark' ? '#ECECEC' : '#212529',
        subText: colorScheme === 'dark' ? '#ADB5BD' : '#495057',
        background: colorScheme === 'dark' ? '#1A1B23' : '#f8f9fa',
        border: colorScheme === 'dark' ? '#2B2D31' : '#E9ECEF',
        hover: colorScheme === 'dark' ? '#2B2D31' : '#F8F9FA',
        success: '#12B886',
        error: '#FA5252',
        warning: '#FD7E14',
    }), [colorScheme]);

    // API hooks (기존 유지)
    // const {
    //     data: dashboardStats,
    //     isLoading: statsLoading,
    //     refetch: refetchStats
    // } = useAdminDashboardStats();

    // const {
    //     data: systemStatus,
    //     isLoading: statusLoading
    // } = useAdminSystemStatus();

    // 탭 설정 (메모이제이션으로 리렌더링 방지)
    const adminTabs = useMemo(() => [
        {
            value: 'info',
            label: '관리자 정보 수정',
            icon: IconUser,
            component: AdminEdit
        },
        // {
        //     value: 'dashboard',
        //     label: '대시보드',
        //     icon: IconDashboard,
        //     component: AdminDashboard,
        // },
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
    ], []);

    // 데이터 새로고침 핸들러 (useCallback으로 리렌더링 방지)
    // const handleRefreshData = useCallback(() => {
    //     refetchStats();
    // }, [refetchStats]);

    // 시스템 상태 확인 (메모이제이션)
    // const isSystemHealthy = useMemo(() =>
    //     systemStatus?.status === 'healthy', [systemStatus?.status]
    // );

    // const isDataLoading = useMemo(() =>
    //     statsLoading || statusLoading, [statsLoading, statusLoading]
    // );
    // const isDataLoading = useMemo(() =>
    //      statusLoading, [statusLoading]
    // );

    // 시스템 상태 뱃지 컴포넌트
    // const SystemStatusBadge = useMemo(() => {
    //     if (!systemStatus) {
    //         return null;
    //     }
    //     return (
    //         <Badge
    //             size="md"
    //             radius="md"
    //             variant="filled"
    //             style={{
    //                 backgroundColor: isSystemHealthy ? themeColors.success : themeColors.error,
    //                 color: 'white',
    //                 fontWeight: 500,
    //             }}
    //             leftSection={
    //                 !isSystemHealthy && <IconAlertCircle size={14} />
    //             }
    //         >
    //             시스템 {isSystemHealthy ? '정상' : '오류'}
    //         </Badge>
    //     );
    // }, [systemStatus, isSystemHealthy, themeColors.success, themeColors.error]);

    // 새로고침 버튼 컴포넌트
    // const RefreshButton = useMemo(() => (
    //     <Tooltip label="데이터 새로고침" position="bottom">
    //         <ActionIcon
    //             variant="subtle"
    //             size="lg"
    //             radius="md"
    //             onClick={handleRefreshData}
    //             loading={isDataLoading}
    //             style={{
    //                 color: themeColors.subText,
    //                 backgroundColor: 'transparent',
    //                 transition: 'all 0.2s ease',
    //             }}
    //             onMouseEnter={(e) => {
    //                 e.currentTarget.style.backgroundColor = themeColors.hover;
    //                 e.currentTarget.style.color = themeColors.text;
    //             }}
    //             onMouseLeave={(e) => {
    //                 e.currentTarget.style.backgroundColor = 'transparent';
    //                 e.currentTarget.style.color = themeColors.subText;
    //             }}
    //         >
    //             <IconRefresh size={20} />
    //         </ActionIcon>
    //     </Tooltip>
    // ), [handleRefreshData, isDataLoading, themeColors]);

    return (
        <Box
            style={{
                backgroundColor: themeColors.background,
                minHeight: '100vh',
                transition: 'background-color 0.2s ease'
            }}
        >
            <Container size="xl" py="xl">
                <Stack gap="2rem">
                    {/* velog 스타일 헤더 */}
                    <Box
                        p="xl"
                        style={{
                            backgroundColor: themeColors.background,
                            borderBottom: `1px solid ${themeColors.border}`,
                            borderRadius: rem(12),
                            boxShadow: colorScheme === 'dark'
                                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                    >
                        <Group justify="space-between" align="flex-start" >
                            <Stack gap="xs">
                                <Title
                                    order={1}
                                    size="2rem"
                                    style={{
                                        color: themeColors.text,
                                        fontWeight: 700,
                                        letterSpacing: '-0.02em',
                                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    관리자 페이지
                                </Title>
                                <Text
                                    size="md"
                                    style={{
                                        color: themeColors.subText,
                                        fontWeight: 400,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    시스템 관리 및 콘텐츠 관리를 위한 관리자 도구
                                </Text>
                            </Stack>

                            <Group gap="md" align="flex-start">
                                {/*{SystemStatusBadge}*/}
                                {/*{RefreshButton}*/}
                            </Group>
                        </Group>

                        {/* 시스템 오류 알림 */}
                        {/*{!isSystemHealthy && (*/}
                        {/*    <Alert*/}
                        {/*        icon={<IconAlertCircle size={18} />}*/}
                        {/*        color="red"*/}
                        {/*        variant="light"*/}
                        {/*        mt="lg"*/}
                        {/*        radius="md"*/}
                        {/*        styles={{*/}
                        {/*            root: {*/}
                        {/*                backgroundColor: `${themeColors.error}10`,*/}
                        {/*                border: `1px solid ${themeColors.error}30`,*/}
                        {/*            },*/}
                        {/*            message: {*/}
                        {/*                color: themeColors.text,*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        시스템에 문제가 발생했습니다. 시스템 관리자에게 문의하세요.*/}
                        {/*    </Alert>*/}
                        {/*)}*/}
                    </Box>

                    {/* velog 스타일 탭 컨테이너 */}
                    <Box
                        style={{
                            backgroundColor: themeColors.background,
                            borderRadius: rem(12),
                            border: `1px solid ${themeColors.border}`,
                            boxShadow: colorScheme === 'dark'
                                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.06)',
                            overflow: 'hidden',
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={setActiveTab}
                            variant="unstyled"
                            keepMounted={false}
                        >
                            {/* velog 스타일 탭 리스트 */}
                            <Tabs.List
                                style={{
                                    backgroundColor: themeColors.hover,
                                    borderBottom: `1px solid ${themeColors.border}`,
                                    padding: rem(4),
                                    gap: rem(4),
                                }}
                            >
                                {adminTabs.map((tab) => (
                                    <Tabs.Tab
                                        key={tab.value}
                                        value={tab.value}
                                        leftSection={<tab.icon size={18} />}
                                        style={{
                                            flex: 1,
                                            padding: `${rem(12)} ${rem(16)}`,
                                            borderRadius: rem(8),
                                            fontSize: rem(14),
                                            fontWeight: 500,
                                            color: activeTab === tab.value ? 'white' : themeColors.subText,
                                            backgroundColor: activeTab === tab.value
                                                ? themeColors.primary
                                                : 'transparent',
                                            border: 'none',
                                            transition: 'all 0.2s ease',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (activeTab !== tab.value) {
                                                e.currentTarget.style.backgroundColor = themeColors.background;
                                                e.currentTarget.style.color = themeColors.text;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (activeTab !== tab.value) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = themeColors.subText;
                                            }
                                        }}
                                    >
                                        {tab.label}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {/* 탭 패널 */}
                            {adminTabs.map((tab) => (
                                <Tabs.Panel key={tab.value} value={tab.value}>
                                    <Box
                                        p="xl"
                                        pos="relative"
                                        style={{
                                            backgroundColor: themeColors.background,
                                            minHeight: '500px',
                                        }}
                                    >
                                        <LoadingOverlay
                                            // visible={isDataLoading}
                                            overlayProps={{
                                                blur: 2,
                                                backgroundOpacity: 0.3,
                                                color: themeColors.background,
                                            }}
                                            loaderProps={{
                                                color: themeColors.primary,
                                                size: 'lg'
                                            }}
                                        />
                                        <tab.component />
                                    </Box>
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
});

export default AdminManagementPage;