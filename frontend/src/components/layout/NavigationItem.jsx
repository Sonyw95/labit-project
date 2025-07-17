import {Badge, NavLink, rem, Stack} from "@mantine/core";
import {IconSparkles} from "@tabler/icons-react";
import React, {memo} from "react";
import {NavLink as Links} from "react-router-dom";
import {Icons} from "@/utils/Icons.jsx";
import {useNavState} from "@/hooks/useNavState.js";


const handleClick = (root, onClose) => {
    onClose && root && onClose();
}
const Navigated = memo(( ({item, onClose, openedItems, toggleItem}) => {
    const subItem = item?.subLinks;
    const href = item.navUrl
    return (
        <NavLink
            key={item.navUrl}
            component={Links}
            to={ href }
            onClick={() => handleClick(item.root, onClose)}
            onChange={(opened) => toggleItem(href)}

            label={item.label}
            opened={openedItems.has(href)}
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
}))
const NavigationItem = memo(({navigationItems, onClose})=> {
    const { openedItems, toggleItem } = useNavState(navigationItems);
    console.log(navigationItems)
    return (
        <Stack gap="xs">
            {navigationItems.map((item) => (
                <Navigated item={item}  onClose={onClose} openedItems={openedItems} toggleItem={toggleItem}/>
            ))}
        </Stack>
    )
})
export default NavigationItem;