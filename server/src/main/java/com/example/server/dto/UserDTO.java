package com.example.server.dto;

import com.example.server.enums.ProjectRole;
import com.example.server.enums.Role;
import com.example.server.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private UUID userId;
    private String name;
    private String username;
    private Set<String> emails;
//    private String password;
    private Role role;
    private ProjectRole projectRole;

    public static UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .userId(user.getId())
                .name(user.getFirstName() + (user.getLastName()==null?"":" "+user.getLastName()))
                .username(user.getUsername())
                .emails(user.getEmails())
                .role(user.getRole())
                .projectRole(user.getProjectRole())
                .build();
    }
}
