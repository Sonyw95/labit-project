import {alpha} from "@mantine/core";

export function BackgroundBlur(props) {
    const blur = 6;
    const alphaPoint = props?.alpha || 0.3;
    const color = props.color;
    return{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, alphaPoint),
    }
}