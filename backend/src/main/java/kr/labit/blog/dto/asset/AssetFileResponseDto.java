package kr.labit.blog.dto.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetFileResponseDto {
    private Long id;
    private String name;
    private String originalName;
    private String url;
    private String mimeType;
    private Long size;
    private Long folderId;
    private Integer sortOrder;
    private LocalDateTime uploadedDate;
    private String type = "file";
    private String uploaderName;
    private String description;
}