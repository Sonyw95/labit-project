import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Container,
    Text,
    TextInput,
    Button,
    Avatar,
    Group,
    Stack,
    Title,
    Divider,
    FileInput,
    Alert,
    Loader,
    ActionIcon,
    Box,
    Anchor
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconCamera,
    IconCheck,
    IconX,
    IconArrowLeft,
    IconAlertCircle,
    IconUpload
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import useAuthStore from '../stores/authStore';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../api/authService';
import { uploadService } from '../api/uploadService';

const UserEditPage = () => {
    const { user, updateUser, isAuthenticated } = useAuthStore();
    const { dark, themeColors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef(null);

    // 폼 초기화
    const form = useForm({
        initialValues: {
            nickname: '',
            email: '',
        },
        validate: {
            nickname: (value) => {
                if (!value?.trim()) {
                    return '닉네임을 입력해주세요';
                }
                if (value.length < 2) {
                    return '닉네임은 2자 이상이어야 합니다';
                }
                if (value.length > 20) {
                    return '닉네임은 20자 이하여야 합니다';
                }
                return null;
            },
            email: (value) => {
                if (!value?.trim()) {
                    return '이메일을 입력해주세요';
                }
                if (!/^\S+@\S+\.\S+$/.test(value)) {
                    return '올바른 이메일 형식이 아닙니다';
                }
                return null;
            },
        },
    });

    // 사용자 정보로 폼 초기화
    useEffect(() => {
        if (user) {
            form.setValues({
                nickname: user.nickname || '',
                email: user.email || '',
            });
            // 현재 프로필 이미지 설정
            if (user.profileImage) {
                setProfileImagePreview(user.profileImage);
            }
        }
    }, [ user]);

    // 인증되지 않은 경우 리다이렉트
    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = '/home';
        }
    }, [isAuthenticated]);

    // 파일 선택 처리
    const handleImageSelect = useCallback((file) => {
        if (!file) {
            return;
        }

        // 파일 유효성 검사
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            notifications.show({
                title: '파일 크기 초과',
                message: '파일 크기는 5MB 이하여야 합니다.',
                color: 'red',
                icon: <IconX />,
            });
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            notifications.show({
                title: '지원하지 않는 파일 형식',
                message: 'JPG, PNG, GIF 파일만 업로드 가능합니다.',
                color: 'red',
                icon: <IconX />,
            });
            return;
        }

        setProfileImageFile(file);

        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }, []);

    // 이미지 제거
    const handleImageRemove = useCallback(() => {
        setProfileImageFile(null);
        setProfileImagePreview(user?.profileImage || null);
        fileInputRef.current.value = '';
        // if (fileInputRef.current) {
        //     fileInputRef.current.value = '';
        // }
    }, [user?.profileImage]);

    // 폼 제출 처리
    const handleSubmit = useCallback(async (values) => {
        if (!user) {
            return;
        }

        setLoading(true);

        try {
            let profileImageUrl = user.profileImage;

            // 프로필 이미지가 변경된 경우 업로드
            if (profileImageFile) {
                setImageUploading(true);
                try {
                    const uploadResponse = await uploadService.uploadImage(profileImageFile, 'profile');
                    profileImageUrl = uploadResponse.fileUrl || uploadResponse.url;
                } catch (uploadError) {
                    console.error('이미지 업로드 실패:', uploadError);
                    notifications.show({
                        title: '이미지 업로드 실패',
                        message: '프로필 이미지 업로드 중 오류가 발생했습니다.',
                        color: 'red',
                        icon: <IconX />,
                    });
                    return;
                } finally {
                    setImageUploading(false);
                }
            }

            // 사용자 정보 업데이트
            const updateData = {
                ...values,
                profileImage: profileImageUrl,
            };

            await authService.updateUserInfo(updateData);

            // 파일 상태 초기화
            setProfileImageFile(null);

        } catch (error) {
            console.error('프로필 수정 실패:', error);
            notifications.show({
                title: '프로필 수정 실패',
                message: error.message || '프로필 수정 중 오류가 발생했습니다.',
                color: 'red',
                icon: <IconX />,
            });
        } finally {
            setLoading(false);
        }
    }, [user, profileImageFile, updateUser]);

    // 변경사항 확인
    const hasChanges = useCallback(() => {
        if (!user) return false;

        const currentValues = form.values;
        return (
            currentValues.nickname !== user.nickname ||
            currentValues.email !== user.email ||
            profileImageFile !== null
        );
    }, [form.values, user, profileImageFile]);

    // 취소 확인 모달
    const handleCancel = useCallback(() => {
        if (hasChanges()) {
            modals.openConfirmModal({
                title: '변경사항 취소',
                children: (
                    <Text size="sm">
                        저장하지 않은 변경사항이 있습니다. 정말 취소하시겠습니까?
                    </Text>
                ),
                labels: { confirm: '취소', cancel: '계속 편집' },
                confirmProps: { color: 'red' },
                onConfirm: () => {
                    // 폼 리셋
                    if (user) {
                        form.setValues({
                            nickname: user.nickname || '',
                            email: user.email || '',
                        });
                        setProfileImageFile(null);
                        setProfileImagePreview(user.profileImage || null);
                    }
                    window.history.back();
                },
            });
        } else {
            window.history.back();
        }
    }, [hasChanges, form, user]);

    if (!user) {
        return (
            <Container size="sm" py="xl">
                <Group justify="center">
                    <Loader size="lg" />
                </Group>
            </Container>
        );
    }

    return (
        <Container size="sm" py="xl">
            <Box
                shadow="sm"
                radius="lg"
                p="xl"
                // style={{
                //     backgroundColor: dark ? themeColors.section : '#ffffff',
                //     border: `1px solid ${themeColors.border}`,
                // }}
            >
                {/* 헤더 */}
                <Group justify="space-between" mb="xl">
                    <Group gap="sm">
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            onClick={handleCancel}
                            aria-label="뒤로가기"
                        >
                            <IconArrowLeft size={20} />
                        </ActionIcon>
                        <Title order={2} c={themeColors.text}>
                            프로필 수정
                        </Title>
                    </Group>
                </Group>

                <Box component="div">
                    <Stack gap="xl">
                        {/* 프로필 이미지 섹션 */}
                        <Box>
                            <Text size="sm" fw={500} mb="sm" c={themeColors.text}>
                                프로필 이미지
                            </Text>
                            <Group gap="lg" align="flex-start">
                                <Box pos="relative">
                                    <Avatar
                                        src={profileImagePreview}
                                        size={120}
                                        radius="lg"
                                        style={{
                                            border: `3px solid ${themeColors.border}`,
                                        }}
                                    >
                                        <IconUser size={40} />
                                    </Avatar>
                                    {profileImageFile && (
                                        <ActionIcon
                                            variant="filled"
                                            color="red"
                                            size="sm"
                                            pos="absolute"
                                            top={-8}
                                            right={-8}
                                            onClick={handleImageRemove}
                                            aria-label="이미지 제거"
                                        >
                                            <IconX size={12} />
                                        </ActionIcon>
                                    )}
                                </Box>

                                <Stack gap="sm" flex={1}>
                                    <FileInput
                                        ref={fileInputRef}
                                        placeholder="이미지 파일을 선택하세요"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        leftSection={<IconCamera size={16} />}
                                        disabled={loading || imageUploading}
                                        styles={{
                                            input: {
                                                backgroundColor: dark ? themeColors.hover : '#f8f9fa',
                                                borderColor: themeColors.border,
                                                color: themeColors.text,
                                            },
                                        }}
                                    />
                                    <Text size="xs" c={themeColors.subText}>
                                        JPG, PNG, GIF 파일 (최대 5MB)
                                    </Text>
                                    {profileImageFile && (
                                        <Alert
                                            icon={<IconUpload size={16} />}
                                            color="blue"
                                            variant="light"
                                            size="sm"
                                        >
                                            새 이미지가 선택되었습니다. 저장 버튼을 눌러 적용하세요.
                                        </Alert>
                                    )}
                                </Stack>
                            </Group>
                        </Box>

                        <Divider color={themeColors.border} />

                        {/* 기본 정보 섹션 */}
                        <Stack gap="md">
                            <Text size="sm" fw={500} c={themeColors.text}>
                                기본 정보
                            </Text>

                            <TextInput
                                label="닉네임"
                                placeholder="닉네임을 입력하세요"
                                leftSection={<IconUser size={16} />}
                                required
                                {...form.getInputProps('nickname')}
                                styles={{
                                    label: { color: themeColors.text },
                                    input: {
                                        backgroundColor: dark ? themeColors.hover : '#f8f9fa',
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '&:focus': {
                                            borderColor: themeColors.primary,
                                        },
                                    },
                                }}
                            />

                            <TextInput
                                label="이메일"
                                leftSection={<IconMail size={16} />}
                                disabled
                                required
                                {...form.getInputProps('email')}
                                styles={{
                                    label: { color: themeColors.text },
                                    input: {
                                        backgroundColor: dark ? themeColors.hover : '#f8f9fa',
                                        borderColor: themeColors.border,
                                        color: themeColors.text,
                                        '&:focus': {
                                            borderColor: themeColors.primary,
                                        },
                                    },
                                }}
                            />
                        </Stack>

                        {/* 계정 정보 (읽기 전용) */}
                        {/*<Stack gap="md">*/}
                        {/*    <Text size="sm" fw={500} c={themeColors.text}>*/}
                        {/*        계정 정보*/}
                        {/*    </Text>*/}

                        {/*    <Box*/}
                        {/*        p="sm"*/}
                        {/*        style={{*/}
                        {/*            backgroundColor: dark ? themeColors.hover : '#f8f9fa',*/}
                        {/*            borderRadius: '8px',*/}
                        {/*            border: `1px solid ${themeColors.border}`,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Text size="sm" c={themeColors.subText} mb={4}>*/}
                        {/*            사용자 ID*/}
                        {/*        </Text>*/}
                        {/*        <Text size="sm" c={themeColors.text} fw={500}>*/}
                        {/*            {user.id}*/}
                        {/*        </Text>*/}
                        {/*    </Box>*/}

                        {/*    <Box*/}
                        {/*        p="sm"*/}
                        {/*        style={{*/}
                        {/*            backgroundColor: dark ? themeColors.hover : '#f8f9fa',*/}
                        {/*            borderRadius: '8px',*/}
                        {/*            border: `1px solid ${themeColors.border}`,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <Text size="sm" c={themeColors.subText} mb={4}>*/}
                        {/*            가입일*/}
                        {/*        </Text>*/}
                        {/*        <Text size="sm" c={themeColors.text} fw={500}>*/}
                        {/*            {user.createdDate ? new Date(user.createdDate).toLocaleDateString('ko-KR') : '-'}*/}
                        {/*        </Text>*/}
                        {/*    </Box>*/}
                        {/*</Stack>*/}

                        {/* 주의사항 */}
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            color="blue"
                            variant="light"
                        >
                            <Text size="sm">
                                카카오 계정 정보는 카카오에서 직접 관리됩니다.
                                <Anchor
                                    href="https://accounts.kakao.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="sm"
                                    ml={4}
                                >
                                    카카오 계정 관리
                                </Anchor>
                            </Text>
                        </Alert>

                        {/* 액션 버튼 */}
                        <Group justify="flex-end" gap="sm">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={handleCancel}
                                disabled={loading || imageUploading}
                            >
                                취소
                            </Button>
                            <Button
                                onClick={() => form.onSubmit(handleSubmit)()}
                                loading={loading || imageUploading}
                                disabled={!hasChanges()}
                                leftSection={<IconCheck size={16} />}
                                style={{
                                    backgroundColor: themeColors.primary,
                                    '&:hover': {
                                        backgroundColor: themeColors.secondary,
                                    },
                                }}
                            >
                                {imageUploading ? '이미지 업로드 중...' : '저장'}
                            </Button>
                        </Group>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default UserEditPage;