package com.example.server.service;

import com.example.server.component.RoleValidator;
import com.example.server.component.SecurityUtils;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.TeamDTO;
import com.example.server.entities.*;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.TeamCreateRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationService organizationService;
    private final SecurityUtils securityUtils;
    private final RoleValidator roleValidator;
    private final OrganizationRepository organizationRepository;

    public TeamDTO createTeamDto(UUID id){
        Team team=teamRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Entity not found"));
        return TeamDTO.builder()
                .name(team.getName())
                .organizationId(team.getOrganizationId())
                .teamLeadId(team.getTeamLeadId())
                .developerIds(teamRepository.findDevsById(team.getId()))
                .qaIds(teamRepository.findQAsById(team.getId()))
                .build();

    }

    public void createTeam(@NonNull TeamCreateRequest request){
        User user1=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user1.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        OrganizationDTO org=organizationService.createOrganizationDTO(user1.getOrganizationId());
        User teamLead=userService.loadUser(request.getTeamLead());
        Set<UUID> members=new HashSet<>();
        members.add(teamLead.getId());
        for(String user: request.getDev()){
            User dev=userService.loadUser(user);
            userService.updateProjectRole(ProjectRole.DEVELOPER,dev);
            members.add(dev.getId());
            userRepository.save(dev);
        }
        for(String user: request.getQa()){
            User qa=userService.loadUser(user);
            userService.updateProjectRole(ProjectRole.QA,qa);
            members.add(qa.getId());
            userRepository.save(qa);
        }
        Team team = new Team();
        team.setName(request.getName());
        team.setTeamLeadId(teamLead.getId());
        team.setOrganizationId(org.getId());
        team.setMemberIds(members);
        teamRepository.save(team);
    }
    

}
