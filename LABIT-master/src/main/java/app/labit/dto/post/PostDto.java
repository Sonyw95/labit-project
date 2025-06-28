package app.labit.dto.post;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Alias("PostDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data class PostDto {

    private String title;
    private String body;
    private String category;
    private String option;
    private String order;
    private String owner;
    private List<String> tags;
    private String headId;
    private String bodyId;
    private String regDate;
    private String fixYn;
    private int viewCount;
    private int commentsCount;
    private int page;
    private String image;
    private String editHeadId;

    private List<Comment> commentData;

    public @Data static class Comment{
        private String headId;
        private String commentId;
        private String parentsCommentId;
        private String owner;
        private String regDate;
        private String comment;
        private int reactions;
    }



}
