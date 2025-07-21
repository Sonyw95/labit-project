import {memo} from "react";
import {useUserInfo} from "../hooks/api/useApi.js";
import {Badge, Card, Container, Grid, Group, Stack, Title, Text} from "@mantine/core";
import {IconShield} from "@tabler/icons-react";

const AdminPage = memo(( () => {
    const { data: user } = useUserInfo();

    const adminFeatures = [
        {
            icon: 'IconUsers',
            title: '사용자 관리',
            description: '시스템 사용자 목록 및 권한 관리',
            color: 'blue',
        },
        {
            icon: 'IconSettings',
            title: '시스템 설정',
            description: '전역 설정 및 환경 변수 관리',
            color: 'green',
        },
        {
            icon: 'IconChartBar',
            title: '통계 및 분석',
            description: '사용자 활동 및 시스템 통계',
            color: 'orange',
        },
    ];

    return (
        <Container size="lg">
            <Stack spacing="xl">
                {/* 페이지 헤더 */}
                <Group>
                    <IconShield size={32} color="var(--mantine-color-red-6)" />
                    <div>
                        <Title order={1}>관리자 페이지</Title>
                        <Text c="dimmed">시스템 관리 및 설정</Text>
                    </div>
                </Group>

                {/* 현재 사용자 정보 */}
                {user && (
                    <Card withBorder padding="lg">
                        <Group justify="space-between">
                            <div>
                                <Text fw={500}>현재 로그인 사용자</Text>
                                <Text size="sm" c="dimmed">
                                    {user.nickname} ({user.email})
                                </Text>
                            </div>
                            <Badge color="red" variant="light">
                                {user.role === 'SUPER_ADMIN' ? '슈퍼관리자' : '관리자'}
                            </Badge>
                        </Group>
                    </Card>
                )}

                {/* 관리 기능들 */}
                <div>
                    <Title order={2} mb="md">관리 기능</Title>
                    <Grid>
                        {adminFeatures.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                        <Group mb="md">
                                            <IconComponent size={24} color={`var(--mantine-color-${feature.color}-6)`} />
                                            <Text fw={500}>{feature.title}</Text>
                                        </Group>
                                        <Text size="sm" c="dimmed">
                                            {feature.description}
                                        </Text>
                                    </Card>
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </div>

                {/* 주의사항 */}
                <Card withBorder padding="lg" style={{ backgroundColor: 'var(--mantine-color-red-light)' }}>
                    <Text fw={500} c="red" mb="sm">⚠️ 주의사항</Text>
                    <Text size="sm">
                        이 페이지는 관리자 권한이 필요합니다. 시스템에 중요한 영향을 미칠 수 있는 작업들이 포함되어 있습니다.
                    </Text>
                </Card>
            </Stack>
        </Container>
    );
}))

export default AdminPage;