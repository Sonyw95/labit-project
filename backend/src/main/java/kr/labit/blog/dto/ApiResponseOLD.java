package kr.labit.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseOLD<T> {
    private boolean success;
    private T data;
    private String message;
    private String code;

    public static <T> ApiResponseOLD<T> success(T data) {
        return ApiResponseOLD.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponseOLD<T> success(T data, String message) {
        return ApiResponseOLD.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponseOLD<T> error(String message, String code) {
        return ApiResponseOLD.<T>builder()
                .success(false)
                .message(message)
                .code(code)
                .build();
    }

    public static <T> ApiResponseOLD<T> error(String message) {
        return ApiResponseOLD.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}