package com.example.server.service;


import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.enums.Role;
import com.example.server.entities.User;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.pojo.GitHubUserInfo;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.*;
import com.example.server.response.AuthResponse;
import com.example.server.component.UserValidator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserValidator userValidator;

    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public void save(User user){
        userRepository.save(user);
    }
    public User loadUser(@NonNull String username){
        Optional<User> userOptional=userRepository.findByUsername(username);
        if(userOptional.isEmpty()){
            logger.warn("User not found: {}",username);
            throw new UsernameNotFoundException("User not found");
        }
        return userOptional.get();
    }
    public User loadAuthenticatedUser(){
        return loadUser(securityUtils.getCurrentUsername());
    }
    public User loadUser(@NonNull UUID id){
        Optional<User> userOptional=userRepository.findById(id);
        if(userOptional.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        return userOptional.get();
    }

    @Transactional
    public AuthResponse createUser(RegisterRequest registerRequest) {
        userValidator.validateRegisterRequest(registerRequest);
        User user = new User();
        String[] data = registerRequest.getName().split(" ");
        String username=data[0]+(data.length>1?"_"+data[1]:"_")+(int)(Math.random() * 9000 +1000) ;
        user.setFirstName(data[0]);
        user.setLastName(data.length == 1 ? null : data[1]);
        user.setUsername(username);
        user.getEmails().add(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER);
        user.setProjectRole(ProjectRole.DEFAULT_TEAM_MEMBER);
        user.setSkills(new HashSet<>());
        user.setDomain(new HashSet<>());
        userRepository.save(user);
        logger.info("User created: {}", user.getUsername());

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .status("200")
                .msg("User created successfully")
                .token(jwtToken)
                .user(UserDTO.mapToUserDTO(user))
                .build();

    }


    public UserDTO getUser(@NonNull String username){

        return UserDTO.mapToUserDTO(loadUser(username));
    }

    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream().map(UserDTO::mapToUserDTO).collect(Collectors.toList());
        // for now, returning all the users
        // paging for efficiency for future
    }
    @Transactional
    public AuthResponse authenticate(LoginRequest request){
            if (request.getUsername() == null || request.getPassword() == null) {
                logger.warn("Login attempt with null username or password");
                return AuthResponse.builder()
                        .msg("Username and password are required")
                        .build();
            }
            UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword());
            authenticationManager.authenticate(authenticationToken);
            var user=userDetailsService.loadUserByUsername(request.getUsername());
            var jwtToken=jwtService.generateToken(user);
            logger.info("User {} successfully authenticated", request.getUsername());
            return AuthResponse.builder()
                    .status("200")
                    .msg("Login Successful")
                    .token(jwtToken)
                    .user(UserDTO.mapToUserDTO((User) user))
                    .build();

    }
    public void updateProjectRole(ChangeUserRoleRequest request){

        User user1= loadUser(securityUtils.getCurrentUsername());
        if(!user1.getProjectRole().hasAuthority(ProjectAuthority.ACCEPT_MEMBERS)){
            throw new UnauthorizedAccessException("user does not have required authority");
        }
        User user2=loadUser(request.getUserId());
        String role=request.getRole().toLowerCase();
        switch (role) {
            case "project manager" -> user2.setProjectRole(ProjectRole.PROJECT_MANAGER);
            case "developer"->user2.setProjectRole(ProjectRole.DEVELOPER);
            case "qa"->user2.setProjectRole(ProjectRole.QA);
            case "team lead"->user2.setProjectRole(ProjectRole.TEAM_LEAD);
        }
        userRepository.save(user2);
    }

    public void updateProjectRole(String role,User user){


        switch (role) {
            case "Product Owner" -> user.setProjectRole(ProjectRole.PRODUCT_OWNER);
            case "Project Manager" -> user.setProjectRole(ProjectRole.PROJECT_MANAGER);
            case "Developer"->user.setProjectRole(ProjectRole.DEVELOPER);
            case "QA"->user.setProjectRole(ProjectRole.QA);
            case "Team Lead"->user.setProjectRole(ProjectRole.TEAM_LEAD);
            case "Stakeholder"->user.setProjectRole(ProjectRole.STAKEHOLDER);
        }
        userRepository.save(user);
    }

    public void updateProjectRole(ProjectRole role,User user){
        user.setProjectRole(role);
        userRepository.save(user);
    }

    public void addSkills(@NonNull AddSkillsToUserRequest request){
        User user=loadUser(securityUtils.getCurrentUsername());
        user.setSkills(request.getSkills());
        user.setDomain(request.getDomains());
        userRepository.save(user);
    }


    public UserDTO updateUser(UserProfileUpdateRequest request){
        User user=loadAuthenticatedUser();
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getUrl() != null) {
            user.setProfilePageUrl(request.getUrl());
        }
        if (request.getPhone() != null) {
            user.setPhoneNumber(request.getPhone());
        }

        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        if (request.getDob() != null) {
            user.setDob(LocalDate.parse(request.getDob(), DateTimeFormatter.ISO_DATE)); // Consider parsing if type is LocalDate
        }

        if (request.getAddressLine1() != null) {
            user.setAddressLine1(request.getAddressLine1());
        }

        if (request.getAddressLine2() != null) {
            user.setAddressLine2(request.getAddressLine2());
        }

        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }

        if (request.getCode() != null) {
            user.setCode(request.getCode());
        }

        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }

        if (request.getState() != null) {
            user.setState(request.getState());
        }
        userRepository.save(user);
        return UserDTO.mapToUserDTO(user);
    }



