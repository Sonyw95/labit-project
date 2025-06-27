import {forwardRef} from "react";
import {Box} from "@mui/material";
import PropTypes from "prop-types";

const SvgBox = forwardRef( ( {src, sx, ...other}, ref ) => (
    <Box
        component={"span"}
        className={"svg-box"}
        ref={ref}
        sx={{
            width: 24,
            height: 24,
            display: 'inline-block',
            bgcolor: 'currentColor',
            mask: `url(${src}) no-repeat center/ contain`,
            WebkitMask: `url(${src}) no-repeat center / contain`,
            ...sx,
        }}
        {...other}
    />
));
SvgBox.propTypes = {
    src: PropTypes.string,
    sx: PropTypes.object,
};
export default SvgBox;