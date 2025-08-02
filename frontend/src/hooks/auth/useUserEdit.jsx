import { useState, useCallback, useMemo, useRef } from 'react';
import { modals } from '@mantine/modals';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";
import { useNavigate } from "react-router-dom";

// 모달 설정 최적화
const createModalConfig = (themeColors) => ({
    centered: true,
    overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
    },
    styles: {
        header: {
            backgroundColor: themeColors.section,
            color: themeColors.text,
        },
        body: {
            backgroundColor: themeColors.section,
            color: themeColors.text,
        },
        title: {
            color: themeColors.text,
            fontWeight: 600,
        },
        close: {
            color: themeColors.text,
            '&:hover': {
                backgroundColor: themeColors.hover,
            }
        }
    },
});

// 확인 모달 커스텀 훅
export const useConfirmModals = () => {
    const { themeColors } = useTheme();

    const modalConfig = useMemo(() => createModalConfig(themeColors), [themeColors]);

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
                color: themeColors.text,
                backgroundColor: 'transparent',
                border: `1px solid ${themeColors.border}`,
                fontWeight: 500,
                '&:hover': {
                    backgroundColor: themeColors.hover,
                }
            }
        }
    }), [themeColors]);

    const openUnsavedChangesModal = useCallback((onConfirm, type = 'cancel') => {
        const isGoBack = type === 'goback';

        modals.openConfirmModal({
            ...modalConfig,
            title: isGoBack ? '페이지 나가기' : '변경사항 취소',
            children: (
                <div>
                    <p style={{ color: themeColors.text, margin: 0, fontSize: '14px' }}>
                        {isGoBack ? '뒤로가시겠습니까?' : '변경사항이 있습니다. 정말 취소하시겠습니까?'}
                    </p>
                    <p style={{ color: themeColors.subText, margin: '8px 0 0 0', fontSize: '12px' }}>
                        작성중인 내용은 저장되지 않습니다.
                    </p>
                </div>
            ),
            labels: {
                confirm: isGoBack ? '뒤로가기' : '취소',
                cancel: '닫기'
            },
            confirmProps: {
                ...confirmProps,
                color: isGoBack ? 'blue' : 'red',
                styles: {
                    ...confirmProps.styles,
                    root: {
                        ...confirmProps.styles.root,
                        backgroundColor: isGoBack ? themeColors.primary : themeColors.error,
                    }
                }
            },
            cancelProps,
            onConfirm,
        });
    }, [modalConfig, confirmProps, cancelProps, themeColors]);

    const openDeleteAccountModal = useCallback((onConfirm) => {
        modals.openConfirmModal({
            ...modalConfig,
            title: '계정 삭제 확인',
            children: (
                <div>
                    <div style={{
                        backgroundColor: `${themeColors.error}15`,
                        border: `1px solid ${themeColors.error}40`,
                        color: themeColors.text,
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '16px'
                    }}>
                        정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </div>
                    <div style={{ color: themeColors.subText, fontSize: '14px' }}>
                        • 작성한 모든 포스트 삭제<br/>
                        • 댓글 및 좋아요 기록 삭제<br/>
                        • 팔로워/팔로잉 관계 삭제
                    </div>
                </div>
            ),
            labels: {
                confirm: '삭제하기',
                cancel: '취소'
            },
            confirmProps: {
                ...confirmProps,
                color: 'red',
                styles: {
                    ...confirmProps.styles,
                    root: {
                        ...confirmProps.styles.root,
                        backgroundColor: themeColors.error,
                    }
                }
            },
            cancelProps,
            onConfirm,
        });
    }, [modalConfig, confirmProps, cancelProps, themeColors]);

    return { openUnsavedChangesModal, openDeleteAccountModal };
};

// 이미지 업로드 커스텀 훅
export const useImageUpload = () => {
    const fileInputRef = useRef(null);
    const fileReaderRef = useRef(null);

    const handleFileSelect = useCallback(async (file, onImageChange) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast.error("업로드 불가", '이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast.info("", '파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        return new Promise((resolve, reject) => {
            // 이전 FileReader 정리
            if (fileReaderRef.current) {
                fileReaderRef.current.abort();
            }

            const reader = new FileReader();
            fileReaderRef.current = reader;

            reader.onload = () => {
                const result = reader.result;
                onImageChange(file, result);
                resolve(result);
            };

            reader.onerror = () => {
                console.error('Image upload error:', reader.error);
                reject(reader.error);
            };

            reader.readAsDataURL(file);
        });
    }, []);

    const cleanup = useCallback(() => {
        if (fileReaderRef.current) {
            fileReaderRef.current.abort();
            fileReaderRef.current = null;
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return { fileInputRef, handleFileSelect, cleanup };
};

// 사용자 편집 메인 훅
export const useUserEdit = (initialUserData) => {
    const { themeColors } = useTheme();
    const { openUnsavedChangesModal } = useConfirmModals();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(initialUserData);
    const [originalUserInfo] = useState(initialUserData);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // 변경사항 확인 (깊은 비교 최적화)
    const hasChanges = useMemo(() => {
        return JSON.stringify(userInfo) !== JSON.stringify(originalUserInfo);
    }, [userInfo, originalUserInfo]);

    // 폼 검증 (메모이제이션으로 최적화)
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
    }, [userInfo.nickname, userInfo.bio]);

    // 사용자 정보 변경 핸들러 (에러 클리어 최적화)
    const handleUserInfoChange = useCallback((newUserInfo) => {
        setUserInfo(prev => {
            // 변경된 필드의 에러만 클리어
            const updatedErrors = { ...errors };
            if (newUserInfo.nickname !== prev.nickname && updatedErrors.nickname) {
                delete updatedErrors.nickname;
                setErrors(updatedErrors);
            }
            if (newUserInfo.bio !== prev.bio && updatedErrors.bio) {
                delete updatedErrors.bio;
                setErrors(updatedErrors);
            }
            return newUserInfo;
        });
    }, [errors]);

    const handleImageChange = useCallback((file, preview) => {
        setUserInfo(prev => ({
            ...prev,
            profileImage: preview,
            profileImageFile: file
        }));
    }, []);

    const handleImageRemove = useCallback(() => {
        setUserInfo(prev => ({
            ...prev,
            profileImage: null,
            profileImageFile: null
        }));
    }, []);

    const handleSave = useCallback(async (value) => {
        if (!validateForm()) {
            return;
        }
        console.log(value);
        setIsSaving(true);
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
                navigate(-1);
            }, 'goback');
        } else {
            navigate(-1);
        }
    }, [hasChanges, openUnsavedChangesModal, navigate]);

    return {
        userInfo,
        errors,
        isSaving,
        hasChanges,
        themeColors,
        handleUserInfoChange,
        handleImageChange,
        handleImageRemove,
        handleSave,
        handleCancel,
        handleDeleteAccount,
        handleGoBack
    };
};