import React from 'react';
import { UnstyledButton, Group, Badge, Text, rem, useMantineColorScheme } from '@mantine/core';

const TagItem = ({ tag }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const getTagColor = (color) => {
        switch (color) {
            case 'blue': return '#3b82f6';
            case 'green': return '#10b981';
            case 'orange': return '#f59e0b';
            case 'indigo': return '#6366f1';
            case 'yellow': return '#eab308';
            default: return '#6b7280';
        }
    };

    return (
        <UnstyledButton
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: rem(8),
                borderRadius: rem(6),
                transition: 'all 0.3s ease',
                '&:hover': {
                    background: dark ? '#21262d' : '#f3f4f6',
                }
            }}
        >
            <Group gap="xs">
                <Badge
                    size="xs"
                    style={{
                        background: getTagColor(tag.color),
                        color: 'white'
                    }}
                >
                    {tag.name}
                </Badge>
            </Group>
            <Text size="xs" c="dimmed">
                {tag.count}
            </Text>
        </UnstyledButton>
    );
};

export default TagItem;