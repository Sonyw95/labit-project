import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    Stack,
    Grid,
    TextInput,
    Textarea,
    NumberInput,
    Button,
    Group,
    Text,
    Alert,
    LoadingOverlay,
    Divider,
    Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
    IconDeviceFloppy,
    IconAlertCircle,
    IconCheck,
    IconX
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { adminService } from "@/api/adminService.js";
import useAuthStore from "@/stores/authStore.js";
import ImageUploadComponent from "./ImageUploadComponent.jsx";

const AdminEdit = memo(() => {
    const navigate = useNavigate();
    const { themeColors } = useTheme();
    const queryClient = useQueryClient();
    const { getIsAdmin, getIsAuthenticated } = useAuthStore();

    const [profileImagePreview, setProfileImagePreview] = useState(null);

    // 권한 체크
    const isAuthenticated = getIsAuthenticated();
    const isAdmin = getIsAdmin();

    // 관리자 정보 조회
    const {
        data: adminInfo,
        isLoading: adminLoading,
        error: adminError
    } = useQuery({
        queryKey: ['admin', 'info'],
        queryFn: adminService.getAdminInfo,
        enabled: isAuthenticated && isAdmin,
        staleTime: 5 * 60 * 1000,
    });

    // 폼 설정
    const form = useForm({
        initialValues: {
            name: '',
            role: '',
            bio: '',
            location: '',
            email: '',
            githubUrl: '',
            startYear: new Date().getFullYear(),
        },
        validate: {
            name: (value) => {
                if (!value || value.trim().length < 2) {
                    return '이름은 2자 이상 입력해주세요';
                }
                if (value.length > 50) {
                    return '이름은 50자 이하로 입력해주세요';
                }
                return null;
            },
            role: (value) => {
                if (!value || value.trim().length < 2) {
                    return '역할은 2자 이상 입력해주세요';
                }
                if (value.length > 100) {
                    return '역할은 100자 이하로 입력해주세요';
                }
                return null;
            },
            email: (value) => {
                if (!value) {
                    return '이메일을 입력해주세요';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return '올바른 이메일 형식을 입력해주세요';
                }
                return null;
            },
            location: (value) => {
                if (!value || value.trim().length < 2) {
                    return '위치를 입력해주세요';
                }
                return null;
            },
            bio: (value) => {
                if (value && value.length > 1000) {
                    return '소개는 1000자 이하로 입력해주세요';
                }
                return null;
            },
            githubUrl: (value) => {
                if (value && !value.startsWith('https://github.com/')) {
                    return 'GitHub URL 형식이 올바르지 않습니다';
                }
                return null;
            },
            startYear: (value) => {
                const currentYear = new Date().getFullYear();
                if (value < 2000 || value > currentYear) {
                    return `시작 연도는 2000년부터 ${currentYear}년 사이여야 합니다`;
                }
                return null;
            },
        },
    });

    // 관리자 정보 수정 Mutation
    const updateAdminMutation = useMutation({
        mutationFn: (adminData) => adminService.updateAdminInfo(adminData),
        onSuccess: (updatedAdmin) => {
            notifications.show({
                title: '수정 완료',
                message: '관리자 정보가 성공적으로 수정되었습니다.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            // React Query 캐시 업데이트
            queryClient.setQueryData(['admin', 'info'], updatedAdmin);

            // Zustand store 업데이트
            useAuthStore.getState().setAdminInfo(updatedAdmin);

            // 홈페이지로 이동
            navigate('/');
        },
        onError: (error) => {
            console.error('관리자 정보 수정 실패:', error);
            notifications.show({
                title: '수정 실패',
                message: error.response?.data?.message || '관리자 정보 수정에 실패했습니다.',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    // 프로필 이미지 업로드 Mutation
    const uploadImageMutation = useMutation({
        mutationFn: (formData) => adminService.uploadProfileImage(formData),
        onSuccess: (imageUrl) => {
            setProfileImagePreview(imageUrl);
            notifications.show({
                title: '이미지 업로드 완료',
                message: '프로필 이미지가 업로드되었습니다.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
        },
        onError: (error) => {
            console.error('이미지 업로드 실패:', error);
            notifications.show({
                title: '업로드 실패',
                message: '이미지 업로드에 실패했습니다.',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    // 관리자 정보로 폼 초기화
    useEffect(() => {
        if (adminInfo) {
            form.setValues({
                name: adminInfo.name || '',
                role: adminInfo.role || '',
                bio: adminInfo.bio || '',
                location: adminInfo.location || '',
                email: adminInfo.email || '',
                githubUrl: adminInfo.githubUrl || '',
                startYear: adminInfo.startYear || new Date().getFullYear(),
            });
            setProfileImagePreview(adminInfo.profileImage);
        }
    }, [adminInfo]);

    // 권한 체크 리다이렉트
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // 이벤트 핸들러들
    const handleSubmit = useCallback((values) => {
        const submitData = {
            ...values,
            profileImage: profileImagePreview, // 업로드된 이미지 URL 포함
        };
        updateAdminMutation.mutate(submitData);
    }, [profileImagePreview, updateAdminMutation]);

    const handleCancel = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const containerStyle = useMemo(() => ({
        backgroundColor: themeColors.background,
        minHeight: '100vh',
        paddingTop: '2rem',
        paddingBottom: '2rem',
    }), [themeColors.background]);

    // 권한이 없는 경우
    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    // 로딩 중인 경우
    if (adminLoading) {
        return (
            <Box style={containerStyle}>
                <Container size="md">
                    <Paper p="xl" radius="md" shadow="sm" pos="relative">
                        <LoadingOverlay visible />
                        <Title order={2} mb="xl">관리자 정보 수정</Title>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // 에러 발생한 경우
    if (adminError) {
        return (
            <Box style={containerStyle}>
                <Container size="md">
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="데이터 로드 실패"
                        color="red"
                        variant="outline"
                    >
                        <Text size="sm">{adminError.message}</Text>
                        <Button
                            variant="outline"
                            size="sm"
                            mt="sm"
                            onClick={() => navigate('/')}
                        >
                            홈으로 돌아가기
                        </Button>
                    </Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box style={containerStyle}>
            <Box p="xl" radius="md" shadow="sm" pos="relative">
                <LoadingOverlay visible={updateAdminMutation.isPending} />

                {/* 헤더 */}
                <Group justify="space-between" mb="xl">
                    <Group>
                        <Title order={2} c={themeColors.text}>
                            관리자 정보 수정
                        </Title>
                    </Group>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        {/* 프로필 이미지 섹션 */}
                        <ImageUploadComponent
                            currentImage={adminInfo?.profileImage}
                            onImageUpload={(imageUrl) => {
                                // 상태 업데이트 또는 폼 값 설정
                            }}
                        />

                        <Divider />

                        {/* 기본 정보 */}
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="이름"
                                    placeholder="이름을 입력하세요"
                                    required
                                    {...form.getInputProps('name')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="역할"
                                    placeholder="예: Full Stack Developer"
                                    required
                                    {...form.getInputProps('role')}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="이메일"
                                    placeholder="email@example.com"
                                    type="email"
                                    required
                                    {...form.getInputProps('email')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="위치"
                                    placeholder="예: Seoul, Korea"
                                    required
                                    {...form.getInputProps('location')}
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={8}>
                                <TextInput
                                    label="GitHub URL"
                                    placeholder="https://github.com/username"
                                    {...form.getInputProps('githubUrl')}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <NumberInput
                                    label="시작 연도"
                                    placeholder="2020"
                                    min={2000}
                                    max={new Date().getFullYear()}
                                    {...form.getInputProps('startYear')}
                                />
                            </Grid.Col>
                        </Grid>

                        <Textarea
                            label="소개"
                            placeholder="자신을 소개해주세요"
                            minRows={4}
                            maxRows={8}
                            {...form.getInputProps('bio')}
                        />

                        {/* 버튼 그룹 */}
                        <Group justify="flex-end" mt="xl">
                            <Button
                                variant="subtle"
                                onClick={handleCancel}
                                disabled={updateAdminMutation.isPending}
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                leftSection={<IconDeviceFloppy size={16} />}
                                loading={updateAdminMutation.isPending}
                            >
                                저장
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
});

AdminEdit.displayName = 'AdminEdit';

export default AdminEdit;