import {useState} from "react";
import {Button, Menu, MenuItem, Typography} from "@mui/material";
import Icons from "../../../components/icon/icons";



export default function Selector({options, title}) {

    const [ open, setOpen ] = useState(null);
    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(null);
    }
    const [ selected, setSelected ] = useState( options[0].text );
    const handleSelect = (event) => {
        setSelected(event.text);
        handleClose()
    }

    return (
        <>
            <Button color={'inherit'} onClick={handleOpen} disableRipple endIcon={<Icons icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}>
                {title}:&nbsp;&nbsp;
                <Typography component={'span'} variant={'subtitle2'} sx={ { color: 'text.secondary' } }>
                    {selected}
                </Typography>
            </Button>
            <Menu
                keepMounted
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {
                    options.map(
                        (option) => (
                            <MenuItem
                                key={option.value}
                                selected={option.value === selected}
                                sx={{ typography: 'body2' }}
                                onClick={() => handleSelect(option)}
                            >
                                {option.text}
                            </MenuItem>
                        ))
                }
            </Menu>
        </>
    )
}