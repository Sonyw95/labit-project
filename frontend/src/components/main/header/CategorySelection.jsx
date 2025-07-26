import React, { memo, useCallback } from "react";
import {
    Box,
    Text,
    UnstyledButton,
    Collapse,
    rem,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const CategorySection = memo(({
                                  category,
                                  level = 0,
                                  velogColors,
                                  openCategories,
                                  toggleCategory,
                                  setCategoryModalOpened
                              }) => {
    const Icon = category.icon;
    const hasChildren = category.children && category.children.length > 0;
    const isClickable = category.href;
    const isOpen = openCategories.has(category.id);
    const navigate = useNavigate();

    const handleItemClick = useCallback((e) => {
        e.stopPropagation();
        if (hasChildren && !isClickable) {
            toggleCategory(category.id);
        } else if (isClickable) {
            navigate(category.href);
            setCategoryModalOpened(false);
        }
    }, [hasChildren, isClickable, category.id, category.href, toggleCategory, navigate, setCategoryModalOpened]);

    const handleToggleClick = useCallback((e) => {
        e.stopPropagation();
        if (hasChildren) {
            toggleCategory(category.id);
        }
    }, [hasChildren, category.id, toggleCategory]);

    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = velogColors.hover;
    }, [velogColors.hover]);

    const handleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }, []);

    const handleToggleMouseEnter = useCallback((e) => {
        e.currentTarget.style.backgroundColor = velogColors.border;
    }, [velogColors.border]);

    const handleToggleMouseLeave = useCallback((e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
    }, []);

    // 스타일 객체들을 메모이제이션
    const buttonStyle = React.useMemo(() => ({
        width: '100%',
        padding: `${rem(10)} ${rem(12)}`,
        paddingLeft: rem(12 + level * 16),
        borderRadius: rem(6),
        display: 'flex',
        alignItems: 'center',
        gap: rem(10),
        transition: 'all 0.15s ease',
        cursor: (hasChildren || isClickable) ? 'pointer' : 'default',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'left',
        position: 'relative',
    }), [level, hasChildren, isClickable]);

    const iconBoxStyle = React.useMemo(() => ({
        color: level === 0 ? velogColors.primary : velogColors.subText,
        display: 'flex',
        alignItems: 'center',
        minWidth: rem(18),
    }), [level, velogColors.primary, velogColors.subText]);

    const textStyle = React.useMemo(() => ({
        color: velogColors.text,
        flex: 1,
    }), [velogColors.text]);

    const toggleBoxStyle = React.useMemo(() => ({
        padding: rem(4),
        borderRadius: rem(4),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    }), []);

    const chevronStyle = React.useMemo(() => ({
        color: velogColors.subText,
        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s ease'
    }), [velogColors.subText, isOpen]);

    const dotStyle = React.useMemo(() => ({
        width: rem(6),
        height: rem(6),
        borderRadius: '50%',
        backgroundColor: velogColors.primary,
        opacity: 0.6,
    }), [velogColors.primary]);

    return (
        <Box mb="xs">
            <UnstyledButton
                onClick={handleItemClick}
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="카테고리 버튼"
            >
                <Box style={iconBoxStyle}>
                    <Icon size={level === 0 ? 18 : 16} />
                </Box>

                <Text
                    size={level === 0 ? "md" : "sm"}
                    fw={level === 0 ? 600 : 400}
                    style={textStyle}
                >
                    {category.label}
                </Text>

                {hasChildren && (
                    <Box
                        onClick={handleToggleClick}
                        style={toggleBoxStyle}
                        onMouseEnter={handleToggleMouseEnter}
                        onMouseLeave={handleToggleMouseLeave}
                    >
                        <IconChevronDown
                            size={14}
                            style={chevronStyle}
                        />
                    </Box>
                )}

                {isClickable && (
                    <Box style={dotStyle} />
                )}
            </UnstyledButton>

            {hasChildren && (
                <Collapse in={isOpen} transitionDuration={200}>
                    <Box mt="xs">
                        {category.children.map((child) => (
                            <CategorySection
                                key={child.id}
                                category={child}
                                level={level + 1}
                                velogColors={velogColors}
                                openCategories={openCategories}
                                toggleCategory={toggleCategory}
                                setCategoryModalOpened={setCategoryModalOpened}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection;