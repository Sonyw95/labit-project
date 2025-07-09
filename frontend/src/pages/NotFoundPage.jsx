import React, {memo} from 'react';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    ThemeIcon,
    Center
} from '@mantine/core';
import { IconHome, IconRefresh, IconAlertTriangle } from '@tabler/icons-react';

// 404 에러 페이지
const NotFoundPage = memo(() => {
    return (
        <Container size="md" py={100}>
            <Center>
                <Stack align="center" spacing="xl">
                    <ThemeIcon size={120} radius="xl" color="blue" variant="light">
                        <IconAlertTriangle size={60} />
                    </ThemeIcon>

                    <Stack align="center" spacing="md">
                        <Title order={1} size="h1" color="blue">
                            404
                        </Title>
                        <Title order={2} size="h3" weight={500}>
                            페이지를 찾을 수 없습니다
                        </Title>
                        <Text color="dimmed" size="md" ta="center" maw={500}>
                            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                            URL을 다시 확인해주세요.
                        </Text>
                    </Stack>

                    <Group spacing="md">
                        <Button
                            leftIcon={<IconHome size={16} />}
                            size="md"
                            onClick={() => window.location.href = '/'}
                        >
                            홈으로 돌아가기
                        </Button>
                        <Button
                            variant="outline"
                            leftIcon={<IconRefresh size={16} />}
                            size="md"
                            onClick={() => window.location.reload()}
                        >
                            새로고침
                        </Button>
                    </Group>
                </Stack>
            </Center>
        </Container>
    );
});
export default NotFoundPage;