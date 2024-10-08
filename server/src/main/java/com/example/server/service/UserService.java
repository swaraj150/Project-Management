package com.example.server.service;


import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.ProjectAuthority;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import com.example.server.exception.AccountConflictException;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
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







}