//    private String exchangeCodeForToken(String code) throws OAuth2AuthenticationException {
//        String tokenUrl = "https://github.com/login/oauth/access_token";
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        Map<String, String> requestBody = Map.of(
//                "client_id", GITHUB_CLIENT_ID,
//                "client_secret", GITHUB_CLIENT_SECRET,
//                "code", code
//        );
//
//        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
//
//        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
//        if (response.getStatusCode() == HttpStatus.OK) {
//            return extractAccessToken(Objects.requireNonNull(response.getBody()));
//        } else {
//            throw new OAuth2AuthenticationException("Failed to obtain access token");
//        }
////        try {
////        } catch (RestClientException e) {
////            throw new OAuth2AuthenticationException("Error during token exchange", e);
////        }
//    }
//
//    private String extractAccessToken(String responseBody) throws OAuth2AuthenticationException {
//        String[] pairs = responseBody.split("&");
//        for (String pair : pairs) {
//            String[] keyValue = pair.split("=");
//            if (keyValue.length == 2 && "access_token".equals(keyValue[0])) {
//                return keyValue[1];
//            }
//        }
//        throw new OAuth2AuthenticationException("Access token not found in the response");
//    }
//
//    private GitHubUserInfo fetchUserInfo(String accessToken) throws OAuth2AuthenticationException, JsonProcessingException {
//        String userInfoUrl = "https://api.github.com/user";
//        String emailUrl = "https://api.github.com/user/emails";
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBearerAuth(accessToken);
//        HttpEntity<String> request = new HttpEntity<>(headers);
//        ResponseEntity<String> userInfoResponse = restTemplate.exchange(
//                userInfoUrl,
//                HttpMethod.GET,
//                request,
//                String.class
//        );
//        GitHubUserInfo userInfo= objectMapper.readValue(userInfoResponse.getBody(), GitHubUserInfo.class);
//        ResponseEntity<String> emailResponse = restTemplate.exchange(
//                emailUrl,
//                HttpMethod.GET,
//                request,
//                String.class
//        );
//        List<GitHubUserInfo.GitHubEmail> emails = objectMapper.readValue(emailResponse.getBody(),
//                new TypeReference<List<GitHubUserInfo.GitHubEmail>>(){});
//
//        // Find primary email
//        String primaryEmail = emails.stream()
//                .filter(GitHubUserInfo.GitHubEmail::isPrimary)
//                .findFirst()
//                .map(GitHubUserInfo.GitHubEmail::getEmail)
//                .orElse(null);
//
//        userInfo.setEmail(primaryEmail);
//        return userInfo;
//
////        try {
////        } catch (HttpClientErrorException e) {
////            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
////                throw new HttpClientErrorException();
////            }
////            throw new OAuth2AuthenticationException("Error fetching user info", e);
////        } catch (IOException e) {
////            throw new OAuth2AuthenticationException("Error parsing user info", e);
////        }
//    }
//
//    private User processUser(GitHubUserInfo userInfo) {
//        String email = userInfo.getEmail();
//        String name = userInfo.getName();
//        String oauth2ClientName = "github";
//        String oauth2Id = String.valueOf(userInfo.getId());
//        return oAuth2UserService.processOAuthPostLogin(email, oauth2ClientName, oauth2Id, name);
//    }







}
