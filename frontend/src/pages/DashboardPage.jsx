import React, { useState, useCallback, useMemo } from 'react';
import {
    AppShell,
    Text,
    Group,
    Badge,
    Card,
    Grid,
    Stack,
    Avatar,
    ActionIcon,
    Progress,
    ScrollArea,
    Divider,
    Button,
    UnstyledButton,
    Box,
    Paper,
    SimpleGrid,
    ThemeIcon,
    Title,
    Anchor,
    Menu,
    Container,
    createTheme,
    Collapse,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconBell,
    IconSearch,
    IconSettings,
    IconTrendingUp,
    IconEye,
    IconHeart,
    IconMessageCircle,
    IconDots,
    IconEdit,
    IconShare,
    IconBookmark,
    IconTag,
    IconChartBar,
    IconClock,
    IconUsers,
    IconTarget,
    IconHome,
    IconServer,
    IconCoffee,
    IconLeaf,
    IconDatabase,
    IconCircle,
    IconComponents,
    IconBrush,
    IconLayersIntersect,
    IconDeviceHeartMonitor,
    IconChevronRight,
    IconChevronDown,
    IconGripVertical,
    IconMoon,
    IconSun
} from '@tabler/icons-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Theme configuration
const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
});

// Navigation data
const NAVIGATION_DATA = [
    {
        LEVEL: 1,
        TREE_LABEL: "홈",
        ID: 1,
        LABEL: "홈",
        HREF: "/home",
        PARENT_ID: null,
        SORT_ORDER: 1,
        DEPTH: 1,
        ICON: "IconHome",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 1,
        TREE_LABEL: "Backend",
        ID: 2,
        LABEL: "Backend",
        HREF: null,
        PARENT_ID: null,
        SORT_ORDER: 2,
        DEPTH: 1,
        ICON: "IconServer",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 2,
        TREE_LABEL: "    Java",
        ID: 4,
        LABEL: "Java",
        HREF: "/posts/java",
        PARENT_ID: 2,
        SORT_ORDER: 1,
        DEPTH: 2,
        ICON: "IconCoffee",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 2,
        TREE_LABEL: "    Spring Boot",
        ID: 5,
        LABEL: "Spring Boot",
        HREF: "/posts/spring-boot",
        PARENT_ID: 2,
        SORT_ORDER: 2,
        DEPTH: 2,
        ICON: "IconLeaf",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 2,
        TREE_LABEL: "    Database",
        ID: 6,
        LABEL: "Database",
        HREF: null,
        PARENT_ID: 2,
        SORT_ORDER: 3,
        DEPTH: 2,
        ICON: "IconDatabase",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 3,
        TREE_LABEL: "        Oracle",
        ID: 10,
        LABEL: "Oracle",
        HREF: "/posts/oracle",
        PARENT_ID: 6,
        SORT_ORDER: 1,
        DEPTH: 3,
        ICON: "IconCircle",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 4,
        TREE_LABEL: "            Mantine",
        ID: 12,
        LABEL: "Mantine",
        HREF: "/posts/mantine",
        PARENT_ID: 10,
        SORT_ORDER: 1,
        DEPTH: 4,
        ICON: "IconComponents",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 4,
        TREE_LABEL: "            Tailwind CSS",
        ID: 13,
        LABEL: "Tailwind CSS",
        HREF: "/posts/tailwind",
        PARENT_ID: 10,
        SORT_ORDER: 2,
        DEPTH: 4,
        ICON: "IconBrush",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 3,
        TREE_LABEL: "        JPA/Hibernate",
        ID: 11,
        LABEL: "JPA/Hibernate",
        HREF: "/posts/jpa",
        PARENT_ID: 6,
        SORT_ORDER: 2,
        DEPTH: 3,
        ICON: "IconLayersIntersect",
        IS_ACTIVE: 1
    },
    {
        LEVEL: 1,
        TREE_LABEL: "Frontend",
        ID: 3,
        LABEL: "Frontend",
        HREF: null,
        PARENT_ID: null,
        SORT_ORDER: 3,
        DEPTH: 1,
        ICON: "IconDeviceHeartMonitor",
        IS_ACTIVE: 1
    }
];

// Icon mapping
const ICON_MAP = {
    IconHome,
    IconServer,
    IconCoffee,
    IconLeaf,
    IconDatabase,
    IconCircle,
    IconComponents,
    IconBrush,
    IconLayersIntersect,
    IconDeviceHeartMonitor,
    IconChartBar,
    IconEdit,
    IconUsers,
    IconTrendingUp,
    IconTag,
    IconClock
};

