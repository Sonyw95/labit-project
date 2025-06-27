import {alpha} from "@mui/material/styles";

export function backgroundBlur(properties){
    const color = properties.color || '#000000';
    const blur = properties.blur || 6;
    const opacity = properties.opacity || 0.3;
    const imageUrl = properties.imageUrl;

    if(imageUrl){
        return {
            position: 'relative',
            backgroundImage: `url(${imageUrl})`,
            '$:before': {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9,
                content: '""',
                width: '100%',
                height: '100%',
                backgroundFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                backgroundColor: alpha(color, opacity),
            },
        };
    }

    return {
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
    }
}