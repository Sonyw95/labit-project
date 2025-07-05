import React, { useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Button,
    Switch,
    Select,
    TextInput,
    Textarea,
    PasswordInput,
    FileButton,
    Avatar,
    Tabs,
    Divider,
    Alert,
    Badge,
    Modal,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconUser,
    IconBell,
    IconShield,
    IconPalette,
    IconDatabase,
    IconUpload,
    IconTrash,
    IconAlertCircle,
    IconDownload,
} from '@tabler/icons-react';

// Hooks and Context
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    useUserProfileQuery,
    useUserPreferencesQuery,
    useUpdateProfileMutation,
} from '../api/queries';

// Utils
import { formatters } from '../utils/formatters';
import {useAuth} from "@/context/AuthContext.jsx";
import {useToast} from "@/components/Toast.jsx";

const Settings = () => {
    const { user, updateUser, changePassword, logout } = useAuth();
    const { success, error: showError } = useToast();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [activeTab, setActiveTab] = useState('profile');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Queries
    const { data: profile, refetch: refetchProfile } = useUserProfileQuery();
    const { data: preferences } = useUserPreferencesQuery();
    const updateProfileMutation = useUpdateProfileMutation();

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <div>
                    <Title order={1} mb="xs">
                        설정
                    </Title>
                    <Text c="dimmed">
                        계정 정보와 앱 설정을 관리하세요.
                    </Text>
                </div>

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                            프로필
                        </Tabs.Tab>
                        {/*<Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>*/}
                        {/*    알림*/}
                        {/*</Tabs.Tab>*/}
                        <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
                            보안
                        </Tabs.Tab>
                        <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
                            화면
                        </Tabs.Tab>
                        {/*<Tabs.Tab value="data" leftSection={<IconDatabase size={16} />}>*/}
                        {/*    데이터*/}
                        {/*</Tabs.Tab>*/}
                    </Tabs.List>

                    {/* Profile Tab */}
                    <Tabs.Panel value="profile" pt="xl">
                        <ProfileSettings
                            user={user}
                            profile={profile}
                            onUpdate={updateUser}
                            isLoading={updateProfileMutation.isPending}
                        />
                    </Tabs.Panel>

                    {/* Notifications Tab */}
                    {/*<Tabs.Panel value="notifications" pt="xl">*/}
                    {/*    <NotificationSettings preferences={preferences} />*/}
                    {/*</Tabs.Panel>*/}

                    {/* Security Tab */}
                    <Tabs.Panel value="security" pt="xl">
                        <SecuritySettings
                            user={user}
                            onChangePassword={changePassword}
                            onLogout={logout}
                            onDeleteAccount={() => setIsDeleteModalOpen(true)}
                        />
                    </Tabs.Panel>

                    {/* Appearance Tab */}
                    <Tabs.Panel value="appearance" pt="xl">
                        <AppearanceSettings
                            colorScheme={colorScheme}
                            onToggleColorScheme={toggleColorScheme}
                            preferences={preferences}
                        />
                    </Tabs.Panel>

                    {/* Data Tab */}
                    {/*<Tabs.Panel value="data" pt="xl">*/}
                    {/*    <DataSettings user={user} />*/}
                    {/*</Tabs.Panel>*/}
                </Tabs>

                {/* Delete Account Modal */}
                <DeleteAccountModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        // 계정 삭제 로직
                        setIsDeleteModalOpen(false);
                    }}
                />
            </Stack>
        </Container>
    );
};

