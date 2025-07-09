import {Badge, NavLink, rem, Stack} from "@mantine/core";
import {IconSparkles} from "@tabler/icons-react";
import React from "react";
import {NavLink as Links} from "react-router-dom";
import {Icons} from "@/utils/Icons.jsx";
import {useNavState} from "@/hooks/useNavState.js";


const handleClick = (requiredNav, onClose) => {
    onClose && requiredNav && onClose();
}
const Navigated = ( ({item, onClose, openedItems, toggleItem}) => {
    const subItem = item?.subLinks;
    return (
        <NavLink
            key={item.href}
            component={Links}
            to={ item.href }
            onClick={() => handleClick(item.requiredNav, onClose)}
            label={item.label}
            opened={openedItems.has(item.href)}
            onChange={(opened) => toggleItem(item.href)}
            leftSection={
                <Icons icon={item.icon} size={18} style={{
                    transition: 'all 0.3s ease',
                }} />
            }
            rightSection={
                item.badge ? (
                    <Badge size="xs" style={{ background: '#ef4444', color: 'white' }}>
                        {item.badge}
                    </Badge>
                ) : item.active ? (
                    <IconSparkles size={14} style={{ color: '#4c6ef5' }} />
                ) : null
            }
            styles={{
                root: {
                    borderRadius: rem(8),
                    padding: rem(12),
                    marginBottom: rem(4),
                    border: 'none',
                    transition: 'all 0.3s ease',
                },
            }}
        >
            { subItem && subItem.length > 0 && item?.subLinks?.map( (sub) => (
                <Navigated item={sub} key={sub.href} onClose={onClose} openedItems={openedItems}/>
            ))}
        </NavLink>
    )
})
export default function NavigationItem({navigationItems, onClose}) {
    const { openedItems, toggleItem } = useNavState(navigationItems);
    return (
        <Stack gap="xs">
            {navigationItems.map((item) => (
                <Navigated item={item} key={item.href} onClose={onClose} openedItems={openedItems} toggleItem={toggleItem}/>
            ))}
        </Stack>
    )
}