import PropTypes from "prop-types";
import {AppBar, Box, IconButton, Stack, styled, Toolbar} from "@mui/material";
import {backgroundBlur} from "../../../utils/backgroundBlur";
import Icons from "../../../components/icon/icons";
import AccountOver from "./AccountOver";


const H_MOBILE = 64;
const H_DESKTOP = 92;
const StyleRoot = styled(AppBar)(({theme}) => ({
    ...backgroundBlur( {color: theme.palette.background.paper} ),
    boxShadow: 'none',
    [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${theme.width.leftNavi+1}px)`,
    },
}))
const StyleToolbar = styled(Toolbar)(({theme}) => ({
    minHeight: H_MOBILE,
    [theme.breakpoints.up('lg')]: {
        minHeight: H_DESKTOP,
        padding: theme.spacing(0, 5)
    }
}))
Header.prototype = {
    onNav: PropTypes.func
};
export default function Header( {onNav, onClose} ){
    return (
        <StyleRoot>
            <StyleToolbar>
                <IconButton
                    onClick={onClose}
                    sx={{
                        mr: 1,
                        color: 'text.primary',
                        display: {lg: 'none'},
                    }}
                >
                    <Icons icon={"eva:menu-2-fill"}/>
                </IconButton>

                <Box sx={{flexGrow: 1}}/>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={{
                        xs: 0.5,
                        sm: 1
                    }}
                >
                    <AccountOver/>
                </Stack>
            </StyleToolbar>
        </StyleRoot>
    )
}
