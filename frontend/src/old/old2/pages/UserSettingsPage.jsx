import React, { useState, useCallback } from 'react';
import {
    Stack,
    Card,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Group,
    Avatar,
    FileInput,
    Textarea,
    Divider,
    Grid,
    Alert,
    Progress,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconPhone,
    IconMapPin,
    IconCamera,
    IconLock,
    IconCheck,
    IconAlertCircle,
} from '@tabler/icons-react';
import {useAuth} from "@/context/AuthContext.jsx";
import useToast from "@/hooks/useToast.jsx";
import {Validation} from "@/utils/helpers.js";

const UserSettings = () => {
    const { user, updateProfile } = useAuth();
    const toast = useToast();

    // 프로필 폼 상태
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        avatar: user?.avatar || null,
    });

    // 비밀번호 변경 폼 상태
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 로딩 상태
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // 유효성 검사 상태
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    // 프로필 유효성 검사
    const validateProfile = useCallback(() => {
        const newErrors = {};

        if (!Validation.required(profileData.name)) {
            newErrors.name = '이름은 필수입니다.';
        }

        if (!Validation.required(profileData.email)) {
            newErrors.email = '이메일은 필수입니다.';
        } else if (!Validation.email(profileData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        if (profileData.phone && !Validation.phone(profileData.phone)) {
            newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
        }

        if (profileData.website && !Validation.url(profileData.website)) {
            newErrors.website = '올바른 URL 형식이 아닙니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [profileData]);

    // 비밀번호 강도 계산
    const calculatePasswordStrength = useCallback((password) => {
        let strength = 0;
        if (password.length >= 8) {strength += 25;}
        if (/[a-z]/.test(password)) {strength += 25;}
        if (/[A-Z]/.test(password)) {strength += 25;}
        if (/\d/.test(password)) {strength += 25;}
        if (/[@$!%*?&]/.test(password)) {strength += 25;}
        return Math.min(strength, 100);
    }, []);

    // 비밀번호 변경 시 강도 계산
    const handlePasswordChange = useCallback((field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));

        if (field === 'newPassword') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    }, [calculatePasswordStrength]);

    // 아바타 업로드 처리
    const handleAvatarUpload = useCallback(async (file) => {
        if (!file) {return;}

        setUploadProgress(0);

        // 파일 크기 검사 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        // 파일 타입 검사
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다.');
            return;
        }

        try {
            // 프로그레스 시뮬레이션
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            // 실제 업로드 로직 (예시)
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {throw new Error('업로드 실패');}

            const result = await response.json();

            setUploadProgress(100);
            setProfileData(prev => ({ ...prev, avatar: result.avatarUrl }));
            toast.success('프로필 이미지가 업데이트되었습니다.');

            setTimeout(() => setUploadProgress(0), 1000);
        } catch (error) {
            setUploadProgress(0);
            toast.error('이미지 업로드에 실패했습니다.');
        }
    }, [toast]);

    // 프로필 업데이트
    const handleUpdateProfile = useCallback(async () => {
        if (!validateProfile()) {return;}

        setIsUpdatingProfile(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // API 호출 시뮬레이션
            updateProfile(profileData);
            toast.success('프로필이 성공적으로 업데이트되었습니다.');
        } catch (error) {
            toast.error('프로필 업데이트에 실패했습니다.');
        } finally {
            setIsUpdatingProfile(false);
        }
    }, [profileData, validateProfile, updateProfile, toast]);

    // 비밀번호 변경
    const handleChangePassword = useCallback(async () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = '현재 비밀번호를 입력하세요.';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = '새 비밀번호를 입력하세요.';
        } else if (!Validation.password(passwordData.newPassword)) {
            newErrors.newPassword = '비밀번호는 8자 이상이며 대소문자, 숫자, 특수문자를 포함해야 합니다.';
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsChangingPassword(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // API 호출 시뮬레이션
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordStrength(0);
            toast.success('비밀번호가 성공적으로 변경되었습니다.');
        } catch (error) {
            toast.error('비밀번호 변경에 실패했습니다.');
        } finally {
            setIsChangingPassword(false);
        }
    }, [passwordData, toast]);

    const getPasswordStrengthColor = (strength) => {
        if (strength < 25) {return 'red';}
        if (strength < 50) {return 'orange';}
        if (strength < 75) {return 'yellow';}
        return 'green';
    };

    const getPasswordStrengthLabel = (strength) => {
        if (strength < 25) {return '매우 약함';}
        if (strength < 50) {return '약함';}
        if (strength < 75) {return '보통';}
        return '강함';
    };

    return (
        <Stack gap="lg">
            {/* 프로필 정보 */}
            <Card shadow="sm" radius="lg" padding="lg">
                <Stack gap="md">
                    <Title order={3} size="h4">
                        <Group gap="xs">
                            <IconUser size={20} />
                            프로필 정보
                        </Group>
                    </Title>

                    <Divider />

                    {/* 아바타 업로드 */}
                    <Group>
                        <Avatar
                            src={profileData.avatar}
                            size={80}
                            radius="md"
                            style={{
                                border: '3px solid var(--mantine-color-blue-6)',
                            }}
                        />
                        <Stack gap="xs">
                            <FileInput
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                placeholder="프로필 이미지 선택"
                                leftSection={<IconCamera size={16} />}
                                size="sm"
                            />
                            {uploadProgress > 0 && (
                                <Progress
                                    value={uploadProgress}
                                    size="xs"
                                    color="blue"
                                    striped
                                    animate
                                />
                            )}
                            <Text size="xs" c="dimmed">
                                JPG, PNG 파일만 업로드 가능 (최대 5MB)
                            </Text>
                        </Stack>
                    </Group>

                    <Grid>
                        <Grid.Col span={6}>
                            <TextInput
                                label="이름"
                                placeholder="이름을 입력하세요"
                                value={profileData.name}
                                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                error={errors.name}
                                leftSection={<IconUser size={16} />}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="이메일"
                                placeholder="example@email.com"
                                value={profileData.email}
                                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                error={errors.email}
                                leftSection={<IconMail size={16} />}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="전화번호"
                                placeholder="010-1234-5678"
                                value={profileData.phone}
                                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                error={errors.phone}
                                leftSection={<IconPhone size={16} />}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label="웹사이트"
                                placeholder="https://example.com"
                                value={profileData.website}
                                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                                error={errors.website}
                                leftSection={<IconMapPin size={16} />}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                label="위치"
                                placeholder="서울, 대한민국"
                                value={profileData.location}
                                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                leftSection={<IconMapPin size={16} />}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Textarea
                                label="자기소개"
                                placeholder="자신을 소개해주세요..."
                                value={profileData.bio}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                rows={4}
                                maxLength={500}
                            />
                            <Text size="xs" c="dimmed" ta="right">
                                {profileData.bio.length}/500
                            </Text>
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                        <Button
                            onClick={handleUpdateProfile}
                            loading={isUpdatingProfile}
                            leftSection={<IconCheck size={16} />}
                        >
                            프로필 업데이트
                        </Button>
                    </Group>
                </Stack>
            </Card>

            {/* 비밀번호 변경 */}
            <Card shadow="sm" radius="lg" padding="lg">
                <Stack gap="md">
                    <Title order={3} size="h4">
                        <Group gap="xs">
                            <IconLock size={20} />
                            비밀번호 변경
                        </Group>
                    </Title>

                    <Divider />

                    <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
                        보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.
                    </Alert>

                    <Grid>
                        <Grid.Col span={12}>
                            <PasswordInput
                                label="현재 비밀번호"
                                placeholder="현재 비밀번호를 입력하세요"
                                value={passwordData.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                error={errors.currentPassword}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <PasswordInput
                                label="새 비밀번호"
                                placeholder="새 비밀번호를 입력하세요"
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                error={errors.newPassword}
                                required
                            />
                            {passwordData.newPassword && (
                                <Stack gap="xs" mt="xs">
                                    <Group justify="space-between">
                                        <Text size="xs" c="dimmed">비밀번호 강도</Text>
                                        <Text size="xs" c={getPasswordStrengthColor(passwordStrength)}>
                                            {getPasswordStrengthLabel(passwordStrength)}
                                        </Text>
                                    </Group>
                                    <Progress
                                        value={passwordStrength}
                                        color={getPasswordStrengthColor(passwordStrength)}
                                        size="xs"
                                    />
                                </Stack>
                            )}
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <PasswordInput
                                label="비밀번호 확인"
                                placeholder="새 비밀번호를 다시 입력하세요"
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                error={errors.confirmPassword}
                                required
                            />
                        </Grid.Col>
                    </Grid>

                    <Group justify="flex-end">
                        <Button
                            onClick={handleChangePassword}
                            loading={isChangingPassword}
                            leftSection={<IconLock size={16} />}
                            color="orange"
                        >
                            비밀번호 변경
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Stack>
    );
};

export default UserSettings;