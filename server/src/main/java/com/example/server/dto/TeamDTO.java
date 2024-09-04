package com.example.server.dto;
import com.example.server.entities.Team;
import com.example.server.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamDTO {
    private UUID id;
    private String name;
    private UUID organizationId;
    private List<UUID> developerIds;
    private List<UUID> qaIds;
    private UUID teamLeadId;

    public static TeamDTO fromTeam(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setOrganizationId(team.getOrganizationId());
        dto.setTeamLeadId(team.getTeamLeadId());
        // developerIds and qaIds need to be set separately
        return dto;
    }

    public Team toTeam() {
        Team team = new Team();
        team.setId(this.id);
        team.setName(this.name);
        team.setOrganizationId(this.organizationId);
        team.setTeamLeadId(this.teamLeadId);
        return team;
    }
}
