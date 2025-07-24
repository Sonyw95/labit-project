package kr.labit.blog.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetFolderResponseDto {
    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private Integer sortOrder;
    private Integer depth;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String type = "folder";
    private Integer fileCount;
    private List<AssetFolderResponseDto> children;
}