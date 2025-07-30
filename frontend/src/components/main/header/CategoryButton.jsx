import React, { memo, useCallback } from "react";
import {
    Text,
    Menu,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const CategoryButton = memo(({ category, themeColors, dark, openCategoryModal }) => {
    const hasChildren = category.children && category.children.length > 0;

    const handleOpenModal = useCallback(() => {
        openCategoryModal(category.label.toLowerCase());
    }, [category.label, openCategoryModal]);

    const handleMouseEnter = useCallback((e) => {
        e.target.style.backgroundColor = themeColors.hover;
    }, [themeColors.hover]);

    const handleMouseLeave = useCallback((e) => {
        e.target.style.backgroundColor = 'transparent';
    }, []);

    // 스타일 객체들을 메모이제이션
    const baseButtonStyle = React.useMemo(() => ({
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(4),
        color: themeColors.text,
        fontSize: rem(14),
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        gap: rem(4),
        transition: 'all 0.15s ease',
        backgroundColor: 'transparent',
    }), [themeColors.text]);

    const textStyle = React.useMemo(() => ({
        color: themeColors.text,
        fontWeight: 400
    }), [themeColors.text]);

    const chevronStyle = React.useMemo(() => ({
        color: themeColors.subText,
        marginTop: rem(1)
    }), [themeColors.subText]);

    const menuStyles = React.useMemo(() => ({
        dropdown: {
            backgroundColor: themeColors.background,
            border: `1px solid ${themeColors.border}`,
            borderRadius: rem(8),
            padding: rem(8),
            minWidth: rem(200),
            boxShadow: dark
                ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px rgba(0, 0, 0, 0.1)',
        }
    }), [themeColors.background, themeColors.border, dark]);

    const viewAllItemStyle = React.useMemo(() => ({
        item: {
            padding: `${rem(8)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(13),
            fontWeight: 500,
            color: themeColors.primary,
            '&:hover': {
                backgroundColor: `${themeColors.primary}10`,
                color: themeColors.primary,
            }
        }
    }), [themeColors.primary]);

    const dividerStyle = React.useMemo(() => ({
        borderColor: themeColors.border,
        margin: `${rem(6)} 0`
    }), [themeColors.border]);

    const getChildItemStyle = useCallback((child) => ({
        item: {
            padding: `${rem(6)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(13),
            color: themeColors.text,
            cursor: child.href ? 'pointer' : 'default',
            opacity: child.href ? 1 : 0.6,
            '&:hover': {
                backgroundColor: child.href ? themeColors.hover : 'transparent',
            }
        }
    }), [themeColors.text, themeColors.hover]);

    const moreItemStyle = React.useMemo(() => ({
        item: {
            padding: `${rem(6)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(12),
            color: themeColors.subText,
            fontStyle: 'italic',
            '&:hover': {
                backgroundColor: themeColors.hover,
                color: themeColors.text,
            }
        }
    }), [themeColors.subText, themeColors.hover, themeColors.text]);

    // 자식이 없는 카테고리 버튼
    const NonChildrenCategoryButton = memo(() => (
        <UnstyledButton
            component={NavLink}
            to={category.href}
            style={baseButtonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="카테고리 버튼"
        >
            <Text size="sm" style={textStyle}>
                {category.label}
            </Text>
        </UnstyledButton>
    ));

    // 자식이 있는 카테고리 버튼
    const HasChildrenCategoryButton = memo(() => (
        <>
            <Menu.Target>
                <UnstyledButton
                    style={baseButtonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    aria-label="카테고리 버튼"
                >
                    <Text size="sm" style={textStyle}>
                        {category.label}
                    </Text>
                    <IconChevronDown size={12} style={chevronStyle} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    onClick={handleOpenModal}
                    styles={viewAllItemStyle}
                >
                    전체 {category.label} 보기
                </Menu.Item>

                {category.children && category.children.length > 0 && (
                    <>
                        <Menu.Divider style={dividerStyle} />
                        {category.children.slice(0, 5).map((child) => (
                            <Menu.Item
                                key={child.id}
                                component={NavLink}
                                to={child.href && child.href}
                                disabled={!child.href}
                                styles={getChildItemStyle(child)}
                            >
                                {child.label}
                            </Menu.Item>
                        ))}
                        {category.children.length > 5 && (
                            <Menu.Item
                                onClick={handleOpenModal}
                                styles={moreItemStyle}
                            >
                                +{category.children.length - 5}개 더 보기
                            </Menu.Item>
                        )}
                    </>
                )}
            </Menu.Dropdown>
        </>
    ));

    return (
        <Menu position="bottom-start" offset={8} styles={menuStyles}>
            {hasChildren ? <HasChildrenCategoryButton /> : <NonChildrenCategoryButton />}
        </Menu>
    );
});

CategoryButton.displayName = 'CategoryButton';

export default CategoryButton;