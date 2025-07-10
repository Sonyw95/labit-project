import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import {
    Box,
    Container,
    Stack,
    Title,
    Text,
    Group,
    Badge,
    ActionIcon,
    rem,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconStar,
    IconTrendingUp,
    IconUsers,
    IconArrowDown,
    IconDevicesCode,
} from '@tabler/icons-react';
import { backgroundBlur } from "@/utils/backgroundBlur.js";

// 스타일시트를 한 번만 추가하도록 최적화
let stylesInjected = false;

const injectStyles = () => {
    if (typeof document === 'undefined' || stylesInjected) {
        return;
    }

    const styleSheet = document.createElement('style');
    styleSheet.id = 'banner-section-styles';
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes smoothChange {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.02); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-12px); }
            70% { transform: translateY(-5px); }
            90% { transform: translateY(-2px); }
        }
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1.08); }
            50% { transform: scale(1.12); }
        }
        @keyframes iconPulse {
            0%, 100% { transform: scale(1.2); }
            50% { transform: scale(1.3); }
        }
        @keyframes iconBounce {
            0%, 100% { transform: scale(1.2); }
            25% { transform: scale(1.3) translateY(-2px); }
            50% { transform: scale(1.25) translateY(-4px); }
            75% { transform: scale(1.28) translateY(-1px); }
        }
        @keyframes glow {
            0% { opacity: 0.5; }
            100% { opacity: 0.8; }
        }
        @keyframes ripple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
    `;

    document.head.appendChild(styleSheet);
    stylesInjected = true;
};

// 컬러 매핑을 상수로 분리
const TECH_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
const TECH_EMOJIS = ['☕', '🍃', '⚛️', '🌟', '🚀'];

// 기본 데이터를 상수로 분리하여 리렌더링 방지
const DEFAULT_STATS = [
    { icon: IconDevicesCode, label: '게시글', value: '42+', color: '#3b82f6', trend: '+12%' },
    { icon: IconUsers, label: '독자', value: '1.2K+', color: '#10b981' },
    { icon: IconStar, label: '좋아요', value: '350+', color: '#f59e0b' },
    { icon: IconTrendingUp, label: '조회수', value: '25K+', color: '#ef4444' },
];

const DEFAULT_TYPING_TEXTS = [
    "개발 경험을 공유합니다",
    "새로운 기술을 탐구합니다",
    "코드 품질을 추구합니다",
    "팀과 함께 성장합니다"
];

const DEFAULT_TECH_STACK = ['Java', 'Spring', 'React'];

// 메모이제이션된 서브 컴포넌트들
const WelcomeBadge = memo(({ title, mounted }) => (
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
));

const TechIndicator = memo(({ tech, index, isActive, color }) => (
    <Stack align="center" gap="xs">
        <Box
            style={{
                width: rem(60),
                height: rem(60),
                borderRadius: '50%',
                background: isActive ? color : '#21262d',
                border: isActive ? `3px solid ${color}40` : '3px solid #30363d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: rem(24),
                transition: 'all 0.5s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                boxShadow: 'none',
            }}
        >
            {TECH_EMOJIS[index] || '🔧'}
        </Box>
        <Text
            size="sm"
            style={{
                color: isActive ? '#e2e8f0' : '#9ca3af',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.5s ease',
            }}
        >
            {tech}
        </Text>
    </Stack>
));

const ProgressIndicator = memo(({ techStack, currentTech, mounted }) => (
    <Box style={{ animation: mounted ? 'fadeInUp 0.8s ease-out 1.2s both' : 'none' }}>
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
));

const ScrollIndicator = memo(({ mounted }) => (
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
));

const StatCard = memo(({
                           stat,
                           index,
                           isHovered,
                           onMouseEnter,
                           onMouseLeave,
                           animationType,
                           dark
                       }) => {
    const cardStyle = useMemo(() => {
        const baseStyle = {
            minWidth: rem(140),
            padding: rem(24),
            borderRadius: rem(16),
            background: dark
                ? (isHovered ? '#1c2128' : '#161b22')
                : (isHovered ? '#f8fafc' : '#ffffff'),
            border: `2px solid ${isHovered ? stat.color : (dark ? '#21262d' : '#e5e7eb')}`,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        };

        const animations = {
            float: {
                transform: isHovered ? 'translateY(-12px) scale(1.05)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? `0 20px 40px -8px ${stat.color}40, 0 0 0 1px ${stat.color}20`
                    : dark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            scale: {
                transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                zIndex: isHovered ? 10 : 1,
                boxShadow: isHovered
                    ? `0 25px 50px ${stat.color}50, 0 0 0 1px ${stat.color}`
                    : dark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }
        };

        return { ...baseStyle, ...(animations[animationType] || animations.float) };
    }, [isHovered, stat.color, dark, animationType]);

    const iconStyle = useMemo(() => ({
        background: isHovered ? stat.color : `${stat.color}20`,
        color: isHovered ? 'white' : stat.color,
        border: 'none',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
    }), [isHovered, stat.color]);

    return (
        <Stack
            align="center"
            gap="md"
            style={cardStyle}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <ActionIcon size="xl" radius="xl" style={iconStyle}>
                <stat.icon size={28} />
            </ActionIcon>

            <Text
                size="xl"
                style={{
                    color: isHovered ? stat.color : (dark ? '#f0f6fc' : '#1e293b'),
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    fontWeight: isHovered ? 800 : 700,
                }}
            >
                {stat.value}
            </Text>

            <Text
                size="sm"
                style={{
                    textAlign: 'center',
                    color: isHovered ? stat.color : (dark ? '#8b949e' : '#64748b'),
                    transition: 'all 0.3s ease',
                    fontWeight: isHovered ? 600 : 400,
                }}
            >
                {stat.label}
            </Text>

            {stat.trend && (
                <Text
                    size="xs"
                    style={{
                        color: stat.color,
                        background: `${stat.color}15`,
                        padding: `${rem(4)} ${rem(8)}`,
                        borderRadius: rem(12),
                        fontWeight: 600,
                        opacity: isHovered ? 1 : 0.7,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {stat.trend}
                </Text>
            )}
        </Stack>
    );
});

// 타이핑 효과를 위한 커스텀 훅
const useTypingEffect = ({
                             texts,
                             typingSpeed = 100,
                             deleteSpeed = 50,
                             pauseTime = 2000,
                             loop = true,
                             enabled = false
                         }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!enabled || texts.length === 0) {
            return;
        }

        const currentFullText = texts[currentIndex];

        timeoutRef.current = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < currentFullText.length) {
                    setCurrentText(currentFullText.slice(0, currentText.length + 1));
                } else if (loop || currentIndex < texts.length - 1) {
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else if (currentText.length > 0) {
                setCurrentText(currentText.slice(0, -1));
            } else {
                setIsDeleting(false);
                setCurrentIndex((prev) =>
                    loop ? (prev + 1) % texts.length : Math.min(prev + 1, texts.length - 1)
                );
            }
        }, isDeleting ? deleteSpeed : typingSpeed);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentText, isDeleting, currentIndex, texts, typingSpeed, deleteSpeed, pauseTime, loop, enabled]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { currentText, currentIndex };
};

const BannerSection = ({
                           title = "LABit",
                           subtitle,
                           description = "풀스택 개발자의 학습 여정을 기록하며, 실무 경험과 인사이트를 공유하는 공간입니다.",
                           backgroundImage,
                           stats = [],
                           techStack = DEFAULT_TECH_STACK,
                           showScrollIndicator = true,
                           variant = "hero",
                           enableTyping = false,
                           typingTexts = DEFAULT_TYPING_TEXTS,
                           typingSpeed = 100,
                           deleteSpeed = 50,
                           pauseTime = 2000,
                           loop = true,
                           animationType = "float",
                       }) => {
    // 스타일 주입은 한 번만 실행
    useEffect(() => {
        injectStyles();
    }, []);

    const { colorScheme } = useMantineColorScheme();
    const dark = useMemo(() => colorScheme === 'dark', [colorScheme]);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [currentTech, setCurrentTech] = useState(0);
    const [mounted, setMounted] = useState(false);

    const techTimerRef = useRef(null);

    // 메모이제이션된 값들
    const displayStats = useMemo(() =>
            stats.length > 0 ? stats : DEFAULT_STATS,
        [stats]
    );

    const textsToType = useMemo(() =>
            typingTexts.length > 0 ? typingTexts : DEFAULT_TYPING_TEXTS,
        [typingTexts]
    );

    const defaultBg = useMemo(() =>
            backgroundImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
        [backgroundImage]
    );

    // 타이핑 효과 훅 사용
    const { currentText, currentIndex } = useTypingEffect({
        texts: textsToType,
        typingSpeed,
        deleteSpeed,
        pauseTime,
        loop,
        enabled: enableTyping && variant === "simple"
    });

    // 마운트 효과
    useEffect(() => {
        setMounted(true);
    }, []);

    // 기술 스택 변경 효과 (최적화된 타이머 관리)
    useEffect(() => {
        if (mounted && techStack.length > 1 && variant === "hero") {
            techTimerRef.current = setInterval(() => {
                setCurrentTech((prev) => (prev + 1) % techStack.length);
            }, 3000);

            return () => {
                if (techTimerRef.current) {
                    clearInterval(techTimerRef.current);
                }
            };
        }
    }, [mounted, techStack.length, variant]);

    // 컴포넌트 언마운트 시 모든 타이머 정리
    useEffect(() => {
        return () => {
            if (techTimerRef.current) {
                clearInterval(techTimerRef.current);
            }
        };
    }, []);

    // 메모이제이션된 콜백들
    const getTechColor = useCallback((index) =>
            TECH_COLORS[index % TECH_COLORS.length],
        []
    );

    const handleStatHover = useCallback((index) => {
        setHoveredIndex(index);
    }, []);

    const handleStatLeave = useCallback(() => {
        setHoveredIndex(null);
    }, []);

    // Hero 버전
    if (variant === "hero") {
        return (
            <Box
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    overflow: 'hidden',
                }}
            >
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

                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        ...backgroundBlur({ color: '#000', alpha: 0.7 })
                    }}
                />

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
                        <WelcomeBadge title={title} mounted={mounted} />

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

                        <Group
                            justify="center"
                            gap="xl"
                            style={{
                                animation: mounted ? 'fadeInUp 0.8s ease-out 0.8s both' : 'none',
                            }}
                        >
                            {techStack.map((tech, index) => (
                                <TechIndicator
                                    key={tech}
                                    tech={tech}
                                    index={index}
                                    isActive={currentTech === index}
                                    color={getTechColor(index)}
                                />
                            ))}
                        </Group>

                        <ProgressIndicator
                            techStack={techStack}
                            currentTech={currentTech}
                            mounted={mounted}
                        />

                        {showScrollIndicator && <ScrollIndicator mounted={mounted} />}
                    </Stack>
                </Container>
            </Box>
        );
    }

    // Simple 버전
    if (variant === "simple") {
        return (
            <Box
                style={{
                    // background: dark
                    //     ? 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)'
                    //     : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    padding: `${rem(80)} 0`,
                    marginBottom: rem(40),
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: `url(${defaultBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
                    <Stack align="center" gap="xl" style={{ textAlign: 'center' }}>
                        {subtitle && (
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
                        )}

                        {title && (
                            <Title
                                order={1}
                                style={{
                                    fontSize: rem(48),
                                    fontWeight: 700,
                                    // color: dark ? '#f0f6fc' : '#1e293b',
                                    color: '#f0f6fc',
                                    animation: mounted ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
                                }}
                            >
                                {title}
                            </Title>
                        )}

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
                    </Stack>
                </Container>
            </Box>
        );
    }

    // Stats 버전
    if (variant === "stats") {
        return (
            <Box
                style={{
                    padding: `${rem(60)} 0`,
                    marginBottom: rem(40),
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
                    <Stack gap="xl">
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

                        <Group
                            justify="center"
                            gap="xl"
                            style={{
                                animation: mounted ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                                flexWrap: 'wrap',
                            }}
                        >
                            {displayStats.map((stat, index) => (
                                <StatCard
                                    key={stat.label}
                                    stat={stat}
                                    index={index}
                                    isHovered={hoveredIndex === index}
                                    onMouseEnter={() => handleStatHover(index)}
                                    onMouseLeave={handleStatLeave}
                                    animationType={animationType}
                                    dark={dark}
                                />
                            ))}
                        </Group>
                    </Stack>
                </Container>
            </Box>
        );
    }

    return null;
};

// 성능 최적화를 위한 memo 처리
export default memo(BannerSection);