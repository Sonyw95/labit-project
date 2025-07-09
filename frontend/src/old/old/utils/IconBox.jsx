import {Icon} from "@iconify/react";


const Icons = ({icon, style, size}) => {
    return <Icon icon={icon} style={style} w={size} h={size}/>
}
// const IconBox = (({ icon, size= 20, style, ...other }) => (
//     // <Box component={Icon} icon={icon} w={size} h={size} style={ {...style}} {...other}/>
// ));


const IconBox = ({icon, size=20, style}) => {
    return <Icons icon={icon} size={size} style={style}/>
}
export default IconBox;