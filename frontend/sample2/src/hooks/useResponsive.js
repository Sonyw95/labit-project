import {useMediaQuery, useTheme} from "@mui/material";


export default function useResponsive(query, start, end){
    const theme = useTheme();
    const mediaUp = useMediaQuery(theme.breakpoints.up(start));
    const mediaDown = useMediaQuery(theme.breakpoints.down(start));
    const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));
    const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

    if( query === 'up' ){
        return mediaUp;
    }else if( query === 'down' ){
        return mediaDown;
    }else if( query === 'between' ){
        return mediaBetween;
    }else {
        return mediaOnly;
    }
}

export function useWidth(){
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();

    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
}