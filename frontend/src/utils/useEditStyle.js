// 스타일 생성 유틸리티 함수들 - 메모리 최적화 및 재사용성 향상

// 기본 카드 스타일
export const createCardStyles = (themeColors) => ({
    backgroundColor: themeColors.section,
    borderColor: themeColors.border,
});

// 입력 필드 스타일
export const createInputStyles = (themeColors) => ({
    input: {
        backgroundColor: themeColors.background,
        borderColor: themeColors.border,
        color: themeColors.text,
        '&:focus': {
            borderColor: themeColors.primary,
        },
        '&::placeholder': {
            color: themeColors.subText,
        }
    },
    label: {
        color: themeColors.text,
        fontWeight: 500,
    }
});

// 읽기 전용 입력 필드 스타일
export const createReadOnlyInputStyles = (themeColors) => ({
    input: {
        backgroundColor: themeColors.hover,
        borderColor: themeColors.border,
        color: themeColors.subText,
        cursor: 'not-allowed'
    },
    label: {
        color: themeColors.text
    }
});

// 컨테이너 스타일
export const createContainerStyles = (themeColors) => ({
    backgroundColor: themeColors.background,
    minHeight: '100vh',
});

// 헤더 스타일
export const createHeaderStyles = (themeColors) => ({
    backgroundColor: themeColors.section,
    borderColor: themeColors.border,
});

// 뒤로가기 버튼 스타일
export const createBackButtonStyles = (themeColors) => ({
    root: {
        color: themeColors.text,
        '&:hover': {
            backgroundColor: themeColors.hover
        }
    }
});

// 저장 버튼 스타일 (상태에 따라 동적)
export const createSaveButtonStyles = (themeColors, hasChanges) => ({
    root: {
        backgroundColor: hasChanges ? themeColors.primary : themeColors.hover,
        color: hasChanges ? 'white' : themeColors.subText,
        fontWeight: 600,
        '&:hover': {
            backgroundColor: hasChanges ? themeColors.primary : themeColors.hover,
            opacity: hasChanges ? 0.9 : 1,
        },
        '&:disabled': {
            backgroundColor: themeColors.hover,
            color: themeColors.subText,
        }
    }
});

// 취소 버튼 스타일
export const createCancelButtonStyles = (themeColors) => ({
    root: {
        color: themeColors.subText,
        '&:hover': {
            backgroundColor: themeColors.hover,
        }
    }
});

// 업로드 버튼 스타일
export const createUploadButtonStyles = (themeColors) => ({
    root: {
        backgroundColor: themeColors.primary,
        color: 'white',
        '&:hover': {
            backgroundColor: themeColors.primary,
            opacity: 0.9
        }
    }
});

// 제거 버튼 스타일
export const createRemoveButtonStyles = (themeColors) => ({
    root: {
        backgroundColor: themeColors.error,
        color: 'white',
        '&:hover': {
            backgroundColor: '#e03131'
        }
    }
});

// 아바타 스타일
export const createAvatarStyles = (themeColors) => ({
    border: `2px solid ${themeColors.border}`,
});

// 위험 영역 카드 스타일
export const createDangerCardStyles = (themeColors) => ({
    backgroundColor: themeColors.section,
    borderColor: themeColors.error,
});

// 경고 알림 스타일
export const createAlertStyles = (themeColors) => ({
    root: {
        backgroundColor: `${themeColors.error}15`,
        border: `1px solid ${themeColors.error}40`,
        color: themeColors.text,
    },
    message: {
        color: themeColors.text
    }
});

// 위험 영역 버튼 스타일
export const createDangerButtonStyles = (themeColors) => ({
    root: {
        borderColor: themeColors.error,
        color: themeColors.error,
        '&:hover': {
            backgroundColor: `${themeColors.error}10`,
        }
    }
});

// 모달 스타일
export const createModalStyles = (themeColors) => ({
    header: {
        backgroundColor: themeColors.section,
        borderBottom: `1px solid ${themeColors.border}`,
    },
    body: {
        backgroundColor: themeColors.section,
    },
    title: {
        color: themeColors.text,
    },
});

