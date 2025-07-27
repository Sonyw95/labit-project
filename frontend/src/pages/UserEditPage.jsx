import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
    Container,
    Grid,
    Card,
    Group,
    Text,
    TextInput,
    Textarea,
    Button,
    Avatar,
    ActionIcon,
    Stack,
    Alert,
    Modal,
    Paper,
    Title,
    Box,
    Badge,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
// Navigation would be handled by parent component or routing library
import {
    IconArrowLeft,
    IconCamera,
    IconTrash,
    IconEdit,
    IconCheck,
    IconX,
    IconAlertTriangle,
    IconUpload,
    IconUser,
    IconMail,
    IconCalendar,
    IconPencil
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";
import {Navigate, useNavigate} from "react-router-dom";

// Modal configurations for dark mode and reusability
const createModalConfig = (velogColors) => ({
    centered: true,
    overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
    },
    styles: {
        header: {
            backgroundColor: velogColors.section,
            color: velogColors.text,
        },
        body: {
            backgroundColor: velogColors.section,
            color: velogColors.text,
        },
        title: {
            color: velogColors.text,
            fontWeight: 600,
        },
        close: {
            color: velogColors.text,
            '&:hover': {
                backgroundColor: velogColors.hover,
            }
        }
    },
});

// Custom hook for confirm modals with dark mode support
const useConfirmModals = () => {
    const { velogColors } = useTheme();

    const modalConfig = useMemo(() => createModalConfig(velogColors), [velogColors]);

    const confirmProps = useMemo(() => ({
        variant: 'filled',
        styles: {
            root: {
                fontWeight: 600,
                color: 'white',
                '&:hover': {
                    opacity: 0.9,
                }
            }
        }
    }), []);

    const cancelProps = useMemo(() => ({
        variant: 'subtle',
        styles: {
            root: {
                color: velogColors.text,
                backgroundColor: 'transparent',
                border: `1px solid ${velogColors.border}`,
                fontWeight: 500,
                '&:hover': {
                    backgroundColor: velogColors.hover,
                }
            }
        }
    }), [velogColors]);

    const openUnsavedChangesModal = useCallback((onConfirm, type = 'cancel') => {
        const isGoBack = type === 'goback';

        modals.openConfirmModal({
            ...modalConfig,
            title: isGoBack ? '페이지 나가기' : '변경사항 취소',
            children: (
                <Box>
                    <Text size="sm" c={velogColors.text}>
                        {isGoBack ? '뒤로가시겠습니까?' : '변경사항이 있습니다. 정말 취소하시겠습니까?'}
                    </Text>
                    <Text size="xs" c={velogColors.subText} mt="xs">
                        작성중인 내용은 저장되지 않습니다.
                    </Text>
                </Box>
            ),
            labels: {
                confirm: (
                    <Text fw={600} c="white">
                        {isGoBack ? '뒤로가기' : '취소'}
                    </Text>
                ),
                cancel: (
                    <Text fw={500} c={velogColors.text}>
                        닫기
                    </Text>
                )
            },
            confirmProps: {
                ...confirmProps,
                color: isGoBack ? 'blue' : 'red',
                styles: {
                    ...confirmProps.styles,
                    root: {
                        ...confirmProps.styles.root,
                        backgroundColor: isGoBack ? velogColors.primary : velogColors.error,
                    }
                }
            },
            cancelProps,
            onConfirm,
        });
    }, [modalConfig, confirmProps, cancelProps, velogColors]);

    const openDeleteAccountModal = useCallback((onConfirm) => {
        modals.openConfirmModal({
            ...modalConfig,
            title: '계정 삭제 확인',
            children: (
                <Stack gap="md">
                    <Alert
                        color="red"
                        icon={<IconAlertTriangle size={16} />}
                        styles={{
                            root: {
                                backgroundColor: `${velogColors.error}15`,
                                border: `1px solid ${velogColors.error}40`,
                                color: velogColors.text,
                            },
                            message: { color: velogColors.text }
                        }}
                    >
                        정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </Alert>
                    <Text size="sm" c={velogColors.subText}>
                        • 작성한 모든 포스트 삭제<br/>
                        • 댓글 및 좋아요 기록 삭제<br/>
                        • 팔로워/팔로잉 관계 삭제
                    </Text>
                </Stack>
            ),
            labels: {
                confirm: (
                    <Text fw={600} c="white">
                        삭제하기
                    </Text>
                ),
                cancel: (
                    <Text fw={500} c={velogColors.text}>
                        취소
                    </Text>
                )
            },
            confirmProps: {
                ...confirmProps,
                color: 'red',
                styles: {
                    ...confirmProps.styles,
                    root: {
                        ...confirmProps.styles.root,
                        backgroundColor: velogColors.error,
                    }
                }
            },
            cancelProps,
            onConfirm,
        });
    }, [modalConfig, confirmProps, cancelProps, velogColors]);

    return { openUnsavedChangesModal, openDeleteAccountModal };
};

