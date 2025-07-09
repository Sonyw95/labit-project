import {memo, useCallback, useState} from "react";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {useTheme} from "../../hooks/useTheme.js";
import {validators} from "../../utils/validators.js";
import {showToast} from "../common/Toast.jsx";
import {
    Alert,
    Avatar,
    Button,
    FileInput,
    Group,
    Modal,
    Paper,
    PasswordInput,
    Stack, Switch,
    Tabs,
    TextInput
} from "@mantine/core";
import {IconBell, IconCamera, IconCheck, IconLock, IconShield, IconUser} from "@tabler/icons-react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator.jsx";

const UserSettingsModal = memo(({ opened, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        avatar: null
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const { updateUser } = useAuth();
    const { dark } = useTheme();

    // 프로필 업데이트
    const handleProfileUpdate = useCallback(async () => {
        if (!validators.required(profileData.name)) {
            showToast.error('오류', '이름을 입력해주세요.');
            return;
        }

        if (!validators.email(profileData.email)) {
            showToast.error('오류', '올바른 이메일 주소를 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            const updatedData = {
                name: profileData.name,
                email: profileData.email,
                bio: profileData.bio
            };

            updateUser(updatedData);
            showToast.success('성공', '프로필이 업데이트되었습니다.');
        } catch (error) {
            showToast.error('오류', '프로필 업데이트 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [profileData, updateUser]);

    // 비밀번호 변경
    const handlePasswordChange = useCallback(async () => {
        if (!validators.required(passwordData.currentPassword)) {
            showToast.error('오류', '현재 비밀번호를 입력해주세요.');
            return;
        }

        const passwordValidation = validators.password(passwordData.newPassword);
        if (!passwordValidation.isValid) {
            showToast.error('오류', '새 비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast.error('오류', '새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);

        try {
            showToast.success('성공', '비밀번호가 변경되었습니다.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            showToast.error('오류', '비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [passwordData]);

    // 파일 선택 핸들러
    const handleAvatarChange = useCallback((file) => {
        if (file && file.size > 5 * 1024 * 1024) { // 5MB 제한
            showToast.error('오류', '파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setProfileData(prev => ({ ...prev, avatar: file }));
    }, []);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="사용자 설정"
            size="lg"
            centered
        >
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="profile" leftSection={<IconUser size={14} />}>
                        프로필
                    </Tabs.Tab>
                    <Tabs.Tab value="password" leftSection={<IconLock size={14} />}>
                        비밀번호
                    </Tabs.Tab>
                    <Tabs.Tab value="notifications" leftSection={<IconBell size={14} />}>
                        알림
                    </Tabs.Tab>
                </Tabs.List>

                {/* 프로필 탭 */}
                <Tabs.Panel value="profile" pt="md">
                    <Stack gap="md">
                        <Group>
                            <Avatar
                                src={user?.avatar}
                                size="xl"
                                radius="md"
                                style={{
                                    border: `2px solid ${dark ? '#30363d' : '#e5e7eb'}`,
                                }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>

                            <Stack gap="xs" style={{ flex: 1 }}>
                                <FileInput
                                    label="프로필 이미지"
                                    placeholder="이미지 파일을 선택하세요"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    leftSection={<IconCamera size={14} />}
                                />
                                <Text size="xs" c="dimmed">
                                    JPG, PNG 파일만 업로드 가능 (최대 5MB)
                                </Text>
                            </Stack>
                        </Group>

                        <TextInput
                            label="이름"
                            placeholder="이름을 입력하세요"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />

                        <TextInput
                            label="이메일"
                            placeholder="이메일을 입력하세요"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />

                        <TextInput
                            label="소개"
                            placeholder="자기소개를 입력하세요"
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        />

                        <Button
                            onClick={handleProfileUpdate}
                            loading={loading}
                            leftSection={<IconCheck size={14} />}
                        >
                            프로필 업데이트
                        </Button>
                    </Stack>
                </Tabs.Panel>

                {/* 비밀번호 탭 */}
                <Tabs.Panel value="password" pt="md">
                    <Stack gap="md">
                        <Alert
                            icon={<IconShield size={16} />}
                            title="보안 정보"
                            color="blue"
                        >
                            비밀번호는 8자 이상이어야 하며, 대소문자, 숫자, 특수문자를 포함하는 것을 권장합니다.
                        </Alert>

                        <PasswordInput
                            label="현재 비밀번호"
                            placeholder="현재 비밀번호를 입력하세요"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                        />

                        <PasswordInput
                            label="새 비밀번호"
                            placeholder="새 비밀번호를 입력하세요"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                        />

                        <PasswordInput
                            label="새 비밀번호 확인"
                            placeholder="새 비밀번호를 다시 입력하세요"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                        />

                        {passwordData.newPassword && (
                            <PasswordStrengthIndicator password={passwordData.newPassword} />
                        )}

                        <Button
                            onClick={handlePasswordChange}
                            loading={loading}
                            leftSection={<IconLock size={14} />}
                            color="red"
                        >
                            비밀번호 변경
                        </Button>
                    </Stack>
                </Tabs.Panel>

                {/* 알림 탭 */}
                <Tabs.Panel value="notifications" pt="md">
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">
                            받고 싶은 알림을 설정하세요.
                        </Text>

                        <Paper p="md" withBorder>
                            <Stack gap="sm">
                                <Switch
                                    label="이메일 알림"
                                    description="새 댓글이나 답글이 달렸을 때 이메일로 알림을 받습니다."
                                    defaultChecked
                                />

                                <Switch
                                    label="브라우저 알림"
                                    description="브라우저에서 푸시 알림을 받습니다."
                                    defaultChecked
                                />

                                <Switch
                                    label="마케팅 정보"
                                    description="새로운 기능이나 이벤트 정보를 받습니다."
                                />
                            </Stack>
                        </Paper>

                        <Button leftSection={<IconBell size={14} />}>
                            알림 설정 저장
                        </Button>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
});

UserSettingsModal.displayName = 'UserSettingsModal';

export default UserSettingsModal;