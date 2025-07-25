import {styled} from "@mui/material";
import Logo from "../components/Logo";
import {Outlet} from "react-router-dom";

const StyleHeader = styled('header')(({ theme }) => ({
    top: 0,
    left: 0,
    lineHeight: 0,
    width: '100%',
    position: 'absolute',
    padding: theme.spacing(3, 3, 0),
    [theme.breakpoints.up('sm')] : {
        padding: theme.spacing(5, 5, 0),
    }
}))

export default function DefaultLayout() {
    return(
        <>
            <StyleHeader>
            </StyleHeader>
            <Outlet/>
        </>
    )
}
