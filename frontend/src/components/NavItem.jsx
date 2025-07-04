import {Badge, NavLink, rem, Stack} from "@mantine/core";
import {IconSparkles} from "@tabler/icons-react";
import React from "react";
import {NavLink as Links, useNavigate} from "react-router-dom";
import {Icons} from "@/utils/Icons.jsx";


const handleClick = (requiredNav, onClose) => {
    onClose && requiredNav && onClose();
}
const Navigated = ( ({item, onClose}) => {
    const subItem = item?.subLinks;
    return (
        <NavLink
            key={item.href}
            component={Links}
            to={ item.href }
            onClick={() => handleClick(item.requiredNav, onClose)}
            label={item.label}
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
                    ransition: 'all 0.3s ease',
                },
            }}
        >
            { subItem && subItem.length > 0 && item?.subLinks?.map( (sub) => (
                <Navigated item={sub} key={sub.href} onClose={onClose}/>
            ))}
        </NavLink>
    )
})
export default function NavItem({navigationItems, onClose}) {
    return (
        <Stack gap="xs">
            {navigationItems.map((item) => (
                <Navigated item={item} key={item.href} onClose={onClose} />
            ))}
        </Stack>
    )
}