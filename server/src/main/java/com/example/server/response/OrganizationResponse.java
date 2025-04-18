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
    private UUID id;
    private String name;
    private UUID productOwner;
    private Set<UUID> stakeholders;
    private Set<UUID> developers;
    private Set<UUID> testers;
    private Set<UUID> managers;
    private String code;
    private Set<UserDTO> members;
}
