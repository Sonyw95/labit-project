import React, { memo } from 'react';
import { Box, Group, Text, rem } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

const StatisticsCard = memo(({
                                 title,
                                 value,
                                 growth,
                                 icon: Icon,
                                 color,
                                 themeColors,
                                 dark
                             }) => {
    const cardStyles = {
        backgroundColor: themeColors.section,
        border: `1px solid ${themeColors.border}`,
        borderRadius: rem(12),
        boxShadow: dark
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.06)',
    };

    const titleStyles = { color: themeColors.subText };
    const valueStyles = {
        color: themeColors.text,
        lineHeight: 1.2,
        marginBottom: rem(12)
    };
    const growthStyles = {
        color: growth > 0 ? themeColors.success : themeColors.error
    };
    const subTextStyles = { color: themeColors.subText };

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
                        style={{ color: themeColors.success }}
                        aria-hidden="true"
                    />
                ) : (
                    <IconTrendingDown
                        size={16}
                        style={{ color: themeColors.error }}
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