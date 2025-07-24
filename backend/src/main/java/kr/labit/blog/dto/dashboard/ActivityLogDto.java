package kr.labit.blog.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    private Long id;
    private String user;
    private String userId;
    private String action;
    private String description;
    private String status; // "success", "failed", "warning"
    private String ipAddress;
    private String userAgent;
    private LocalDateTime timestamp;
    private String resourceType; // "navigation", "asset", "post", "user"
    private Long resourceId;
    private String oldValue;
    private String newValue;
}