// Mock data
const STATS_DATA = [
    { name: 'Jan', views: 4000, likes: 240, comments: 140 },
    { name: 'Feb', views: 3000, likes: 139, comments: 221 },
    { name: 'Mar', views: 2000, likes: 980, comments: 229 },
    { name: 'Apr', views: 2780, likes: 390, comments: 200 },
    { name: 'May', views: 1890, likes: 480, comments: 218 },
    { name: 'Jun', views: 2390, likes: 380, comments: 250 },
];

const TAG_DATA = [
    { name: 'React', value: 45, color: '#61dafb' },
    { name: 'JavaScript', value: 35, color: '#f7df1e' },
    { name: 'TypeScript', value: 25, color: '#3178c6' },
    { name: 'Node.js', value: 20, color: '#339933' },
    { name: 'CSS', value: 15, color: '#1572b6' },
];

const RECENT_POSTS = [
    { id: 1, title: 'React 19의 새로운 기능들', views: 1024, likes: 45, comments: 12, publishedAt: '2시간 전', tags: ['React', 'JavaScript'] },
    { id: 2, title: 'TypeScript 타입 시스템 완벽 가이드', views: 856, likes: 32, comments: 8, publishedAt: '1일 전', tags: ['TypeScript', 'Frontend'] },
    { id: 3, title: 'Mantine UI로 대시보드 만들기', views: 742, likes: 28, comments: 15, publishedAt: '3일 전', tags: ['Mantine', 'UI/UX'] },
    { id: 4, title: 'Next.js 15 App Router 심화', views: 634, likes: 21, comments: 6, publishedAt: '5일 전', tags: ['Next.js', 'React'] },
];

// Utility functions
const buildNavigationTree = (data) => {
    const itemMap = new Map();
    const rootItems = [];

    // Create map of all items
    data.forEach(item => {
        itemMap.set(item.ID, { ...item, children: [] });
    });

    // Build tree structure
    data.forEach(item => {
        const currentItem = itemMap.get(item.ID);
        if (item.PARENT_ID === null) {
            rootItems.push(currentItem);
        } else {
            const parent = itemMap.get(item.PARENT_ID);
            if (parent) {
                parent.children.push(currentItem);
            }
        }
    });

    return rootItems.sort((a, b) => a.SORT_ORDER - b.SORT_ORDER);
};

const renderIcon = (iconName, size = 16) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent size={size} /> : <IconCircle size={size} />;
};

// Components
const StatCard = ({ title, value, change, icon, color, subtitle }) => (
    <Card p="md" radius="md" withBorder h="100%">
        <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={500}>{title}</Text>
            <ThemeIcon color={color} variant="light" size="sm">
                {icon}
            </ThemeIcon>
        </Group>
        <Text fw={700} size="xl" mb={4}>{value}</Text>
        {subtitle && <Text size="xs" c="dimmed" mb="xs">{subtitle}</Text>}
        <Group gap={4}>
            <Text size="xs" c={change >= 0 ? 'teal' : 'red'} fw={500}>
                {change >= 0 ? '+' : ''}{change}%
            </Text>
            <Text size="xs" c="dimmed">지난달 대비</Text>
        </Group>
    </Card>
);

const PostCard = ({ post }) => (
    <Card p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
            <Anchor component="button" size="sm" fw={600} lineClamp={1}>
                {post.title}
            </Anchor>
            <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDots size={14} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEdit size={14} />}>수정</Menu.Item>
                    <Menu.Item leftSection={<IconShare size={14} />}>공유</Menu.Item>
                    <Menu.Item leftSection={<IconBookmark size={14} />}>북마크</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>

        <Group gap={8} mb="sm">
            {post.tags.map((tag) => (
                <Badge key={tag} variant="light" size="xs">{tag}</Badge>
            ))}
        </Group>

        <Group justify="space-between" align="center">
            <Group gap="lg">
                <Group gap={4}>
                    <IconEye size={14} color="#868e96" />
                    <Text size="xs" c="dimmed">{post.views}</Text>
                </Group>
                <Group gap={4}>
                    <IconHeart size={14} color="#868e96" />
                    <Text size="xs" c="dimmed">{post.likes}</Text>
                </Group>
                <Group gap={4}>
                    <IconMessageCircle size={14} color="#868e96" />
                    <Text size="xs" c="dimmed">{post.comments}</Text>
                </Group>
            </Group>
            <Text size="xs" c="dimmed">{post.publishedAt}</Text>
        </Group>
    </Card>
);

