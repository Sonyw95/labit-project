import React, { memo, useMemo, useCallback } from 'react';
import { Box, Group, Text, Badge, Stack, Timeline, ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconCheck, IconX, IconRefresh } from '@tabler/icons-react';

const ActivityLogsCard = memo(({
                                   activityLogsData,
                                   themeColors,
                                   dark,
                                   refetchStats,
                                   logsLoading
                               }) => {
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleString('ko-KR');
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

    const timelineStyles = useMemo(() => ({
        itemBody: {
            paddingBottom: rem(16),
        },
        itemBullet: {
            backgroundColor: themeColors.section,
            border: `2px solid ${themeColors.border}`,
        }
    }), [themeColors]);

    const handleRefreshMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
        e.currentTarget.style.color = themeColors.text;
    }, [themeColors]);

    const handleRefreshMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = themeColors.subText;
    }, [themeColors]);

    const renderTimelineItem = useCallback((log) => {
        const bulletIcon = log.status === 'success' ? (
            <IconCheck size={14} aria-hidden="true" />
        ) : (
            <IconX size={14} aria-hidden="true" />
        );

        const bulletColor = log.status === 'success'
            ? themeColors.success
            : themeColors.error;

        const badgeStyles = {
            backgroundColor: bulletColor,
            color: 'white',
        };

        return (
            <Timeline.Item
                key={log.id}
                bullet={
                    <Box style={{ color: bulletColor }}>
                        {bulletIcon}
                    </Box>
                }
                title={
                    <Group gap="sm" wrap="nowrap">
                        <Text
                            fw={500}
                            size="sm"
                            style={{
                                color: themeColors.text,
                                flex: 1,
                            }}
                        >
                            {log.action}
                        </Text>
                        <Badge
                            size="xs"
                            radius="md"
                            variant="filled"
                            style={badgeStyles}
                            aria-label={`상태: ${log.status}`}
                        >
                            {log.status}
                        </Badge>
                    </Group>
                }
            >
                <Text
                    size="xs"
                    style={{ color: themeColors.subText }}
                >
                    {log.user} • {formatDate(log.timestamp)}
                </Text>
            </Timeline.Item>
        );
    }, [themeColors, formatDate]);

    const displayedLogs = useMemo(() =>
            activityLogsData.slice(0, 5)
        , [activityLogsData]);

    return (
        <Box
            p="xl"
            style={cardStyles}
            role="region"
            aria-labelledby="activity-logs-title"
        >
            <Group justify="space-between" mb="xl">
                <Text
                    id="activity-logs-title"
                    fw={700}
                    size="lg"
                    style={{ color: themeColors.text }}
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
                            color: themeColors.subText,
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={handleRefreshMouseEnter}
                        onMouseLeave={handleRefreshMouseLeave}
                        aria-label="활동 로그 새로고침"
                    >
                        <IconRefresh size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>

            <Box style={scrollContainerStyles}>
                <Timeline
                    active={activityLogsData.length}
                    bulletSize={24}
                    lineWidth={2}
                    styles={timelineStyles}
                    role="list"
                    aria-label="최근 활동 목록"
                >
                    {displayedLogs.map(renderTimelineItem)}
                </Timeline>
            </Box>
        </Box>
    );
});

ActivityLogsCard.displayName = 'ActivityLogsCard';

export default ActivityLogsCard;