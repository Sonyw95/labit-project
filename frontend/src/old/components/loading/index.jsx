import React from 'react';
import {
    Center,
    Stack,
    Box,
    Text,
    ThemeIcon,
    RingProgress,
} from '@mantine/core';
import Logo from "@/components/logo/index.jsx";

const CustomLoader = ({ progress, dark }) => {
    return (
        <Box
            style={{
                height: '100vh',
                background: dark ? '#000000' : '#f8fafc',
                overflow: 'hidden',
            }}
        >
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
                                        <Logo
                                            isLogo
                                            radius="xl"
                                            size="sm"
                                            dark={dark}
                                        />
                                    </ThemeIcon>
                                </Center>
                            }
                            style={{
                                filter: 'none',
                            }}
                        />
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
        </Box>
    );
};

export default CustomLoader;