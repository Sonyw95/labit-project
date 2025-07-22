import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Avatar,
    Badge,
    ActionIcon,
    Divider,
    ScrollArea,
    Menu,
    Button,
    Card,
    Box,
    useMantineTheme,
    useMantineColorScheme,
    Tooltip,
    FloatingIndicator,
    Anchor,
    rem,
    em,
    Flex
} from '@mantine/core';
import {
    IconHeart,
    IconBookmark,
    IconShare,
    IconDots,
    IconCalendar,
    IconEye,
    IconMessage,
    IconArrowLeft,
    IconCopy,
    IconBrandX,
    IconBrandLinkedin,
    IconBrandFacebook,
    IconSun,
    IconMoon,
    IconSparkles,
    IconCode
} from '@tabler/icons-react';

// 샘플 Rich Text Editor에서 생성된 HTML 컨텐츠 (코드 블럭과 하이라이트 포함)
const samplePostContent = `
<h1 style="color: #2563eb; font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
  The Future of Web Development in 2025
</h1>

<p style="font-size: 1.125rem; line-height: 1.8; color: var(--mantine-color-text); margin-bottom: 1.5rem;">
  Web development has evolved dramatically over the past few years, and 2025 promises to bring even more exciting changes. From <strong style="color: #f59e0b;">AI-powered development tools</strong> to <em style="color: #8b5cf6;">revolutionary design paradigms</em>, let's explore what's shaping the future of our industry.
</p>

<h2 style="color: #059669; font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem 0; position: relative;">
  🚀 Key Technologies Driving Change
</h2>

<ul style="margin: 1.5rem 0; padding-left: 1.5rem;">
  <li style="margin-bottom: 0.75rem; font-size: 1.125rem;"><strong>React Server Components</strong> - Enabling better performance and developer experience</li>
  <li style="margin-bottom: 0.75rem; font-size: 1.125rem;"><strong>Edge Computing</strong> - Bringing computation closer to users</li>
  <li style="margin-bottom: 0.75rem; font-size: 1.125rem;"><strong>WebAssembly</strong> - High-performance applications in the browser</li>
  <li style="margin-bottom: 0.75rem; font-size: 1.125rem;"><strong>AI Integration</strong> - Smart code generation and optimization</li>
</ul>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 16px; margin: 2rem 0; color: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
  <h3 style="color: white; font-size: 1.5rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
    ✨ Pro Tip
  </h3>
  <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.125rem; line-height: 1.6; margin: 0;">
    Always stay updated with the latest trends, but don't chase every new framework. Focus on mastering the fundamentals and choose technologies that solve real problems for your users.
  </p>
</div>

<h2 style="color: #dc2626; font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem 0;">
  💻 Code Example: Modern React Hook
</h2>

<p style="margin-bottom: 1rem; color: var(--mantine-color-text);">
  Here's an example of a modern React hook that showcases 2025 best practices:
</p>

<pre style="background: #1f2937; color: #f9fafb; padding: 1.5rem; border-radius: 12px; overflow-x: auto; font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; font-size: 0.875rem; line-height: 1.5; margin: 1.5rem 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);"><code><span style="color: #60a5fa;">import</span> <span style="color: #a78bfa;">{ useState, useEffect, useCallback }</span> <span style="color: #60a5fa;">from</span> <span style="color: #34d399;">'react'</span>;

<span style="color: #fb7185;">// Custom hook for API data fetching with error handling</span>
<span style="color: #60a5fa;">export</span> <span style="color: #60a5fa;">const</span> <span style="color: #fbbf24;">useApiData</span> = <span style="color: #a78bfa;">(url: string)</span> => {
  <span style="color: #60a5fa;">const</span> [<span style="color: #fbbf24;">data</span>, <span style="color: #fbbf24;">setData</span>] = <span style="color: #a78bfa;">useState</span>(<span style="color: #60a5fa;">null</span>);
  <span style="color: #60a5fa;">const</span> [<span style="color: #fbbf24;">loading</span>, <span style="color: #fbbf24;">setLoading</span>] = <span style="color: #a78bfa;">useState</span>(<span style="color: #60a5fa;">true</span>);
  <span style="color: #60a5fa;">const</span> [<span style="color: #fbbf24;">error</span>, <span style="color: #fbbf24;">setError</span>] = <span style="color: #a78bfa;">useState</span>(<span style="color: #60a5fa;">null</span>);

  <span style="color: #60a5fa;">const</span> <span style="color: #fbbf24;">fetchData</span> = <span style="color: #a78bfa;">useCallback</span>(<span style="color: #60a5fa;">async</span> () => {
    <span style="color: #60a5fa;">try</span> {
      <span style="color: #fbbf24;">setLoading</span>(<span style="color: #60a5fa;">true</span>);
      <span style="color: #60a5fa;">const</span> <span style="color: #fbbf24;">response</span> = <span style="color: #60a5fa;">await</span> <span style="color: #a78bfa;">fetch</span>(url);
      <span style="color: #60a5fa;">const</span> <span style="color: #fbbf24;">result</span> = <span style="color: #60a5fa;">await</span> response.<span style="color: #fbbf24;">json</span>();
      <span style="color: #fbbf24;">setData</span>(result);
    } <span style="color: #60a5fa;">catch</span> (err) {
      <span style="color: #fbbf24;">setError</span>(err);
    } <span style="color: #60a5fa;">finally</span> {
      <span style="color: #fbbf24;">setLoading</span>(<span style="color: #60a5fa;">false</span>);
    }
  }, [url]);

  <span style="color: #a78bfa;">useEffect</span>(() => {
    <span style="color: #fbbf24;">fetchData</span>();
  }, [fetchData]);

  <span style="color: #60a5fa;">return</span> { data, loading, error, refetch: fetchData };
};</code></pre>

<h2 style="color: #7c3aed; font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem 0;">
  🎨 Design Trends Shaping 2025
</h2>

<p style="font-size: 1.125rem; line-height: 1.8; color: var(--mantine-color-text); margin-bottom: 1.5rem;">
  The design landscape in 2025 is characterized by <mark style="background: linear-gradient(120deg, #a78bfa 0%, #fbbf24 100%); padding: 0.2rem 0.5rem; border-radius: 6px; color: white; font-weight: 600;">bold, high-contrast designs</mark> and <mark style="background: linear-gradient(120deg, #34d399 0%, #059669 100%); padding: 0.2rem 0.5rem; border-radius: 6px; color: white; font-weight: 600;">micro-interactions</mark> that create immersive user experiences.
</p>

<blockquote style="border-left: 4px solid #8b5cf6; padding: 1.5rem; margin: 2rem 0; background: rgba(139, 92, 246, 0.05); border-radius: 0 12px 12px 0; font-style: italic; color: var(--mantine-color-text);">
  <p style="font-size: 1.25rem; line-height: 1.6; margin: 0;">
    "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs
  </p>
</blockquote>

<h3 style="color: #0891b2; font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 1rem 0;">
  Key Design Elements for 2025:
</h3>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <h4 style="color: #92400e; font-size: 1.25rem; margin-bottom: 0.75rem;">🌟 Vivid Glow</h4>
    <p style="color: #92400e; margin: 0; line-height: 1.5;">Bright, glowing colors that seem to emit light and capture attention with unmistakable vibrancy.</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #dcfce7 0%, #16a34a 100%); padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <h4 style="color: #14532d; font-size: 1.25rem; margin-bottom: 0.75rem;">🍃 Organic Matter</h4>
    <p style="color: #14532d; margin: 0; line-height: 1.5;">Natural shapes, textures, and earth-inspired colors that bring warmth to digital spaces.</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #e0e7ff 0%, #6366f1 100%); padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <h4 style="color: #312e81; font-size: 1.25rem; margin-bottom: 0.75rem;">🎭 Anti-Design</h4>
    <p style="color: #312e81; margin: 0; line-height: 1.5;">Breaking traditional rules with asymmetrical layouts and unconventional design choices.</p>
  </div>
</div>

<h2 style="color: #059669; font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem 0;">
  🔮 Looking Ahead
</h2>

<p style="font-size: 1.125rem; line-height: 1.8; color: var(--mantine-color-text); margin-bottom: 1.5rem;">
  As we move through 2025, the focus will continue to be on creating <strong>meaningful, accessible, and performant</strong> web experiences. The integration of AI tools will streamline development workflows, while designers push creative boundaries with bold visual expressions.
</p>

<div style="background: linear-gradient(135deg, #f3e8ff 0%, #8b5cf6 100%); padding: 2rem; border-radius: 20px; margin: 2rem 0; text-align: center; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 4s ease-in-out infinite;"></div>
  <h3 style="color: white; font-size: 1.75rem; margin-bottom: 1rem; position: relative; z-index: 1;">
    🚀 Ready to Build the Future?
  </h3>
  <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.125rem; margin: 0; position: relative; z-index: 1;">
    Join the revolution and start implementing these cutting-edge technologies and design trends in your next project!
  </p>
</div>

<style>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}
</style>
`;

