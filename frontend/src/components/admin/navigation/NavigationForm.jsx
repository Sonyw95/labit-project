import {memo, useCallback, useEffect, useMemo} from "react";
import {useTheme} from "@/contexts/ThemeContext.jsx";
import {useForm} from "@mantine/form";
import {Button, Group, Modal, Select, Stack, Switch, Textarea, TextInput, Text} from "@mantine/core";

const AdminNavigationForm = memo(({
                                 opened,
                                 onClose,
                                 onSubmit,
                                 editingItem,
                                 parentOptions,
                                 isLoading = false
                             }) => {
    const { velogColors } = useTheme();

    const form = useForm({
        initialValues: {
            label: '',
            href: '',
            icon: '',
            description: '',
            parentId: null,
            isActive: true,
        },
        validate: {
            label: (value) => (!value ? '메뉴 이름을 입력하세요' : null),
        },
    });

    const modalStyles = useMemo(() => ({
        content: {
            backgroundColor: velogColors.background,
        },
        header: {
            backgroundColor: velogColors.background,
            borderBottom: `1px solid ${velogColors.border}`,
        }
    }), [velogColors]);

    const inputStyles = useMemo(() => ({
        label: {
            color: velogColors.text,
            fontWeight: 500
        },
        input: {
            backgroundColor: velogColors.background,
            borderColor: velogColors.border,
            color: velogColors.text,
            '&:focus': {
                borderColor: velogColors.primary,
            }
        }
    }), [velogColors]);

    const switchStyles = useMemo(() => ({
        label: {
            color: velogColors.text,
            fontWeight: 500
        },
        description: {
            color: velogColors.subText
        },
        track: {
            backgroundColor: form.values.isActive
                ? velogColors.primary
                : velogColors.border,
        }
    }), [velogColors, form.values.isActive]);

    const buttonStyles = useMemo(() => ({
        cancel: {
            color: velogColors.subText,
            backgroundColor: 'transparent',
        },
        submit: {
            backgroundColor: velogColors.primary,
            border: 'none',
        }
    }), [velogColors]);

    useEffect(() => {
        if (editingItem) {
            form.setValues({
                label: editingItem.label || '',
                href: editingItem.href || '',
                icon: editingItem.icon || '',
                description: editingItem.description || '',
                parentId: editingItem.parentId ? editingItem.parentId.toString() : '',
                isActive: editingItem.isActive ?? true,
            });
        } else {
            form.reset();
        }
    }, [editingItem]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const handleSubmit = useCallback((values) => {
        const data = {
            ...values,
            parentId: values.parentId ? parseInt(values.parentId, 10) : null,
        };

        if (onSubmit) {
            onSubmit(data);
        }
    }, [onSubmit]);

    const handleFormSubmit = useCallback(() => {
        form.onSubmit(handleSubmit)();
    }, [form, handleSubmit]);

    const handleCancelButtonHover = useCallback((e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.backgroundColor = velogColors.hover;
            e.currentTarget.style.color = velogColors.text;
        } else {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = velogColors.subText;
        }
    }, [velogColors]);

    const handleSubmitButtonHover = useCallback((e, isEntering) => {
        if (!isLoading) {
            e.currentTarget.style.backgroundColor = isEntering
                ? '#0CA678'
                : velogColors.primary;
        }
    }, [isLoading, velogColors.primary]);

    const modalTitle = useMemo(() => (
        <Text
            fw={600}
            size="lg"
            style={{ color: velogColors.text }}
        >
            {editingItem ? '메뉴 수정' : '새 메뉴 추가'}
        </Text>
    ), [editingItem, velogColors.text]);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={modalTitle}
            size="md"
            radius="md"
            styles={modalStyles}
            closeOnClickOutside={!isLoading}
            closeOnEscape={!isLoading}
            aria-labelledby="navigation-form-title"
        >
            <Stack gap="lg" role="form" aria-label="네비게이션 메뉴 폼">
                <TextInput
                    label="메뉴 이름"
                    placeholder="메뉴 이름을 입력하세요"
                    required
                    {...form.getInputProps('label')}
                    styles={inputStyles}
                    aria-describedby="label-error"
                    disabled={isLoading}
                />

                <TextInput
                    label="링크 URL"
                    placeholder="/path/to/page"
                    {...form.getInputProps('href')}
                    styles={inputStyles}
                    disabled={isLoading}
                    aria-describedby="href-help"
                />

                <Select
                    label="부모 메뉴"
                    placeholder="부모 메뉴를 선택하세요"
                    data={parentOptions}
                    clearable
                    {...form.getInputProps('parentId')}
                    styles={inputStyles}
                    disabled={isLoading}
                    aria-describedby="parent-help"
                />

                <TextInput
                    label="아이콘"
                    placeholder="아이콘 클래스 또는 문자"
                    {...form.getInputProps('icon')}
                    styles={inputStyles}
                    disabled={isLoading}
                    aria-describedby="icon-help"
                />

                <Textarea
                    label="설명"
                    placeholder="메뉴에 대한 설명을 입력하세요"
                    rows={3}
                    {...form.getInputProps('description')}
                    styles={inputStyles}
                    disabled={isLoading}
                />

                <Switch
                    label="활성화"
                    description="메뉴를 사용자에게 표시할지 설정합니다"
                    {...form.getInputProps('isActive', { type: 'checkbox' })}
                    styles={switchStyles}
                    disabled={isLoading}
                />

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={handleClose}
                        style={buttonStyles.cancel}
                        onMouseEnter={(e) => handleCancelButtonHover(e, true)}
                        onMouseLeave={(e) => handleCancelButtonHover(e, false)}
                        disabled={isLoading}
                        aria-label="취소"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleFormSubmit}
                        loading={isLoading}
                        style={buttonStyles.submit}
                        onMouseEnter={(e) => handleSubmitButtonHover(e, true)}
                        onMouseLeave={(e) => handleSubmitButtonHover(e, false)}
                        aria-label={editingItem ? '메뉴 수정' : '메뉴 추가'}
                    >
                        {editingItem ? '수정' : '추가'}
                    </Button>
                </Group>
            </Stack>

            <div style={{ position: 'absolute', left: '-9999px' }}>
                <div id="href-help">
                    선택사항입니다. 페이지 경로를 입력하면 클릭 시 해당 페이지로 이동합니다.
                </div>
                <div id="parent-help">
                    현재 메뉴의 상위 메뉴를 선택합니다. 선택하지 않으면 최상위 메뉴가 됩니다.
                </div>
                <div id="icon-help">
                    메뉴 옆에 표시될 아이콘을 설정합니다.
                </div>
            </div>
        </Modal>
    );
});

AdminNavigationForm.displayName = 'AdminNavigationForm';

export default AdminNavigationForm;