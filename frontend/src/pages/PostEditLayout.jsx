import {memo} from "react";
import PostEdit from "../components/blog/PostEdit.jsx";


const PostEditLayout = memo(() => {
    const handleSave = (postData) => {
        console.log('저장된 포스트:', postData);
    };

    const handlePreview = (postData) => {
        console.log('미리보기:', postData);
    };

    return (
        <PostEdit
            initialPost={null} // 새 포스트 작성
            onSave={handleSave}
            onPreview={handlePreview}
            navbarData={[
                { id: 'tech', label: '기술' },
                { id: 'tutorial', label: '튜토리얼' }
            ]}
        />
    );
})

export default PostEditLayout;