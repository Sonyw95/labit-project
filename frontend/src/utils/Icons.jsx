import * as icons from "@tabler/icons-react";
import {memo} from "react";

export const Icons = memo((props) => {
    const { icon, color = "gray", size = 6, stroke = 2, style } = props
    const Icon = icons[icon]
    return <Icon size={size} color={color} stroke={stroke} style={style} />
})