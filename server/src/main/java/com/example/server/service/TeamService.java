package com.example.server.service;

import com.example.server.component.RoleValidator;
import com.example.server.entities.Organization;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.Team;
import com.example.server.entities.User;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.TeamCreateRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationService organizationService;

    private final RoleValidator roleValidator;
    private final OrganizationRepository organizationRepository;


    public void createTeam(@NonNull TeamCreateRequest request){
        Organization org=organizationService.loadOrganization(request.getOrganizationId());
        User teamLead=userService.loadUser(request.getTeamLead());
        roleValidator.validaterRole(ProjectRole.TEAM_LEAD,teamLead);
        List<User> devs=new ArrayList<>();
        List<User> qas=new ArrayList<>();
        for(String user: request.getDev()){
            User dev=userService.loadUser(user);
            roleValidator.validaterRole(ProjectRole.DEVELOPER,dev);
            devs.add(dev);
        }
        for(String user: request.getQa()){
            User qa=userService.loadUser(user);
            roleValidator.validaterRole(ProjectRole.QA,qa);
            qas.add(qa);
        }
        Team team = new Team();
        team.setName(request.getName());
        team.setDevelopers(devs);
        team.setQA(qas);
        team.setTeamLead(teamLead);
        team.setOrganization(org);
        org.getTeams().add(team);
        organizationRepository.save(org);
        teamRepository.save(team);
    }
    

}
