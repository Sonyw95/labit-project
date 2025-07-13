package kr.labit.blog.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NavigationItemDto {
    private Long id;
    private String title;
    private String path;
    private String icon;
    private Integer orderIndex;
    private Boolean isActive;
    private List<NavigationItemDto> children;
}