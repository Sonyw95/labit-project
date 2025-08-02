import React, { useMemo, useCallback, useEffect } from 'react';
import {
    Container,
    Grid,
    Group,
    Text,
    ActionIcon,
    Paper,
    Title,
    Box,
    Badge,
} from '@mantine/core';
import {
    IconArrowLeft,
} from '@tabler/icons-react';
import {
    createBackButtonStyles,
    createBadgeStyles,
    createContainerStyles,
    createHeaderStyles,
    createTextStyles
} from "@/utils/useEditStyle.js";
import ProfileImageUpload from "@/components/section/profile/ProfileImageUpload.jsx";
import UserInfoForm from "@/components/section/profile/UserInfoForm.jsx";
import ActionButtons from "@/components/section/profile/ActionButtons.jsx";
import DangerZone from "@/components/section/profile/DangerZone.jsx";
import {useUserEdit} from "@/hooks/auth/useUserEdit.jsx";
import useAuthStore from "@/stores/authStore.js";


// 페이지 헤더 컴포넌트
const PageHeader = React.memo(({
                                   onGoBack,
                                   hasChanges,
                                   isSaving,
                                   themeColors
                               }) => {
    const headerStyles = useMemo(() => createHeaderStyles(themeColors), [themeColors]);
    const backButtonStyles = useMemo(() => createBackButtonStyles(themeColors), [themeColors]);
    const badgeStyles = useMemo(() => createBadgeStyles(themeColors, 'warning'), [themeColors]);
    const textStyles = useMemo(() => createTextStyles(themeColors), [themeColors]);
    const subtitleStyles = useMemo(() => createTextStyles(themeColors, 'subtitle'), [themeColors]);

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            style={headerStyles}
            component="header"
            role="banner"
        >
            <Group justify="space-between" align="center">
                <Group gap="md">
                    <ActionIcon
                        variant="subtle"
                        onClick={onGoBack}
                        disabled={isSaving}
                        styles={backButtonStyles}
                        aria-label="이전 페이지로 돌아가기"
                        size="lg"
                    >
                        <IconArrowLeft size={18} aria-hidden="true" />
                    </ActionIcon>
                    <Box>
                        <Title
                            order={1}
                            style={textStyles}
                            size="h2"
                        >
                            프로필 설정
                        </Title>
                        <Text
                            size="sm"
                            style={subtitleStyles}
                            role="doc-subtitle"
                        >
                            프로필 정보를 수정할 수 있습니다
                        </Text>
                    </Box>
                </Group>

                {hasChanges && (
                    <Badge
                        styles={badgeStyles}
                        aria-label="저장되지 않은 변경사항이 있습니다"
                        role="status"
                        aria-live="polite"
                    >
                        변경사항 있음
                    </Badge>
                )}
            </Group>
        </Paper>
    );
});

// 그리드 레이아웃 컴포넌트
const ProfileGrid = React.memo(({
                                    userInfo,
                                    errors,
                                    isSaving,
                                    hasChanges,
                                    onUserInfoChange,
                                    onImageChange,
                                    onImageRemove,
                                    onSave,
                                    onCancel,
                                    onDeleteAccount
                                }) => {
    return (
        <Grid
            gutter="md"
            role="main"
            aria-label="프로필 편집 영역"
        >
            {/* 프로필 이미지 - 왼쪽 컬럼 */}
            <Grid.Col
                span={{ base: 12, sm: 12, md: 4 }}
                aria-label="프로필 이미지 섹션"
            >
                <ProfileImageUpload
                    currentImage={userInfo.profileImage}
                    onImageChange={onImageChange}
                    onImageRemove={onImageRemove}
                    disabled={isSaving}
                />
            </Grid.Col>

            {/* 사용자 정보 폼 - 오른쪽 컬럼 */}
            <Grid.Col
                span={{ base: 12, sm: 12, md: 8 }}
                aria-label="사용자 정보 입력 섹션"
            >
                <UserInfoForm
                    userInfo={userInfo}
                    onChange={onUserInfoChange}
                    errors={errors}
                    disabled={isSaving}
                />
            </Grid.Col>

            {/* 액션 버튼 - 전체 너비 */}
            <Grid.Col span={12}>
                <ActionButtons
                    onSave={onSave}
                    onCancel={onCancel}
                    isSaving={isSaving}
                    hasChanges={hasChanges}
                    disabled={isSaving}
                />
            </Grid.Col>

            {/* 위험 영역 - 전체 너비 */}
            <Grid.Col span={12}>
                <DangerZone
                    onDeleteAccount={onDeleteAccount}
                    disabled={isSaving}
                />
            </Grid.Col>
        </Grid>
    );
});

