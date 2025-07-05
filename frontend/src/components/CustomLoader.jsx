import React from 'react';
import {
    Center,
    Stack,
    Box,
    RingProgress,
    ThemeIcon,
    Text,
} from '@mantine/core';
import { IconCode } from '@tabler/icons-react';

const CustomLoader = ({ progress, dark }) => (
    <Center style={{ height: '100vh' }}>
        <Stack align="center" gap="xl">
            <Box style={{ position: 'relative' }}>
                <RingProgress
                    size={120}
                    thickness={8}
                    sections={[
                        {
                            value: progress,
                            color: dark ? '#4c6ef5' : '#339af0',
                        }
                    ]}
                    label={
                        <Center>
                            <ThemeIcon
                                size="xl"
                                radius="xl"
                                style={{
                                    background: dark ? '#4c6ef5' : '#339af0',
                                    animation: 'spin 2s linear infinite',
                                    boxShadow: 'none',
                                }}
                            >
                                <IconCode size={24} />
                            </ThemeIcon>
                        </Center>
                    }
                    style={{
                        filter: 'none',
                    }}
                />

                {/* 주변 회전하는 점들 */}
            </Box>

            <Stack align="center" gap="xs">
                <Text
                    size="xl"
                    fw={700}
                    style={{
                        color: dark ? '#ffffff' : '#1e293b',
                        animation: 'fadeInUp 0.8s ease-out',
                    }}
                >
                    LABit
                </Text>
                <Text
                    size="sm"
                    c="dimmed"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.2s both',
                    }}
                >
                    기술과 성장의 기록을 불러오는 중...
                </Text>
                <Text
                    size="xs"
                    c="dimmed"
                    style={{
                        animation: 'fadeInUp 0.8s ease-out 0.4s both',
                    }}
                >
                    {Math.round(progress)}%
                </Text>
            </Stack>
        </Stack>
    </Center>
);

export default CustomLoader;