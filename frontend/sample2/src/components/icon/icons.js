import {forwardRef} from "react";
import {Box} from "@mui/material";
import {Icon} from "@iconify/react";
import PropTypes from "prop-types";


const Icons = forwardRef( ({ icon, width= 20, sx, ...other }, ref) => (
    <Box ref={ref} component={Icon} icon={icon} sx={ {width, height: width, ...sx}} {...other}/>
));

Icons.prototype ={
    sx: PropTypes.object,
    width: PropTypes.oneOfType( [ PropTypes.number, PropTypes.string ] ),
    icon: PropTypes.oneOfType([ PropTypes.element, PropTypes.string ]),
};

export default Icons;