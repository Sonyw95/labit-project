import useNavigationStore from "@/stores/navigationStore.js";
import {memo} from "react";
import {IconChevronDown, IconChevronRight} from "@tabler/icons-react";
import {Box, NavLink as MantineNavLink, rem, Stack} from '@mantine/core';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {Icons} from "@/utils/Icons.jsx";

const NavigationItem = memo(({
                                 menuItem,
                                 isExpanded,
                                 isSelected,
                                 onMenuClick,
                                 depth = 0
                             }) => {
    const { toggleMenuExpansion, expandMenu } = useNavigationStore();

    const hasChildren = menuItem.children && menuItem.children.length > 0;


    // 메뉴 클릭 핸들러
    const handleClick = () => {
        if (hasChildren) {
            toggleMenuExpansion(menuItem.id);
        }

        if (menuItem.href) {
            onMenuClick(menuItem);
            // 부모 메뉴들도 펼치기
            if (hasChildren) {
                expandMenu(menuItem.id);
            }
        }
    };

    // RouterNavLink로 감싸는 경우와 아닌 경우 분리
    const navLinkContent = (
        <MantineNavLink
            label={menuItem.label}
            // description={menuItem.description}
            leftSection={<Icons icon={menuItem.icon} size={18} stroke={1.5} />}
            rightSection={
                hasChildren ? (
                    isExpanded ? (
                        <IconChevronDown size={16} stroke={1.5} />
                    ) : (
                        <IconChevronRight size={16} stroke={1.5} />
                    )
                ) : null
            }
            active={isSelected}
            opened={isExpanded}
            onClick={handleClick}
            style={{
                paddingLeft: `${12 + depth * 16}px`,
                borderRadius: rem(8),
                margin: '2px 8px',
                transition: 'all 0.3s ease',
            }}
            // style={{
            //     margin: '2px 8px',
            //     borderRadius: rem(8),
            //     padding: rem(12),
            //     marginBottom: rem(4),
            //     border: 'none',
            // }}
            styles={{
                description: {
                    fontSize: '12px',
                    color: 'var(--mantine-color-dimmed)',
                },
            }}
        />
    );

    return (
        <>
            {/* 링크가 있는 경우 RouterNavLink로 감싸기 */}
            {menuItem.href ? (
                <MantineNavLink
                    component={RouterNavLink}
                    label={menuItem.label}
                    to={ menuItem.href }
                    active={isSelected}
                    opened={isExpanded}
                    // onClick={handleClick}
                    leftSection={<Icons icon={menuItem.icon} size={18} stroke={1.5} />}
                    rightSection={
                        hasChildren ? (
                            isExpanded ? (
                                <IconChevronDown size={16} stroke={1.5} />
                            ) : (
                                <IconChevronRight size={16} stroke={1.5} />
                            )
                        ) : null
                    }
                    style={{
                        paddingLeft: `${12 + depth * 16}px`,
                        borderRadius: rem(8),
                        margin: '2px 8px',
                        transition: 'all 0.3s ease',
                    }}
                    styles={{
                        description: {
                            fontSize: '12px',
                            color: 'var(--mantine-color-dimmed)',
                        },
                    }}
                />
            ) : (
                navLinkContent
            )}

            {/* 하위 메뉴들 렌더링 */}
            {hasChildren && isExpanded && (
                <Stack spacing={0}>
                    {menuItem.children.map((childItem) => (
                        <NavigationItem
                            key={childItem.id}
                            menuItem={childItem}
                            isExpanded={useNavigationStore.getState().expandedMenus.includes(childItem.id)}
                            isSelected={useNavigationStore.getState().selectedMenuId === childItem.id}
                            onMenuClick={onMenuClick}
                            depth={depth + 1}
                        />
                    ))}
                </Stack>
            )}
        </>
    );
});


export default NavigationItem;