// Profile Image Upload Component with optimization
const ProfileImageUpload = React.memo(({ currentImage, onImageChange, onImageRemove }) => {
    const { velogColors } = useTheme();
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);

    const cardStyles = useMemo(() => ({
        backgroundColor: velogColors.section,
        borderColor: velogColors.border,
    }), [velogColors]);

    const avatarStyles = useMemo(() => ({
        border: `2px solid ${velogColors.border}`,
    }), [velogColors.border]);

    const uploadButtonStyles = useMemo(() => ({
        root: {
            backgroundColor: velogColors.primary,
            color: 'white',
            '&:hover': {
                backgroundColor: velogColors.primary,
                opacity: 0.9
            }
        }
    }), [velogColors.primary]);

    const removeButtonStyles = useMemo(() => ({
        root: {
            backgroundColor: velogColors.error,
            color: 'white',
            '&:hover': {
                backgroundColor: '#e03131'
            }
        }
    }), [velogColors.error]);

    const handleFileSelect = useCallback(async (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast.error("업로드 불가", '이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast.info("", '파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                setPreview(result);
                onImageChange(file, result);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Image upload error:', error);
            setIsUploading(false);
        }
    }, [onImageChange]);

    const handleRemoveImage = useCallback(() => {
        setPreview(null);
        onImageRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onImageRemove]);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <Card p="lg" radius="md" withBorder style={cardStyles}>
            <Stack align="center" gap="md">
                <Text fw={600} size="sm" c={velogColors.text}>
                    프로필 이미지
                </Text>

                <Box pos="relative">
                    <Avatar
                        size={120}
                        radius="50%"
                        src={preview}
                        style={avatarStyles}
                        aria-label="프로필 이미지"
                    >
                        <IconUser size={48} color={velogColors.subText} />
                    </Avatar>

                    <ActionIcon
                        size="sm"
                        radius="50%"
                        variant="filled"
                        color="blue"
                        pos="absolute"
                        bottom={8}
                        right={8}
                        onClick={handleUploadClick}
                        loading={isUploading}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        aria-label="프로필 이미지 변경"
                    >
                        <IconCamera size={14} />
                    </ActionIcon>
                </Box>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    style={{ display: 'none' }}
                    aria-label="프로필 이미지 파일 선택"
                />

                <Group gap="xs">
                    <Button
                        variant="light"
                        size="xs"
                        leftSection={<IconUpload size={14} />}
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        styles={uploadButtonStyles}
                    >
                        업로드
                    </Button>

                    {preview && (
                        <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconTrash size={14} />}
                            onClick={handleRemoveImage}
                            styles={removeButtonStyles}
                        >
                            제거
                        </Button>
                    )}
                </Group>

                <Text size="xs" c={velogColors.subText} ta="center">
                    JPG, PNG 파일 (최대 5MB)
                </Text>
            </Stack>
        </Card>
    );
});

ProfileImageUpload.displayName = 'ProfileImageUpload';

