import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Card,
    Group,
    Text,
    Button,
    Avatar,
    ActionIcon,
    Stack,
    Box,
} from '@mantine/core';
import {
    IconCamera,
    IconTrash,
    IconUpload,
    IconUser,
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";
import {
    CONSTANTS,
    createAvatarStyles,
    createCardStyles,
    createRemoveButtonStyles,
    createUploadButtonStyles
} from "@/utils/useEditStyle.js";
import {useImageUpload} from "@/hooks/auth/useUserEdit.jsx";


// 프로필 이미지 업로드 컴포넌트 - 메모리 누수 방지 및 접근성 개선
const ProfileImageUpload = React.memo(({
                                           currentImage,
                                           onImageChange,
                                           onImageRemove,
                                           disabled = false
                                       }) => {
    const { themeColors } = useTheme();
    const { fileInputRef, handleFileSelect, cleanup } = useImageUpload();
    const [preview, setPreview] = useState(currentImage);
    const [isUploading, setIsUploading] = useState(false);

    // 스타일 메모이제이션
    const styles = useMemo(() => ({
        card: createCardStyles(themeColors),
        avatar: createAvatarStyles(themeColors),
        uploadButton: createUploadButtonStyles(themeColors),
        removeButton: createRemoveButtonStyles(themeColors)
    }), [themeColors]);

    // 현재 이미지가 변경될 때 미리보기 업데이트
    useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    // 파일 선택 핸들러 (메모리 누수 방지)
    const handleFileSelectWrapper = useCallback(async (file) => {
        if (!file || disabled) {
            return;
        }

        setIsUploading(true);
        try {
            const result = await handleFileSelect(file, onImageChange);
            if (result) {
                setPreview(result);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            showToast.error('업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    }, [handleFileSelect, onImageChange, disabled]);

    // 이미지 제거 핸들러
    const handleRemoveImage = useCallback(() => {
        if (disabled) {
            return;
        }

        setPreview(null);
        onImageRemove();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onImageRemove, disabled, fileInputRef]);

    // 업로드 클릭 핸들러
    const handleUploadClick = useCallback(() => {
        if (disabled || isUploading) {
            return
        }
        fileInputRef.current?.click();
    }, [disabled, isUploading, fileInputRef]);

    // 키보드 네비게이션 지원
    const handleKeyDown = useCallback((event, action) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }, []);

    // 파일 입력 변경 핸들러
    const handleFileInputChange = useCallback((event) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelectWrapper(file);
        }
    }, [handleFileSelectWrapper]);

    // 드래그 앤 드롭 지원
    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled || isUploading) {
            return;
        }

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFileSelectWrapper(files[0]);
        }
    }, [disabled, isUploading, handleFileSelectWrapper]);

    return (
        <Card
            p="lg"
            radius="md"
            withBorder
            style={styles.card}
            role="region"
            aria-labelledby="profile-image-title"
        >
            <Stack align="center" gap="md">
                <Text
                    id="profile-image-title"
                    fw={600}
                    size="sm"
                    c={themeColors.text}
                >
                    프로필 이미지
                </Text>

                <Box
                    pos="relative"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{
                        borderRadius: '50%',
                        transition: 'transform 0.2s ease',
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onClick={handleUploadClick}
                    onKeyDown={(e) => handleKeyDown(e, handleUploadClick)}
                    tabIndex={disabled ? -1 : 0}
                    role="button"
                    aria-label="프로필 이미지 업로드 또는 변경"
                    aria-describedby="image-upload-instructions"
                >
                    <Avatar
                        size={CONSTANTS.AVATAR_SIZE}
                        radius="50%"
                        src={preview}
                        style={styles.avatar}
                        alt={preview ? "현재 프로필 이미지" : "기본 프로필 이미지"}
                    >
                        <IconUser
                            size={48}
                            color={themeColors.subText}
                            aria-hidden="true"
                        />
                    </Avatar>

                    <ActionIcon
                        size="sm"
                        radius="50%"
                        variant="filled"
                        color="blue"
                        pos="absolute"
                        bottom={8}
                        right={8}
                        loading={isUploading}
                        disabled={disabled}
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            pointerEvents: 'none' // 부모의 클릭 이벤트가 처리되도록
                        }}
                        aria-label="프로필 이미지 변경"
                    >
                        <IconCamera size={14} aria-hidden="true" />
                    </ActionIcon>
                </Box>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={CONSTANTS.ACCEPTED_IMAGE_TYPES}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                    aria-label="프로필 이미지 파일 선택"
                    disabled={disabled}
                />

                <Group gap="xs">
                    <Button
                        variant="light"
                        size="xs"
                        leftSection={<IconUpload size={14} aria-hidden="true" />}
                        onClick={handleUploadClick}
                        disabled={disabled || isUploading}
                        loading={isUploading}
                        styles={styles.uploadButton}
                        aria-describedby="image-upload-instructions"
                    >
                        {isUploading ? '업로드 중...' : '업로드'}
                    </Button>

                    {preview && (
                        <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconTrash size={14} aria-hidden="true" />}
                            onClick={handleRemoveImage}
                            disabled={disabled}
                            styles={styles.removeButton}
                            aria-label="프로필 이미지 제거"
                        >
                            제거
                        </Button>
                    )}
                </Group>

                <Text
                    id="image-upload-instructions"
                    size="xs"
                    c={themeColors.subText}
                    ta="center"
                    role="note"
                >
                    JPG, PNG 파일 (최대 {CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB)
                    <br />
                    드래그 앤 드롭으로도 업로드 가능
                </Text>

                {/* 화면 리더를 위한 상태 안내 */}
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                    style={{
                        position: 'absolute',
                        left: '-10000px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden'
                    }}
                >
                    {isUploading && '이미지를 업로드하는 중입니다...'}
                    {preview && !isUploading && '프로필 이미지가 설정되었습니다.'}
                    {!preview && !isUploading && '프로필 이미지가 설정되지 않았습니다.'}
                </div>
            </Stack>
        </Card>
    );
});

ProfileImageUpload.displayName = 'ProfileImageUpload';

export default ProfileImageUpload;