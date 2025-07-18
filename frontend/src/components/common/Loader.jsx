import React from 'react';
import {
    Center,
    Stack,
    Box,
    RingProgress,
    ThemeIcon,
    Text,
    useMantineColorScheme,
} from '@mantine/core';
import { IconCode } from '@tabler/icons-react';

const CustomLoader = ({ progress }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
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
                    <Box
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 140,
                            height: 140,
                            animation: 'rotate 3s linear infinite',
                        }}
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: dark ? '#4c6ef5' : '#339af0',
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-70px)`,
                                    boxShadow: 'none',
                                    animation: `pulse 1s ease-in-out infinite ${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </Box>
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

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    @keyframes rotate {
                        from { transform: translate(-50%, -50%) rotate(0deg); }
                        to { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    
                    @keyframes pulse {
                        0%, 100% { 
                            opacity: 1; 
                            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1);
                        }
                        50% { 
                            opacity: 0.5; 
                            transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1.2);
                        }
                    }
                    
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </Center>
    );
};

export default CustomLoader;