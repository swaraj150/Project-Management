package com.example.server.service;


import com.example.server.dto.UserDTO;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.LoginRequest;
import com.example.server.requests.RegisterRequest;
import com.example.server.response.AuthResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Transactional
    public AuthResponse createUser(RegisterRequest registerRequest) {
        try {
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
        } catch (IllegalArgumentException e) {
            logger.error("Error creating user: {}", e.getMessage(), e);
            return AuthResponse.builder()
                    .msg("Error creating user: " + e.getMessage())
                    .error(true)
                    .build();
        } catch (Exception e) {
            logger.error("Unexpected error during user creation: {}", e.getMessage(), e);
            return AuthResponse.builder()
                    .msg("Unexpected error during user creation")
                    .error(true)
                    .build();
        }
    }


    public UserDTO getUser(String username){
        Optional<User> userOptional=userRepository.findByUsername(username);
        if(userOptional.isEmpty()){
            logger.warn("User not found: {}",username);
            throw new UsernameNotFoundException("User not found");
        }

        User user=userOptional.get();
        return UserDTO.mapToUserDTO(user);
    }

    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream().map(UserDTO::mapToUserDTO).collect(Collectors.toList());
        // for now, returning all the users
        // paging for efficiency for future
    }
    @Transactional
    public AuthResponse authenticate(LoginRequest request){
        try {
            UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword());
            authenticationManager.authenticate(authenticationToken);
            var user=userDetailsService.loadUserByUsername(request.getUsername());
            var jwtToken=jwtService.generateToken(user);
            return AuthResponse.builder()
                    .msg("Login Successful")
                    .token(jwtToken)
                    .build();
        }
        catch (Exception b){
            System.out.println(b.getLocalizedMessage());
            return AuthResponse.builder()
                    .msg("Error authenticating user: " + b.getMessage())
                    .error(true)
                    .build();
        }

    }



}
