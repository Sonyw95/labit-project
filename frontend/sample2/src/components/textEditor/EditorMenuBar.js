

import {ReactNodeViewRenderer, useCurrentEditor} from '@tiptap/react'
import React, {useState} from 'react'
import {
    Button,
    Container,
    Divider,
    Grid,
    Grid2,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import Icons from "../icon/icons";
import palette from "../../theme/palette";
import TextSelector from "./selector/text";



const StyleIconButton = styled(IconButton)({
    '&.is-active': {
        color: palette.primary.main,
    },
})
const StyleGrid = styled(Grid2)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
}))

export default function EditorMenuBar() {
    const { editor } = useCurrentEditor()

    if (!editor) {
        return null
    }else {
        editor.view.dom.style.margin = '0 16px 0 16px';
        editor.view.dom.style.outline = 'none';
    }

    return (
        <Grid2 container spacing={0} columns={16} sx={{ display: 'flex', justifyContent: 'center', borderBottom: '.1rem solid #ddd' }}>
            <StyleGrid xl={3} lg={3} >
                <Tooltip title="볼드체">
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        {<Icons icon={'lucide:bold'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title="이탤릭체">
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        {<Icons icon={'lucide:italic'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title="취소선">
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                    >
                        {<Icons icon={'lucide:strikethrough'}/>}
                    </StyleIconButton>
                </Tooltip>
            </StyleGrid>
            <Divider orientation="vertical" flexItem />

            <StyleGrid  xl={4} lg={4}>
                <TextSelector styledButton={StyleIconButton} editor={editor} />
            </StyleGrid>
            <Divider orientation="vertical" flexItem />

            <StyleGrid xl={2} lg={2}>
                <Tooltip title={"기호목록"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList', ) ? 'is-active' : ''}
                    >
                        {<Icons icon={'lucide:list'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title={"순서목록"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList', ) ? 'is-active' : ''}
                    >
                        {<Icons icon={'lucide:list-ordered'}/>}
                    </StyleIconButton>
                </Tooltip>
            </StyleGrid>

            <Divider orientation="vertical" flexItem />

            <StyleGrid xl={3} lg={3}>
                <Tooltip title={"코드블럭"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        {<Icons icon={'lucide:square-code'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title={"코드"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        {<Icons icon={'lucide:code'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title={"인용구"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        {<Icons icon={'lucide:quote'}/>}
                    </StyleIconButton>
                </Tooltip>
            </StyleGrid>

            <Divider orientation="vertical" flexItem />
            <StyleGrid xl={2} lg={2}>
                <Tooltip title={"되돌리기"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        {<Icons icon={'lucide:undo-2'}/>}
                    </StyleIconButton>
                </Tooltip>

                <Tooltip title={"실행취소"}>
                    <StyleIconButton
                        color={ palette.grey[900] }
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        {<Icons icon={'lucide:redo-2'}/>}
                    </StyleIconButton>
                </Tooltip>
            </StyleGrid>
        </Grid2>
        /*
        <div className="control-group">
            <div className="button-group">

                <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    Clear marks
                </button>
                <button onClick={() => editor.chain().focus().clearNodes().run()}>
                    Clear nodes
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'is-active' : ''}
                >
                    Paragraph
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Horizontal rule
                </button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                    Hard break
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                >
                    Redo
                </button>
                <button
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
                >
                    Purple
                </button>
            </div>
        </div>
        */
    )
}
