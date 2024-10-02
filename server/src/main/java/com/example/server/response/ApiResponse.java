package com.example.server.response;

import lombok.*;
import org.springframework.http.HttpStatus;


@RequiredArgsConstructor
@Data
@Builder
public class ApiResponse<T> {
    private final String status;
    private final String message;
    private final T data;


    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("200", "",data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("500", "",null);
    }

    public static <T> ApiResponse<T> error(String message, HttpStatus status) {
        return new ApiResponse<>(String.valueOf(status.value()),message, null);
    }


}