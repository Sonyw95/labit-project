import React, { useEffect, useState} from "react";
import {
    BackgroundImage, Badge, Box,
    Container, Group, rem, Stack, Title,Text
} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import HeroSection from "@/components/heroSection/index.jsx";
import RecentPosts from "@/components/post/recent/index.jsx";
import PostCardList from "@/components/section/PostCardList.jsx";
import {BackgroundBlur} from "@/utils/BackgroundBlur.jsx";

export default function (){
    const recentPosts = [
        {
            id: 1,
            title: "모바일 앱 UI/UX 디자인 트렌드 2025",
            excerpt: "2025년에 주목해야 할 모바일 앱 디자인 트렌드와 사용자 경험 개선 방법을 살펴보겠습니다.",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
            author: {
                name: "김디자이너",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            },
            category: "디자인",
            readTime: "5분",
            views: 1250,
            likes: 89,
            createdAt: "2025-06-24",
            tags: ["UI/UX", "모바일", "트렌드"]
        },
        {
            id: 2,
            title: "React와 TypeScript로 만드는 모던 웹 애플리케이션",
            excerpt: "실무에서 바로 사용할 수 있는 React와 TypeScript 베스트 프랙티스를 공유합니다.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            author: {
                name: "박개발자",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            },
            category: "개발",
            readTime: "8분",
            views: 2100,
            likes: 156,
            createdAt: "2025-06-23",
            tags: ["React", "TypeScript", "JavaScript"]
        },
        {
            id: 3,
            title: "AI와 머신러닝이 바꾸는 웹 개발의 미래",
            excerpt: "인공지능 기술이 웹 개발에 미치는 영향과 개발자가 준비해야 할 역량에 대해 알아봅니다.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
            author: {
                name: "이엔지니어",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            },
            category: "AI/ML",
            readTime: "12분",
            views: 3420,
            likes: 234,
            createdAt: "2025-06-22",
            tags: ["AI", "머신러닝", "웹개발"]
        },
        {
            id: 4,
            title: "성능 최적화를 위한 Next.js 14 활용법",
            excerpt: "Next.js 14의 새로운 기능들을 활용하여 웹 애플리케이션의 성능을 극대화하는 방법을 알아봅니다.",
            image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
            author: {
                name: "최프론트",
                avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face"
            },
            category: "프레임워크",
            readTime: "10분",
            views: 1890,
            likes: 145,
            createdAt: "2025-06-21",
            tags: ["Next.js", "성능", "최적화"]
        },
        {
            id: 5,
            title: "클라우드 네이티브 애플리케이션 개발 가이드",
            excerpt: "컨테이너와 마이크로서비스 아키텍처를 활용한 클라우드 네이티브 애플리케이션 개발 방법론을 소개합니다.",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop",
            author: {
                name: "정클라우드",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
            },
            category: "클라우드",
            readTime: "15분",
            views: 987,
            likes: 67,
            createdAt: "2025-06-20",
            tags: ["클라우드", "컨테이너", "마이크로서비스"]
        },
        {
            id: 6,
            title: "사이버 보안 트렌드와 개발자가 알아야 할 것들",
            excerpt: "최신 사이버 보안 위협과 개발 과정에서 고려해야 할 보안 요소들을 정리했습니다.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
            author: {
                name: "홍보안",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
            },
            category: "보안",
            readTime: "7분",
            views: 1567,
            likes: 92,
            createdAt: "2025-06-19",
            tags: ["보안", "사이버", "개발"]
        }
    ];
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
            <HeroSection
                techStack={techStack}
                currentTech={currentTech}
                dark={dark}
            />
            <Container size="lg">
                <RecentPosts posts={recentPosts} dark={dark} />
            </Container>


            {/*<BackgroundImage*/}
            {/*    // src={banner}*/}
            {/*    style={{*/}
            {/*        animation: 'fadeInDown 0.8s ease-out',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Box*/}
            {/*        style={{*/}
            {/*            minHeight: '100vh',*/}
            {/*            position: 'relative',*/}
            {/*            overflow: 'hidden',*/}
            {/*            display: 'flex',*/}
            {/*            alignItems: 'center',*/}
            {/*            marginBottom: rem(60),*/}
            {/*            ...BackgroundBlur({color: '#000', alpha: 0.7})*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Container size="md" style={{position: 'relative', zIndex: 10, marginTop: rem(40)}} >*/}
            {/*            <Stack align="center" gap={rem(50)} style={{textAlign: 'center'}}>*/}
            {/*                /!* Badge *!/*/}
            {/*                <Badge*/}
            {/*                    size="lg"*/}
            {/*                    radius="xl"*/}
            {/*                    style={{*/}
            {/*                        background: '#4c6ef5',*/}
            {/*                        color: 'white',*/}
            {/*                        border: 'none',*/}
            {/*                        padding: '8px 20px',*/}
            {/*                        fontSize: rem(14),*/}
            {/*                        fontWeight: 500,*/}
            {/*                        animation: 'fadeInDown 0.8s ease-out',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    ✨ 환영합니다.*/}
            {/*                </Badge>*/}

            {/*                /!* Main Headline *!/*/}
            {/*                <Stack gap="md" align="center">*/}
            {/*                    <Title*/}
            {/*                        order={1}*/}
            {/*                        style={{*/}
            {/*                            fontSize: rem(64),*/}
            {/*                            fontWeight: 300,*/}
            {/*                            lineHeight: 1.1,*/}
            {/*                            color: '#fff',*/}
            {/*                            animation: 'fadeInUp 0.8s ease-out 0.2s both',*/}
            {/*                            letterSpacing: '-0.02em',*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        To Record, To Share*/}
            {/*                    </Title>*/}

            {/*                    <Box style={{position: 'relative', height: rem(80)}}>*/}
            {/*                        <Title*/}
            {/*                            order={1}*/}
            {/*                            style={{*/}
            {/*                                fontSize: rem(80),*/}
            {/*                                fontWeight: 700,*/}
            {/*                                lineHeight: 1,*/}
            {/*                                color: currentTech === 0*/}
            {/*                                    ? '#f59e0b' // Java*/}
            {/*                                    : currentTech === 1*/}
            {/*                                        ? '#10b981' // Spring*/}
            {/*                                        : '#3b82f6', // React*/}
            {/*                                animation: 'smoothChange 0.6s ease-in-out',*/}
            {/*                                letterSpacing: '-0.03em',*/}
            {/*                            }}*/}
            {/*                            key={currentTech}*/}
            {/*                        >*/}
            {/*                            {techStack[currentTech]}*/}
            {/*                        </Title>*/}
            {/*                    </Box>*/}
            {/*                </Stack>*/}

            {/*                /!* Description *!/*/}
            {/*                <Text*/}
            {/*                    size="xl"*/}
            {/*                    style={{*/}
            {/*                        maxWidth: 600,*/}
            {/*                        lineHeight: 1.6,*/}
            {/*                        color: '#94a3b8',*/}
            {/*                        fontWeight: 400,*/}
            {/*                        animation: 'fadeInUp 0.8s ease-out 0.6s both',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    풀스택 개발자의 학습 여정을 기록하며,*/}
            {/*                    <Text span style={{color: '#e2e8f0', fontWeight: 500}}>*/}
            {/*                        실무 경험과 인사이트*/}
            {/*                    </Text>를 공유하는 공간입니다.*/}
            {/*                </Text>*/}

            {/*                /!* Tech Stack Indicators *!/*/}
            {/*                <Group justify="center" gap="xl" style={{animation: 'fadeInUp 0.8s ease-out 0.8s both'}}>*/}
            {/*                    {[*/}
            {/*                        {name: 'Java', icon: '☕', active: currentTech === 0},*/}
            {/*                        {name: 'Spring', icon: '🍃', active: currentTech === 1},*/}
            {/*                        {name: 'React', icon: '⚛️', active: currentTech === 2},*/}
            {/*                    ].map((tech) => (*/}
            {/*                        <Stack key={tech.name} align="center" gap="xs">*/}
            {/*                            <Box*/}
            {/*                                style={{*/}
            {/*                                    width: rem(60),*/}
            {/*                                    height: rem(60),*/}
            {/*                                    borderRadius: '50%',*/}
            {/*                                    background: tech.active ? '#4c6ef5' : '#21262d',  // 매우 어두운 비활성 색상*/}
            {/*                                    border: tech.active ? '3px solid #60a5fa' : '3px solid #30363d',  // 어두운 보더*/}
            {/*                                    display: 'flex',*/}
            {/*                                    alignItems: 'center',*/}
            {/*                                    justifyContent: 'center',*/}
            {/*                                    fontSize: rem(24),*/}
            {/*                                    transition: 'all 0.5s ease',*/}
            {/*                                    transform: tech.active ? 'scale(1.1)' : 'scale(1)',*/}
            {/*                                    boxShadow: 'none', // 플랫 디자인: 그림자 제거*/}
            {/*                                }}*/}
            {/*                            >*/}
            {/*                                {tech.icon}*/}
            {/*                            </Box>*/}
            {/*                            <Text*/}
            {/*                                size="sm"*/}
            {/*                                style={{*/}
            {/*                                    color: tech.active ? '#e2e8f0' : '#9ca3af',*/}
            {/*                                    fontWeight: tech.active ? 600 : 400,*/}
            {/*                                    transition: 'all 0.5s ease',*/}
            {/*                                }}*/}
            {/*                            >*/}
            {/*                                {tech.name}*/}
            {/*                            </Text>*/}
            {/*                        </Stack>*/}
            {/*                    ))}*/}
            {/*                </Group>*/}

            {/*                /!* Progress Indicator *!/*/}
            {/*                <Box style={{animation: 'fadeInUp 0.8s ease-out 1.2s both'}}>*/}
            {/*                    <Group gap="xs" justify="center">*/}
            {/*                        {techStack.map((_, index) => (*/}
            {/*                            <Box*/}
            {/*                                key={index}*/}
            {/*                                style={{*/}
            {/*                                    width: currentTech === index ? rem(24) : rem(8),*/}
            {/*                                    height: rem(4),*/}
            {/*                                    borderRadius: rem(2),*/}
            {/*                                    background: currentTech === index ? '#4c6ef5' : '#6b7280',*/}
            {/*                                    transition: 'all 0.5s ease',*/}
            {/*                                }}*/}
            {/*                            />*/}
            {/*                        ))}*/}
            {/*                    </Group>*/}
            {/*                </Box>*/}

            {/*                /!* Scroll Hint *!/*/}
            {/*                <Box*/}
            {/*                    style={{*/}
            {/*                        marginTop: rem(60),*/}
            {/*                        animation: 'fadeInUp 0.8s ease-out 1.4s both',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Stack align="center" gap="xs">*/}
            {/*                        <Text size="sm" c="dimmed">*/}
            {/*                            스크롤하여 더 많은 콘텐츠 보기*/}
            {/*                        </Text>*/}
            {/*                        <Box*/}
            {/*                            style={{*/}
            {/*                                width: rem(1),*/}
            {/*                                height: rem(40),*/}
            {/*                                background: '#30363d',  // 어두운 그레이*/}
            {/*                                borderRadius: rem(1),*/}
            {/*                                animation: 'gentlePulse 2s ease-in-out infinite',*/}
            {/*                            }}*/}
            {/*                        />*/}
            {/*                    </Stack>*/}
            {/*                </Box>*/}
            {/*            </Stack>*/}
            {/*        </Container>*/}
            {/*    </Box>*/}
            {/*</BackgroundImage>*/}

            {/*<Container size="lg">*/}

            {/*    <Stack gap="xl" mb="xl">*/}
            {/*        <Box ta="center">*/}
            {/*            <Text*/}
            {/*                fw={900}*/}
            {/*                style={{*/}
            {/*                    backgroundImage: !dark*/}
            {/*                        ? 'linear-gradient(135deg, var(--mantine-color-dark-6),  var(--mantine-color-gray-6))'*/}
            {/*                        : 'linear-gradient(135deg, var(--mantine-color-dark-1),  var(--mantine-color-gray-3))',*/}
            {/*                    backgroundClip: 'text',*/}
            {/*                    WebkitBackgroundClip: 'text',*/}
            {/*                    color: 'transparent',*/}
            {/*                    fontSize: 'clamp(2rem, 5vw, 3rem)',*/}
            {/*                    textShadow: !dark*/}
            {/*                        ? '0 4px 20px rgba(0, 0, 0, 0.1)'*/}
            {/*                        : '0 4px 20px rgba(255, 255, 255, 0.1)'*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                최신 게시글*/}
            {/*            </Text>*/}
            {/*            <Text*/}
            {/*                size="lg"*/}
            {/*                c="dimmed"*/}
            {/*                mt="sm"*/}
            {/*                style={{*/}
            {/*                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',*/}
            {/*                    maxWidth: '600px',*/}
            {/*                    margin: '0 auto'*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                최신 기술 트렌드와 인사이트를 담은 포스트들을 만나보세요.*/}
            {/*            </Text>*/}
            {/*        </Box>*/}
            {/*    </Stack>*/}
            {/*    <PostCardList opts={{*/}
            {/*        maxCount: 6,*/}
            {/*        category: 'all',*/}
            {/*    }} dark={dark}/>*/}
            {/*    /!* 더 보기 버튼 *!/*/}
            {/*    <Group justify="center" mt="xl" mb="xl">*/}
            {/*        <Badge*/}
            {/*            variant="gradient"*/}
            {/*            gradient={{ from: 'blue', to: 'violet', deg: 135 }}*/}
            {/*            size="xl"*/}
            {/*            style={{*/}
            {/*                cursor: 'pointer',*/}
            {/*                padding: '12px 32px',*/}
            {/*                fontSize: '16px',*/}
            {/*                fontWeight: 600,*/}
            {/*                border: '1px solid rgba(255, 255, 255, 0.2)',*/}
            {/*                backdropFilter: 'blur(10px)',*/}
            {/*                transition: 'all 0.3s ease',*/}
            {/*                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'*/}
            {/*            }}*/}
            {/*            onMouseEnter={(e) => {*/}
            {/*                e.target.style.transform = 'scale(1.05)';*/}
            {/*                e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';*/}
            {/*            }}*/}
            {/*            onMouseLeave={(e) => {*/}
            {/*                e.target.style.transform = 'scale(1)';*/}
            {/*                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            더 많은 포스트 보기*/}
            {/*        </Badge>*/}
            {/*    </Group>*/}
            {/*</Container>*/}
            {/*<style>*/}
            {/*    {`*/}
            {/*                @keyframes float {*/}
            {/*                    0%, 100% { transform: translateY(0px); }*/}
            {/*                    50% { transform: translateY(-10px); }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes spin {*/}
            {/*                    from { transform: rotate(0deg); }*/}
            {/*                    to { transform: rotate(360deg); }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes rotate {*/}
            {/*                    from { transform: translate(-50%, -50%) rotate(0deg); }*/}
            {/*                    to { transform: translate(-50%, -50%) rotate(360deg); }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes pulse {*/}
            {/*                    0%, 100% { */}
            {/*                        opacity: 1; */}
            {/*                        transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1);*/}
            {/*                    }*/}
            {/*                    50% { */}
            {/*                        opacity: 0.5; */}
            {/*                        transform: translate(-50%, -50%) rotate(var(--rotation)) translateY(-70px) scale(1.2);*/}
            {/*                    }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes fadeInDown {*/}
            {/*                    from {*/}
            {/*                        opacity: 0;*/}
            {/*                        transform: translateY(-20px);*/}
            {/*                    }*/}
            {/*                    to {*/}
            {/*                        opacity: 1;*/}
            {/*                        transform: translateY(0);*/}
            {/*                    }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes fadeInUp {*/}
            {/*                    from {*/}
            {/*                        opacity: 0;*/}
            {/*                        transform: translateY(20px);*/}
            {/*                    }*/}
            {/*                    to {*/}
            {/*                        opacity: 1;*/}
            {/*                        transform: translateY(0);*/}
            {/*                    }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes smoothChange {*/}
            {/*                    0% { */}
            {/*                        opacity: 0; */}
            {/*                        transform: scale(0.95); */}
            {/*                    }*/}
            {/*                    100% { */}
            {/*                        opacity: 1; */}
            {/*                        transform: scale(1); */}
            {/*                    }*/}
            {/*                }*/}
            {/*                */}
            {/*                @keyframes gentlePulse {*/}
            {/*                    0%, 100% { opacity: 0.5; }*/}
            {/*                    50% { opacity: 1; }*/}
            {/*                }*/}
            {/*                @keyframes play {*/}
            {/*                  to {*/}
            {/*                    background-position: 100% 0;*/}
            {/*                  }*/}
            {/*                }*/}
            {/*            `}*/}
            {/*</style>*/}
        </>
    );
}