// User Info Form Component with optimization
const UserInfoForm = React.memo(({ userInfo, onChange, errors = {} }) => {
    const { velogColors } = useTheme();

    const cardStyles = useMemo(() => ({
        backgroundColor: velogColors.section,
        borderColor: velogColors.border,
    }), [velogColors]);

    const inputStyles = useMemo(() => ({
        input: {
            backgroundColor: velogColors.background,
            borderColor: velogColors.border,
            color: velogColors.text,
            '&:focus': {
                borderColor: velogColors.primary,
            },
            '&::placeholder': {
                color: velogColors.subText,
            }
        },
        label: {
            color: velogColors.text,
            fontWeight: 500,
        }
    }), [velogColors]);

    const readOnlyInputStyles = useMemo(() => ({
        input: {
            backgroundColor: velogColors.hover,
            borderColor: velogColors.border,
            color: velogColors.subText,
            cursor: 'not-allowed'
        },
        label: { color: velogColors.text }
    }), [velogColors]);

    const handleInputChange = useCallback((field) => (value) => {
        onChange({ ...userInfo, [field]: value });
    }, [userInfo, onChange]);

    const handleNicknameChange = useCallback((e) => {
        handleInputChange('nickname')(e.target.value);
    }, [handleInputChange]);

    const handleBioChange = useCallback((e) => {
        handleInputChange('bio')(e.target.value);
    }, [handleInputChange]);

    const handleDateChange = useCallback((value) => {
        handleInputChange('devStartDate')(value);
    }, [handleInputChange]);

    return (
        <Stack gap="md">
            {/* Basic Info Card */}
            <Card p="lg" radius="md" withBorder style={cardStyles}>
                <Stack gap="md">
                    <Group gap="xs" mb="sm">
                        <IconUser size={16} color={velogColors.primary} />
                        <Text fw={600} size="sm" c={velogColors.text}>
                            기본 정보
                        </Text>
                    </Group>

                    <TextInput
                        label="닉네임"
                        placeholder="닉네임을 입력하세요"
                        value={userInfo.nickname || ''}
                        onChange={handleNicknameChange}
                        error={errors.nickname}
                        leftSection={<IconEdit size={14} color={velogColors.subText} />}
                        styles={inputStyles}
                        aria-describedby={errors.nickname ? 'nickname-error' : undefined}
                    />

                    <TextInput
                        label="이메일"
                        value={userInfo.email || ''}
                        readOnly
                        leftSection={<IconMail size={14} color={velogColors.subText} />}
                        rightSection={
                            <Badge
                                size="xs"
                                styles={{
                                    root: {
                                        backgroundColor: velogColors.hover,
                                        color: velogColors.subText
                                    }
                                }}
                            >
                                수정불가
                            </Badge>
                        }
                        styles={readOnlyInputStyles}
                        aria-label="이메일 주소 (수정 불가)"
                    />
                </Stack>
            </Card>

            {/* About Me Card */}
            <Card p="lg" radius="md" withBorder style={cardStyles}>
                <Stack gap="md">
                    <Group gap="xs" mb="sm">
                        <IconPencil size={16} color={velogColors.primary} />
                        <Text fw={600} size="sm" c={velogColors.text}>
                            자기소개
                        </Text>
                    </Group>

                    <Textarea
                        placeholder="자신을 소개해주세요..."
                        value={userInfo.bio || ''}
                        onChange={handleBioChange}
                        error={errors.bio}
                        minRows={4}
                        maxRows={8}
                        autosize
                        styles={inputStyles}
                        aria-describedby="bio-counter"
                    />

                    <Text
                        id="bio-counter"
                        size="xs"
                        c={velogColors.subText}
                        aria-live="polite"
                    >
                        {userInfo.bio?.length || 0}/500
                    </Text>
                </Stack>
            </Card>

            {/* Development Start Date Card */}
            <Card p="lg" radius="md" withBorder style={cardStyles}>
                <Stack gap="md">
                    <Group gap="xs" mb="sm">
                        <IconCalendar size={16} color={velogColors.primary} />
                        <Text fw={600} size="sm" c={velogColors.text}>
                            개발 시작일
                        </Text>
                    </Group>

                    <DateInput
                        label="언제부터 개발을 시작하셨나요?"
                        placeholder="날짜를 선택하세요"
                        value={userInfo.devStartDate}
                        onChange={handleDateChange}
                        error={errors.devStartDate}
                        maxDate={new Date()}
                        styles={inputStyles}
                        aria-label="개발 시작 날짜 선택"
                    />
                </Stack>
            </Card>
        </Stack>
    );
});

UserInfoForm.displayName = 'UserInfoForm';

