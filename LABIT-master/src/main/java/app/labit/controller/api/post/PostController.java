package app.labit.controller.api.post;

import app.labit.Exceptions.NoDataException;
import app.labit.Exceptions.NothingWorkException;
import app.labit.dto.param.ParamDto;
import app.labit.dto.post.PostDto;
import app.labit.service.post.PostService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping(value="/api/post")
public class PostController {

    @Resource
    private PostService postService;

    @RequestMapping(value="/list")
    public Object listPost(@RequestBody PostDto postDto){

        return postService.selectListPost(postDto.getPage());
    }

    @RequestMapping(value = "/write")
    public String writePost(@RequestBody ParamDto paramDto){
        PostDto postDto = paramDto.getForm(PostDto.class);
        try {
            if(postDto.getEditHeadId() != null ){
                return postService.updateWritePost(postDto);
            }else{
                return postService.insertWritePost(postDto);
            }
        } catch (NothingWorkException e) {
            e.printStackTrace();
            return "FAIL";
        }
    }

    @RequestMapping(value = "/read/{headId}")
    public Object readPost(@PathVariable("headId") String headId){
        try {
            return postService.selectReadPost(headId);
        } catch (NoDataException e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @RequestMapping("/delete/{headId}")
    public Object deletePost(@PathVariable("headId") String headId){
        try {
            return postService.deletePost(headId);
        } catch (NothingWorkException e) {
            e.printStackTrace();
        }
        return false;
    }
}
