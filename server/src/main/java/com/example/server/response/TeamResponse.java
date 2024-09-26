
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
public class TeamResponse {
    private UUID id;
    private String name;
    private UUID organization;
    private List<UserDTO> developers;
    private List<UserDTO> testers;
    private UserDTO teamLead;
}
