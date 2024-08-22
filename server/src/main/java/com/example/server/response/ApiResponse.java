package com.example.server.response;

import lombok.*;
import org.springframework.http.HttpStatus;


@RequiredArgsConstructor
@Data
@Builder
public class ApiResponse<T> {
    private final Integer status;
    private final String message;
    private final T data;


    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Success", data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), message, null);
    }

    public static <T> ApiResponse<T> error(String message, int status) {
        return new ApiResponse<>(status, message, null);
    }


}