// 메인 사용자 프로필 페이지 컴포넌트
const UserProfilePage = () => {
    // 초기 데이터 생성 (한 번만)
    // const initialUserData = useMemo(() => createInitialUserData(), []);

    const { user: initialUserData } = useAuthStore();

    // 커스텀 훅으로 상태 및 핸들러 관리
    const {
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
    } = useUserEdit(initialUserData);

    // 컨테이너 스타일 메모이제이션
    const containerStyles = useMemo(() =>
            createContainerStyles(themeColors),
        [themeColors]
    );

    // 페이지 제목 설정 (SEO 및 접근성)
    useEffect(() => {
        const originalTitle = document.title;
        document.title = '프로필 설정 - 사용자 편집';

        return () => {
            document.title = originalTitle;
        };
    }, []);

    // 페이지 나가기 전 확인 (브라우저 레벨)
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (hasChanges && !isSaving) {
                event.preventDefault();
                event.returnValue = ''; // 표준 방식
                return ''; // 일부 브라우저 호환성
            }
        };

        if (hasChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges, isSaving]);

    // 키보드 단축키 지원
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ctrl+S 또는 Cmd+S로 저장
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                if (hasChanges && !isSaving) {
                    handleSave();
                }
            }
            // Escape로 취소 (모달이 열려있지 않을 때)
            else if (event.key === 'Escape' && !document.querySelector('[role="dialog"]')) {
                if (hasChanges && !isSaving) {
                    handleCancel();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [hasChanges, isSaving, handleSave, handleCancel]);

    // 폼 제출 핸들러
    const handleFormSubmit = useCallback((event) => {
        event.preventDefault();
        if (hasChanges && !isSaving) {
            handleSave();
        }
    }, [hasChanges, isSaving, handleSave]);

    return (
        <Box
            style={containerStyles}
            role="application"
            aria-label="사용자 프로필 편집 애플리케이션"
        >
            <Container size="md" py="xl">
                <form onSubmit={handleFormSubmit} noValidate>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* 페이지 헤더 */}
                        <PageHeader
                            onGoBack={handleGoBack}
                            hasChanges={hasChanges}
                            isSaving={isSaving}
                            themeColors={themeColors}
                        />

                        {/* 메인 컨텐츠 그리드 */}
                        <ProfileGrid
                            userInfo={userInfo}
                            errors={errors}
                            isSaving={isSaving}
                            hasChanges={hasChanges}
                            onUserInfoChange={handleUserInfoChange}
                            onImageChange={handleImageChange}
                            onImageRemove={handleImageRemove}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDeleteAccount={handleDeleteAccount}
                        />
                    </Box>
                </form>

                {/* 키보드 단축키 안내 (화면 리더용) */}
                <Box
                    className="sr-only"
                    role="note"
                    aria-label="키보드 단축키 안내"
                >
                    Ctrl+S 또는 Cmd+S를 눌러 저장할 수 있습니다.
                    Escape 키를 눌러 변경사항을 취소할 수 있습니다.
                </Box>

                {/* 상태 안내 (화면 리더용) */}
                <Box
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                    role="status"
                >
                    {isSaving && '프로필 정보를 저장하는 중입니다...'}
                    {hasChanges && !isSaving && '저장되지 않은 변경사항이 있습니다.'}
                </Box>
            </Container>

            {/* 전역 스타일 - 접근성 및 성능 개선 */}
            <style jsx global>{`
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

                /* 포커스 개선 */
                *:focus-visible {
                    outline: 2px solid ${themeColors.primary};
                    outline-offset: 2px;
                }

                /* 감소된 모션 선호 사용자를 위한 설정 */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }

                /* 고대비 모드 지원 */
                @media (prefers-contrast: high) {
                    button, input, textarea {
                        border-width: 2px !important;
                    }
                }

                /* 인쇄 최적화 */
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </Box>
    );
};

// displayName 설정
PageHeader.displayName = 'PageHeader';
ProfileGrid.displayName = 'ProfileGrid';
UserProfilePage.displayName = 'UserProfilePage';

export default UserProfilePage;