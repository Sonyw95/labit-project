package kr.labit.blog.dto.asset;

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
public class AssetFolderRequestDto {

    @NotBlank(message = "폴더 이름은 필수입니다")
    @Size(max = 100, message = "폴더 이름은 100자를 초과할 수 없습니다")
    private String name;

    @Size(max = 500, message = "설명은 500자를 초과할 수 없습니다")
    private String description;

    private Long parentId;
}