package kr.labit.blog.dto;

import kr.labit.blog.entity.LabNavigation;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class NavigationResponseDto {

    private Long id;
    private String label;
    private String href;
    private Long parentId;
    private Integer sortOrder;
    private Integer depth;
    private String icon;
    private String description;
    private List<NavigationResponseDto> children;

    // Entity to DTO 변환 메서드
    public static NavigationResponseDto fromEntity(LabNavigation entity) {
        return NavigationResponseDto.builder()
                .id(entity.getId())
                .label(entity.getLabel())
                .href(entity.getHref())
                .parentId(entity.getParentId())
                .sortOrder(entity.getSortOrder())
                .depth(entity.getDepth())
                .icon(entity.getIcon())
                .description(entity.getDescription())
                .children(entity.getChildren() != null ?
                        entity.getChildren().stream()
                                .map(NavigationResponseDto::fromEntity)
                                .collect(Collectors.toList()) :
                        new ArrayList<>())
                .build();
    }
}
