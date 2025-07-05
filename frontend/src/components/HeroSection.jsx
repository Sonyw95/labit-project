import React from 'react';
import {
    BackgroundImage,
    Box,
    Container,
    Stack,
    Badge,
    Title,
    Text,
    Group,
    Button,
    rem,
} from '@mantine/core';
import {
    IconChevronRight,
    IconUser,
} from '@tabler/icons-react';
import { banner, techStack } from '../constants/data';
import { BackgroundBlur, getTechConfig } from '../utils/helpers';

const HeroSection = ({ currentTech, dark }) => (
    <BackgroundImage src={banner}>
        <Box
            style={{
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                marginBottom: rem(60),
                ...BackgroundBlur({ color: '#000', alpha: 0.7})
            }}
        >
            <Container size="md" style={{ position: 'relative', zIndex: 10 }}>
                <Stack align="center" gap={rem(50)} style={{ textAlign: 'center' }}>
                    {/* Badge */}
                    <Badge
                        size="lg"
                        radius="xl"
                        style={{
                            background: '#4c6ef5',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            fontSize: rem(14),
                            fontWeight: 500,
                            animation: 'fadeInDown 0.8s ease-out',
                        }}
                    >
                        ✨ Welcome to LABit
                    </Badge>

                    {/* Main Headline */}
                    <Stack gap="md" align="center">
                        <Title
                            order={1}
                            style={{
                                fontSize: rem(64),
                                fontWeight: 300,
                                lineHeight: 1.1,
                                color: '#fff',
                                animation: 'fadeInUp 0.8s ease-out 0.2s both',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Let's Learn
                        </Title>

                        <Box style={{ position: 'relative', height: rem(80) }}>
                            <Title
                                order={1}
                                style={{
                                    fontSize: rem(80),
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    color: getTechConfig(techStack[currentTech], true).color,
                                    animation: 'smoothChange 0.6s ease-in-out',
                                    letterSpacing: '-0.03em',
                                }}
                                key={currentTech}
                            >
                                {techStack[currentTech]}
                            </Title>
                        </Box>
                    </Stack>

                    {/* Description */}
                    <Text
                        size="xl"
                        style={{
                            maxWidth: 600,
                            lineHeight: 1.6,
                            color: '#94a3b8',
                            fontWeight: 400,
                            animation: 'fadeInUp 0.8s ease-out 0.6s both',
                        }}
                    >
                        풀스택 개발자의 학습 여정을 기록하며,
                        <Text span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            실무 경험과 인사이트
                        </Text>를 공유하는 공간입니다.
                    </Text>

                    {/* Tech Stack Indicators */}
                    <Group justify="center" gap="xl" style={{ animation: 'fadeInUp 0.8s ease-out 0.8s both' }}>
                        {techStack.map((tech, index) => {
                            const config = getTechConfig(tech, currentTech === index);
                            return (
                                <Stack key={tech} align="center" gap="xs">
                                    <Box
                                        style={{
                                            width: rem(60),
                                            height: rem(60),
                                            borderRadius: '50%',
                                            background: currentTech === index ? '#4c6ef5' : '#21262d',
                                            border: currentTech === index ? '3px solid #60a5fa' : '3px solid #30363d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: rem(24),
                                            transition: 'all 0.5s ease',
                                            transform: currentTech === index ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        {config.icon}
                                    </Box>
                                    <Text
                                        size="sm"
                                        style={{
                                            color: currentTech === index ? '#e2e8f0' : '#9ca3af',
                                            fontWeight: currentTech === index ? 600 : 400,
                                            transition: 'all 0.5s ease',
                                        }}
                                    >
                                        {tech}
                                    </Text>
                                </Stack>
                            );
                        })}
                    </Group>

                    {/* Action Buttons */}
                    {/*<Group gap="md" style={{ animation: 'fadeInUp 0.8s ease-out 1s both' }}>*/}
                    {/*    <Button*/}
                    {/*        size="lg"*/}
                    {/*        radius="xl"*/}
                    {/*        rightSection={<IconChevronRight size={18} />}*/}
                    {/*        style={{*/}
                    {/*            background: '#4c6ef5',*/}
                    {/*            color: 'white',*/}
                    {/*            border: 'none',*/}
                    {/*            padding: '12px 32px',*/}
                    {/*            fontSize: rem(16),*/}
                    {/*            fontWeight: 500,*/}
                    {/*            boxShadow: 'none',*/}
                    {/*            transition: 'all 0.3s ease',*/}
                    {/*            '&:hover': {*/}
                    {/*                background: '#3b82f6',*/}
                    {/*                transform: 'translateY(-2px)',*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        블로그 둘러보기*/}
                    {/*    </Button>*/}

                    {/*    <Button*/}
                    {/*        size="lg"*/}
                    {/*        radius="xl"*/}
                    {/*        variant="outline"*/}
                    {/*        leftSection={<IconUser size={18} />}*/}
                    {/*        style={{*/}
                    {/*            padding: '12px 32px',*/}
                    {/*            fontSize: rem(16),*/}
                    {/*            fontWeight: 500,*/}
                    {/*            background: 'transparent',*/}
                    {/*            color: '#8b949e',*/}
                    {/*            border: '2px solid #30363d',*/}
                    {/*            transition: 'all 0.3s ease',*/}
                    {/*            '&:hover': {*/}
                    {/*                background: 'rgba(255, 255, 255, 0.1)',*/}
                    {/*                transform: 'translateY(-2px)',*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        개발자 소개*/}
                    {/*    </Button>*/}
                    {/*</Group>*/}

                    {/* Progress Indicator */}
                    <Box style={{ animation: 'fadeInUp 0.8s ease-out 1.2s both' }}>
                        <Group gap="xs" justify="center">
                            {techStack.map((_, index) => (
                                <Box
                                    key={index}
                                    style={{
                                        width: currentTech === index ? rem(24) : rem(8),
                                        height: rem(4),
                                        borderRadius: rem(2),
                                        background: currentTech === index ? '#4c6ef5' : '#6b7280',
                                        transition: 'all 0.5s ease',
                                    }}
                                />
                            ))}
                        </Group>
                    </Box>

                    {/* Scroll Hint */}
                    <Box
                        style={{
                            marginTop: rem(60),
                            animation: 'fadeInUp 0.8s ease-out 1.4s both',
                        }}
                    >
                        <Stack align="center" gap="xs">
                            <Text size="sm" c="dimmed">
                                스크롤하여 더 많은 콘텐츠 보기
                            </Text>
                            <Box
                                style={{
                                    width: rem(1),
                                    height: rem(40),
                                    background: '#30363d',
                                    borderRadius: rem(1),
                                    animation: 'gentlePulse 2s ease-in-out infinite',
                                }}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    </BackgroundImage>
);

export default HeroSection;