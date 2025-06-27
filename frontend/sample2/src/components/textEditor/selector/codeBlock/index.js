import Icons from "../../../icon/icons";
import React from "react";


export default function CodeBlock({ styleButton }) {
    const list = [
        { value: 'p', icon: <Icons icon={'majesticons:paragraph-line'}/>, func: () => editor.chain().focus().setParagraph().run() } ,
        { value: '1', icon: <Icons icon={'lucide:heading-1'}/>, func: () => editor.chain().focus().toggleHeading({ level: 1}).run()},
        { value: '2', icon: <Icons icon={'lucide:heading-2'}/>, func: () => editor.chain().focus().toggleHeading({ level: 2}).run()},
        { value: '3', icon: <Icons icon={'lucide:heading-3'}/>, func: () => editor.chain().focus().toggleHeading({ level: 3}).run()},
        { value: '4', icon: <Icons icon={'lucide:heading-4'}/>, func: () => editor.chain().focus().toggleHeading({ level: 4}).run()},
        { value: '5', icon: <Icons icon={'lucide:heading-5'}/>, func: () => editor.chain().focus().toggleHeading({ level: 5}).run()},
    ]


    return(
        <>
        </>
    )
}