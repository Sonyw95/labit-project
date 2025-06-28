package app.labit.dto.post;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@Alias("CommentDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public @Data class CommentDto {
    private String headId;
    private String commentId;
    private String parentsCommentId;
    private String owner;
    private String regDate;
    private String comment;
    private int reactions;
}

