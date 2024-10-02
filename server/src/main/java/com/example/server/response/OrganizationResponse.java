package com.example.server.response;

import com.example.server.dto.TeamDTO;
import com.example.server.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationResponse {
    private String name;
    private UserDTO productOwner;
//    private UserDTO projectManager;
    private List<UserDTO> stakeholders;
    private List<UserDTO> members;
    private String code;
    private Set<UUID> projects;

}
