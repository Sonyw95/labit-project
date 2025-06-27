import {styled} from "@mui/material";
import SimpleBar from "simplebar-react";
import {alpha} from "@mui/material/styles";
import PropTypes from 'prop-types';
import {Box} from "@mui/material";
import {memo} from "react";

const StyleRootScrollbar = styled('div')( () => ({
    flexGrow: 1,
    height: '100%',
    overflow: 'hidden',
}));

const StyleScrollbar = styled(SimpleBar)( ({theme}) => ({
    // maxHeight: '100%',
    '$ .simplebar-scrollbar':{
        '$:before': {
            backgroundColor: alpha(theme.palette.grey[600], 0.45),
        }
    }
}))


ScrollBar.prototype = {
    sx: PropTypes.object,
    child: PropTypes.node,
}
function ScrollBar({children, sx, ...other}){
    const agent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);

    if(isMobile){
        return (
            <Box sx={{overflowX: 'auto', ...sx}} {...other}>
                {children}
            </Box>
        );
    }

    return (
        <StyleRootScrollbar>
            <StyleScrollbar clickOnTrack={false} sx={sx} {...other}>
                {children}
            </StyleScrollbar>
        </StyleRootScrollbar>
    )
}

export default memo(ScrollBar);