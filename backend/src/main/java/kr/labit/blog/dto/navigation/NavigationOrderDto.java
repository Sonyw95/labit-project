package kr.labit.blog.dto.navigation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NavigationOrderDto {

    @NotNull(message = "ID는 필수입니다")
    private Long id;

    @NotNull(message = "정렬 순서는 필수입니다")
    private Integer sortOrder;

    private Long parentId;
}