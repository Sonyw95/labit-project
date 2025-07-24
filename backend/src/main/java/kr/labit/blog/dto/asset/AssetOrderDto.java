package kr.labit.blog.dto.asset;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetOrderDto {

    @NotNull(message = "ID는 필수입니다")
    private Long id;

    @NotNull(message = "정렬 순서는 필수입니다")
    private Integer sortOrder;

    private Long folderId;

    @NotNull(message = "타입은 필수입니다")
    private String type; // "file" or "folder"
}