import {Badge, Card, Group, Stack, Text} from "@mantine/core";

function NotificationList({ notifications }) {
    if (!notifications?.length) {
        return (
            <Card shadow="sm" padding="lg">
                <Text>새로운 알림이 없습니다.</Text>
            </Card>
        );
    }

    return (
        <Card shadow="sm" padding="lg">
            <Text weight={500} size="lg" mb="md">알림</Text>
            <Stack spacing="xs">
                {notifications.slice(0, 5).map(notification => (
                    <div key={notification.id}>
                        <Group position="apart">
                            <Text size="sm">{notification.message}</Text>
                            <Badge size="xs" color={notification.type === 'error' ? 'red' : 'blue'}>
                                {notification.type}
                            </Badge>
                        </Group>
                    </div>
                ))}
            </Stack>
        </Card>
    );
}

export default NotificationList;