const NavigationItem = ({ item, index, onToggle, expandedItems }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.ID);
    const paddingLeft = (item.DEPTH - 1) * 16;

    return (
        <Draggable draggableId={item.ID.toString()} index={index}>
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                >
                    <UnstyledButton
                        w="100%"
                        p="xs"
                        style={{
                            borderRadius: 6,
                            paddingLeft: paddingLeft + 8,
                            backgroundColor: snapshot.isDragging ? 'var(--mantine-color-blue-light)' : 'transparent'
                        }}
                        onClick={() => hasChildren && onToggle(item.ID)}
                    >
                        <Group gap="xs" wrap="nowrap">
                            <Box {...provided.dragHandleProps}>
                                <IconGripVertical size={12} color="gray" />
                            </Box>

                            {hasChildren && (
                                <ActionIcon size="xs" variant="transparent">
                                    {isExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
                                </ActionIcon>
                            )}

                            {renderIcon(item.ICON, 14)}

                            <Text size="sm" truncate>
                                {item.LABEL}
                            </Text>
                        </Group>
                    </UnstyledButton>

                    {hasChildren && (
                        <Collapse in={isExpanded}>
                            <Droppable droppableId={`children-${item.ID}`} type="navigation">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                                        {item.children.map((child, childIndex) => (
                                            <NavigationItem
                                                key={child.ID}
                                                item={child}
                                                index={childIndex}
                                                onToggle={onToggle}
                                                expandedItems={expandedItems}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Collapse>
                    )}
                </Box>
            )}
        </Draggable>
    );
};

const NavigationMenu = ({ navigationData, onReorder }) => {
    const [expandedItems, setExpandedItems] = useState(new Set([2, 6])); // Backend and Database expanded by default

    const handleToggle = useCallback((itemId) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;
        onReorder(result);
    }, [onReorder]);

    const navigationTree = useMemo(() => buildNavigationTree(navigationData), [navigationData]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="navigation-root" type="navigation">
                {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                        {navigationTree.map((item, index) => (
                            <NavigationItem
                                key={item.ID}
                                item={item}
                                index={index}
                                onToggle={handleToggle}
                                expandedItems={expandedItems}
                            />
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

const TagCloud = () => (
    <Card p="md" radius="md" withBorder h="100%">
        <Group justify="space-between" mb="md">
            <Text fw={600} size="sm">인기 태그</Text>
            <Button variant="subtle" size="xs" compact>더보기</Button>
        </Group>
        <Stack gap="xs">
            {TAG_DATA.map((tag) => (
                <Group key={tag.name} justify="space-between">
                    <Group gap="xs">
                        <Box
                            w={8}
                            h={8}
                            style={{ backgroundColor: tag.color, borderRadius: '50%' }}
                        />
                        <Text size="sm">{tag.name}</Text>
                    </Group>
                    <Badge variant="light" size="xs">{tag.value}</Badge>
                </Group>
            ))}
        </Stack>
    </Card>
);

const ActivityHeatmap = () => (
    <Card p="md" radius="md" withBorder h="100%">
        <Group justify="space-between" mb="md">
            <Text fw={600} size="sm">활동 히트맵</Text>
            <Text size="xs" c="dimmed">최근 12주</Text>
        </Group>
        <Grid gutter={2}>
            {Array.from({ length: 84 }, (_, i) => (
                <Grid.Col span={1} key={i}>
                    <Box
                        h={12}
                        style={{
                            backgroundColor: Math.random() > 0.7 ? '#51cf66' : Math.random() > 0.4 ? '#91a7ff' : 'var(--mantine-color-gray-2)',
                            borderRadius: 2
                        }}
                    />
                </Grid.Col>
            ))}
        </Grid>
        <Group justify="space-between" mt="sm">
            <Text size="xs" c="dimmed">Less</Text>
            <Group gap={2}>
                {[0, 1, 2, 3, 4].map((level) => (
                    <Box
                        key={level}
                        w={8}
                        h={8}
                        style={{
                            backgroundColor: level === 0 ? 'var(--mantine-color-gray-2)' :
                                level === 1 ? '#c3d9ff' :
                                    level === 2 ? '#91a7ff' :
                                        level === 3 ? '#748ffc' :
                                            '#51cf66',
                            borderRadius: 1
                        }}
                    />
                ))}
            </Group>
            <Text size="xs" c="dimmed">More</Text>
        </Group>
    </Card>
);

const GoalProgress = () => (
    <Card p="md" radius="md" withBorder h="100%">
        <Group justify="space-between" mb="md">
            <Text fw={600} size="sm">이달의 목표</Text>
            <ThemeIcon color="blue" variant="light" size="sm">
                <IconTarget size={14} />
            </ThemeIcon>
        </Group>
        <Stack gap="md">
            <Box>
                <Group justify="space-between" mb={4}>
                    <Text size="sm">포스트 작성</Text>
                    <Text size="sm" fw={500}>7/10</Text>
                </Group>
                <Progress value={70} size="sm" color="blue" />
            </Box>
            <Box>
                <Group justify="space-between" mb={4}>
                    <Text size="sm">조회수</Text>
                    <Text size="sm" fw={500}>8.5K/10K</Text>
                </Group>
                <Progress value={85} size="sm" color="green" />
            </Box>
            <Box>
                <Group justify="space-between" mb={4}>
                    <Text size="sm">좋아요</Text>
                    <Text size="sm" fw={500}>456/500</Text>
                </Group>
                <Progress value={91} size="sm" color="orange" />
            </Box>
        </Stack>
    </Card>
);

const ThemeToggle = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <ActionIcon
            onClick={toggleColorScheme}
            variant="subtle"
            color="gray"
            size="sm"
        >
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>
    );
};

const DashboardPage = () => {
    const [opened, setOpened] = useState(false);
    const [navigationData, setNavigationData] = useState(NAVIGATION_DATA);

    const handleNavigationReorder = useCallback((result) => {
        // Handle drag and drop reordering logic here
        console.log('Reorder:', result);
        // You can implement the reordering logic based on your requirements
    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Container size="100%" px="md">
                    <Group h="100%" justify="space-between">
                        <Group>
                            <Text fw={700} size="lg" c="blue">velog</Text>
                            <Badge variant="light" size="xs">Dashboard</Badge>
                        </Group>

                        <Group>
                            <ActionIcon variant="subtle" color="gray">
                                <IconSearch size={18} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray">
                                <IconBell size={18} />
                            </ActionIcon>
                            <ThemeToggle />
                            <ActionIcon variant="subtle" color="gray">
                                <IconSettings size={18} />
                            </ActionIcon>
                            <Avatar size="sm" radius="xl" />
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <ScrollArea>
                    <Stack gap="md">
                        <Box>
                            <Group gap="sm" mb="sm">
                                <Avatar size="lg" radius="xl" />
                                <Box>
                                    <Text fw={600} size="sm">개발자 김벨로그</Text>
                                    <Text size="xs" c="dimmed">@velogger</Text>
                                </Box>
                            </Group>
                            <SimpleGrid cols={3} spacing="xs">
                                <Box ta="center">
                                    <Text fw={600} size="sm">42</Text>
                                    <Text size="xs" c="dimmed">포스트</Text>
                                </Box>
                                <Box ta="center">
                                    <Text fw={600} size="sm">1.2K</Text>
                                    <Text size="xs" c="dimmed">팔로워</Text>
                                </Box>
                                <Box ta="center">
                                    <Text fw={600} size="sm">856</Text>
                                    <Text size="xs" c="dimmed">팔로잉</Text>
                                </Box>
                            </SimpleGrid>
                        </Box>

                        <Divider />

                        <Box>
                            <Text fw={600} size="sm" c="dimmed" mb="sm">NAVIGATION</Text>
                            <NavigationMenu
                                navigationData={navigationData}
                                onReorder={handleNavigationReorder}
                            />
                        </Box>
                    </Stack>
                </ScrollArea>
            </AppShell.Navbar>

            <AppShell.Main>
                <Stack gap="lg">
                    <Group justify="space-between" align="flex-end">
                        <Box>
                            <Title order={2} mb={4}>대시보드</Title>
                            <Text c="dimmed" size="sm">글쓰기 여정을 한눈에 확인하세요</Text>
                        </Box>
                        <Button leftSection={<IconEdit size={16} />} variant="filled">
                            새 포스트 작성
                        </Button>
                    </Group>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="총 조회수"
                                value="24.5K"
                                change={12.5}
                                icon={<IconEye size={16} />}
                                color="blue"
                                subtitle="이번 달"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="좋아요"
                                value="1,234"
                                change={8.2}
                                icon={<IconHeart size={16} />}
                                color="red"
                                subtitle="총 누적"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="댓글"
                                value="567"
                                change={-2.1}
                                icon={<IconMessageCircle size={16} />}
                                color="green"
                                subtitle="총 누적"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                title="팔로워"
                                value="1,234"
                                change={15.3}
                                icon={<IconUsers size={16} />}
                                color="violet"
                                subtitle="이번 달 +45"
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 8 }}>
                            <Card p="md" radius="md" withBorder h={300}>
                                <Group justify="space-between" mb="md">
                                    <Text fw={600} size="sm">조회수 추이</Text>
                                    <Group gap="xs">
                                        <Badge variant="light" size="xs">월간</Badge>
                                        <ActionIcon variant="subtle" size="sm">
                                            <IconDots size={14} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                                <ResponsiveContainer width="100%" height="85%">
                                    <AreaChart data={STATS_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-3)" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#339af0"
                                            fill="#d0ebff"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 4 }}>
                            <TagCloud />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <ActivityHeatmap />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <GoalProgress />
                        </Grid.Col>
                    </Grid>

                    <Paper p="md" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <Text fw={600}>최근 포스트</Text>
                            <Button variant="subtle" size="xs">전체보기</Button>
                        </Group>
                        <Stack gap="sm">
                            {RECENT_POSTS.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </Stack>
                    </Paper>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
};

export default DashboardPage;