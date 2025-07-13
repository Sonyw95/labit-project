package kr.labit.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NavigationDto {

    private Long id;

    @NotBlank(message = "메뉴명은 필수입니다")
    private String label;

    private String path;

    private String icon;

    private String description;

    @NotNull(message = "정렬 순서는 필수입니다")
    private Integer sortOrder;

    private Long parentId;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isVisible = true;

    private String requiredRole;

    private List<NavigationDto> children;

    // 트리 구조를 위한 메서드
    public boolean hasChildren() {
        return children != null && !children.isEmpty();
    }

    public boolean isRootMenu() {
        return parentId == null;
    }
}