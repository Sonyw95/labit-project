package app.labit.service.post;

import app.labit.Exceptions.NoDataException;
import app.labit.Exceptions.NothingWorkException;
import app.labit.dao.DatabaseDao;
import app.labit.dto.post.PostDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PostService {

    @Resource
    private DatabaseDao databaseDao;

    public Object selectListPost(int index){

        index = (index-1) * 10 ;
        int lastPage = (int) databaseDao.execSelect("PostMapper", "selectLastPage", index);
        List<PostDto> postList = (List<PostDto>) databaseDao.execSelectList("PostMapper", "selectPostList", index);
        Map<String, Object> map = new HashMap<>();
        map.put("lastPage", lastPage);
        map.put("post",postList);
        return map;
    }

    @Transactional
    public Object deletePost(String headId) throws NothingWorkException {
        int result = 0;
        result = databaseDao.execInsert("PostMapper", "deletePostHead", headId);
        result = databaseDao.execInsert("PostMapper", "deletePostBody", headId);
        result = databaseDao.execInsert("PostMapper", "deletePostTags", headId);
        result = databaseDao.execInsert("PostMapper", "deletePostComments", headId);

        return true;
    }

    @Transactional
    public String insertWritePost(PostDto postDto) throws NothingWorkException {
        String headId = (String) databaseDao.execSelect("PostMapper","selectPostHeadId", postDto);
        String bodyId = (String) databaseDao.execSelect("PostMapper","selectPostBodyId", postDto);

        postDto.setHeadId(headId);
        postDto.setBodyId(bodyId);

        int result = 0;
        result = databaseDao.execInsert("PostMapper", "insertWritePostHead", postDto);
        result = databaseDao.execInsert("PostMapper", "insertWritePostBody", postDto);
        result = databaseDao.execInsert("PostMapper", "insertPostTags", postDto);
        if(result == 0){
            throw new NothingWorkException();
        }else{
            return headId;
        }
    }

    @Transactional
    public String updateWritePost(PostDto postDto) throws NothingWorkException {
        int result = 0;
        result = databaseDao.execUpdate("PostMapper", "updatePostHead", postDto);
        result = databaseDao.execUpdate("PostMapper", "updatePostBody", postDto);
        result = databaseDao.execUpdate("PostMapper", "deletePostTags", postDto);
        result = databaseDao.execUpdate("PostMapper", "insertPostTags", postDto);
        if(result == 0){
            throw new NothingWorkException();
        }else{
            return postDto.getEditHeadId();
        }
    }

    public Object selectReadPost(String headId) throws NoDataException {
        PostDto postDto = (PostDto) databaseDao.execSelect("PostMapper", "selectReadPost", headId);
        if(postDto == null){
            throw new NoDataException("해당 게시글이 존재하지 않습니다.");
        }else{
            postDto.setTags((List<String>) databaseDao.execSelectList("PostMapper", "selectReadPostTags", headId));
            postDto.setCommentData((List<PostDto.Comment>) databaseDao.execSelectList("PostMapper", "selectReadPostComment", headId));
            return postDto;
        }
    }

}
