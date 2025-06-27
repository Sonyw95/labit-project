import PropTypes from "prop-types";
import {useLocation} from "react-router-dom";
import useResponsive from "../../../hooks/useResponsive";
import {useEffect, memo} from "react";
import {
    Avatar,
    Box,
    Drawer,
    Typography,
} from "@mui/material";
import Logo from "../../../components/Logo";
import {alpha} from "@mui/material/styles";
import account from "../../../mock/account";
import navCategories from "./config";
import NavItemList from "../../../components/nav/NavItem";
import ScrollBar from "../../../components/scroll/bar";


const LeftNavigation = ({ openNav, onClose }) => {
    LeftNavigation.prototype = {
        openNav: PropTypes.bool,
        onClose: PropTypes.func,
    }
    const { pathname } = useLocation();
    const isDeskTop = useResponsive( 'up', 'lg');

    useEffect( () => {
        if(openNav){
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderAccount = (
        <Box
            sx={{
                my: 3,
                mx: 2.5,
                py: 2,
                px: 2.5,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
        >
            <Avatar src={account.photo} alt={"[photo"}/>
            <Box sx={{ ml :2 }}>
                <Typography variant={"subtitle2"}>{account.name}</Typography>
                <Typography variant={"body2"} sx={{ color: 'text.secondary' }}>
                    {account.email}
                </Typography>
            </Box>
        </Box>
    )
    const renderContent = (
        <ScrollBar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Logo sx={{ width: 60, height: 60, mt: 3, ml: 4 }} />
            {renderAccount}
            <NavItemList data={navCategories}/>
        </ScrollBar>
    );

    return (
        <Box
            sx={{
                flexShrink: { lg : 0},
                width: { lg: (theme) => theme.width.leftNavi }
            }}
        >
            {
                isDeskTop ? (
                    <Box
                        sx={{
                            height: 1,
                            position: 'flex',
                            width: (theme) => theme.width.leftNavi,
                            bgcolor: 'background.default',
                            borderRightStyle: 'none',
                            boxShadow: (theme) => theme.customShadows.z8
                        }}
                    >
                        {renderContent}
                    </Box>
                ) : (
                    <Drawer
                        open={openNav}
                        onClose={onClose}
                        PaperProps={{
                            sx: {
                                width: (theme) => theme.width.leftNavi
                            },
                        }}
                    >
                        {renderContent}
                    </Drawer>
                )
            }
        </Box>
    );
}
export default memo(LeftNavigation);
