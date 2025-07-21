import {Avatar, Button, Card, Text} from "@mantine/core";
import {useUpdateProfile} from "@/hooks/api/useApi.js";

function UserProfile({ userInfo }) {
    const updateProfileMutation = useUpdateProfile();

    const handleUpdateProfile = () => {
        updateProfileMutation.mutate({
            name: 'Updated Name',
            bio: 'Updated bio'
        });
    };

    if (!userInfo) {
        return (
            <Card shadow="sm" padding="lg">
                <Text>사용자 정보를 불러올 수 없습니다.</Text>
            </Card>
        );
    }

    return (
        <Card shadow="sm" padding="lg">
            <Avatar size="xl" src={userInfo.avatar} />
            <Text weight={500} size="lg" mt="md">
                {userInfo.name}
            </Text>
            <Text size="sm" color="dimmed">
                {userInfo.email}
            </Text>
            <Text size="sm" mt="sm">
                {userInfo.bio}
            </Text>
            <Button
                fullWidth
                mt="md"
                onClick={handleUpdateProfile}
                loading={updateProfileMutation.isLoading}
            >
                프로필 수정
            </Button>
        </Card>
    );
}

export default UserProfile;