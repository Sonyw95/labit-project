import React, { useState, useEffect } from 'react';
import {
    Container,
    Text,
    Stack,
    Group,
    Avatar,
    Badge,
    ActionIcon,
    Divider,
    Box,
    Paper,
    Affix,
    Transition,
    Progress,
    Tooltip,
    Button,
    useComputedColorScheme,
    Card
} from '@mantine/core';
import {
    IconHeart,
    IconMessageCircle,
    IconEye,
    IconCalendar,
    IconClock,
    IconArrowLeft,
    IconArrowUp,
    IconCopy
} from '@tabler/icons-react';
import {NavLink} from "react-router-dom";

// 포스트 네비게이터 컴포넌트
function PostNavigator({ currentProgress, onScrollTo }) {
    const computedColorScheme = useComputedColorScheme('light');
    const [activeSection, setActiveSection] = useState(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sections = [
        { id: 'intro', title: '소개', progress: 0 },
        { id: 'overview', title: '개요', progress: 20 },
        { id: 'content', title: '본문', progress: 40 },
        { id: 'examples', title: '예시', progress: 60 },
        { id: 'conclusion', title: '결론', progress: 80 },
        { id: 'comments', title: '댓글', progress: 100 }
    ];

    useEffect(() => {
        const currentSection = sections.findIndex(section =>
            currentProgress >= section.progress &&
            currentProgress < (sections[sections.indexOf(section) + 1]?.progress || 100)
        );
        setActiveSection(Math.max(0, currentSection));
    }, [currentProgress, sections]);

    return (
        <Affix position={{ top: '50%', right: 20 }} style={{ transform: 'translateY(-50%)' }}>
            <Paper
                p="md"
                style={{
                    background: computedColorScheme === 'light'
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: computedColorScheme === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.1)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    boxShadow: computedColorScheme === 'light'
                        ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                        : '0 8px 32px rgba(255, 255, 255, 0.05)',
                    width: '200px'
                }}
            >
                <Stack gap="xs">
                    <Group justify="space-between" align="center" mb="xs">
                        <Text size="sm" fw={600}>목차</Text>
                    </Group>

                    <Progress
                        value={currentProgress}
                        size="xs"
                        radius="xl"
                        style={{ marginBottom: '8px' }}
                    />

                    {sections.map((section, index) => (
                        <Box
                            key={section.id}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: activeSection === index
                                    ? computedColorScheme === 'light'
                                        ? 'rgba(34, 139, 230, 0.1)'
                                        : 'rgba(34, 139, 230, 0.2)'
                                    : 'transparent',
                                border: activeSection === index
                                    ? '1px solid rgba(34, 139, 230, 0.3)'
                                    : '1px solid transparent',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => onScrollTo(section.progress)}
                        >
                            <Text
                                size="xs"
                                c={activeSection === index ? 'blue' : 'dimmed'}
                                fw={activeSection === index ? 600 : 400}
                            >
                                {section.title}
                            </Text>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Affix>
    );
}

// 플로팅 액션 버튼
function FloatingActions() {
    const [isLiked, setIsLiked] = useState(false);
    // const [isBookmarked, setIsBookmarked] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const computedColorScheme = useComputedColorScheme('light');

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const shareActions = [
        // { icon: IconBrandTwitter, label: 'Twitter', color: '#1DA1F2' },
        // { icon: IconBrandFacebook, label: 'Facebook', color: '#4267B2' },
        // { icon: IconBrandLinkedin, label: 'LinkedIn', color: '#0077B5' },
        { icon: IconCopy, label: '링크 복사', color: '#666' }
    ];

    return (
        <Affix >
            <Stack gap="xs">
                {/* 공유 버튼들 */}
                <Paper
                    p="xs"
                    style={{
                        background: computedColorScheme === 'light'
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: computedColorScheme === 'light'
                            ? '1px solid rgba(0, 0, 0, 0.1)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        boxShadow: computedColorScheme === 'light'
                            ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                            : '0 8px 32px rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <Stack gap="xs">
                        {shareActions.map(({ icon: Icon, label, color }) => (
                            <Tooltip key={label} label={label} position="right">
                                <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    style={{
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: `${color  }20`,
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    <Icon size={20} color={color} />
                                </ActionIcon>
                            </Tooltip>
                        ))}

                        <Divider size="xs" />

                        {/* 좋아요 버튼 */}
                        <Tooltip label={isLiked ? '좋아요 취소' : '좋아요'} position="right">
                            <ActionIcon
                                variant={isLiked ? "filled" : "subtle"}
                                color={isLiked ? "red" : "gray"}
                                size="lg"
                                onClick={() => setIsLiked(!isLiked)}
                                style={{
                                    transition: 'all 0.2s ease',
                                    transform: isLiked ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <IconHeart size={20} fill={isLiked ? "currentColor" : "none"} />
                            </ActionIcon>
                        </Tooltip>

                        {/*/!* 북마크 버튼 *!/*/}
                        {/*<Tooltip label={isBookmarked ? '북마크 해제' : '북마크'} position="right">*/}
                        {/*    <ActionIcon*/}
                        {/*        variant={isBookmarked ? "filled" : "subtle"}*/}
                        {/*        color={isBookmarked ? "yellow" : "gray"}*/}
                        {/*        size="lg"*/}
                        {/*        onClick={() => setIsBookmarked(!isBookmarked)}*/}
                        {/*        style={{*/}
                        {/*            transition: 'all 0.2s ease',*/}
                        {/*            transform: isBookmarked ? 'scale(1.1)' : 'scale(1)'*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <IconBookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />*/}
                        {/*    </ActionIcon>*/}
                        {/*</Tooltip>*/}
                    </Stack>
                </Paper>

                {/* 맨 위로 버튼 */}
                <Transition mounted={showScrollTop} transition="slide-up" duration={200}>
                    {(styles) => (
                        <ActionIcon
                            style={{
                                ...styles,
                                background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-violet-6))',
                                backdropFilter: 'blur(20px)',
                                border: computedColorScheme === 'light'
                                    ? '1px solid rgba(0, 0, 0, 0.1)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                boxShadow: computedColorScheme === 'light'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                                    : '0 8px 32px rgba(255, 255, 255, 0.05)'
                            }}
                            size="xl"
                            onClick={scrollToTop}
                        >
                            <IconArrowUp size={24} color="white" />
                        </ActionIcon>
                    )}
                </Transition>
            </Stack>
        </Affix>
    );
}

// 메인 포스트 상세 컴포넌트
export default function PostDetail() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const computedColorScheme = useComputedColorScheme('light');

    // 스크롤 진행률 추적
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / docHeight) * 100, 100);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollTo = (targetProgress) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetPosition = (targetProgress / 100) * docHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };

    const post = {
        title: "2025년 웹 디자인 트렌드: 미래를 이끄는 혁신적인 디자인 패러다임",
        subtitle: "AI 기반 개인화, 지속가능한 디자인, 그리고 몰입형 사용자 경험의 시대",
        bannerImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=600&fit=crop",
        author: {
            name: "김디자이너",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
            bio: "UX/UI 디자이너이자 웹 트렌드 전문가",
            followers: "12.5K"
        },
        publishedAt: "2025-06-25",
        readTime: "12분",
        views: 3420,
        likes: 234,
        category: "디자인",
        tags: ["웹디자인", "2025트렌드", "UI/UX", "사용자경험"]
    };

    return (
        <Box style={{ minHeight: '100vh' }}>
            {/* 진행률 표시바 */}
            <Progress
                value={scrollProgress}
                size="xs"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000
                }}
            />

            {/* 배너 이미지 섹션 */}
            <Box
                style={{
                    height: '70vh',
                    backgroundImage: `url(${post.bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'end',
                    padding: '0 20px 60px'
                }}
            >
                {/* 그라디언트 오버레이 */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: computedColorScheme === 'light'
                            ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)'
                            : 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)',
                        backdropFilter: 'blur(1px)'
                    }}
                />

                {/* 뒤로가기 버튼 */}
                <ActionIcon
                    component={NavLink}
                    to={-1}
                    variant="filled"
                    size="lg"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    <IconArrowLeft size={20} color="white" />
                </ActionIcon>

                {/* 타이틀 영역 */}
                <Container size="lg" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
                    <Stack gap="md">
                        <Badge
                            color="blue"
                            variant="filled"
                            size="lg"
                            style={{
                                backdropFilter: 'blur(10px)',
                                background: 'rgba(34, 139, 230, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            {post.category}
                        </Badge>

                        <Text
                            size="3rem"
                            fw={900}
                            c="white"
                            style={{
                                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                                lineHeight: 1.2,
                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                                maxWidth: '80%'
                            }}
                        >
                            {post.title}
                        </Text>

                        <Text
                            size="xl"
                            c="rgba(255, 255, 255, 0.9)"
                            style={{
                                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                                maxWidth: '70%'
                            }}
                        >
                            {post.subtitle}
                        </Text>
                    </Stack>
                </Container>
            </Box>

            {/* 메인 콘텐츠 */}
            <Container size="md" py="xl">
                {/* 작성자 정보 */}
                <Card
                    p="lg"
                    mb="xl"
                    style={{
                        background: computedColorScheme === 'light'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(30, 30, 30, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: computedColorScheme === 'light'
                            ? '1px solid rgba(0, 0, 0, 0.1)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        boxShadow: computedColorScheme === 'light'
                            ? '0 8px 32px rgba(0, 0, 0, 0.08)'
                            : '0 8px 32px rgba(255, 255, 255, 0.02)'
                    }}
                >
                    <Group justify="space-between" align="center">
                        <Group>
                            <Avatar src={post.author.avatar} size="lg" />
                            <Stack gap={4}>
                                <Text fw={600}>{post.author.name}</Text>
                                <Text size="sm" c="dimmed">{post.author.bio}</Text>
                                <Group gap="xs">
                                    <Group gap={4}>
                                        <IconCalendar size={14} />
                                        <Text size="xs" c="dimmed">{post.publishedAt}</Text>
                                    </Group>
                                    <Group gap={4}>
                                        <IconClock size={14} />
                                        <Text size="xs" c="dimmed">{post.readTime}</Text>
                                    </Group>
                                    <Group gap={4}>
                                        <IconEye size={14} />
                                        <Text size="xs" c="dimmed">{post.views.toLocaleString()}</Text>
                                    </Group>
                                </Group>
                            </Stack>
                        </Group>

                        <Stack align="center" gap={4}>
                            <Button variant="light" size="sm">팔로우</Button>
                            <Text size="xs" c="dimmed">{post.author.followers} 팔로워</Text>
                        </Stack>
                    </Group>
                </Card>

                {/* 포스트 콘텐츠 */}
                <Stack gap="xl" id="content">
                    <section id="intro">
                        <Text size="lg" fw={600} mb="md">들어가며</Text>
                        <Text style={{ lineHeight: 1.8 }}>
                            2025년, 웹 디자인 업계는 전례없는 변화의 중심에 서 있습니다.
                            반디자인과 실험적 내비게이션부터
                            AI 기반 개인화와 지속가능한 디자인까지,
                            새로운 패러다임이 사용자 경험의 미래를 재정의하고 있습니다.
                        </Text>
                    </section>

                    <Divider />

                    <section id="overview">
                        <Text size="lg" fw={600} mb="md">2025년 핵심 트렌드 개요</Text>
                        <Stack gap="md">
                            <Text style={{ lineHeight: 1.8 }}>
                                마이크로 애니메이션과 커스텀 커서는 단순한 장식을 넘어
                                브랜드 요소로 진화하고 있습니다. 사용자들은 더 이상 정적인 웹사이트에 만족하지 않으며,
                                인터랙티브하고 몰입적인 경험을 기대합니다.
                            </Text>

                            <Text style={{ lineHeight: 1.8 }}>
                                가시적 그리드 레이아웃과
                                3D 요소의 접근성 향상은
                                디자이너들에게 새로운 창작의 자유를 제공하고 있습니다.
                            </Text>
                        </Stack>
                    </section>

                    <Divider />

                    <section id="examples">
                        <Text size="lg" fw={600} mb="md">실제 적용 사례</Text>
                        <Stack gap="md">
                            <Paper
                                p="md"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(249, 250, 251, 0.8)'
                                        : 'rgba(40, 40, 40, 0.8)',
                                    borderRadius: '12px',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <Text fw={600} mb="xs">스크롤 기반 스토리텔링</Text>
                                <Text size="sm" style={{ lineHeight: 1.6 }}>
                                    스크롤텔링은 단순한 제품 브로셔를 넘어 제품 모험으로 진화하고 있습니다.
                                    패럴랙스 스크롤링과 줌 인 효과를 통해 더욱 몰입적인 경험을 제공합니다.
                                </Text>
                            </Paper>

                            <Paper
                                p="md"
                                style={{
                                    background: computedColorScheme === 'light'
                                        ? 'rgba(249, 250, 251, 0.8)'
                                        : 'rgba(40, 40, 40, 0.8)',
                                    borderRadius: '12px',
                                    border: computedColorScheme === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.05)'
                                        : '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <Text fw={600} mb="xs">지속가능한 웹 디자인</Text>
                                <Text size="sm" style={{ lineHeight: 1.6 }}>
                                    2025년 웹 지속가능성은 기본 최적화를 넘어 환경 친화적 웹사이트 창조에 집중합니다.
                                    이는 더 빠르고 효율적인 웹사이트로 이어져 사용자 경험과 환경 책임의 완벽한 조화를 이룹니다.
                                </Text>
                            </Paper>
                        </Stack>
                    </section>

                    <Divider />

                    <section id="conclusion">
                        <Text size="lg" fw={600} mb="md">마무리</Text>
                        <Text style={{ lineHeight: 1.8 }}>
                            2025년 웹 디자인 트렌드는 전통적인 규칙을 깨뜨리는 것에 관한 것입니다.
                            하지만 이러한 혁신은 항상 사용자 중심적이어야 하며, 접근성과 사용성을 희생하지 않는 선에서 이루어져야 합니다.
                        </Text>
                    </section>

                    <Divider />

                    {/* 태그 섹션 */}
                    <Group gap="xs">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="light" size="md">
                                #{tag}
                            </Badge>
                        ))}
                    </Group>

                    {/* 댓글 섹션 */}
                    <section id="comments">
                        <Group justify="space-between" align="center" mb="md">
                            <Text size="lg" fw={600}>댓글</Text>
                            <Group gap={4}>
                                <IconMessageCircle size={16} />
                                <Text size="sm" c="dimmed">24개</Text>
                            </Group>
                        </Group>
                        {/*<CommentForm onSubmit={handleCommentSubmit} />*/}
                        <Paper
                            p="lg"
                            style={{
                                background: computedColorScheme === 'light'
                                    ? 'rgba(249, 250, 251, 0.8)'
                                    : 'rgba(40, 40, 40, 0.8)',
                                borderRadius: '12px',
                                border: computedColorScheme === 'light'
                                    ? '1px solid rgba(0, 0, 0, 0.05)'
                                    : '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <Text c="dimmed" ta="center">
                                댓글 시스템이 곧 추가될 예정입니다.
                            </Text>
                        </Paper>
                    </section>
                </Stack>
            </Container>

            {/* 포스트 네비게이터 */}
            <PostNavigator
                currentProgress={scrollProgress}
                onScrollTo={handleScrollTo}
            />

            {/* 플로팅 액션 버튼들 */}
            <FloatingActions />
        </Box>
    );
}