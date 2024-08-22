package com.example.server.service;

import com.example.server.dto.UserDTO;
import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.RegisterRequest;
import com.example.server.response.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

//@SpringBootTest
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserValidator userValidator;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void createUser_Success() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setUsername("johndoe");
        registerRequest.setEmail("johndoe@example.com");
        registerRequest.setPassword("SecurePass1!");

        User user = new User();
        user.setUsername("johndoe");

        doNothing().when(userValidator).validateRegisterRequest(registerRequest);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(User.class))).thenReturn("mockJwtToken");

        AuthResponse response = userService.createUser(registerRequest);

        assertEquals("User created successfully", response.getMsg());
        assertFalse(response.isError());
        assertEquals("mockJwtToken", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_ValidationFailure() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setUsername("johndoe");
        registerRequest.setEmail("invalid-email");
        registerRequest.setPassword("password");

        doThrow(new IllegalArgumentException("Invalid email format"))
                .when(userValidator).validateRegisterRequest(registerRequest);

        AuthResponse response = userService.createUser(registerRequest);

        assertTrue(response.isError());
        assertEquals("Error creating user: Invalid email format", response.getMsg());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUser_Success() {
        String username = "johndoe";
        User user = new User();
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        UserDTO userDTO = userService.getUser(username);

        assertEquals(username, userDTO.getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void getUser_UserNotFound() {
        String username = "nonexistent";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.getUser(username));

        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void getAllUsers_Success() {
        List<User> users = new ArrayList<>();
        User user1 = new User();
        user1.setUsername("user1");
        User user2 = new User();
        user2.setUsername("user2");

        users.add(user1);
        users.add(user2);

        when(userRepository.findAll()).thenReturn(users);

        List<UserDTO> userDTOs = userService.getAllUsers();

        assertEquals(2, userDTOs.size());
        verify(userRepository, times(1)).findAll();
    }

}
