package kr.labit.blog.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatusDto {
    private String status; // "healthy", "warning", "error"
    private List<ServiceStatus> services;
    private ResourceUsage resources;
    private DatabaseStatus database;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceStatus {
        private String name;
        private String status;
        private String uptime;
        private String lastChecked;
        private String errorMessage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceUsage {
        private Integer cpu; // percentage
        private Integer memory; // percentage
        private Integer disk; // percentage
        private Integer network; // percentage
        private String diskSpace; // formatted string
        private String memoryUsage; // formatted string
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatabaseStatus {
        private String status;
        private Integer connectionCount;
        private Integer maxConnections;
        private Double responseTime; // milliseconds
        private String version;
    }
}