// Profile Settings Component
const ProfileSettings = ({ user, profile, onUpdate, isLoading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: profile?.bio || '',
        website: profile?.website || '',
        location: profile?.location || '',
        twitter: profile?.twitter || '',
        github: profile?.github || '',
    });
    const [avatar, setAvatar] = useState(null);
    const { success, error: showError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await onUpdate(formData);
            success('프로필이 업데이트되었습니다.');
        } catch (err) {
            showError('프로필 업데이트에 실패했습니다.');
        }
    };

    const handleAvatarUpload = (file) => {
        if (file) {
            setAvatar(file);
            // 실제로는 여기서 파일 업로드 API 호출
            success('프로필 이미지가 업데이트되었습니다.');
        }
    };

    return (
        <Paper p="xl">
            <form onSubmit={handleSubmit}>
                <Stack gap="lg">
                    <Title order={2} size="h3">
                        프로필 정보
                    </Title>

                    {/* Avatar Section */}
                    <Group gap="md">
                        <Avatar
                            src={user?.avatar}
                            name={user?.name}
                            size="xl"
                        />
                        <Stack gap="xs">
                            <FileButton
                                onChange={handleAvatarUpload}
                                accept="image/png,image/jpeg,image/jpg"
                            >
                                {(props) => (
                                    <Button
                                        {...props}
                                        variant="light"
                                        leftSection={<IconUpload size={16} />}
                                    >
                                        이미지 변경
                                    </Button>
                                )}
                            </FileButton>
                            <Text size="xs" c="dimmed">
                                JPG, PNG 파일만 가능 (최대 5MB)
                            </Text>
                        </Stack>
                    </Group>

                    <Divider />

                    {/* Basic Information */}
                    <Stack gap="md">
                        <TextInput
                            label="이름"
                            placeholder="이름을 입력하세요"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <TextInput
                            label="이메일"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            required
                        />

                        <Textarea
                            label="소개"
                            placeholder="자신을 소개해주세요"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            minRows={3}
                            maxRows={6}
                        />

                        <TextInput
                            label="웹사이트"
                            placeholder="https://yourwebsite.com"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />

                        <TextInput
                            label="위치"
                            placeholder="Seoul, South Korea"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </Stack>

                    <Divider />

                    {/* Social Links */}
                    <Stack gap="md">
                        <Title order={3} size="h4">
                            소셜 링크
                        </Title>

                        <TextInput
                            label="Twitter"
                            placeholder="@username"
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        />

                        <TextInput
                            label="GitHub"
                            placeholder="username"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                        />
                    </Stack>

                    <Group justify="flex-end">
                        <Button type="submit" loading={isLoading}>
                            저장
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
};

// Notification Settings Component
const NotificationSettings = ({ preferences }) => {
    const [settings, setSettings] = useLocalStorage('notificationSettings', {
        emailNotifications: true,
        pushNotifications: true,
        newComments: true,
        newFollowers: true,
        postLikes: false,
        weeklyDigest: true,
        marketingEmails: false,
    });

    const { success } = useToast();

    const handleToggle = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
        success('알림 설정이 저장되었습니다.');
    };

    return (
        <Paper p="xl">
            <Stack gap="lg">
                <Title order={2} size="h3">
                    알림 설정
                </Title>

                <Stack gap="md">
                    <Switch
                        label="이메일 알림"
                        description="중요한 업데이트를 이메일로 받습니다"
                        checked={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                    />

                    <Switch
                        label="푸시 알림"
                        description="브라우저 푸시 알림을 받습니다"
                        checked={settings.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                    />

                    <Divider />

                    <Title order={3} size="h4">
                        콘텐츠 알림
                    </Title>

                    <Switch
                        label="새 댓글"
                        description="내 게시글에 댓글이 달렸을 때"
                        checked={settings.newComments}
                        onChange={() => handleToggle('newComments')}
                    />

                    <Switch
                        label="새 팔로워"
                        description="새로운 팔로워가 생겼을 때"
                        checked={settings.newFollowers}
                        onChange={() => handleToggle('newFollowers')}
                    />

                    <Switch
                        label="게시글 좋아요"
                        description="내 게시글에 좋아요를 받았을 때"
                        checked={settings.postLikes}
                        onChange={() => handleToggle('postLikes')}
                    />

                    <Divider />

                    <Title order={3} size="h4">
                        정기 알림
                    </Title>

                    <Switch
                        label="주간 요약"
                        description="매주 인기 게시글과 업데이트를 받습니다"
                        checked={settings.weeklyDigest}
                        onChange={() => handleToggle('weeklyDigest')}
                    />

                    <Switch
                        label="마케팅 이메일"
                        description="새로운 기능과 이벤트 소식을 받습니다"
                        checked={settings.marketingEmails}
                        onChange={() => handleToggle('marketingEmails')}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
};

// Security Settings Component
const SecuritySettings = ({ user, onChangePassword, onLogout, onDeleteAccount }) => {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const { success, error: showError } = useToast();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            showError('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        setIsChangingPassword(true);

        try {
            await onChangePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            success('비밀번호가 변경되었습니다.');
        } catch (err) {
            showError('비밀번호 변경에 실패했습니다.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <Paper p="xl">
            <Stack gap="lg">
                <Title order={2} size="h3">
                    보안 설정
                </Title>

                {/* Account Info */}
                <Group justify="space-between" p="md" style={{
                    background: 'var(--mantine-color-gray-0)',
                    borderRadius: 8
                }}>
                    <Stack gap="xs">
                        <Text fw={600}>계정 생성일</Text>
                        <Text size="sm" c="dimmed">
                            {formatters.date.toKorean(user?.createdAt)}
                        </Text>
                    </Stack>
                    <Badge color="green">활성</Badge>
                </Group>

                <Divider />

                {/* Password Change */}
                <form onSubmit={handlePasswordChange}>
                    <Stack gap="md">
                        <Title order={3} size="h4">
                            비밀번호 변경
                        </Title>

                        <PasswordInput
                            label="현재 비밀번호"
                            placeholder="현재 비밀번호를 입력하세요"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value
                            })}
                            required
                        />

                        <PasswordInput
                            label="새 비밀번호"
                            placeholder="새 비밀번호를 입력하세요"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value
                            })}
                            required
                        />

                        <PasswordInput
                            label="새 비밀번호 확인"
                            placeholder="새 비밀번호를 다시 입력하세요"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value
                            })}
                            required
                        />

                        <Group justify="flex-end">
                            <Button
                                type="submit"
                                loading={isChangingPassword}
                                disabled={!passwordForm.currentPassword || !passwordForm.newPassword}
                            >
                                비밀번호 변경
                            </Button>
                        </Group>
                    </Stack>
                </form>

                <Divider />

                {/* Account Actions */}
                <Stack gap="md">
                    <Title order={3} size="h4">
                        계정 관리
                    </Title>

                    <Group justify="space-between">
                        <div>
                            <Text fw={600}>모든 기기에서 로그아웃</Text>
                            <Text size="sm" c="dimmed">
                                다른 기기에서 로그인된 세션을 모두 종료합니다
                            </Text>
                        </div>
                        <Button variant="light" onClick={onLogout}>
                            로그아웃
                        </Button>
                    </Group>

                    <Group justify="space-between">
                        <div>
                            <Text fw={600} c="red">
                                계정 삭제
                            </Text>
                            <Text size="sm" c="dimmed">
                                계정과 모든 데이터가 영구적으로 삭제됩니다
                            </Text>
                        </div>
                        <Button color="red" variant="light" onClick={onDeleteAccount}>
                            계정 삭제
                        </Button>
                    </Group>
                </Stack>
            </Stack>
        </Paper>
    );
};

