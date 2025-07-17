package kr.labit.blog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NavigationDto {
    private Long navId;
    private String navName;
    private String navUrl;
    private String navIcon;
    private Long parentId;
    private Integer navOrder;
    private Integer navLevel;
    private char isActive;
    private List<NavigationDto> children;
    private Boolean hasChildren;
    private Boolean isExpanded;
}