// Action Buttons Component with optimization
const ActionButtons = React.memo(({ onSave, onCancel, isSaving, hasChanges }) => {
    const { velogColors } = useTheme();

    const cardStyles = useMemo(() => ({
        backgroundColor: velogColors.section,
        borderColor: velogColors.border,
    }), [velogColors]);

    const saveButtonStyles = useMemo(() => ({
        root: {
            backgroundColor: hasChanges ? velogColors.primary : velogColors.hover,
            color: hasChanges ? 'white' : velogColors.subText,
            fontWeight: 600,
            '&:hover': {
                backgroundColor: hasChanges ? velogColors.primary : velogColors.hover,
                opacity: hasChanges ? 0.9 : 1,
            },
            '&:disabled': {
                backgroundColor: velogColors.hover,
                color: velogColors.subText,
            }
        }
    }), [hasChanges, velogColors]);

    const cancelButtonStyles = useMemo(() => ({
        root: {
            color: velogColors.subText,
            '&:hover': {
                backgroundColor: velogColors.hover,
            }
        }
    }), [velogColors]);

    return (
        <Card p="lg" radius="md" withBorder style={cardStyles}>
            <Group justify="space-between">
                <Button
                    variant="subtle"
                    leftSection={<IconX size={16} />}
                    onClick={onCancel}
                    disabled={isSaving}
                    styles={cancelButtonStyles}
                    aria-label="변경사항 취소"
                >
                    취소
                </Button>

                <Button
                    leftSection={<IconCheck size={16} />}
                    onClick={onSave}
                    loading={isSaving}
                    disabled={!hasChanges}
                    styles={saveButtonStyles}
                    aria-label={hasChanges ? "변경사항 저장" : "저장할 변경사항 없음"}
                >
                    저장하기
                </Button>
            </Group>
        </Card>
    );
});

ActionButtons.displayName = 'ActionButtons';

