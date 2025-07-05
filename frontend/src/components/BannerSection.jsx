import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Stack,
    Title,
    Text,
    Group,
    Badge,
    Button,
    ActionIcon,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconChevronRight,
    IconUser,
    IconStar,
    IconTrendingUp,
    IconUsers,
    IconArrowDown, IconDevicesCode,
} from '@tabler/icons-react';
import {BackgroundBlur} from "@/utils/helpers.js";

const BannerSection = ({
                                   title = "LABit",
                                   subtitle = "기술과 성장의 기록",
                                   description = "풀스택 개발자의 학습 여정을 기록하며, 실무 경험과 인사이트를 공유하는 공간입니다.",
                                   backgroundImage,
                                   stats = [],
                                   techStack = ['Java', 'Spring', 'React'],
                                   onPrimaryAction,
                                   onSecondaryAction,
                                   showScrollIndicator = true,
                                   variant = "hero", // hero, simple, stats
                                   // 타이핑 효과 관련 props
                                   enableTyping = false,
                                   typingTexts = [],
                                   typingSpeed = 100,
                                   deleteSpeed = 50,
                                   pauseTime = 2000,
                                   loop = true,
                               }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [currentTech, setCurrentTech] = useState(0);
    const [mounted, setMounted] = useState(false);

    // 타이핑 효과 상태
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // 기본 타이핑 텍스트
    const defaultTypingTexts = [
        "개발 경험을 공유합니다",
        "새로운 기술을 탐구합니다",
        "코드 품질을 추구합니다",
        "팀과 함께 성장합니다"
    ];

    const textsToType = typingTexts.length > 0 ? typingTexts : defaultTypingTexts;

    // 마운트 애니메이션
    useEffect(() => {
        setMounted(true);
    }, []);

    // 기술 스택 텍스트 변경 효과 (Hero variant에서만)
    useEffect(() => {
        if (mounted && techStack.length > 1 && variant === "hero") {
            const techTimer = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);
            return () => clearInterval(techTimer);
        }
    }, [mounted, techStack.length, variant]);

    // 타이핑 효과
    useEffect(() => {
        if (!enableTyping || !mounted || variant !== "simple") return;

        const currentFullText = textsToType[currentIndex];

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // 타이핑 중
                if (currentText.length < currentFullText.length) {
                    setCurrentText(currentFullText.slice(0, currentText.length + 1));
                } else {
                    // 타이핑 완료
                    if (loop || currentIndex < textsToType.length - 1) {
                        setTimeout(() => {
                            setIsDeleting(true);
                        }, pauseTime);
                    }
                }
            } else {
                // 삭제 중
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1));
                } else {
                    // 삭제 완료, 다음 텍스트로
                    setIsDeleting(false);
                    setCurrentIndex((prev) =>
                        loop ? (prev + 1) % textsToType.length : Math.min(prev + 1, textsToType.length - 1)
                    );
                }
            }
        }, isDeleting ? deleteSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentIndex, enableTyping, mounted, loop, pauseTime, typingSpeed, deleteSpeed, textsToType, variant]);

    // 기본 통계 데이터
    const defaultStats = [
        { icon: IconDevicesCode, label: '게시글', value: '42+', color: '#3b82f6' },
        { icon: IconUsers, label: '독자', value: '1.2K+', color: '#10b981' },
        { icon: IconStar, label: '좋아요', value: '350+', color: '#f59e0b' },
        { icon: IconTrendingUp, label: '조회수', value: '25K+', color: '#ef4444' },
    ];

    const displayStats = stats.length > 0 ? stats : defaultStats;

    // 기본 배경 이미지
    const defaultBg = backgroundImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop';

    const getTechColor = (index) => {
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
        return colors[index % colors.length];
    };

    // Hero 버전 (메인 페이지용)
    if (variant === "hero") {
        return (
            <Box
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    marginBottom: rem(40),
                }}
            >
                {/* Background */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${defaultBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                    }}
                />

                {/* Overlay */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        ...BackgroundBlur({ color: '#000', alpha: 0.7})

                    }}
                />

                {/* Content */}
                <Container
                    size="lg"
                    style={{
                        height: '100vh',
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Stack gap={rem(50)} style={{ textAlign: 'center', width: '100%' }}>
                        {/* Welcome Badge */}
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
                                animation: mounted ? 'fadeInDown 0.8s ease-out' : 'none',
                                alignSelf: 'center',
                            }}
                        >
                            ✨ Welcome to {title}
                        </Badge>

                        {/* Main Title */}
                        <Stack gap="md" align="center">
                            <Title
                                order={1}
                                style={{
                                    fontSize: rem(64),
                                    fontWeight: 300,
                                    lineHeight: 1.1,
                                    color: '#fff',
                                    animation: mounted ? 'fadeInUp 0.8s ease-out 0.2s both' : 'none',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Let's learn
                            </Title>

                            {/* Dynamic Tech Stack */}
                            <Box style={{ position: 'relative', height: rem(80) }}>
                                <Title
                                    order={1}
                                    style={{
                                        fontSize: rem(80),
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        color: getTechColor(currentTech),
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
                                animation: mounted ? 'fadeInUp 0.8s ease-out 0.6s both' : 'none',
                                margin: '0 auto',
                            }}
                        >
                            {description}
                        </Text>

                        {/* Tech Stack Indicators */}
                        <Group
                            justify="center"
                            gap="xl"
                            style={{
                                animation: mounted ? 'fadeInUp 0.8s ease-out 0.8s both' : 'none',
                            }}
                        >
                            {techStack.map((tech, index) => (
                                <Stack key={tech} align="center" gap="xs">
                                    <Box
                                        style={{
                                            width: rem(60),
                                            height: rem(60),
                                            borderRadius: '50%',
                                            background: currentTech === index ? getTechColor(index) : '#21262d',
                                            border: currentTech === index
                                                ? `3px solid ${getTechColor(index)}40`
                                                : '3px solid #30363d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: rem(24),
                                            transition: 'all 0.5s ease',
                                            transform: currentTech === index ? 'scale(1.1)' : 'scale(1)',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        {index === 0 ? '☕' : index === 1 ? '🍃' : '⚛️'}
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
                            ))}
                        </Group>

                        {/* Action Buttons */}
                        <Group
                            gap="md"
                            justify="center"
                            style={{
                                animation: mounted ? 'fadeInUp 0.8s ease-out 1s both' : 'none',
                            }}
                        >
                            <Button
                                size="lg"
                                radius="xl"
                                rightSection={<IconChevronRight size={18} />}
                                onClick={onPrimaryAction}
                                style={{
                                    background: '#4c6ef5',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 32px',
                                    fontSize: rem(16),
                                    fontWeight: 500,
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: '#3b82f6',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                블로그 둘러보기
                            </Button>

                            <Button
                                size="lg"
                                radius="xl"
                                variant="outline"
                                leftSection={<IconUser size={18} />}
                                onClick={onSecondaryAction}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: rem(16),
                                    fontWeight: 500,
                                    background: 'transparent',
                                    color: '#8b949e',
                                    border: '2px solid #30363d',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                개발자 소개
                            </Button>
                        </Group>

                        {/* Progress Indicator */}
                        <Box style={{
                            animation: mounted ? 'fadeInUp 0.8s ease-out 1.2s both' : 'none',
                        }}>
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

                        {/* Scroll Indicator */}
                        {showScrollIndicator && (
                            <Box
                                style={{
                                    marginTop: rem(60),
                                    animation: mounted ? 'fadeInUp 0.8s ease-out 1.4s both' : 'none',
                                }}
                            >
                                <Stack align="center" gap="xs">
                                    <Text size="sm" c="dimmed">
                                        스크롤하여 더 많은 콘텐츠 보기
                                    </Text>
                                    <ActionIcon
                                        variant="transparent"
                                        size="lg"
                                        style={{
                                            color: '#94a3b8',
                                            animation: 'bounce 2s infinite',
                                        }}
                                    >
                                        <IconArrowDown size={24} />
                                    </ActionIcon>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Box>
        );
    }

    // Simple 버전 (서브 페이지용) - 타이핑 효과 지원
    if (variant === "simple") {
        return (
            <Box
                style={{
                    background: dark
                        ? 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    padding: `${rem(80)} 0`,
                    marginBottom: rem(40),
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* 배경 패턴 */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // backgroundImage: dark
                        //     ? `radial-gradient(circle at 25% 25%, rgba(76, 110, 245, 0.1) 0%, transparent 50%),
                        //        radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
                        //     : `radial-gradient(circle at 25% 25%, rgba(76, 110, 245, 0.05) 0%, transparent 50%),
                        //        radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`,
                        animation: 'float 6s ease-in-out infinite',
                    }}
                />

                <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
                    <Stack align="center" gap="xl" style={{ textAlign: 'center' }}>
                        <Badge
                            size="md"
                            radius="xl"
                            style={{
                                background: '#4c6ef5',
                                color: 'white',
                                animation: mounted ? 'fadeInDown 0.6s ease-out' : 'none',
                            }}
                        >
                            {subtitle}
                        </Badge>

                        <Title
                            order={1}
                            style={{
                                fontSize: rem(48),
                                fontWeight: 700,
                                color: dark ? '#f0f6fc' : '#1e293b',
                                animation: mounted ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
                            }}
                        >
                            {title}
                        </Title>

                        {/* Typing Text or Static Description */}
                        {enableTyping ? (
                            <Box
                                style={{
                                    minHeight: rem(60),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    size="lg"
                                    style={{
                                        color: dark ? '#8b949e' : '#64748b',
                                        fontSize: rem(20),
                                        fontWeight: 500,
                                        animation: mounted ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                                        position: 'relative',
                                    }}
                                >
                                    {currentText}
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '2px',
                                            height: '1.2em',
                                            backgroundColor: '#4c6ef5',
                                            marginLeft: '2px',
                                            animation: 'blink 1s infinite',
                                            verticalAlign: 'text-bottom',
                                        }}
                                    />
                                </Text>
                            </Box>
                        ) : (
                            <Text
                                size="lg"
                                style={{
                                    maxWidth: 500,
                                    color: dark ? '#8b949e' : '#64748b',
                                    animation: mounted ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                                }}
                            >
                                {description}
                            </Text>
                        )}

                        {/* Progress Dots for Typing */}
                        {/*{enableTyping && (*/}
                        {/*    <Box*/}
                        {/*        style={{*/}
                        {/*            animation: mounted ? 'fadeInUp 0.6s ease-out 0.6s both' : 'none',*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Stack align="center" gap="xs">*/}
                        {/*            <Text size="xs" c="dimmed" style={{ marginBottom: rem(8) }}>*/}
                        {/*                {currentIndex + 1} / {textsToType.length}*/}
                        {/*            </Text>*/}
                        {/*            <Box style={{ display: 'flex', gap: rem(8) }}>*/}
                        {/*                {textsToType.map((_, index) => (*/}
                        {/*                    <Box*/}
                        {/*                        key={index}*/}
                        {/*                        style={{*/}
                        {/*                            width: currentIndex === index ? rem(20) : rem(8),*/}
                        {/*                            height: rem(4),*/}
                        {/*                            borderRadius: rem(2),*/}
                        {/*                            background: currentIndex === index ? '#4c6ef5' :*/}
                        {/*                                dark ? '#30363d' : '#d1d5db',*/}
                        {/*                            transition: 'all 0.3s ease',*/}
                        {/*                        }}*/}
                        {/*                    />*/}
                        {/*                ))}*/}
                        {/*            </Box>*/}
                        {/*        </Stack>*/}
                        {/*    </Box>*/}
                        {/*)}*/}
                    </Stack>
                </Container>
            </Box>
        );
    }

    // Stats 버전 (통계가 포함된 배너)
    if (variant === "stats") {
        return (
            <Box
                style={{
                    background: dark
                        ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    padding: `${rem(60)} 0`,
                    marginBottom: rem(40),
                    border: `1px solid ${dark ? '#30363d' : '#e2e8f0'}`,
                }}
            >
                <Container size="lg">
                    <Stack gap="xl">
                        {/* Header */}
                        <Stack align="center" gap="md" style={{ textAlign: 'center' }}>
                            <Title
                                order={2}
                                style={{
                                    fontSize: rem(36),
                                    fontWeight: 600,
                                    color: dark ? '#f0f6fc' : '#1e293b',
                                    animation: mounted ? 'fadeInUp 0.6s ease-out' : 'none',
                                }}
                            >
                                {title}
                            </Title>

                            <Text
                                size="md"
                                style={{
                                    color: dark ? '#8b949e' : '#64748b',
                                    animation: mounted ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
                                }}
                            >
                                {description}
                            </Text>
                        </Stack>

                        {/* Stats Grid */}
                        <Group
                            justify="center"
                            gap="xl"
                            style={{
                                animation: mounted ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                            }}
                        >
                            {displayStats.map((stat, index) => (
                                <Stack
                                    key={stat.label}
                                    align="center"
                                    gap="xs"
                                    style={{
                                        minWidth: rem(120),
                                        padding: rem(20),
                                        borderRadius: rem(12),
                                        background: dark ? '#161b22' : '#ffffff',
                                        border: `1px solid ${dark ? '#21262d' : '#e5e7eb'}`,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                        }
                                    }}
                                >
                                    <ActionIcon
                                        size="xl"
                                        radius="xl"
                                        style={{
                                            background: `${stat.color}20`,
                                            color: stat.color,
                                            border: 'none',
                                        }}
                                    >
                                        <stat.icon size={24} />
                                    </ActionIcon>

                                    <Text
                                        size="xl"
                                        fw={700}
                                        style={{
                                            color: dark ? '#f0f6fc' : '#1e293b',
                                        }}
                                    >
                                        {stat.value}
                                    </Text>

                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{ textAlign: 'center' }}
                                    >
                                        {stat.label}
                                    </Text>
                                </Stack>
                            ))}
                        </Group>
                    </Stack>
                </Container>
            </Box>
        );
    }

    return null;
};

// 스타일 추가
const enhancedBannerStyles = `
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

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }

    @keyframes blink {
        0%, 50% {
            opacity: 1;
        }
        51%, 100% {
            opacity: 0;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-10px) rotate(1deg);
        }
    }
`;

// 스타일을 head에 추가
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = enhancedBannerStyles;
    document.head.appendChild(styleSheet);
}

export default BannerSection;