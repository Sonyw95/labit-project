import React, { useEffect, useState} from "react";
import {
    Container,
    BackgroundImage,
    Badge,
    Box,
    rem,
    Stack,
    Title,
    Group,
    Text,
    Grid,
} from "@mantine/core";
import {BackgroundBlur} from "@/utils/BackgroundBlur.jsx";
import banner from "../../assets/banner/banner.gif"
import {useOutletContext} from "react-router-dom";
import PostCardList from "@/components/section/PostCardList.jsx";

export default function (){
    const { dark, loading } = useOutletContext();
    const [currentTech, setCurrentTech] = useState(0);
    const techStack = ['Java', 'Spring', 'React'];

    // 기술 스택 텍스트 변경 효과
    useEffect(() => {
        if (!loading) {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);

            return () => clearInterval(techTimer);
        }
    }, [loading, techStack.length]);
    return (
        <>
            <BackgroundImage
                src={banner}
                style={{
                    animation: 'fadeInDown 0.8s ease-out',
                }}
            >
                <Box
                    style={{
                        minHeight: '100vh',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: rem(60),
                        ...BackgroundBlur({color: '#000', alpha: 0.7})
                    }}
                >
                    <Container size="md" style={{position: 'relative', zIndex: 10, marginTop: rem(40)}} >
                        <Stack align="center" gap={rem(50)} style={{textAlign: 'center'}}>
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
                                ✨ 환영합니다.
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
                                    To Record, To Share
                                </Title>

                                <Box style={{position: 'relative', height: rem(80)}}>
                                    <Title
                                        order={1}
                                        style={{
                                            fontSize: rem(80),
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            color: currentTech === 0
                                                ? '#f59e0b' // Java
                                                : currentTech === 1
                                                    ? '#10b981' // Spring
                                                    : '#3b82f6', // React
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
                                <Text span style={{color: '#e2e8f0', fontWeight: 500}}>
                                    실무 경험과 인사이트
                                </Text>를 공유하는 공간입니다.
                            </Text>

                            {/* Tech Stack Indicators */}
                            <Group justify="center" gap="xl" style={{animation: 'fadeInUp 0.8s ease-out 0.8s both'}}>
                                {[
                                    {name: 'Java', icon: '☕', active: currentTech === 0},
                                    {name: 'Spring', icon: '🍃', active: currentTech === 1},
                                    {name: 'React', icon: '⚛️', active: currentTech === 2},
                                ].map((tech) => (
                                    <Stack key={tech.name} align="center" gap="xs">
                                        <Box
                                            style={{
                                                width: rem(60),
                                                height: rem(60),
                                                borderRadius: '50%',
                                                background: tech.active ? '#4c6ef5' : '#21262d',  // 매우 어두운 비활성 색상
                                                border: tech.active ? '3px solid #60a5fa' : '3px solid #30363d',  // 어두운 보더
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: rem(24),
                                                transition: 'all 0.5s ease',
                                                transform: tech.active ? 'scale(1.1)' : 'scale(1)',
                                                boxShadow: 'none', // 플랫 디자인: 그림자 제거
                                            }}
                                        >
                                            {tech.icon}
                                        </Box>
                                        <Text
                                            size="sm"
                                            style={{
                                                color: tech.active ? '#e2e8f0' : '#9ca3af',
                                                fontWeight: tech.active ? 600 : 400,
                                                transition: 'all 0.5s ease',
                                            }}
                                        >
                                            {tech.name}
                                        </Text>
                                    </Stack>
                                ))}
                            </Group>

                            {/* Action Buttons */}
                            {/*<Group gap="md" style={{animation: 'fadeInUp 0.8s ease-out 1s both'}}>*/}
                            {/*    <Button*/}
                            {/*        size="lg"*/}
                            {/*        radius="xl"*/}
                            {/*        rightSection={<IconChevronRight size={18}/>}*/}
                            {/*        style={{*/}
                            {/*            background: '#4c6ef5',*/}
                            {/*            color: 'white',*/}
                            {/*            border: 'none',*/}
                            {/*            padding: '12px 32px',*/}
                            {/*            fontSize: rem(16),*/}
                            {/*            fontWeight: 500,*/}
                            {/*            boxShadow: 'none', // 플랫 디자인: 그림자 제거*/}
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
                            {/*        leftSection={<IconUser size={18}/>}*/}
                            {/*        style={{*/}
                            {/*            padding: '12px 32px',*/}
                            {/*            fontSize: rem(16),*/}
                            {/*            fontWeight: 500,*/}
                            {/*            background: 'transparent',*/}
                            {/*            color: '#8b949e',  // 어두운 테마의 텍스트*/}
                            {/*            border: '2px solid #30363d',  // 어두운 보더*/}
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
                            <Box style={{animation: 'fadeInUp 0.8s ease-out 1.2s both'}}>
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
                                            background: '#30363d',  // 어두운 그레이
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

            <Container size="lg">

                <Stack gap="xl" mb="xl">
                    <Box ta="center">
                        <Text
                            fw={900}
                            style={{
                                backgroundImage: !dark
                                    ? 'linear-gradient(135deg, var(--mantine-color-dark-6),  var(--mantine-color-gray-6))'
                                    : 'linear-gradient(135deg, var(--mantine-color-dark-1),  var(--mantine-color-gray-3))',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                textShadow: !dark
                                    ? '0 4px 20px rgba(0, 0, 0, 0.1)'
                                    : '0 4px 20px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            최신 게시글
                        </Text>
                        <Text
                            size="lg"
                            c="dimmed"
                            mt="sm"
                            style={{
                                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}
                        >
                            최신 기술 트렌드와 인사이트를 담은 포스트들을 만나보세요.
                        </Text>
                    </Box>
                </Stack>
                <PostCardList opts={{
                    maxCount: 6,
                    category: 'all',
                }} dark={dark}/>
                {/* 더 보기 버튼 */}
                <Group justify="center" mt="xl" mb="xl">
                    <Badge
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'violet', deg: 135 }}
                        size="xl"
                        style={{
                            cursor: 'pointer',
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        더 많은 포스트 보기
                    </Badge>
                </Group>
            </Container>
            <style>
                {`
                            @keyframes float {
                                0%, 100% { transform: translateY(0px); }
                                50% { transform: translateY(-10px); }
                            }
                            
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
                            
                            @keyframes fadeInDown {
                                from {
                                    opacity: 0;
                                    transform: translateY(-20px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
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
                            
                            @keyframes smoothChange {
                                0% { 
                                    opacity: 0; 
                                    transform: scale(0.95); 
                                }
                                100% { 
                                    opacity: 1; 
                                    transform: scale(1); 
                                }
                            }
                            
                            @keyframes gentlePulse {
                                0%, 100% { opacity: 0.5; }
                                50% { opacity: 1; }
                            }
                            @keyframes play {
                              to {
                                background-position: 100% 0;
                              }
                            }
                        `}
            </style>
        </>
    );
}