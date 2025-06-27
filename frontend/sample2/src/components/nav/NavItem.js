import PropTypes from "prop-types";

import {memo, useState} from "react";
import {Box, Collapse, List, ListItemText} from "@mui/material";
import {StyledNavIcon, StyleNavItem} from "./style";
import { NavLink } from "react-router-dom";
import Icons from "../icon/icons";


const arrows = (icon) => {
    return  <Icons width={20} icon={icon}/>
}
const NavItem = ({ item  }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    }
    NavItem.prototype = {
        item: PropTypes.object,
    }

    const{ title, path, icon, head, child } = item;
    return(
        <>
            <StyleNavItem
                component={ head === 'element' ? NavLink : 'div'}
                to={ head === 'element' ? path : ''}
                // selected={selectPath === path}
                onClick={ child ? handleClick :'' }
            >
                <StyledNavIcon>
                    <Icons width={24} icon={icon} />
                </StyledNavIcon>
                <ListItemText disableTypography primary={title}/>
                {
                    child && ( open ? arrows('line-md:chevron-small-up') : arrows('line-md:chevron-small-down') )
                }
            </StyleNavItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <NavItemList data={item.child}/>
            </Collapse>
        </>

    )
}


const NavItemList = ({data = [], ...other}) => {
    NavItemList.prototype = {
        data: PropTypes.array
    }
    return(
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {
                    data.map( (item, index) => (
                        <NavItem key={item.title} item={item} index={index}/>
                    ))
                }

            </List>
        </Box>
    )

}

export default memo(NavItemList);
