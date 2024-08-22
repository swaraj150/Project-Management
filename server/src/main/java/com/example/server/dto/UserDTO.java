package com.example.server.dto;

import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private String name;
    private String username;
    private String email;
//    private String password;
    private Role role;
    private ProjectRole projectRole;

    public static UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .name(user.getFirstName() + " " + (user.getLastName()==null?"":user.getLastName()))
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .projectRole(user.getProjectRole())
                .build();
    }
}
