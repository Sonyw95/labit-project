import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Card,
    Group,
    Text,
    TextInput,
    Button,
    Stack,
    Alert,
    Modal,
} from '@mantine/core';
import {
    IconAlertTriangle,
    IconTrash,
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import {
    CONSTANTS,
    createAlertStyles,
    createDangerButtonStyles,
    createDangerCardStyles,
    createModalStyles
} from "@/utils/useEditStyle.js";

// 삭제 확인 모달 컴포넌트
const DeleteConfirmModal = React.memo(({
                                           isOpen,
                                           onClose,
                                           onConfirm,
                                           isDeleting,
                                           styles
                                       }) => {
    const { themeColors } = useTheme();
    const [confirmText, setConfirmText] = useState('');

    // 모달이 열릴 때마다 텍스트 초기화
    useEffect(() => {
        if (isOpen) {
            setConfirmText('');
        }
    }, [isOpen]);

    // 텍스트 입력 핸들러
    const handleConfirmTextChange = useCallback((event) => {
        setConfirmText(event.target.value);
    }, []);

    // 삭제 확인 핸들러
    const handleConfirmDelete = useCallback(async () => {
        if (confirmText !== CONSTANTS.DELETE_CONFIRMATION_TEXT) {
            return;
        }
        await onConfirm();
    }, [confirmText, onConfirm]);

    // 모달 닫기 핸들러
    const handleModalClose = useCallback(() => {
        if (!isDeleting) {
            onClose();
        }
    }, [isDeleting, onClose]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && confirmText === CONSTANTS.DELETE_CONFIRMATION_TEXT) {
            handleConfirmDelete();
        } else if (event.key === 'Escape' && !isDeleting) {
            handleModalClose();
        }
    }, [confirmText, handleConfirmDelete, handleModalClose, isDeleting]);

    const isConfirmValid = confirmText === CONSTANTS.DELETE_CONFIRMATION_TEXT;

    return (
        <Modal
            opened={isOpen}
            onClose={handleModalClose}
            title="계정 삭제 확인"
            centered
            closeOnClickOutside={!isDeleting}
            closeOnEscape={!isDeleting}
            styles={styles.modal}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            trapFocus
            lockScroll
        >
            <Stack gap="md" role="dialog" aria-modal="true">
                <Alert
                    icon={<IconAlertTriangle size={16} aria-hidden="true" />}
                    styles={styles.alert}
                    role="alert"
                    aria-live="assertive"
                >
                    <Text c={themeColors.text} id="delete-modal-description">
                        정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </Text>
                </Alert>

                <Text size="sm" c={themeColors.text}>
                    계속하려면 아래에 <strong>{CONSTANTS.DELETE_CONFIRMATION_TEXT}</strong>를 입력하세요:
                </Text>

                <TextInput
                    value={confirmText}
                    onChange={handleConfirmTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder={CONSTANTS.DELETE_CONFIRMATION_TEXT}
                    disabled={isDeleting}
                    autoFocus
                    aria-label={`삭제 확인을 위해 ${CONSTANTS.DELETE_CONFIRMATION_TEXT}를 입력하세요`}
                    aria-describedby="delete-input-help"
                    aria-invalid={confirmText.length > 0 && !isConfirmValid}
                    styles={{
                        input: {
                            backgroundColor: themeColors.background,
                            borderColor: confirmText.length > 0 && !isConfirmValid
                                ? themeColors.error
                                : themeColors.border,
                            color: themeColors.text,
                            '&:focus': {
                                borderColor: themeColors.primary,
                            }
                        }
                    }}
                />

                <Group justify="flex-end" gap="xs">
                    <Button
                        variant="subtle"
                        onClick={handleModalClose}
                        disabled={isDeleting}
                        aria-label="계정 삭제 취소"
                        styles={{
                            root: {
                                color: themeColors.text,
                                '&:hover': {
                                    backgroundColor: themeColors.hover,
                                }
                            }
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        disabled={!isConfirmValid}
                        loading={isDeleting}
                        aria-label={isConfirmValid ? "계정 삭제 실행" : "삭제 확인 텍스트를 정확히 입력해주세요"}
                        aria-describedby="delete-button-help"
                        styles={{
                            root: {
                                backgroundColor: themeColors.error,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#e03131',
                                },
                                '&:disabled': {
                                    backgroundColor: themeColors.hover,
                                    color: themeColors.subText,
                                }
                            }
                        }}
                    >
                        {isDeleting ? '삭제 중...' : '삭제하기'}
                    </Button>
                </Group>

                {/* 접근성을 위한 숨겨진 도움말 */}
                <div className="sr-only">
                    <div id="delete-input-help">
                        {confirmText.length === 0
                            ? `삭제를 확인하려면 ${CONSTANTS.DELETE_CONFIRMATION_TEXT}를 정확히 입력해주세요.`
                            : isConfirmValid
                                ? '올바르게 입력되었습니다. 삭제 버튼을 클릭하여 계정을 삭제할 수 있습니다.'
                                : `${CONSTANTS.DELETE_CONFIRMATION_TEXT}를 정확히 입력해주세요.`
                        }
                    </div>
                    <div id="delete-button-help">
                        {isConfirmValid
                            ? '이 버튼을 클릭하면 계정이 영구적으로 삭제됩니다.'
                            : '삭제 확인 텍스트를 올바르게 입력해야 삭제할 수 있습니다.'
                        }
                    </div>
                </div>

                {/* 삭제 상태를 위한 라이브 영역 */}
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                    role="status"
                >
                    {isDeleting && '계정을 삭제하는 중입니다...'}
                </div>
            </Stack>
        </Modal>
    );
});

// 메인 위험 영역 컴포넌트
const DangerZone = React.memo(({
                                   onDeleteAccount,
                                   disabled = false
                               }) => {
    const { themeColors } = useTheme();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 스타일 메모이제이션
    const styles = useMemo(() => ({
        card: createDangerCardStyles(themeColors),
        alert: createAlertStyles(themeColors),
        button: createDangerButtonStyles(themeColors),
        modal: createModalStyles(themeColors)
    }), [themeColors]);

    // 삭제 버튼 클릭 핸들러
    const handleDeleteClick = useCallback(() => {
        if (disabled) {
            return;
        }
        setShowConfirmModal(true);
    }, [disabled]);

    // 삭제 확인 핸들러
    const handleConfirmDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            await onDeleteAccount();
        } catch (error) {
            console.error('Delete account error:', error);
        } finally {
            setIsDeleting(false);
            setShowConfirmModal(false);
        }
    }, [onDeleteAccount]);

    // 모달 닫기 핸들러
    const handleModalClose = useCallback(() => {
        if (!isDeleting) {
            setShowConfirmModal(false);
        }
    }, [isDeleting]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((event, action) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }, []);

    return (
        <>
            <Card
                p="lg"
                radius="md"
                withBorder
                style={styles.card}
                role="region"
                aria-labelledby="danger-zone-title"
                aria-describedby="danger-zone-description"
            >
                <Stack gap="md">
                    <Group gap="xs">
                        <IconAlertTriangle
                            size={16}
                            color={themeColors.error}
                            aria-hidden="true"
                        />
                        <Text
                            id="danger-zone-title"
                            fw={600}
                            size="sm"
                            c={themeColors.error}
                        >
                            위험 영역
                        </Text>
                    </Group>

                    <Alert
                        icon={<IconAlertTriangle size={16} aria-hidden="true" />}
                        styles={styles.alert}
                        role="alert"
                    >
                        <Text
                            id="danger-zone-description"
                            size="sm"
                            mb="xs"
                            c={themeColors.text}
                        >
                            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                        </Text>
                        <Text
                            size="xs"
                            c={themeColors.subText}
                            component="div"
                        >
                            <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                <li>작성한 모든 포스트 삭제</li>
                                <li>댓글 및 좋아요 기록 삭제</li>
                                <li>팔로워/팔로잉 관계 삭제</li>
                                <li>이 작업은 되돌릴 수 없습니다</li>
                            </ul>
                        </Text>
                    </Alert>

                    <Button
                        color="red"
                        variant="outline"
                        leftSection={<IconTrash size={16} aria-hidden="true" />}
                        onClick={handleDeleteClick}
                        onKeyDown={(e) => handleKeyDown(e, handleDeleteClick)}
                        disabled={disabled}
                        styles={styles.button}
                        style={{ alignSelf: 'flex-start' }}
                        aria-label="계정 삭제 - 모든 데이터가 영구적으로 삭제됩니다"
                        aria-describedby="delete-warning"
                    >
                        회원탈퇴
                    </Button>

                    {/* 접근성을 위한 숨겨진 경고 */}
                    <div id="delete-warning" className="sr-only">
                        경고: 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                    </div>
                </Stack>
            </Card>

            <DeleteConfirmModal
                isOpen={showConfirmModal}
                onClose={handleModalClose}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                styles={styles}
            />

            {/* 스타일 - 접근성 개선 */}
            <style jsx>{`
                .sr-only {
                    position: absolute !important;
                    width: 1px !important;
                    height: 1px !important;
                    padding: 0 !important;
                    margin: -1px !important;
                    overflow: hidden !important;
                    clip: rect(0, 0, 0, 0) !important;
                    white-space: nowrap !important;
                    border: 0 !important;
                }
            `}</style>
        </>
    );
});

DeleteConfirmModal.displayName = 'DeleteConfirmModal';
DangerZone.displayName = 'DangerZone';

export default DangerZone;