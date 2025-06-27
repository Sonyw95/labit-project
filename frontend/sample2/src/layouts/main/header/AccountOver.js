import {useState} from "react";
import {Avatar, Box, Divider, IconButton, MenuItem, Popover, Stack, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import account from "../../../mock/account";
import Icons from "../../../components/icon/icons";
import {useNavigate} from "react-router-dom";


const MENU = [
    {
        label: 'Home',
        icon: 'eva:home-fill',
        path: '/main'
    },
    {
        label: 'Profile',
        icon: 'eva:person-fill',
        path: '/main'

    },
    {
        label: 'Settings',
        icon: 'eva:settings-fill',
        path: '/main'

    }
]
export default function AccountOver(){
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const onHandleOpen = (e) => {
        setOpen(e.currentTarget);
    };
    const onHandleClose = (path) => {
        setOpen( null );
    };
    const onHandleNavigate = (path) => {
        path && navigate(path)
    }

    return (
        <>
            <IconButton
                onClick={onHandleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: '""',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                        },
                    }),
                    bgcolor: (theme) => alpha(theme.palette.grey[700], 0.22),
                }}
            >
                <Avatar src={account.photo} alt={"photo"}/>
            </IconButton>
            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={onHandleClose}
                anchorOrigin={ {vertical: 'bottom', horizontal: "right"} }
                transformOrigin={ {vertical: 'top', horizontal: 'right'} }
                PaperProps={{
                    sx: {
                        p: 0,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '$ .MuiMenuItem-root':{
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant={"subtitle2"} noWrap>
                        {account.name}
                    </Typography>
                    <Typography variant={"body2"} sx={{color: 'text.secondary'}}>
                        {account.email}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>
                <Stack sx={{ p: 1 }}>
                    {
                        MENU.map( (option) =>(
                            <MenuItem key={option.label} onClick={ () => onHandleNavigate(option.path)}>
                                <Icons icon={option.icon} sx={{
                                    mr: 1
                                }}/>
                                {option.label}
                            </MenuItem>
                        ) )
                    }
                </Stack>
                <Divider sx={{borderStyle: 'dashed'}}/>
                <MenuItem onClick={onHandleClose} sx={{ m:1 }}>
                    Logout
                </MenuItem>

            </Popover>
        </>
    )
}