// 배지 스타일
export const createBadgeStyles = (themeColors, variant = 'default') => {
    const variants = {
        default: {
            backgroundColor: themeColors.hover,
            color: themeColors.subText
        },
        warning: {
            backgroundColor: `${themeColors.warning}20`,
            color: themeColors.warning,
            border: `1px solid ${themeColors.warning}40`
        }
    };

    return {
        root: variants[variant]
    };
};

// 아이콘 그룹 스타일
export const createIconGroupStyles = (themeColors) => ({
    color: themeColors.primary
});

// 텍스트 스타일
export const createTextStyles = (themeColors, variant = 'default') => {
    const variants = {
        default: { color: themeColors.text },
        subtitle: { color: themeColors.subText },
        title: { color: themeColors.text },
        error: { color: themeColors.error }
    };

    return variants[variant];
};

// 스타일 키 상수
export const STYLE_KEYS = {
    CARD: 'card',
    INPUT: 'input',
    READONLY_INPUT: 'readonlyInput',
    CONTAINER: 'container',
    HEADER: 'header',
    BACK_BUTTON: 'backButton',
    SAVE_BUTTON: 'saveButton',
    CANCEL_BUTTON: 'cancelButton',
    UPLOAD_BUTTON: 'uploadButton',
    REMOVE_BUTTON: 'removeButton',
    AVATAR: 'avatar',
    DANGER_CARD: 'dangerCard',
    ALERT: 'alert',
    DANGER_BUTTON: 'dangerButton',
    MODAL: 'modal',
    BADGE: 'badge',
    ICON_GROUP: 'iconGroup',
    TEXT: 'text'
};

// 스타일 팩토리 - 모든 스타일을 한 번에 생성 (메모이제이션 최적화)
export const createAllStyles = (themeColors, hasChanges = false) => ({
    [STYLE_KEYS.CARD]: createCardStyles(themeColors),
    [STYLE_KEYS.INPUT]: createInputStyles(themeColors),
    [STYLE_KEYS.READONLY_INPUT]: createReadOnlyInputStyles(themeColors),
    [STYLE_KEYS.CONTAINER]: createContainerStyles(themeColors),
    [STYLE_KEYS.HEADER]: createHeaderStyles(themeColors),
    [STYLE_KEYS.BACK_BUTTON]: createBackButtonStyles(themeColors),
    [STYLE_KEYS.SAVE_BUTTON]: createSaveButtonStyles(themeColors, hasChanges),
    [STYLE_KEYS.CANCEL_BUTTON]: createCancelButtonStyles(themeColors),
    [STYLE_KEYS.UPLOAD_BUTTON]: createUploadButtonStyles(themeColors),
    [STYLE_KEYS.REMOVE_BUTTON]: createRemoveButtonStyles(themeColors),
    [STYLE_KEYS.AVATAR]: createAvatarStyles(themeColors),
    [STYLE_KEYS.DANGER_CARD]: createDangerCardStyles(themeColors),
    [STYLE_KEYS.ALERT]: createAlertStyles(themeColors),
    [STYLE_KEYS.DANGER_BUTTON]: createDangerButtonStyles(themeColors),
    [STYLE_KEYS.MODAL]: createModalStyles(themeColors),
    [STYLE_KEYS.BADGE]: createBadgeStyles(themeColors),
    [STYLE_KEYS.ICON_GROUP]: createIconGroupStyles(themeColors),
    [STYLE_KEYS.TEXT]: createTextStyles(themeColors)
});

// 상수
export const CONSTANTS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_BIO_LENGTH: 500,
    MIN_NICKNAME_LENGTH: 2,
    MAX_NICKNAME_LENGTH: 20,
    AVATAR_SIZE: 120,
    ACCEPTED_IMAGE_TYPES: 'image/*',
    DELETE_CONFIRMATION_TEXT: 'DELETE'
};