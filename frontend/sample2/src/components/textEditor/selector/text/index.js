import React, {useState} from "react";
import palette from "../../../../theme/palette";
import {Menu, MenuItem} from "@mui/material";
import Icons from "../../../icon/icons";


export default function TextSelector({ styledButton, editor }) {
    const StyleBtn  = styledButton
    const list = [
        { value: 'p', icon: <Icons icon={'majesticons:paragraph-line'}/>, func: () => editor.chain().focus().setParagraph().run() } ,
        { value: '1', icon: <Icons icon={'lucide:heading-1'}/>, func: () => editor.chain().focus().toggleHeading({ level: 1}).run()},
        { value: '2', icon: <Icons icon={'lucide:heading-2'}/>, func: () => editor.chain().focus().toggleHeading({ level: 2}).run()},
        { value: '3', icon: <Icons icon={'lucide:heading-3'}/>, func: () => editor.chain().focus().toggleHeading({ level: 3}).run()},
        { value: '4', icon: <Icons icon={'lucide:heading-4'}/>, func: () => editor.chain().focus().toggleHeading({ level: 4}).run()},
        { value: '5', icon: <Icons icon={'lucide:heading-5'}/>, func: () => editor.chain().focus().toggleHeading({ level: 5}).run()},
    ]
    const [ textOpen, setTextOpen ] = useState(null );
    const handleTextOpen = (e) => {
        setTextOpen(e.currentTarget);
    }
    const handleTextClose = () => {
        setTextOpen(null);
    }
    const [ selectText, setSelectText] = useState(list[0]);
    const handleTextSelect = ( e ) => {
        setSelectText(e);
        e.func();
        handleTextClose();
    }
    return (
        <>
            <StyleBtn
                color={ palette.grey[900] }
                onClick={handleTextOpen}
                disableRipple
            >
                {selectText.icon}
            </StyleBtn>
            <Menu
                keepMounted
                anchorEl={textOpen}
                open={Boolean(textOpen)}
                onClose={handleTextClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {
                    list.map(
                        (option) => (
                            <MenuItem
                                key={option.value}
                                selected={option.value === selectText.value}
                                sx={{ typography: 'body2' }}
                                onClick={() => handleTextSelect(option)}
                            >
                                {option.icon}
                            </MenuItem>
                        ))
                }
            </Menu>
        </>
    )

}