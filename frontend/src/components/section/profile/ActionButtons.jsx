import React, { useMemo, useCallback } from 'react';
import {
    Card,
    Group,
    Button, Box,
} from '@mantine/core';
import {
    IconCheck,
    IconX,
} from '@tabler/icons-react';
import { useTheme } from "@/contexts/ThemeContext.jsx";
import {createCancelButtonStyles, createCardStyles, createSaveButtonStyles} from "@/utils/useEditStyle.js";

// 액션 버튼 컴포넌트 - 저장/취소 기능
const ActionButtons = React.memo(({
                                      onSave,
                                      onCancel,
                                      isSaving = false,
                                      hasChanges = false,
                                      disabled = false,
                                      saveLabel = '저장하기',
                                      cancelLabel = '취소'
                                  }) => {
    const { themeColors } = useTheme();

    // 스타일 메모이제이션
    const styles = useMemo(() => ({
        card: createCardStyles(themeColors),
        saveButton: createSaveButtonStyles(themeColors, hasChanges),
        cancelButton: createCancelButtonStyles(themeColors)
    }), [themeColors, hasChanges]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((event, action) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    }, []);

    // 저장 버튼 핸들러
    const handleSave = useCallback((event) => {
        if (disabled || isSaving || !hasChanges) {
            return;
        }
        onSave(event);
    }, [disabled, isSaving, hasChanges, onSave]);

    // 취소 버튼 핸들러
    const handleCancel = useCallback((event) => {
        if (disabled || isSaving) {
            return;
        }
        onCancel(event);
    }, [disabled, isSaving, onCancel]);

    // 저장 버튼 상태에 따른 메시지
    const getSaveButtonMessage = () => {
        if (isSaving) {
            return '저장 중...';
        }
        if (!hasChanges) {
            return '저장할 변경사항이 없습니다';
        }
        return '변경사항을 저장합니다';
    };

    return (
        <Card
            p="lg"
            radius="md"
            withBorder
            style={styles.card}
            role="region"
            aria-labelledby="action-buttons-title"
        >
            {/* 스크린 리더를 위한 숨겨진 제목 */}
            <h3
                id="action-buttons-title"
                className="sr-only"
            >
                폼 작업 버튼
            </h3>

            <Group justify="space-between" align="center">
                <Button
                    variant="subtle"
                    leftSection={<IconX size={16} aria-hidden="true" />}
                    onClick={handleCancel}
                    onKeyDown={(e) => handleKeyDown(e, handleCancel)}
                    disabled={disabled || isSaving}
                    styles={styles.cancelButton}
                    aria-label={`${cancelLabel} - 모든 변경사항이 취소됩니다`}
                    aria-describedby="cancel-button-help"
                    size="md"
                >
                    {cancelLabel}
                </Button>

                <Button
                    leftSection={<IconCheck size={16} aria-hidden="true" />}
                    onClick={handleSave}
                    onKeyDown={(e) => handleKeyDown(e, handleSave)}
                    loading={isSaving}
                    disabled={disabled || !hasChanges}
                    styles={styles.saveButton}
                    aria-label={getSaveButtonMessage()}
                    aria-describedby="save-button-help"
                    size="md"
                    type="submit"
                >
                    {isSaving ? '저장 중...' : saveLabel}
                </Button>
            </Group>

            {/* 접근성을 위한 숨겨진 도움말 */}
            <Box className="sr-only">
                <Box id="cancel-button-help">
                    취소 버튼을 클릭하면 모든 변경사항이 취소되고 원래 상태로 돌아갑니다.
                </Box>
                <Box id="save-button-help">
                    {hasChanges
                        ? '저장 버튼을 클릭하면 변경된 내용이 저장됩니다.'
                        : '변경된 내용이 없어 저장할 수 없습니다.'
                    }
                </Box>
            </Box>

            {/* 저장 상태를 위한 라이브 영역 */}
            <Box
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                role="status"
            >
                {isSaving && '변경사항을 저장하는 중입니다...'}
            </Box>

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
        </Card>
    );
});

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;