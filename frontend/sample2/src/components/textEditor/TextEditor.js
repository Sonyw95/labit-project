
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import {EditorProvider, useCurrentEditor} from "@tiptap/react";
import EditorMenuBar from "./EditorMenuBar";
import {Checkbox, Container, Grid, Grid2, Input, InputLabel, Stack, styled, Typography} from "@mui/material";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import EditorCodeBlock from "./EditorCodeBlock";
import Selector from "../common/selector";
import './index.css';
import {NavLink, useNavigate} from "react-router-dom";
import Icons from "../icon/icons";
import {LoadingButton} from "@mui/lab";
import {Icon} from "@iconify/react";



const StyleEditor = styled(EditorProvider)({
    padding: '16px',
})

const StyleButtonGroup = () => {
    const { editor } = useCurrentEditor();

    const navigate = useNavigate(); //변수 할당시켜서 사용
    const onHandleCancel = () => {
        debugger
        // navigate(-1); // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
    };
    return (
        <>
            <Stack
                direction="row"
                spacing={12}
                sx={{
                    justifyContent: "flex-end",
                    alignItems: "baseline",
                }}
            >

                <LoadingButton  fullWidth startIcon={<Icons icon="icon-park-outline:write" />}  size="large" type="submit" variant="contained" >
                    작성
                </LoadingButton>

                <LoadingButton fullWidth startIcon={<Icons icon="iconoir:cancel" />} size="large" type="submit" variant="contained"  color={'inherit'} onClick={onHandleCancel}>
                    취소
                </LoadingButton>
            </Stack>
        </>
    )
}
export default function TextEditor(){
    const TAG_OPTIONS = [
        { value: '', text: '선택'},
        { value: 'aem', text: 'AEM' },
        { value: 'spring', text: 'Spring' }
    ]


    const extensions = [
        Bold,
        Italic,
        Strike,
        EditorCodeBlock,
        Heading.configure({
            levels: [1, 2, 3, 4, 5, 6]
        }),
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
            codeBlock: false,
            bulletList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
        }),
    ]

    return(
        <Container>
            <Grid2 container spacing={2}>
                <Grid2 size={12} sx={{
                    marginBottom: 1
                }}>
                    <InputLabel htmlFor="post-title">제목</InputLabel>
                    <Input
                        id="post-title"
                        sx={{
                            width: "100%",
                        }}
                    />
                </Grid2>

                <Grid2 size={4}   sx={{
                    marginBottom: 1
                }}>
                    <Selector options={TAG_OPTIONS} title={'주제'}/>
                    <Checkbox value="true" icon={<Icons icon='ph:push-pin' />} checkedIcon={<Icons icon='ph:push-pin-fill' />} />

                </Grid2>

                <Grid2 size={12}  sx={{border: ".1rem solid #ddd", padding: "0 0 !important "}}>
                    <StyleEditor  slotBefore={<EditorMenuBar />} extensions={extensions} ></StyleEditor>
                </Grid2>

                <Grid2 size={12}  xs={12} sx={{
                    marginBottom: 1
                }}>
                 <StyleButtonGroup/>
                </Grid2>

            </Grid2>
        </Container>
    )

}