const PostView = () => {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likes, setLikes] = useState(247);
    const [showFloatingActions, setShowFloatingActions] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingActions(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
    };

    const sharePost = (platform) => {
        const url = window.location.href;
        const title = "The Future of Web Development in 2025";

        switch(platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`);
                break;
            case 'linkedin':
                window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}`);
                break;
            case 'facebook':
                window.open(`https://facebook.com/sharer/sharer.php?u=${url}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                break;
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: colorScheme === 'dark'
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                    : 'linear-gradient(135deg, #fafbff 0%, #f1f5f9 100%)',
                position: 'relative'
            }}
        >
            {/* Floating Background Elements - 2025 Trend */}
            <Box
                style={{
                    position: 'fixed',
                    top: '10%',
                    right: '5%',
                    width: rem(200),
                    height: rem(200),
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    zIndex: 0,
                    animation: 'float 6s ease-in-out infinite'
                }}
            />
            <Box
                style={{
                    position: 'fixed',
                    bottom: '20%',
                    left: '10%',
                    width: rem(150),
                    height: rem(150),
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    zIndex: 0,
                    animation: 'float 8s ease-in-out infinite reverse'
                }}
            />

            {/* Header with Back Navigation */}
            {/*<Container size="lg" style={{ position: 'relative', zIndex: 1 }}>*/}
            {/*    <Group justify="space-between" py="xl">*/}
            {/*        <Button*/}
            {/*            variant="subtle"*/}
            {/*            leftSection={<IconArrowLeft size={rem(16)} />}*/}
            {/*            size="sm"*/}
            {/*            style={{*/}
            {/*                background: colorScheme === 'dark'*/}
            {/*                    ? 'rgba(255, 255, 255, 0.1)'*/}
            {/*                    : 'rgba(0, 0, 0, 0.05)',*/}
            {/*                backdropFilter: 'blur(10px)',*/}
            {/*                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,*/}
            {/*                borderRadius: rem(12)*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Back to Blog*/}
            {/*        </Button>*/}

            {/*        <ActionIcon*/}
            {/*            variant="subtle"*/}
            {/*            size="lg"*/}
            {/*            onClick={() => toggleColorScheme()}*/}
            {/*            style={{*/}
            {/*                background: colorScheme === 'dark'*/}
            {/*                    ? 'rgba(255, 255, 255, 0.1)'*/}
            {/*                    : 'rgba(0, 0, 0, 0.05)',*/}
            {/*                backdropFilter: 'blur(10px)',*/}
            {/*                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,*/}
            {/*                borderRadius: rem(12)*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {colorScheme === 'dark' ? <IconSun size={rem(18)} /> : <IconMoon size={rem(18)} />}*/}
            {/*        </ActionIcon>*/}
            {/*    </Group>*/}
            {/*</Container>*/}

            {/* Main Content */}
            <Container size="md" pb="xl" style={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    shadow="xl"
                    radius="xl"
                    p={0}
                    style={{
                        background: colorScheme === 'dark'
                            ? 'rgba(30, 41, 59, 0.8)'
                            : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                        overflow: 'hidden'
                    }}
                >
                    {/* Post Header */}
                    <Box p="xl">
                        <Group justify="space-between" mb="lg">
                            <Group>
                                <Avatar
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    size="lg"
                                    radius="xl"
                                    style={{
                                        border: '3px solid',
                                        borderColor: theme.colors.blue[5]
                                    }}
                                />
                                <Stack gap={rem(4)}>
                                    <Text size="lg" fw={600}>Alex Chen</Text>
                                    <Group gap="xs">
                                        <Badge
                                            variant="light"
                                            color="blue"
                                            size="sm"
                                            style={{ borderRadius: rem(8) }}
                                        >
                                            Senior Developer
                                        </Badge>
                                        <Badge
                                            variant="light"
                                            color="green"
                                            size="sm"
                                            style={{ borderRadius: rem(8) }}
                                        >
                                            Tech Lead
                                        </Badge>
                                    </Group>
                                </Stack>
                            </Group>

                            <Menu shadow="md" width={200} position="bottom-end">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" size="lg" radius="xl">
                                        <IconDots size={rem(18)} />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item leftSection={<IconBookmark size={rem(14)} />}>
                                        Save Post
                                    </Menu.Item>
                                    <Menu.Item leftSection={<IconShare size={rem(14)} />}>
                                        Share
                                    </Menu.Item>
                                    <Menu.Item leftSection={<IconCopy size={rem(14)} />}>
                                        Copy Link
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>

                        {/* Post Meta */}
                        <Group mb="xl" justify="space-between">
                            <Group gap="md">
                                <Group gap="xs" style={{ color: theme.colors.gray[6] }}>
                                    <IconCalendar size={rem(16)} />
                                    <Text size="sm">March 15, 2025</Text>
                                </Group>
                                <Group gap="xs" style={{ color: theme.colors.gray[6] }}>
                                    <IconEye size={rem(16)} />
                                    <Text size="sm">1.2k views</Text>
                                </Group>
                                <Group gap="xs" style={{ color: theme.colors.gray[6] }}>
                                    <IconMessage size={rem(16)} />
                                    <Text size="sm">23 comments</Text>
                                </Group>
                            </Group>

                            <Badge
                                variant="light"
                                color="violet"
                                size="lg"
                                leftSection={<IconSparkles size={15} />}
                                style={{ borderRadius: rem(12) }}
                            >
                                Featured
                            </Badge>
                        </Group>
                    </Box>

                    <Divider />

                    {/* Post Content */}
                    <Box p="xl">
                        <div
                            dangerouslySetInnerHTML={{ __html: samplePostContent }}
                            style={{
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    fontFamily: theme.fontFamily
                                },
                                '& p': {
                                    fontFamily: theme.fontFamily
                                },
                                '& pre': {
                                    position: 'relative'
                                },
                                '& code': {
                                    fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", "Consolas", monospace'
                                }
                            }}
                        />
                    </Box>

                    <Divider />

                    {/* Post Actions */}
                    <Box p="xl">
                        <Group justify="space-between">
                            <Group>
                                <Tooltip label={liked ? "Unlike" : "Like this post"}>
                                    <ActionIcon
                                        variant={liked ? "filled" : "subtle"}
                                        color="red"
                                        size="lg"
                                        radius="xl"
                                        onClick={handleLike}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            transform: liked ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    >
                                        <IconHeart size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                                <Text size="sm" c="dimmed">{likes}</Text>

                                <Tooltip label={bookmarked ? "Remove bookmark" : "Bookmark this post"}>
                                    <ActionIcon
                                        variant={bookmarked ? "filled" : "subtle"}
                                        color="blue"
                                        size="lg"
                                        radius="xl"
                                        onClick={() => setBookmarked(!bookmarked)}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            transform: bookmarked ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    >
                                        <IconBookmark size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>

                            <Group>
                                <Tooltip label="Share on Twitter">
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        size="lg"
                                        radius="xl"
                                        onClick={() => sharePost('twitter')}
                                    >
                                        <IconBrandX size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Share on LinkedIn">
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        size="lg"
                                        radius="xl"
                                        onClick={() => sharePost('linkedin')}
                                    >
                                        <IconBrandLinkedin size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Share on Facebook">
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        size="lg"
                                        radius="xl"
                                        onClick={() => sharePost('facebook')}
                                    >
                                        <IconBrandFacebook size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Copy link">
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="lg"
                                        radius="xl"
                                        onClick={() => sharePost('copy')}
                                    >
                                        <IconCopy size={rem(18)} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Box>
                </Paper>

                {/* Floating Action Buttons - 2025 Trend */}
                {showFloatingActions && (
                    <Box
                        style={{
                            position: 'fixed',
                            right: rem(24),
                            bottom: rem(24),
                            zIndex: 1000
                        }}
                    >
                        <Stack gap="xs">
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="filled"
                                color="red"
                                onClick={handleLike}
                                style={{
                                    background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
                                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5)',
                                    transform: liked ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <IconHeart size={rem(20)} />
                            </ActionIcon>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="filled"
                                color="blue"
                                onClick={() => setBookmarked(!bookmarked)}
                                style={{
                                    background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                                    transform: bookmarked ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <IconBookmark size={rem(20)} />
                            </ActionIcon>
                            <ActionIcon
                                size="xl"
                                radius="xl"
                                variant="filled"
                                color="green"
                                onClick={() => sharePost('copy')}
                                style={{
                                    background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.5)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <IconShare size={rem(20)} />
                            </ActionIcon>
                        </Stack>
                    </Box>
                )}

                {/* Related Posts Section */}
                <Box mt="xl">
                    <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
                        Related Articles
                    </Title>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: rem(24) }}>
                        {[
                            {
                                title: "React 19: What's New and Exciting",
                                excerpt: "Explore the latest features and improvements in React 19...",
                                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
                                readTime: "5 min read",
                                category: "React"
                            },
                            {
                                title: "TypeScript Best Practices for 2025",
                                excerpt: "Level up your TypeScript skills with these modern patterns...",
                                image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
                                readTime: "8 min read",
                                category: "TypeScript"
                            },
                            {
                                title: "Building Scalable Design Systems",
                                excerpt: "Learn how to create maintainable design systems that grow...",
                                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
                                readTime: "12 min read",
                                category: "Design"
                            }
                        ].map((post, index) => (
                            <Card
                                key={index}
                                shadow="md"
                                radius="lg"
                                style={{
                                    background: colorScheme === 'dark'
                                        ? 'rgba(30, 41, 59, 0.8)'
                                        : 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                }}
                            >
                                <Card.Section>
                                    <Box
                                        style={{
                                            height: rem(180),
                                            backgroundImage: `url(${post.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative'
                                        }}
                                    >
                                        <Badge
                                            variant="filled"
                                            style={{
                                                position: 'absolute',
                                                top: rem(12),
                                                right: rem(12),
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        >
                                            {post.category}
                                        </Badge>
                                    </Box>
                                </Card.Section>

                                <Box p="md">
                                    <Title order={4} mb="xs" lineClamp={2}>
                                        {post.title}
                                    </Title>
                                    <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                                        {post.excerpt}
                                    </Text>
                                    <Group justify="space-between">
                                        <Text size="xs" c="dimmed">{post.readTime}</Text>
                                        <Anchor size="sm" fw={600}>
                                            Read more →
                                        </Anchor>
                                    </Group>
                                </Box>
                            </Card>
                        ))}
                    </div>
                </Box>
            </Container>

            {/* CSS for animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.1; 
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${colorScheme === 'dark' ? '#1f2937' : '#f1f5f9'};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        /* Code block enhancements */
        pre {
          position: relative;
        }
        
        pre::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          border-radius: 12px 12px 0 0;
        }
        
        /* Smooth text selection */
        ::selection {
          background: rgba(139, 92, 246, 0.3);
          color: inherit;
        }
        
        ::-moz-selection {
          background: rgba(139, 92, 246, 0.3);
          color: inherit;
        }

        /* Enhanced link styles */
        a {
          position: relative;
          text-decoration: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }
        
        a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }
        
        a:hover::after {
          width: 100%;
        }

        /* Micro-interactions for buttons */
        button, [role="button"] {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        button:active, [role="button"]:active {
          transform: scale(0.95);
        }

        /* Glassmorphism effects */
        .glass-effect {
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
        </Box>
    );
};

export default PostView;