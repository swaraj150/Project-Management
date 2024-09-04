package com.example.server.controller;

import com.example.server.component.SecurityUtils;
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
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    private final PasswordResetService passwordResetService;

    private final SecurityUtils securityUtils;

    private static final Logger logger= LoggerFactory.getLogger(UserController.class);


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@RequestBody  RegisterRequest registerRequest) {
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

    @GetMapping("/")
    public ResponseEntity<ApiResponse<UserDTO>> getUser() {
        UserDTO userDTO = userService.getUser(securityUtils.getCurrentUsername());
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

}
