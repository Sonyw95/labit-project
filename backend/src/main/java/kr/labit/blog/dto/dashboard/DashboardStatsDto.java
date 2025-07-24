package kr.labit.blog.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private UserStats users;
    private PostStats posts;
    private AssetStats assets;
    private ViewStats views;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private Long total;
        private Double growth; // 전월 대비 증가율 (%)
        private Long newToday;
        private Long activeToday;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostStats {
        private Long total;
        private Double growth;
        private Long newToday;
        private Long publishedToday;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssetStats {
        private Long total;
        private Double growth;
        private Long totalSize; // bytes
        private Long uploadedToday;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ViewStats {
        private Long total;
        private Double growth;
        private Long today;
        private Long uniqueToday;
    }
}