// Appearance Settings Component
const AppearanceSettings = ({ colorScheme, onToggleColorScheme, preferences }) => {
    const [settings, setSettings] = useLocalStorage('appearanceSettings', {
        fontSize: 'medium',
        language: 'ko',
        dateFormat: 'relative',
        showReadTime: true,
        compactMode: false,
    });

    const { success } = useToast();

    const handleUpdate = (key, value) => {
        setSettings({ ...settings, [key]: value });
        success('설정이 저장되었습니다.');
    };

    return (
        <Paper p="xl">
            <Stack gap="lg">
                <Title order={2} size="h3">
                    화면 설정
                </Title>

                <Stack gap="md">
                    <Group justify="space-between">
                        <div>
                            <Text fw={600}>다크 모드</Text>
                            <Text size="sm" c="dimmed">
                                어두운 테마로 변경합니다
                            </Text>
                        </div>
                        <Switch
                            checked={colorScheme === 'dark'}
                            onChange={onToggleColorScheme}
                        />
                    </Group>

                    <Select
                        label="글꼴 크기"
                        value={settings.fontSize}
                        onChange={(value) => handleUpdate('fontSize', value)}
                        data={[
                            { value: 'small', label: '작게' },
                            { value: 'medium', label: '보통' },
                            { value: 'large', label: '크게' },
                        ]}
                    />

                    <Select
                        label="언어"
                        value={settings.language}
                        onChange={(value) => handleUpdate('language', value)}
                        data={[
                            { value: 'ko', label: '한국어' },
                            { value: 'en', label: 'English' },
                        ]}
                    />

                    <Select
                        label="날짜 형식"
                        value={settings.dateFormat}
                        onChange={(value) => handleUpdate('dateFormat', value)}
                        data={[
                            { value: 'relative', label: '상대적 (3일 전)' },
                            { value: 'absolute', label: '절대적 (2023년 1월 1일)' },
                            { value: 'iso', label: 'ISO (2023-01-01)' },
                        ]}
                    />

                    <Switch
                        label="읽기 시간 표시"
                        description="게시글의 예상 읽기 시간을 표시합니다"
                        checked={settings.showReadTime}
                        onChange={(checked) => handleUpdate('showReadTime', checked)}
                    />

                    <Switch
                        label="컴팩트 모드"
                        description="더 많은 정보를 화면에 표시합니다"
                        checked={settings.compactMode}
                        onChange={(checked) => handleUpdate('compactMode', checked)}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
};

// Data Settings Component
const DataSettings = ({ user }) => {
    const { success, error: showError } = useToast();

    const handleExportData = async () => {
        try {
            // 데이터 내보내기 API 호출
            success('데이터 내보내기가 시작되었습니다. 완료되면 이메일로 알려드리겠습니다.');
        } catch (err) {
            showError('데이터 내보내기에 실패했습니다.');
        }
    };

    const handleClearCache = () => {
        localStorage.clear();
        sessionStorage.clear();
        success('캐시가 삭제되었습니다. 페이지를 새로고침해주세요.');
    };

    return (
        <Paper p="xl">
            <Stack gap="lg">
                <Title order={2} size="h3">
                    데이터 관리
                </Title>

                <Alert color="blue">
                    데이터 처리 방침에 따라 개인정보와 콘텐츠를 관리할 수 있습니다.
                </Alert>

                <Stack gap="md">
                    <Group justify="space-between">
                        <div>
                            <Text fw={600}>데이터 내보내기</Text>
                            <Text size="sm" c="dimmed">
                                모든 게시글, 댓글, 프로필 정보를 JSON 형태로 다운로드합니다
                            </Text>
                        </div>
                        <Button
                            variant="light"
                            leftSection={<IconDownload size={16} />}
                            onClick={handleExportData}
                        >
                            내보내기
                        </Button>
                    </Group>

                    <Group justify="space-between">
                        <div>
                            <Text fw={600}>캐시 삭제</Text>
                            <Text size="sm" c="dimmed">
                                저장된 임시 데이터와 설정을 삭제합니다
                            </Text>
                        </div>
                        <Button
                            variant="light"
                            color="orange"
                            leftSection={<IconTrash size={16} />}
                            onClick={handleClearCache}
                        >
                            삭제
                        </Button>
                    </Group>

                    <Divider />

                    <Stack gap="xs">
                        <Text fw={600}>저장 공간 사용량</Text>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">게시글</Text>
                            <Text size="sm">1.2 MB</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">이미지</Text>
                            <Text size="sm">45.6 MB</Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">댓글</Text>
                            <Text size="sm">0.8 MB</Text>
                        </Group>
                        <Divider />
                        <Group justify="space-between">
                            <Text fw={600}>총합</Text>
                            <Text fw={600}>47.6 MB</Text>
                        </Group>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

// Delete Account Modal Component
const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: showError } = useToast();

    const handleConfirm = async () => {
        if (confirmText !== 'DELETE') {
            showError('DELETE를 정확히 입력해주세요.');
            return;
        }

        setIsDeleting(true);

        try {
            await onConfirm();
        } catch (err) {
            showError('계정 삭제에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="계정 삭제"
            centered
            size="md"
        >
            <Stack gap="md">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    title="주의사항"
                >
                    이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로 삭제됩니다.
                </Alert>

                <Stack gap="xs">
                    <Text fw={600}>삭제되는 데이터:</Text>
                    <Text size="sm" c="dimmed">• 모든 게시글과 댓글</Text>
                    <Text size="sm" c="dimmed">• 프로필 정보</Text>
                    <Text size="sm" c="dimmed">• 북마크와 좋아요</Text>
                    <Text size="sm" c="dimmed">• 업로드한 이미지</Text>
                    <Text size="sm" c="dimmed">• 팔로우/팔로워 관계</Text>
                </Stack>

                <TextInput
                    label="확인을 위해 'DELETE'를 입력하세요"
                    placeholder="DELETE"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                />

                <Group justify="flex-end" gap="sm">
                    <Button variant="light" onClick={onClose}>
                        취소
                    </Button>
                    <Button
                        color="red"
                        onClick={handleConfirm}
                        loading={isDeleting}
                        disabled={confirmText !== 'DELETE'}
                    >
                        계정 삭제
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default Settings;