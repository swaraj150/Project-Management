package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.User;
import com.example.server.pojo.GoogleUserInfo;
import com.example.server.requests.*;
import com.example.server.response.ApiResponse;
import com.example.server.response.AuthResponse;
import com.example.server.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.JsonFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.hibernate.mapping.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.json.JsonFactory.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.*;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final PasswordResetService passwordResetService;

    private final SecurityUtils securityUtils;

    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    private final TokenBlacklistService tokenBlacklistService;
    
    private final RestTemplate restTemplate;
    private final CustomOAuth2UserService oAuth2UserService;

    private static final Logger logger= LoggerFactory.getLogger(UserController.class);



    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody  RegisterRequest registerRequest) {
        AuthResponse authResponse = userService.createUser(registerRequest);
        if (authResponse == null) {
            logger.error("AuthResponse is null");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed"));
        }
        logger.info("Returning successful response");
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("token",authResponse.getToken());
        h.put("user",authResponse.getUser());
        return ResponseEntity.ok(h);
    }
    @CrossOrigin("http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        logger.info("Received login request for: {}", loginRequest.getUsername());
        AuthResponse authResponse = userService.authenticate(loginRequest);
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("token",authResponse.getToken());
        h.put("user",authResponse.getUser());
        return ResponseEntity.ok(h);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/")
    public ResponseEntity<?> getUser() {
        String username=securityUtils.getCurrentUsername();
        UserDTO userDTO = userService.getUser(username);
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("user",userDTO);
        return ResponseEntity.ok(h);
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

    @GetMapping("/logout-user")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request) {
        String token=jwtService.extractToken(request);
        tokenBlacklistService.addToken(token);
        return ResponseEntity.ok(ApiResponse.success("Logout success"));


    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody GoogleOauthRequest googleOauthRequest) throws GeneralSecurityException, IOException {
        logger.info("google oauth access token: {}",googleOauthRequest.getAccessToken());
        String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?access_token=" + googleOauthRequest.getAccessToken();
        ResponseEntity<String> tokenInfoResponse = restTemplate.getForEntity(tokenInfoUrl, String.class);
        if (tokenInfoResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        String peopleApiUrl = "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleOauthRequest.getAccessToken());
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                peopleApiUrl,
                HttpMethod.GET,
                entity,
                String.class
        );
        GoogleUserInfo userInfo = objectMapper.readValue(userInfoResponse.getBody(), GoogleUserInfo.class);
        if(userInfo==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not extract the userinfo");

        }
        String email = oAuth2UserService.extractEmail(userInfo);
        String oauth2ClientName = "google";  // Since we're using Google OAuth
        String oauth2Id = oAuth2UserService.extractOAuth2Id(userInfo);
        String name=oAuth2UserService.extractName(userInfo);
        User user=oAuth2UserService.processOAuthPostLogin(email,oauth2ClientName,oauth2Id,name);
        String token = jwtService.generateToken(user);
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("token",token);
        h.put("user",UserDTO.mapToUserDTO(user));
        return ResponseEntity.ok(h);
    }





}
