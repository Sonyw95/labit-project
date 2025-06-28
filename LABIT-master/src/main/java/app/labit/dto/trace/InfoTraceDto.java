package app.labit.dto.trace;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@Alias("InfoTraceDto")
@EqualsAndHashCode(callSuper = false)
@JsonSerialize(include =  JsonSerialize.Inclusion.NON_NULL)
public @Data class InfoTraceDto {

    private String type;
    private String agent;
    private String referer;
}
