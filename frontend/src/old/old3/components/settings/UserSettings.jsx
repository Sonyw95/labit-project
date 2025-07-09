
// ========================================
// components/settings/UserSettings.jsx - 사용자 설정 컴포넌트
// ========================================
import React, { useState, useCallback } from 'react';
import {
    Modal,
    Box,
    Text,
    Button,
    Group,
    Stack,
    TextInput,
    PasswordInput,
    Avatar,
    FileInput,
    Paper,
    Tabs,
    Switch,
    Select,
    Textarea,
    Progress,
    Alert,
    useMantineColorScheme
} from '@mantine/core';
import {
    IconUser,
    IconLock,
    IconUpload,
    IconAlertCircle,
    IconPhoto,
    IconSettings as IconSettingsIcon,
    IconDeviceFloppy
} from '@tabler/icons-react';
import {useAuth} from "@/contexts/AuthContext.jsx";
import {useToast} from "@/contexts/ToastContext.jsx";
import {useUpdateProfile, useUploadFile} from "@/hooks/useApiQueries.js";

const UserSettings = ({ opened, onClose }) => {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const { user, updateUser } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const updateProfileMutation = useUpdateProfile();
    const uploadFileMutation = useUploadFile();

    // 2025 트렌드: 모달 스타일
    const getModalStyles = () => ({
        content: {
            background: dark
                ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
            borderRadius: '20px',
        }
    });

    // 폼 데이터 업데이트
    const updateFormData = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // 비밀번호 데이터 업데이트
    const updatePasswordData = useCallback((field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    }, []);

    // 프로필 저장
    const handleSaveProfile = useCallback(async () => {
        try {
            await updateProfileMutation.mutateAsync(formData);
            updateUser(formData);
            toast.success('프로필이 성공적으로 업데이트되었습니다.');
        } catch (error) {
            toast.error(error.message || '프로필 업데이트에 실패했습니다.');
        }
    }, [formData, updateProfileMutation, updateUser, toast]);

    // 아바타 업로드
    const handleAvatarUpload = useCallback(async () => {
        if (!avatarFile) {
            return;
        }

        try {
            const response = await uploadFileMutation.mutateAsync({
                file: avatarFile,
                onProgress: setUploadProgress,
            });

            const avatarUrl = response.data.url;
            await updateProfileMutation.mutateAsync({ avatar: avatarUrl });
            updateUser({ avatar: avatarUrl });

            setAvatarFile(null);
            setUploadProgress(0);
            toast.success('프로필 이미지가 업데이트되었습니다.');
        } catch (error) {
            toast.error(error.message || '이미지 업로드에 실패했습니다.');
        }
    }, [avatarFile, uploadFileMutation, updateProfileMutation, updateUser, toast]);

    // 비밀번호 변경
    const handleChangePassword = useCallback(async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('비밀번호는 최소 8자 이상이어야 합니다.');
            return;
        }

        try {
            // API 호출 (구현 필요)
            // await apiClient.auth.changePassword(passwordData.currentPassword, passwordData.newPassword);

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            toast.success('비밀번호가 성공적으로 변경되었습니다.');
        } catch (error) {
            toast.error(error.message || '비밀번호 변경에 실패했습니다.');
        }
    }, [passwordData, toast]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="사용자 설정"
            size="lg"
            centered
            styles={getModalStyles}
        >
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                        프로필
                    </Tabs.Tab>
                    <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
                        보안
                    </Tabs.Tab>
                    <Tabs.Tab value="preferences" leftSection={<IconSettingsIcon size={16} />}>
                        환경설정
                    </Tabs.Tab>
                </Tabs.List>

                {/* 프로필 탭 */}
                <Tabs.Panel value="profile" pt="md">
                    <Stack gap="md">
                        {/* 아바타 섹션 */}
                        <Paper
                            p="md"
                            style={{
                                background: dark ? 'rgba(48, 54, 61, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Group align="flex-start" gap="md">
                                <Avatar
                                    src={user?.avatar}
                                    size={80}
                                    radius="xl"
                                    style={{
                                        border: `3px solid ${dark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                                    }}
                                />

                                <Box style={{ flex: 1 }}>
                                    <Text size="sm" fw={600} mb="xs">
                                        프로필 이미지
                                    </Text>

                                    <FileInput
                                        placeholder="이미지 파일 선택"
                                        accept="image/*"
                                        value={avatarFile}
                                        onChange={setAvatarFile}
                                        leftSection={<IconPhoto size={16} />}
                                        mb="xs"
                                    />

                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <Progress value={uploadProgress} mb="xs" />
                                    )}

                                    <Button
                                        size="xs"
                                        disabled={!avatarFile}
                                        loading={uploadFileMutation.isPending}
                                        onClick={handleAvatarUpload}
                                        leftSection={<IconUpload size={14} />}
                                    >
                                        업로드
                                    </Button>
                                </Box>
                            </Group>
                        </Paper>

                        {/* 기본 정보 */}
                        <Group grow>
                            <TextInput
                                label="이름"
                                value={formData.name}
                                onChange={(e) => updateFormData('name', e.target.value)}
                                placeholder="이름을 입력하세요"
                            />
                            <TextInput
                                label="이메일"
                                value={formData.email}
                                onChange={(e) => updateFormData('email', e.target.value)}
                                placeholder="이메일을 입력하세요"
                                type="email"
                            />
                        </Group>

                        <Textarea
                            label="자기소개"
                            value={formData.bio}
                            onChange={(e) => updateFormData('bio', e.target.value)}
                            placeholder="자기소개를 입력하세요"
                            minRows={3}
                        />

                        <Group grow>
                            <TextInput
                                label="위치"
                                value={formData.location}
                                onChange={(e) => updateFormData('location', e.target.value)}
                                placeholder="위치를 입력하세요"
                            />
                            <TextInput
                                label="웹사이트"
                                value={formData.website}
                                onChange={(e) => updateFormData('website', e.target.value)}
                                placeholder="https://example.com"
                                type="url"
                            />
                        </Group>

                        <Group justify="flex-end">
                            <Button
                                onClick={handleSaveProfile}
                                loading={updateProfileMutation.isPending}
                                leftSection={<IconDeviceFloppy size={16} />}
                            >
                                저장
                            </Button>
                        </Group>
                    </Stack>
                </Tabs.Panel>

                {/* 보안 탭 */}
                <Tabs.Panel value="security" pt="md">
                    <Stack gap="md">
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            title="비밀번호 변경"
                            color="blue"
                            variant="light"
                        >
                            안전한 비밀번호를 위해 8자 이상의 문자, 숫자, 특수문자를 포함하세요.
                        </Alert>

                        <PasswordInput
                            label="현재 비밀번호"
                            value={passwordData.currentPassword}
                            onChange={(e) => updatePasswordData('currentPassword', e.target.value)}
                            placeholder="현재 비밀번호를 입력하세요"
                        />

                        <PasswordInput
                            label="새 비밀번호"
                            value={passwordData.newPassword}
                            onChange={(e) => updatePasswordData('newPassword', e.target.value)}
                            placeholder="새 비밀번호를 입력하세요"
                        />

                        <PasswordInput
                            label="새 비밀번호 확인"
                            value={passwordData.confirmPassword}
                            onChange={(e) => updatePasswordData('confirmPassword', e.target.value)}
                            placeholder="새 비밀번호를 다시 입력하세요"
                            error={
                                passwordData.confirmPassword &&
                                passwordData.newPassword !== passwordData.confirmPassword
                                    ? '비밀번호가 일치하지 않습니다'
                                    : undefined
                            }
                        />

                        <Group justify="flex-end">
                            <Button
                                onClick={handleChangePassword}
                                disabled={
                                    !passwordData.currentPassword ||
                                    !passwordData.newPassword ||
                                    passwordData.newPassword !== passwordData.confirmPassword
                                }
                                leftSection={<IconLock size={16} />}
                            >
                                비밀번호 변경
                            </Button>
                        </Group>
                    </Stack>
                </Tabs.Panel>

                {/* 환경설정 탭 */}
                <Tabs.Panel value="preferences" pt="md">
                    <Stack gap="md">
                        <Paper
                            p="md"
                            style={{
                                background: dark ? 'rgba(48, 54, 61, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Text size="sm" fw={600} mb="md">
                                알림 설정
                            </Text>

                            <Stack gap="md">
                                <Switch
                                    label="이메일 알림"
                                    description="새로운 댓글이나 멘션 시 이메일을 받습니다"
                                />
                                <Switch
                                    label="푸시 알림"
                                    description="브라우저 푸시 알림을 받습니다"
                                />
                                <Switch
                                    label="마케팅 이메일"
                                    description="새로운 기능이나 업데이트 소식을 받습니다"
                                />
                            </Stack>
                        </Paper>

                        <Paper
                            p="md"
                            style={{
                                background: dark ? 'rgba(48, 54, 61, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                border: `1px solid ${dark ? 'rgba(48, 54, 61, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                                borderRadius: '12px',
                            }}
                        >
                            <Text size="sm" fw={600} mb="md">
                                표시 설정
                            </Text>

                            <Stack gap="md">
                                <Select
                                    label="언어"
                                    data={[
                                        { value: 'ko', label: '한국어' },
                                        { value: 'en', label: 'English' },
                                        { value: 'ja', label: '日本語' },
                                    ]}
                                    defaultValue="ko"
                                />

                                <Select
                                    label="시간대"
                                    data={[
                                        { value: 'Asia/Seoul', label: '서울 (GMT+9)' },
                                        { value: 'UTC', label: 'UTC (GMT+0)' },
                                        { value: 'America/New_York', label: '뉴욕 (GMT-5)' },
                                    ]}
                                    defaultValue="Asia/Seoul"
                                />
                            </Stack>
                        </Paper>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
};

export default UserSettings;