import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CodeBlock from "@tiptap/extension-code-block"

import {CodeBlock as ComponentCodeBlock, dracula} from "react-code-blocks";


const CustomCodeBlock = (props) => {
    debugger
    return (
        <NodeViewWrapper className="code-block">
            <ComponentCodeBlock text={'const test = Object.keys(a)'}
                                language='javascript'
                                showLineNumbers={false}
                                theme={dracula}/>
        </NodeViewWrapper>
    );
};


export default CodeBlock.extend({
    name: 'reactComponent',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            count: {
                default: 0,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'react-component',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['react-component', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomCodeBlock)
    },
})



