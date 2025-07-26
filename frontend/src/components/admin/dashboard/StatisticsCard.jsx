import React, { memo } from 'react';
import { Box, Group, Text, rem } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

const StatisticsCard = memo(({
                                 title,
                                 value,
                                 growth,
                                 icon: Icon,
                                 color,
                                 velogColors,
                                 dark
                             }) => {
    const cardStyles = {
        backgroundColor: velogColors.section,
        border: `1px solid ${velogColors.border}`,
        borderRadius: rem(12),
        boxShadow: dark
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.06)',
    };

    const titleStyles = { color: velogColors.subText };
    const valueStyles = {
        color: velogColors.text,
        lineHeight: 1.2,
        marginBottom: rem(12)
    };
    const growthStyles = {
        color: growth > 0 ? velogColors.success : velogColors.error
    };
    const subTextStyles = { color: velogColors.subText };

    return (
        <Box
            p="xl"
            style={cardStyles}
            role="article"
            aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
            <Group justify="space-between" mb="md">
                <Text
                    id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
                    size="sm"
                    fw={500}
                    style={titleStyles}
                >
                    {title}
                </Text>
                <Icon
                    size={24}
                    style={{ color }}
                    aria-hidden="true"
                />
            </Group>

            <Text
                fw={700}
                size="2rem"
                style={valueStyles}
                aria-label={`${title} ${value.toLocaleString()}`}
            >
                {value.toLocaleString()}
            </Text>

            <Group gap="xs">
                {growth > 0 ? (
                    <IconTrendingUp
                        size={16}
                        style={{ color: velogColors.success }}
                        aria-hidden="true"
                    />
                ) : (
                    <IconTrendingDown
                        size={16}
                        style={{ color: velogColors.error }}
                        aria-hidden="true"
                    />
                )}
                <Text
                    size="sm"
                    fw={500}
                    style={growthStyles}
                    aria-label={`${growth > 0 ? '증가' : '감소'} ${Math.abs(growth)}퍼센트`}
                >
                    {Math.abs(growth)}%
                </Text>
                <Text
                    size="sm"
                    style={subTextStyles}
                >
                    지난 달 대비
                </Text>
            </Group>
        </Box>
    );
});

StatisticsCard.displayName = 'StatisticsCard';

export default StatisticsCard;