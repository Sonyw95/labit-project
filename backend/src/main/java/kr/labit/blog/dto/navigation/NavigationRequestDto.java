package kr.labit.blog.dto.navigation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NavigationRequestDto {

    @NotBlank(message = "메뉴 이름은 필수입니다")
    @Size(max = 100, message = "메뉴 이름은 100자를 초과할 수 없습니다")
    private String label;

    @Size(max = 255, message = "링크는 255자를 초과할 수 없습니다")
    private String href;

    private Long parentId;

    @Size(max = 50, message = "아이콘은 50자를 초과할 수 없습니다")
    private String icon;

    @Size(max = 500, message = "설명은 500자를 초과할 수 없습니다")
    private String description;

    private Boolean isActive = true;
}