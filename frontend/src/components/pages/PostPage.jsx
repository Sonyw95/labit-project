import PostCardList from "@/components/section/PostCardList.jsx";
import {useOutletContext, useParams} from "react-router-dom";
import {Box, Button, Center, Container, Group, Overlay, Stack, Text, TextInput, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";

export default function PostPage() {
    const { dark } = useOutletContext();
    const {id} = useParams();

    // 배너 이미지 슬라이드
    const bannerImages = [
        {
            url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1920&h=1080&fit=crop",
            title: "Modern Web Design",
            subtitle: "2025 Design Trends"
        },
        {
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop",
            title: "AI-Powered Interfaces",
            subtitle: "The Future of UX"
        },
        {
            url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop",
            title: "Immersive Experiences",
            subtitle: "Next-Gen Web"
        },
        {
            url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&h=1080&fit=crop",
            title: "React Revolution",
            subtitle: "Component-Driven Design"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    // 자동 슬라이드
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerImages.length]);
    return(
        <>
            {/*<Box ta="center">*/}
            {/*    <Text*/}
            {/*        fw={900}*/}
            {/*        mt='xl'*/}
            {/*        style={{*/}
            {/*            backgroundImage: !dark*/}
            {/*                ? 'linear-gradient(135deg, var(--mantine-color-dark-6),  var(--mantine-color-gray-6))'*/}
            {/*                : 'linear-gradient(135deg, var(--mantine-color-dark-1),  var(--mantine-color-gray-3))',*/}
            {/*            backgroundClip: 'text',*/}
            {/*            WebkitBackgroundClip: 'text',*/}
            {/*            color: 'transparent',*/}
            {/*            fontSize: 'clamp(2rem, 5vw, 3rem)',*/}
            {/*            textShadow: !dark*/}
            {/*                ? '0 4px 20px rgba(0, 0, 0, 0.1)'*/}
            {/*                : '0 4px 20px rgba(255, 255, 255, 0.1)'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {id.toUpperCase()} 포스팅*/}
            {/*    </Text>*/}
            {/*    <Text*/}
            {/*        size="lg"*/}
            {/*        c="dimmed"*/}
            {/*        mt="sm"*/}
            {/*        mb='xl'*/}
            {/*        style={{*/}
            {/*            fontSize: 'clamp(1rem, 2vw, 1.25rem)',*/}
            {/*            maxWidth: '600px',*/}
            {/*            margin: '0 auto'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {id.toUpperCase()} 을 기록하는 공간 입니다.*/}
            {/*    </Text>*/}
            {/*</Box>*/}
            {/* Post Image Banner */}
            <Box
                style={{
                    height: '90vh',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Background Images with Slide Animation */}
                {bannerImages.map((image, index) => (
                    <Box
                        key={index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${image.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            opacity: currentSlide === index ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out, transform 0.5s ease',
                            transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
                            filter: `brightness(0.7) contrast(1.1) saturate(1.2)`,
                        }}
                    />
                ))}



                {/* Content */}
                <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
                    <Center>
                        <Stack align="center" gap="xl" style={{ textAlign: 'center' }}>
                            {/* Dynamic Title */}
                            <Stack align="center" gap="md">
                                <Title
                                    order={1}
                                    size="3.5rem"
                                    style={{
                                        color: 'white',
                                        fontWeight: 800,
                                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                                        background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.1,
                                        opacity: currentSlide >= 0 ? 1 : 0,
                                        transform: currentSlide >= 0 ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.8s ease-out',
                                    }}
                                >
                                    {bannerImages[currentSlide]?.title}
                                </Title>
                                <Text
                                    size="xl"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                                        fontWeight: 500,
                                        letterSpacing: '0.02em',
                                        opacity: currentSlide >= 0 ? 1 : 0,
                                        transform: currentSlide >= 0 ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.8s ease-out 0.2s',
                                    }}
                                >
                                    {bannerImages[currentSlide]?.subtitle}
                                </Text>
                            </Stack>

                            {/* Search Input Bar */}
                            <Box
                                style={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    opacity: currentSlide >= 0 ? 1 : 0,
                                    transform: currentSlide >= 0 ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'all 0.8s ease-out 0.4s',
                                }}
                            >
                                <TextInput
                                    size="xl"
                                    radius="xl"
                                    placeholder="블로그 포스트를 검색해보세요..."
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.currentTarget.value)}
                                    leftSection={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8"/>
                                            <path d="m21 21-4.35-4.35"/>
                                        </svg>
                                    }
                                    rightSection={
                                        searchValue && (
                                            <Button
                                                variant="subtle"
                                                size="xs"
                                                radius="xl"
                                                onClick={() => setSearchValue('')}
                                                style={{
                                                    minWidth: 'auto',
                                                    padding: '4px 8px',
                                                    height: '24px'
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        )
                                    }
                                    style={{
                                        '& .mantine-TextInput-input': {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontSize: '18px',
                                            padding: '16px 20px',
                                            height: '60px',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                            transition: 'all 0.3s ease',
                                        },
                                        '& .mantine-TextInput-input::placeholder': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                        },
                                        '& .mantine-TextInput-input:focus': {
                                            background: 'rgba(255, 255, 255, 0.25)',
                                            border: '1px solid rgba(255, 255, 255, 0.4)',
                                            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                />
                            </Box>

                            {/*/!* Slide Indicators *!/*/}
                            {/*<Group gap="xs" style={{ marginTop: '2rem' }}>*/}
                            {/*    {bannerImages.map((_, index) => (*/}
                            {/*        <Box*/}
                            {/*            key={index}*/}
                            {/*            onClick={() => setCurrentSlide(index)}*/}
                            {/*            style={{*/}
                            {/*                width: currentSlide === index ? '32px' : '12px',*/}
                            {/*                height: '4px',*/}
                            {/*                background: currentSlide === index*/}
                            {/*                    ? 'rgba(255, 255, 255, 0.9)'*/}
                            {/*                    : 'rgba(255, 255, 255, 0.4)',*/}
                            {/*                borderRadius: '2px',*/}
                            {/*                cursor: 'pointer',*/}
                            {/*                transition: 'all 0.3s ease',*/}
                            {/*                boxShadow: currentSlide === index*/}
                            {/*                    ? '0 2px 8px rgba(255, 255, 255, 0.3)'*/}
                            {/*                    : 'none',*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    ))}*/}
                            {/*</Group>*/}
                        </Stack>
                    </Center>
                </Container>

                {/* Scroll Indicator */}
                <Box
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        animation: 'bounce 2s infinite',
                        zIndex: 3,
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                </Box>

                <style>{`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {
                            transform: translateX(-50%) translateY(0);
                        }
                        40% {
                            transform: translateX(-50%) translateY(-10px);
                        }
                        60% {
                            transform: translateX(-50%) translateY(-5px);
                        }
                    }
                `}</style>
            </Box>
            {/* 포스팅 버튼 */}
            <Group justify="space-between" align="center" mb="md">
                <div></div> {/* 왼쪽 여백 */}
                <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                    size="md"
                    radius="md"
                    leftSection={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    }
                    style={{
                        boxShadow: '0 4px 12px rgba(34, 139, 230, 0.4)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(34, 139, 230, 0.5)',
                        }
                    }}
                    onClick={() => {
                        // 포스팅 페이지로 이동하거나 모달 열기
                        console.log('포스트 작성 버튼 클릭');
                    }}
                >
                    새 포스트 작성
                </Button>
            </Group>
            <PostCardList opts={{
                maxCount: 9,
                category: 'all',
            }} dark={dark}/>
        </>
    )

}