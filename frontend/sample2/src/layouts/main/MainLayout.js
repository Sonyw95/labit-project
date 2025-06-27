import {styled} from "@mui/material";
import {Outlet} from "react-router-dom";
import {useState} from "react";
import Header from "./header";
import LeftNavigation from "./nav";


const StyleRoot = styled("div")({
   display: "flex",
   minHeight: "100%",
   overflow: "hidden",
});
const MainContainer = styled("div")( ({theme}) => ({
    flexGrow:1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: 88,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]:{
        paddingTop: 116,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));
export default function MainLayout(){
    const [open, setOpen] = useState(false);
    return (
        <StyleRoot>
            <Header openNav={open} onClose={ () => setOpen(!open)}/>
            <LeftNavigation openNav={open} onClose={ () => setOpen(false)}/>
            <MainContainer>
                <Outlet/>
            </MainContainer>
        </StyleRoot>
    )
}
