import React, { memo, useState, useCallback, useMemo } from "react";
import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    Text,
    Box,
    Modal,
    ScrollArea,
    Center
} from "@mantine/core";
import {
    IconMoon,
    IconSearch,
    IconSun,
    IconEdit,
} from "@tabler/icons-react";
import { backgroundBlur } from "@/utils/helpers.jsx";
import { showToast } from "@/components/advanced/Toast.jsx";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { NavLink } from "react-router-dom";
import CategoryButton from "./CategoryButton.jsx";
import CategorySkeleton from "./CategorySkeleton.jsx";
import useAuthStore from "@/stores/authStore.js";
import {useNavigationTree} from "@/hooks/api/useApi.js";
import {
    getActionButtonStyles,
    getHeaderStyles,
    getModalStyles,
} from "@/components/main/header/style.js";
import CategorySection from "@/components/main/header/CategorySelection.jsx";
import UserMenu from "@/components/common/Auth/UserMenu.jsx";
import UserLogin from "@/components/common/Auth/UserLogin.jsx";

const Header = memo(({
                         isDark,
                         navOpened,
                         setNavOpened,
                         toggleColorScheme
                     }) => {
    console.log('Header')
    const { isAuthenticated } = useAuthStore();
    const [categoryModalOpened, setCategoryModalOpened] = useState(false);
    const [openCategories, setOpenCategories] = useState(new Set([2, 3]));
    const { dark, velogColors } = useTheme();

    // API hooks
    const {
        data: categories = [],
        isLoading,
        error
    } = useNavigationTree();

    // 메모이제이션된 스타일들
    const headerStyles = useMemo(() => getHeaderStyles(velogColors), [velogColors]);
    const actionButtonStyles = useMemo(() => getActionButtonStyles(velogColors), [velogColors]);
    const modalStyles = useMemo(() => getModalStyles(velogColors), [velogColors]);

    // 헤더 스타일 계산
    const headerStyle = useMemo(() => ({
        ...headerStyles.header,
        ...backgroundBlur({
            color: velogColors.background,
            alpha: 1
        }),
    }), [headerStyles.header, velogColors.background]);

    // 이벤트 핸들러들을 useCallback으로 메모이제이션
    const handleBurgerClick = useCallback(() => {
        setNavOpened(!navOpened);
    }, [navOpened, setNavOpened]);

    const handleSearchClick = useCallback(() => {
        showToast.info('알림', '같은 레벨 내에서만 이동 가능합니다.');
    }, []);

    const handleEditClick = useCallback(() => {
        showToast.info('글 작성', '글 작성 페이지로 이동합니다.');
    }, []);

    const handleModalClose = useCallback(() => {
        setCategoryModalOpened(false);
    }, []);

    const toggleCategory = useCallback((categoryId) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    }, []);

    const openCategoryModal = useCallback(() => {
        setCategoryModalOpened(true);
    }, []);

    // 필터링된 카테고리들을 메모이제이션
    const filteredCategories = useMemo(() => {
        return categories && categories.length > 0
            ? categories.filter(category => category.href !== '/home')
            : [];
    }, [categories]);

    // 모달 제목 메모이제이션
    const modalTitle = useMemo(() => (
        <Text
            fw={600}
            size="lg"
            style={{ color: velogColors.text }}
        >
            카테고리
        </Text>
    ), [velogColors.text]);

    // 카테고리 렌더링 컴포넌트
    const CategoryList = memo(() => {
        if (isLoading) {
            return <CategorySkeleton velogColors={velogColors} />;
        }

        if (error) {
            return <Text size="sm" c="dimmed">카테고리 로드 실패</Text>;
        }

        return (
            <>
                {filteredCategories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        category={category}
                        velogColors={velogColors}
                        dark={dark}
                        openCategoryModal={openCategoryModal}
                    />
                ))}
            </>
        );
    });

    // 모달 컨텐츠 컴포넌트
    const ModalContent = memo(() => {
        if (isLoading) {
            return (
                <Center>
                    <Text size="sm" c="dimmed">카테고리를 불러오는 중...</Text>
                </Center>
            );
        }

        if (error) {
            return (
                <Center>
                    <Text size="sm" c="red">카테고리 로드에 실패했습니다.</Text>
                </Center>
            );
        }

        return (
            <>
                {categories && categories.length > 0 && categories.map((category) => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        velogColors={velogColors}
                        openCategories={openCategories}
                        toggleCategory={toggleCategory}
                        setCategoryModalOpened={setCategoryModalOpened}
                    />
                ))}
            </>
        );
    });

    return (
        <>
            <AppShell.Header style={headerStyle}>
                <Group h="100%" px="xl" justify="space-between">
                    {/* 좌측: 로고/브랜드 + 카테고리 영역 */}
                    <Group gap="md">
                        <Burger
                            opened={navOpened}
                            onClick={handleBurgerClick}
                            hiddenFrom="lg"
                            size="sm"
                            color={velogColors.text}
                        />

                        {/* velog 스타일 로고 */}
                        <Box
                            component={NavLink}
                            to="/"
                            style={headerStyles.logoBox}
                        >
                            <Text
                                size="1.75rem"
                                fw={800}
                                style={headerStyles.logoText}
                            >
                                LABit
                            </Text>
                        </Box>

                        {/* 카테고리 네비게이션 - 데스크톱에서만 표시 */}
                        <Group gap="xs" visibleFrom="lg">
                            <CategoryList />
                        </Group>
                    </Group>

                    {/* 우측: 액션 버튼들 */}
                    <Group gap="sm" visibleFrom="lg">
                        {/* 검색 버튼 */}
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            radius="xl"
                            onClick={handleSearchClick}
                            style={actionButtonStyles.search}
                        >
                            <IconSearch size={20} />
                        </ActionIcon>

                        {/* 다크모드 토글 - 로그인하지 않은 경우에만 표시 */}
                        {!isAuthenticated && (
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                radius="xl"
                                onClick={toggleColorScheme}
                                style={actionButtonStyles.darkMode}
                            >
                                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
                            </ActionIcon>
                        )}

                        {/* 로그인된 경우 새 글 작성 버튼 */}
                        {isAuthenticated && (
                            <ActionIcon
                                variant="filled"
                                size="lg"
                                radius="xl"
                                onClick={handleEditClick}
                                style={actionButtonStyles.edit}
                            >
                                <IconEdit size={20} />
                            </ActionIcon>
                        )}

                        {/* 로그인/사용자 메뉴 */}
                        {isAuthenticated ? <UserMenu/> : <UserLogin/>}
                    </Group>
                </Group>
            </AppShell.Header>

            {/* 카테고리 전체보기 모달 */}
            <Modal
                opened={categoryModalOpened}
                onClose={handleModalClose}
                title={modalTitle}
                size="md"
                padding="xl"
                radius="md"
                styles={modalStyles}
            >
                <ScrollArea h={450} type="scroll" scrollbarSize={6}>
                    <Box p="lg">
                        <ModalContent />
                    </Box>
                </ScrollArea>
            </Modal>
        </>
    );
});

Header.displayName = 'Header';

export default Header;