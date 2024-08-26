package com.example.server.controller;

import com.example.server.dto.UserDTO;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.requests.RegisterRequest;
import com.example.server.response.AuthResponse;
import com.example.server.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

//    @MockBean
    @Mock
    private UserService userService;

    @InjectMocks
//    @Autowired
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }
    @Test
    void healthCheck_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/users/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("API is running"));
    }

    @Test
    void sayHello_ReturnsHelloMessage() throws Exception {
        mockMvc.perform(get("/api/v1/users/"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello from secure endpoint"));
    }

    @Test
    void registerUser_ReturnsSuccess() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setUsername("johndoe");
        registerRequest.setEmail("johndoe@example.com");
        registerRequest.setPassword("SecurePass1!");

        AuthResponse authResponse = AuthResponse.builder()
                .msg("User created successfully")
                .token("mockJwtToken")
                .build();

        when(userService.createUser(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"John Doe\", \"username\": \"johndoe\", \"email\": \"johndoe@example.com\", \"password\": \"SecurePass1!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.msg").value("User created successfully"))
                .andExpect(jsonPath("$.data.token").value("mockJwtToken"));
    }

    @Test
    void getAllUsers_ReturnsListOfUsers() throws Exception {
        List<UserDTO> userDTOs = new ArrayList<>();
        UserDTO user1=UserDTO.builder().name("user1").username("user1_2").email("user1@example.com").role(Role.USER).projectRole(ProjectRole.DEFAULT_TEAM_MEMBER).build();
        UserDTO user2=UserDTO.builder().name("user2").username("user1_3").email("user2@example.com").role(Role.USER).projectRole(ProjectRole.DEFAULT_TEAM_MEMBER).build();

        userDTOs.add(user1);
        userDTOs.add(user2);

        when(userService.getAllUsers()).thenReturn(userDTOs);

        mockMvc.perform(get("/api/v1/users/getAllUsers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].username").value("user1"))
                .andExpect(jsonPath("$.data[1].username").value("user2"));
    }

    @Test
    void getUser_ReturnsUserDTO() throws Exception {
        UserDTO userDTO=UserDTO.builder().name("John Doe").username("johndoe").email("johndoe@example.com").role(Role.USER).projectRole(ProjectRole.DEFAULT_TEAM_MEMBER).build();

        when(userService.getUser("johndoe")).thenReturn(userDTO);

        mockMvc.perform(get("/api/v1/users/johndoe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("johndoe"))
                .andExpect(jsonPath("$.data.firstName").value("John"))
                .andExpect(jsonPath("$.data.lastName").value("Doe"))
                .andExpect(jsonPath("$.data.email").value("johndoe@example.com"));
    }

    @Test
    void handleException_ReturnsInternalServerError() throws Exception {
        when(userService.getUser("nonexistent")).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/v1/users/nonexistent"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("An unexpected error occurred"));
    }
}
