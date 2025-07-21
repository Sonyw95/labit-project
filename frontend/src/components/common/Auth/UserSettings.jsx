import {memo, useState} from 'react';
import {
    Stack,
    Group,
    Avatar,
    Text,
    TextInput,
    Button,
    Card,
    Divider,
    Badge,
    Alert,
    ActionIcon,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconCalendar,
    IconShield,
    IconInfoCircle,
    IconEdit,
    IconCheck,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {queryKeys} from "../../../hooks/api/useApi.js";

const  UserSettings = memo(({ user, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        nickname: user?.nickname || '',
        email: user?.email || '',
    });

    const queryClient = useQueryClient();

    // 프로필 수정 뮤테이션 (실제 API 연동 시 구현)
    const updateProfileMutation = useMutation({
        mutationFn: (profileData) => {
            // TODO: 실제 프로필 업데이트 API 호출
            return Promise.resolve(profileData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.userInfo });
            setIsEditing(false);
        },
    });

    const handleSave = () => {
        updateProfileMutation.mutate(editForm);
    };

    const handleCancel = () => {
        setEditForm({
            nickname: user?.nickname || '',
            email: user?.email || '',
        });
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return '정보 없음';
        }
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'red';
            case 'ADMIN': return 'orange';
            default: return 'blue';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'SUPER_ADMIN': return '슈퍼관리자';
            case 'ADMIN': return '관리자';
            default: return '일반사용자';
        }
    };

    return (
        <Stack spacing="lg">
            {/* 프로필 카드 */}
            <Card withBorder padding="lg">
                <Group justify="space-between" mb="md">
                    <Group>
                        <Avatar
                            src={user?.profileImage}
                            alt={user?.nickname}
                            size="xl"
                        />
                        <div>
                            {isEditing ? (
                                <Stack spacing="xs">
                                    <TextInput
                                        placeholder="닉네임"
                                        value={editForm.nickname}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            nickname: e.target.value
                                        }))}
                                        size="sm"
                                    />
                                    <TextInput
                                        placeholder="이메일"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            email: e.target.value
                                        }))}
                                        size="sm"
                                    />
                                </Stack>
                            ) : (
                                <>
                                    <Text size="lg" fw={600}>
                                        {user?.nickname}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {user?.email}
                                    </Text>
                                </>
                            )}
                        </div>
                    </Group>

                    {isEditing ? (
                        <Group spacing="xs">
                            <ActionIcon
                                color="green"
                                onClick={handleSave}
                                loading={updateProfileMutation.isLoading}
                            >
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                                color="red"
                                onClick={handleCancel}
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        </Group>
                    ) : (
                        <ActionIcon
                            variant="light"
                            onClick={() => setIsEditing(true)}
                        >
                            <IconEdit size={16} />
                        </ActionIcon>
                    )}
                </Group>

                <Badge
                    color={getRoleBadgeColor(user?.role)}
                    variant="light"
                    leftSection={<IconShield size={12} />}
                >
                    {getRoleLabel(user?.role)}
                </Badge>
            </Card>

            {/* 계정 정보 */}
            <Card withBorder padding="lg">
                <Text size="md" fw={500} mb="md">
                    계정 정보
                </Text>

                <Stack spacing="md">
                    <Group>
                        <IconUser size={16} color="gray" />
                        <div>
                            <Text size="sm" c="dimmed">사용자 ID</Text>
                            <Text size="sm">{user?.id}</Text>
                        </div>
                    </Group>

                    <Group>
                        <IconMail size={16} color="gray" />
                        <div>
                            <Text size="sm" c="dimmed">카카오 ID</Text>
                            <Text size="sm">{user?.kakaoId}</Text>
                        </div>
                    </Group>

                    <Group>
                        <IconCalendar size={16} color="gray" />
                        <div>
                            <Text size="sm" c="dimmed">가입일</Text>
                            <Text size="sm">{formatDate(user?.createdDate)}</Text>
                        </div>
                    </Group>

                    <Group>
                        <IconCalendar size={16} color="gray" />
                        <div>
                            <Text size="sm" c="dimmed">최근 로그인</Text>
                            <Text size="sm">{formatDate(user?.lastLoginDate)}</Text>
                        </div>
                    </Group>
                </Stack>
            </Card>

            {/* 계정 상태 */}
            <Alert
                icon={<IconInfoCircle size={16} />}
                color={user?.isActive ? 'green' : 'red'}
                title="계정 상태"
            >
                {user?.isActive ? '활성 계정입니다.' : '비활성 계정입니다.'}
            </Alert>

            <Divider />

            {/* 액션 버튼들 */}
            <Group justify="flex-end">
                <Button variant="outline" onClick={onClose}>
                    닫기
                </Button>
            </Group>
        </Stack>
    );
})

export default UserSettings;