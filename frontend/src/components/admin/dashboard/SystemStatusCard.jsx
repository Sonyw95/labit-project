import React, { memo, useMemo, useCallback } from 'react';
import { Box, Group, Text, Badge, Stack, Progress, rem } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconX, IconClock } from '@tabler/icons-react';

const SystemStatusCard = memo(({
                                   systemStatusData,
                                   themeColors,
                                   dark
                               }) => {
    const getStatusColor = useCallback((status) => {
        switch (status) {
            case 'healthy': return themeColors.success;
            case 'warning': return themeColors.warning;
            case 'error': return themeColors.error;
            default: return themeColors.subText;
        }
    }, [themeColors]);

    const getStatusIcon = useCallback((status) => {
        const iconProps = { size: 16, 'aria-hidden': true };
        switch (status) {
            case 'healthy': return <IconCheck {...iconProps} />;
            case 'warning': return <IconAlertCircle {...iconProps} />;
            case 'error': return <IconX {...iconProps} />;
            default: return <IconClock {...iconProps} />;
        }
    }, []);

    const getStatusText = useCallback((status) => {
        return status === 'healthy' ? '정상' : '문제 있음';
    }, []);

    const cardStyles = useMemo(() => ({
        backgroundColor: themeColors.section,
        border: `1px solid ${themeColors.border}`,
        borderRadius: rem(12),
        boxShadow: dark
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.06)',
        height: rem(450),
    }), [themeColors, dark]);

    const scrollContainerStyles = useMemo(() => ({
        maxHeight: rem(320),
        overflowY: 'auto',
        paddingRight: rem(8),
    }), []);

    const badgeStyles = useMemo(() => ({
        backgroundColor: getStatusColor(systemStatusData.status),
        color: 'white',
    }), [getStatusColor, systemStatusData.status]);

    const resourceConfigs = useMemo(() => [
        { name: 'CPU', value: systemStatusData.resources.cpu, color: '#339AF0' }, // info 색상 직접 정의
        { name: '메모리', value: systemStatusData.resources.memory, color: themeColors.success },
        { name: '디스크', value: systemStatusData.resources.disk, color: themeColors.warning },
    ], [systemStatusData.resources, themeColors]);

    return (
        <Box
            p="xl"
            style={cardStyles}
            role="region"
            aria-labelledby="system-status-title"
        >
            <Group justify="space-between" mb="xl">
                <Text
                    id="system-status-title"
                    fw={700}
                    size="lg"
                    style={{ color: themeColors.text }}
                >
                    시스템 상태
                </Text>
                <Badge
                    size="md"
                    radius="md"
                    variant="filled"
                    style={badgeStyles}
                    leftSection={getStatusIcon(systemStatusData.status)}
                    aria-label={`시스템 상태: ${getStatusText(systemStatusData.status)}`}
                >
                    {getStatusText(systemStatusData.status)}
                </Badge>
            </Group>

            <Box style={scrollContainerStyles}>
                <Stack gap="lg" mb="xl">
                    <Text
                        fw={600}
                        style={{ color: themeColors.text }}
                        id="services-list-title"
                    >
                        서비스 목록
                    </Text>
                    {systemStatusData.services.map((service, index) => (
                        <Group
                            key={`${service.name}-${index}`}
                            justify="space-between"
                            role="listitem"
                        >
                            <Group gap="sm">
                                <Box
                                    w={10}
                                    h={10}
                                    style={{
                                        backgroundColor: getStatusColor(service.status),
                                        borderRadius: '50%',
                                    }}
                                    aria-label={`${service.name} 상태: ${service.status}`}
                                />
                                <Text
                                    fw={500}
                                    style={{ color: themeColors.text }}
                                >
                                    {service.name}
                                </Text>
                            </Group>
                            <Text
                                size="sm"
                                style={{ color: themeColors.subText }}
                                aria-label={`가동률: ${service.uptime}`}
                            >
                                {service.uptime}
                            </Text>
                        </Group>
                    ))}
                </Stack>

                <Text
                    fw={600}
                    mb="lg"
                    style={{ color: themeColors.text }}
                    id="resources-title"
                >
                    리소스 사용량
                </Text>
                <Stack gap="md" role="list" aria-labelledby="resources-title">
                    {resourceConfigs.map((resource, index) => (
                        <Box key={`${resource.name}-${index}`} role="listitem">
                            <Group justify="space-between" mb="xs">
                                <Text
                                    size="sm"
                                    style={{ color: themeColors.text }}
                                >
                                    {resource.name}
                                </Text>
                                <Text
                                    size="sm"
                                    fw={500}
                                    style={{ color: themeColors.text }}
                                    aria-label={`${resource.name} 사용률: ${resource.value}퍼센트`}
                                >
                                    {resource.value}%
                                </Text>
                            </Group>
                            <Progress
                                value={resource.value}
                                size="md"
                                radius="md"
                                style={{
                                    backgroundColor: themeColors.border,
                                }}
                                styles={{
                                    bar: {
                                        backgroundColor: resource.color,
                                    }
                                }}
                                aria-label={`${resource.name} 진행률 ${resource.value}퍼센트`}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
});

SystemStatusCard.displayName = 'SystemStatusCard';

export default SystemStatusCard;