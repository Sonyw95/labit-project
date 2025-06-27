import {forwardRef} from "react";
import {Box, Link, useTheme} from "@mui/material";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

const Logo = forwardRef( ({ link = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const PR_LIGHT = theme.palette.primary.light;
    const PR_MAIN = theme.palette.primary.main;
    const PR_DARK = theme.palette.primary.dark;

    const logo = (
        <Box
            ref={ ref }
            sx={{
                display:'inline-flex',
                ...sx,
            }}
            {...other}
            >
            <svg xmlns={"http://www.w3.org/2000/svg"} width={"100%"} height={"100%"} viewBox={"0 0 256 256"}>

                <g transform="translate(0.000000,260.000000) scale(0.050000,-0.050000)" fill={"#ff8200"} >
                    <path d="M1403 4238 c-176 -89 -192 -140 -199 -641 l-6 -437 111 0 111 0 0
            392 0 391 58 59 c64 63 111 71 193 34 97 -44 109 -101 109 -505 l0 -371 111 0
            111 0 -6 437 -6 436 -55 72 c-131 172 -348 226 -532 133z"/>
                    <path d="M2080 3850 c0 -98 5 -113 47 -129 107 -41 133 -108 133 -344 l0 -217
            110 0 110 0 0 245 c-1 331 -54 444 -245 524 -135 57 -155 46 -155 -79z"/>
                    <path d="M1620 3084 c0 -9 30 -65 66 -125 226 -371 234 -378 234 -209 l0 110
            235 0 c292 0 372 -21 478 -128 254 -253 66 -651 -308 -652 -80 0 -80 -3 -1
            -134 64 -106 65 -106 167 -106 296 0 496 -325 351 -571 l-43 -73 63 -99 c75
            -118 89 -116 172 22 165 273 119 598 -113 808 -45 40 -90 73 -101 73 -11 0 11
            40 48 89 270 353 95 869 -334 983 -115 30 -914 41 -914 12z"/>
                    <path d="M2333 2627 c-23 -24 -14 -101 16 -126 61 -51 146 21 120 102 -12 37
            -106 53 -136 24z"/>
                </g>
                <g transform="translate(0.000000,260.000000) scale(0.050000,-0.050000)" fill={"#ff8200"} >
                    <path d="M1200 2011 l0 -1091 620 0 c694 0 656 -10 568 147 l-51 93 -459 0
            -458 0 0 360 0 360 275 0 276 0 299 -479 300 -479 135 -1 c74 -1 135 7 135 16
            0 9 -304 497 -675 1085 l-676 1068 -144 6 -145 6 0 -1091z m457 364 l162 -255
            -199 0 -200 0 0 315 c0 314 0 315 37 255 20 -33 110 -175 200 -315z"/>
                </g>
            </svg>
        </Box>
    );

    return (
        <Link component={NavLink} to={"/"} sx={{ display: 'contents', cursor: 'pointer' }}>
            {logo}
        </Link>
    )

});

Logo.propTypes ={
    sx: PropTypes.object,
    link: PropTypes.bool,
}
export default Logo;
