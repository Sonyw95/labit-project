import {Button, Card, Container, Divider, Group, Stack, Switch, Title, Text} from "@mantine/core";
import {useAuthStore} from "@/store/authStore.js";
import {useToast} from "@/context/toastContext.jsx";

export default function Settings(){
    // const { settings, updateSettings, resetSettings } = useThemeSettings();
    const { user } = useAuthStore();
    const { addToast } = useToast();

    const handleSave = () => {
        addToast({
            type: 'success',
            title: '설정이 저장되었습니다',
        });
    };

    const handleReset = () => {
        // resetSettings();
        addToast({
            type: 'info',
            title: '설정이 초기화되었습니다',
        });
    };

    return (
        <Container size="md" py="xl">
            <Title order={1} mb="xl">
                설정
            </Title>

            <Stack gap="lg">
                {/* 사용자 설정 */}
                <Card>
                    <Title order={3} mb="md">
                        사용자 설정
                    </Title>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text>사용자 이름</Text>
                            <Text c="dimmed">{user?.name || '로그인되지 않음'}</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text>이메일</Text>
                            <Text c="dimmed">{user?.email || '로그인되지 않음'}</Text>
                        </Group>
                    </Stack>
                </Card>

                {/* 테마 설정 */}
                {/*<Card>*/}
                {/*    <Title order={3} mb="md">*/}
                {/*        테마 설정*/}
                {/*    </Title>*/}
                {/*    <Stack gap="md">*/}
                {/*        <Group justify="space-between">*/}
                {/*            <Text>애니메이션</Text>*/}
                {/*            <Switch*/}
                {/*                checked={settings.animations}*/}
                {/*                onChange={(event) =>*/}
                {/*                    updateSettings({ animations: event.currentTarget.checked })*/}
                {/*                }*/}
                {/*            />*/}
                {/*        </Group>*/}

                {/*        <Group justify="space-between">*/}
                {/*            <Text>컴팩트 모드</Text>*/}
                {/*            <Switch*/}
                {/*                checked={settings.compactMode}*/}
                {/*                onChange={(event) =>*/}
                {/*                    updateSettings({ compactMode: event.currentTarget.checked })*/}
                {/*                }*/}
                {/*            />*/}
                {/*        </Group>*/}

                {/*        <Group justify="space-between">*/}
                {/*            <Text>모서리 둥글기</Text>*/}
                {/*            <Select*/}
                {/*                value={settings.borderRadius}*/}
                {/*                onChange={(value) =>*/}
                {/*                    updateSettings({ borderRadius: value as any })*/}
                {/*                }*/}
                {/*                data={[*/}
                {/*                    { value: 'xs', label: '매우 작음' },*/}
                {/*                    { value: 'sm', label: '작음' },*/}
                {/*                    { value: 'md', label: '보통' },*/}
                {/*                    { value: 'lg', label: '큼' },*/}
                {/*                    { value: 'xl', label: '매우 큼' },*/}
                {/*                ]}*/}
                {/*                w={150}*/}
                {/*            />*/}
                {/*        </Group>*/}

                {/*        <Group justify="space-between">*/}
                {/*            <Text>폰트</Text>*/}
                {/*            <Select*/}
                {/*                value={settings.fontFamily}*/}
                {/*                onChange={(value) =>*/}
                {/*                    updateSettings({ fontFamily: value || 'system-ui, sans-serif' })*/}
                {/*                }*/}
                {/*                data={[*/}
                {/*                    { value: 'system-ui, sans-serif', label: '시스템 기본' },*/}
                {/*                    { value: '"Noto Sans KR", sans-serif', label: 'Noto Sans' },*/}
                {/*                    { value: '"Malgun Gothic", sans-serif', label: '맑은 고딕' },*/}
                {/*                    { value: 'monospace', label: '모노스페이스' },*/}
                {/*                ]}*/}
                {/*                w={150}*/}
                {/*            />*/}
                {/*        </Group>*/}
                {/*    </Stack>*/}
                {/*</Card>*/}

                {/* 알림 설정 */}
                <Card>
                    <Title order={3} mb="md">
                        알림 설정
                    </Title>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text>새 댓글 알림</Text>
                            <Switch defaultChecked />
                        </Group>
                        <Group justify="space-between">
                            <Text>새 포스트 알림</Text>
                            <Switch defaultChecked />
                        </Group>
                        <Group justify="space-between">
                            <Text>이메일 알림</Text>
                            <Switch />
                        </Group>
                    </Stack>
                </Card>

                <Divider />

                {/* 액션 버튼들 */}
                <Group justify="space-between">
                    <Button variant="outline" onClick={handleReset}>
                        초기화
                    </Button>
                    <Button onClick={handleSave}>
                        저장
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
};