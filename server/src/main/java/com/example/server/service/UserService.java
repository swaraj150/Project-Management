package com.example.server.service;


import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import com.example.server.exception.InvalidPasswordException;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.LoginRequest;
import com.example.server.requests.RegisterRequest;
import com.example.server.response.AuthResponse;
import com.example.server.component.UserValidator;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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


    public User loadUser(@NonNull String username){
        Optional<User> userOptional=userRepository.findByUsername(username);
        if(userOptional.isEmpty()){
            logger.warn("User not found: {}",username);
            throw new UsernameNotFoundException("User not found");
        }
        return userOptional.get();
    }

    @Transactional
    public AuthResponse createUser(RegisterRequest registerRequest) {
        userValidator.validateRegisterRequest(registerRequest);

        User user = new User();
        String[] data = registerRequest.getName().split(" ");
        user.setFirstName(data[0]);
        user.setLastName(data.length == 1 ? null : data[1]);
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.USER);
        user.setProjectRole(ProjectRole.DEFAULT_TEAM_MEMBER);

        userRepository.save(user);
        logger.info("User created: {}", user.getUsername());

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .msg("User created successfully")
                .token(jwtToken)
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
                        .error(true)
                        .build();
            }
            UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword());
            authenticationManager.authenticate(authenticationToken);
            var user=userDetailsService.loadUserByUsername(request.getUsername());
            var jwtToken=jwtService.generateToken(user);
            logger.info("User {} successfully authenticated", request.getUsername());
            return AuthResponse.builder()
                    .msg("Login Successful")
                    .token(jwtToken)
                    .build();

    }
    // get dev,qa,projectmanager,etc;
    public void updateProjectRole(String role){

        User user= loadUser(securityUtils.getCurrentUsername());
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











}