// Danger Zone Component with optimization
const DangerZone = React.memo(({ onDeleteAccount }) => {
    const { velogColors } = useTheme();
    const { openDeleteAccountModal } = useConfirmModals();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const cardStyles = useMemo(() => ({
        backgroundColor: velogColors.section,
        borderColor: velogColors.error,
    }), [velogColors]);

    const alertStyles = useMemo(() => ({
        root: {
            backgroundColor: `${velogColors.error}15`,
            border: `1px solid ${velogColors.error}40`,
            color: velogColors.text,
        },
        message: { color: velogColors.text }
    }), [velogColors]);

    const buttonStyles = useMemo(() => ({
        root: {
            borderColor: velogColors.error,
            color: velogColors.error,
            '&:hover': {
                backgroundColor: `${velogColors.error}10`,
            }
        }
    }), [velogColors.error]);

    const modalStyles = useMemo(() => ({
        header: {
            backgroundColor: velogColors.section,
            borderBottom: `1px solid ${velogColors.border}`,
        },
        body: {
            backgroundColor: velogColors.section,
        },
        title: {
            color: velogColors.text,
        },
    }), [velogColors]);

    const handleDeleteClick = useCallback(() => {
        setShowConfirmModal(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (confirmText !== 'DELETE') return;

        setIsDeleting(true);
        try {
            await onDeleteAccount();
        } catch (error) {
            console.error('Delete account error:', error);
        } finally {
            setIsDeleting(false);
            setShowConfirmModal(false);
            setConfirmText('');
        }
    }, [confirmText, onDeleteAccount]);

    const handleModalClose = useCallback(() => {
        if (!isDeleting) {
            setShowConfirmModal(false);
            setConfirmText('');
        }
    }, [isDeleting]);

    const handleConfirmTextChange = useCallback((e) => {
        setConfirmText(e.target.value);
    }, []);

    return (
        <>
            <Card p="lg" radius="md" withBorder style={cardStyles}>
                <Stack gap="md">
                    <Group gap="xs">
                        <IconAlertTriangle size={16} color={velogColors.error} />
                        <Text fw={600} size="sm" c={velogColors.error}>
                            위험 영역
                        </Text>
                    </Group>

                    <Alert icon={<IconAlertTriangle size={16} />} styles={alertStyles}>
                        <Text size="sm" mb="xs" c={velogColors.text}>
                            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                        </Text>
                        <Text size="xs" c={velogColors.subText}>
                            • 작성한 모든 포스트 삭제<br/>
                            • 댓글 및 좋아요 기록 삭제<br/>
                            • 팔로워/팔로잉 관계 삭제<br/>
                            • 이 작업은 되돌릴 수 없습니다
                        </Text>
                    </Alert>

                    <Button
                        color="red"
                        variant="outline"
                        leftSection={<IconTrash size={16} />}
                        onClick={handleDeleteClick}
                        styles={buttonStyles}
                        style={{ alignSelf: 'flex-start' }}
                        aria-label="계정 삭제"
                    >
                        회원탈퇴
                    </Button>
                </Stack>
            </Card>

            <Modal
                opened={showConfirmModal}
                onClose={handleModalClose}
                title="계정 삭제 확인"
                centered
                closeOnClickOutside={!isDeleting}
                closeOnEscape={!isDeleting}
                styles={modalStyles}
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <Stack gap="md">
                    <Alert
                        icon={<IconAlertTriangle size={16} />}
                        styles={alertStyles}
                    >
                        <Text c={velogColors.text}>
                            정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </Text>
                    </Alert>

                    <Text size="sm" c={velogColors.text}>
                        계속하려면 아래에 <strong>DELETE</strong>를 입력하세요:
                    </Text>

                    <TextInput
                        value={confirmText}
                        onChange={handleConfirmTextChange}
                        placeholder="DELETE"
                        disabled={isDeleting}
                        styles={{
                            input: {
                                backgroundColor: velogColors.background,
                                borderColor: velogColors.border,
                                color: velogColors.text,
                                '&:focus': {
                                    borderColor: velogColors.primary,
                                }
                            }
                        }}
                    />

                    <Group justify="flex-end" gap="xs">
                        <Button
                            variant="subtle"
                            onClick={handleModalClose}
                            disabled={isDeleting}
                            styles={{
                                root: {
                                    color: velogColors.text,
                                    '&:hover': {
                                        backgroundColor: velogColors.hover,
                                    }
                                }
                            }}
                        >
                            취소
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={confirmText !== 'DELETE'}
                            loading={isDeleting}
                            styles={{
                                root: {
                                    backgroundColor: velogColors.error,
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#e03131',
                                    }
                                }
                            }}
                        >
                            삭제하기
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
});

DangerZone.displayName = 'DangerZone';

// Main Profile Settings Page Component
const UserProfilePage = () => {
    const { velogColors } = useTheme();
    const { openUnsavedChangesModal } = useConfirmModals();
    const navigate = useNavigate();

    // Initial user data (would come from API)
    const initialUserData = useMemo(() => ({
        id: 1,
        nickname: '개발자 김벨로그',
        email: 'velogger@example.com',
        bio: '프론트엔드 개발을 사랑하는 개발자입니다. React와 TypeScript를 주로 사용하며, 새로운 기술에 대한 학습을 즐깁니다.',
        profileImage: null,
        devStartDate: new Date('2020-03-15'),
    }), []);

    const [userInfo, setUserInfo] = useState(initialUserData);
    const [originalUserInfo] = useState(initialUserData);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Memoized styles
    const containerStyles = useMemo(() => ({
        backgroundColor: velogColors.background,
        minHeight: '100vh',
    }), [velogColors.background]);

    const headerStyles = useMemo(() => ({
        backgroundColor: velogColors.section,
        borderColor: velogColors.border,
    }), [velogColors]);

    const backButtonStyles = useMemo(() => ({
        root: {
            color: velogColors.text,
            '&:hover': {
                backgroundColor: velogColors.hover
            }
        }
    }), [velogColors]);

    // Check if there are changes
    const hasChanges = useMemo(() => {
        return JSON.stringify(userInfo) !== JSON.stringify(originalUserInfo);
    }, [userInfo, originalUserInfo]);

    // Validation
    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!userInfo.nickname?.trim()) {
            newErrors.nickname = '닉네임을 입력해주세요';
        } else if (userInfo.nickname.length < 2) {
            newErrors.nickname = '닉네임은 2자 이상이어야 합니다';
        } else if (userInfo.nickname.length > 20) {
            newErrors.nickname = '닉네임은 20자 이하여야 합니다';
        }

        if (userInfo.bio && userInfo.bio.length > 500) {
            newErrors.bio = '자기소개는 500자 이하여야 합니다';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [userInfo]);

    // Handlers
    const handleUserInfoChange = useCallback((newUserInfo) => {
        setUserInfo(newUserInfo);
        // Clear related errors when user types
        if (errors.nickname && newUserInfo.nickname !== userInfo.nickname) {
            setErrors(prev => ({ ...prev, nickname: undefined }));
        }
        if (errors.bio && newUserInfo.bio !== userInfo.bio) {
            setErrors(prev => ({ ...prev, bio: undefined }));
        }
    }, [userInfo, errors]);

    const handleImageChange = useCallback((file, preview) => {
        setUserInfo(prev => ({ ...prev, profileImage: preview, profileImageFile: file }));
    }, []);

    const handleImageRemove = useCallback(() => {
        setUserInfo(prev => ({ ...prev, profileImage: null, profileImageFile: null }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Saving user info:', userInfo);
            showToast.success('프로필 수정 성공', '프로필이 성공적으로 업데이트되었습니다!');

        } catch (error) {
            console.error('Save error:', error);
            showToast.error('오류 발생', '저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    }, [userInfo, validateForm]);

    const handleCancel = useCallback(() => {
        if (hasChanges) {
            openUnsavedChangesModal(() => {
                setUserInfo(originalUserInfo);
                setErrors({});
            }, 'cancel');
        } else {
            setUserInfo(originalUserInfo);
            setErrors({});
        }
    }, [hasChanges, originalUserInfo, openUnsavedChangesModal]);

    const handleDeleteAccount = useCallback(async () => {
        console.log('Deleting account...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        showToast.success('삭제 완료', '계정이 삭제되었습니다.');
    }, []);

    const handleGoBack = useCallback(() => {
        if (hasChanges) {
            openUnsavedChangesModal(() => {
            }, 'goback');
        } else {
            // return <Navigate replace to='/' />
            navigate(-1)
        }
    }, [hasChanges, openUnsavedChangesModal, navigate]);

    return (
        <div style={containerStyles}>
            <Container size="md" py="xl">
                <Stack gap="xl">
                    {/* Header */}
                    <Paper p="md" radius="md" withBorder style={headerStyles}>
                        <Group justify="space-between" align="center">
                            <Group gap="md">
                                <ActionIcon
                                    variant="subtle"
                                    onClick={handleGoBack}
                                    disabled={isSaving}
                                    styles={backButtonStyles}
                                    aria-label="뒤로가기"
                                >
                                    <IconArrowLeft size={18} />
                                </ActionIcon>
                                <Box>
                                    <Title order={2} c={velogColors.text}>
                                        프로필 설정
                                    </Title>
                                    <Text size="sm" c={velogColors.subText}>
                                        프로필 정보를 수정할 수 있습니다
                                    </Text>
                                </Box>
                            </Group>

                            {hasChanges && (
                                <Badge
                                    styles={{
                                        root: {
                                            backgroundColor: `${velogColors.warning}20`,
                                            color: velogColors.warning,
                                            border: `1px solid ${velogColors.warning}40`
                                        }
                                    }}
                                >
                                    변경사항 있음
                                </Badge>
                            )}
                        </Group>
                    </Paper>

                    {/* Bento Grid Layout */}
                    <Grid gutter="md">
                        {/* Profile Image - Left Column */}
                        <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
                            <ProfileImageUpload
                                currentImage={userInfo.profileImage}
                                onImageChange={handleImageChange}
                                onImageRemove={handleImageRemove}
                            />
                        </Grid.Col>

                        {/* User Info Form - Right Column */}
                        <Grid.Col span={{ base: 12, sm: 12, md: 8 }}>
                            <UserInfoForm
                                userInfo={userInfo}
                                onChange={handleUserInfoChange}
                                errors={errors}
                            />
                        </Grid.Col>

                        {/* Action Buttons - Full Width */}
                        <Grid.Col span={12}>
                            <ActionButtons
                                onSave={handleSave}
                                onCancel={handleCancel}
                                isSaving={isSaving}
                                hasChanges={hasChanges}
                            />
                        </Grid.Col>

                        {/* Danger Zone - Full Width */}
                        <Grid.Col span={12}>
                            <DangerZone onDeleteAccount={handleDeleteAccount} />
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>
        </div>
    );
};

export default UserProfilePage;