import * as icons from "@tabler/icons-react";

export const Icons = (props) => {
    const { icon, color = "gray", size = 6, stroke = 2, style } = props
    const Icon = icons[icon]
    return <Icon width={size} color={color} stroke={stroke} style={style} />
}