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
public class ErrorResponseDto {
    private LocalDateTime timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;
    private String trace;
}