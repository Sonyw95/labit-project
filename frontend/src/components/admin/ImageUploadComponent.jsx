
import { memo, useCallback, useState } from 'react';
import {FileInput, Avatar, Group, Text, Stack, Box} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPhoto, IconUser, IconCheck, IconX } from '@tabler/icons-react';
import {useTheme} from "../../contexts/ThemeContext.jsx";
import {fileService} from "../../api/fileService.js";

const ImageUploadComponent = memo(({
                                       currentImage,
                                       onImageUpload,
                                       loading = false,
                                       size = "xl"
                                   }) => {
    const [previewImage, setPreviewImage] = useState(currentImage);
    const [uploading, setUploading] = useState(false);
    const{ themeColors } = useTheme();

    const handleFileSelect = useCallback(async (file) => {
        if (!file) {
            return;
        }

        // 클라이언트 검증
        if (file.size > 5 * 1024 * 1024) {
            notifications.show({
                title: '파일 크기 초과',
                message: '이미지 파일 크기는 5MB 이하여야 합니다.',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        if (!file.type.startsWith('image/')) {
            notifications.show({
                title: '잘못된 파일 형식',
                message: '이미지 파일만 업로드 가능합니다.',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        // 미리보기 설정
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);

        // 서버 업로드
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            const imageUrl = await fileService.uploadProfileImage(formData);

            notifications.show({
                title: '업로드 완료',
                message: '이미지가 성공적으로 업로드되었습니다.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            // 부모 컴포넌트에 알림
            if (onImageUpload) {
                onImageUpload(imageUrl);
            }

        } catch (error) {
            console.error('이미지 업로드 실패:', error);

            notifications.show({
                title: '업로드 실패',
                message: error.message || '이미지 업로드에 실패했습니다.',
                color: 'red',
                icon: <IconX size={16} />,
            });

            // 미리보기 원복
            setPreviewImage(currentImage);

        } finally {
            setUploading(false);
        }
    }, [currentImage, onImageUpload]);

    return (
        <Box p="md" radius="md">
            <Text size="sm" fw={600} mb="md" c={themeColors.text}>
                프로필 이미지
            </Text>
            <Group align="center" gap="md">
                <Avatar
                    src={previewImage}
                    size="xl"
                    radius="md"
                    style={{
                        border: `2px solid ${themeColors.border}`,
                    }}
                >
                    <IconUser size={40} />
                </Avatar>
                <Stack gap="xs" flex={1}>
                    <FileInput
                        placeholder="이미지 파일 선택"
                        accept="image/*"
                        leftSection={<IconPhoto size={16} />}
                        onChange={handleFileSelect}
                        disabled={uploading || loading}
                    />
                    <Text size="xs" c="dimmed">
                        JPG, PNG, GIF 파일만 가능 (최대 5MB)
                    </Text>
                </Stack>
            </Group>
        </Box>
    );
});

export default ImageUploadComponent;