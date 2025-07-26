import {memo, useCallback, useMemo} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {Button, Group, Modal, Stack, Text} from "@mantine/core";

const DeleteModal = memo(({
                              opened,
                              onClose,
                              onConfirm,
                              isLoading = false
                          }) => {
    const { velogColors } = useTheme();

    const modalStyles = useMemo(() => ({
        content: {
            backgroundColor: velogColors.background,
        },
        header: {
            backgroundColor: velogColors.background,
            borderBottom: `1px solid ${velogColors.border}`,
        }
    }), [velogColors]);

    const textStyles = useMemo(() => ({
        title: {
            color: velogColors.text,
            fontWeight: 600,
            fontSize: '1.125rem'
        },
        description: {
            color: velogColors.text
        },
        warning: {
            color: velogColors.subText
        }
    }), [velogColors]);

    const buttonStyles = useMemo(() => ({
        cancel: {
            borderColor: velogColors.border,
            color: velogColors.subText
        }
    }), [velogColors]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const handleConfirm = useCallback(() => {
        if (onConfirm) {
            onConfirm();
        }
    }, [onConfirm]);

    const modalTitle = useMemo(() => (
        <Text style={textStyles.title}>
            포스트 삭제
        </Text>
    ), [textStyles.title]);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={modalTitle}
            centered
            styles={modalStyles}
        >
            <Stack gap="lg">
                <Text style={textStyles.description}>
                    정말로 이 포스트를 삭제하시겠습니까?
                </Text>
                <Text size="sm" style={textStyles.warning}>
                    삭제된 포스트는 복구할 수 없습니다.
                </Text>

                <Group justify="flex-end" gap="md">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        color="gray"
                        style={buttonStyles.cancel}
                        aria-label="취소 버튼"
                    >
                        취소
                    </Button>
                    <Button
                        color="red"
                        onClick={handleConfirm}
                        loading={isLoading}
                        aria-label="삭제 버튼"
                    >
                        삭제
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
});

export default DeleteModal;