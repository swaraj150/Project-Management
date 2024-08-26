package com.example.server.controller;

import com.example.server.dto.UserDTO;
import com.example.server.exception.InvalidPasswordException;
import com.example.server.exception.InvalidTokenException;
import com.example.server.requests.EmailForForgotPasswordRequest;
import com.example.server.requests.LoginRequest;
import com.example.server.requests.RegisterRequest;
import com.example.server.requests.ResetPasswordRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.AuthResponse;
import com.example.server.service.PasswordResetService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    private final PasswordResetService passwordResetService;

    private static final Logger logger= LoggerFactory.getLogger(UserController.class);

    @GetMapping("/")
    public ResponseEntity<String> sayHello(){
        logger.info("request sayHello reached");
        return ResponseEntity.ok("Hello from secure endpoint");
    }
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@RequestBody  RegisterRequest registerRequest) {
        logger.info("Received register request for: {}", registerRequest.getUsername());
        AuthResponse authResponse = userService.createUser(registerRequest);
        if (authResponse == null) {
            logger.error("AuthResponse is null");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed"));
        }
        logger.info("Returning successful response");
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest){
        logger.info("Received login request for: {}", loginRequest.getUsername());
        AuthResponse authResponse = userService.authenticate(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserDTO>> getUser(@PathVariable @NonNull String username) {
        UserDTO userDTO = userService.getUser(username);
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> requestForForgotPassword(@RequestBody @NonNull EmailForForgotPasswordRequest request){
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Reset Password Link sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@RequestParam String token,ResetPasswordRequest request) {
        passwordResetService.resetPassword(token, request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Password Reset Successful"));
    }

    @PutMapping("/update-project-role")
    public ResponseEntity<ApiResponse<?>> updateProjectRole(@RequestParam String role) {
        userService.updateProjectRole(role);
        return ResponseEntity.ok(ApiResponse.success("Project role updated"));
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidTokenException(InvalidTokenException e) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(e.getMessage()));

    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidPasswordException(InvalidPasswordException e) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(e.getMessage(),HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(e.getMessage(),HttpStatus.BAD_REQUEST));
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleBadCredentialsException(BadCredentialsException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid Credentials",HttpStatus.UNAUTHORIZED));
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<String>> handleDisabledException(DisabledException e) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("User account disabled",HttpStatus.FORBIDDEN));
    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }
}
