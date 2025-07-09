import {Badge, NavLink, rem, Stack} from "@mantine/core";
import {TablerIcons} from "@/components/icon/index.jsx";
import {IconSparkles} from "@tabler/icons-react";
import React from "react";
import {NavLink as Links} from "react-router-dom";


const Navigated = ( ({item}) => {
    return (
        <NavLink
            key={item.href}
            component={Links}
            to={ item.href }
            label={item.label}
            leftSection={
                <TablerIcons icon={item.icon} size={18} style={{
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
            // style={{
            //     borderRadius: rem(8),
            //     padding: rem(12),
            //     marginBottom: rem(4),
            //     border: 'none',
            //     transition: 'all 0.3s ease',
            // }}
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
            { item.subLinks.length > 0 && item.subLinks.map( (sub) => (
                <Navigated item={sub} key={sub.href}/>
            ))}
        </NavLink>
    )
})
export default function NavLinkLayout({navigationItems}) {
   return (
       <Stack gap="xs">
           {navigationItems.map((item) => (
               <Navigated item={item} key={item.href}  />
           ))}
       </Stack>
   )
}