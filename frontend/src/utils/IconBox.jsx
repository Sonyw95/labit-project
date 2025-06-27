import {forwardRef} from "react";
import {Icon} from "@iconify/react";
import {Box} from "@mantine/core";

const IconBox = forwardRef(({ icon, size= 20, style, ...other }, ref) => (
    <Box ref={ref} component={Icon} icon={icon} w={size} h={size} style={ {...style}} {...other}/>
));
export default IconBox;