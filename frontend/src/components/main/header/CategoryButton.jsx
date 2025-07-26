import React, { memo, useCallback } from "react";
import {
    Text,
    Menu,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const CategoryButton = memo(({ category, velogColors, dark, openCategoryModal }) => {
    const hasChildren = category.children && category.children.length > 0;

    const handleOpenModal = useCallback(() => {
        openCategoryModal(category.label.toLowerCase());
    }, [category.label, openCategoryModal]);

    const handleMouseEnter = useCallback((e) => {
        e.target.style.backgroundColor = velogColors.hover;
    }, [velogColors.hover]);

    const handleMouseLeave = useCallback((e) => {
        e.target.style.backgroundColor = 'transparent';
    }, []);

    // 스타일 객체들을 메모이제이션
    const baseButtonStyle = React.useMemo(() => ({
        padding: `${rem(6)} ${rem(10)}`,
        borderRadius: rem(4),
        color: velogColors.text,
        fontSize: rem(14),
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        gap: rem(4),
        transition: 'all 0.15s ease',
        backgroundColor: 'transparent',
    }), [velogColors.text]);

    const textStyle = React.useMemo(() => ({
        color: velogColors.text,
        fontWeight: 400
    }), [velogColors.text]);

    const chevronStyle = React.useMemo(() => ({
        color: velogColors.subText,
        marginTop: rem(1)
    }), [velogColors.subText]);

    const menuStyles = React.useMemo(() => ({
        dropdown: {
            backgroundColor: velogColors.background,
            border: `1px solid ${velogColors.border}`,
            borderRadius: rem(8),
            padding: rem(8),
            minWidth: rem(200),
            boxShadow: dark
                ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                : '0 4px 16px rgba(0, 0, 0, 0.1)',
        }
    }), [velogColors.background, velogColors.border, dark]);

    const viewAllItemStyle = React.useMemo(() => ({
        item: {
            padding: `${rem(8)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(13),
            fontWeight: 500,
            color: velogColors.primary,
            '&:hover': {
                backgroundColor: `${velogColors.primary}10`,
                color: velogColors.primary,
            }
        }
    }), [velogColors.primary]);

    const dividerStyle = React.useMemo(() => ({
        borderColor: velogColors.border,
        margin: `${rem(6)} 0`
    }), [velogColors.border]);

    const getChildItemStyle = useCallback((child) => ({
        item: {
            padding: `${rem(6)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(13),
            color: velogColors.text,
            cursor: child.href ? 'pointer' : 'default',
            opacity: child.href ? 1 : 0.6,
            '&:hover': {
                backgroundColor: child.href ? velogColors.hover : 'transparent',
            }
        }
    }), [velogColors.text, velogColors.hover]);

    const moreItemStyle = React.useMemo(() => ({
        item: {
            padding: `${rem(6)} ${rem(12)}`,
            borderRadius: rem(4),
            fontSize: rem(12),
            color: velogColors.subText,
            fontStyle: 'italic',
            '&:hover': {
                backgroundColor: velogColors.hover,
                color: velogColors.text,
            }
        }
    }), [velogColors.subText, velogColors.hover, velogColors.text]);

    // 자식이 없는 카테고리 버튼
    const NonChildrenCategoryButton = memo(() => (
        <UnstyledButton
            component={NavLink}
            to={category.href}
            style={baseButtonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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