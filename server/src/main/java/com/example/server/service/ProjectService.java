package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.ProjectDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.response.ProjectResponse;
import com.example.server.response.TeamResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final SecurityUtils securityUtils;
    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final TeamService teamService;
    public ProjectResponse createProject(@NonNull CreateProjectRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Organization organization=organizationRepository.findById(user.getOrganizationId())
                .orElseThrow(()->new EntityNotFoundException("Organization not found"));
        Project project=new Project();
        if(user.getProjectRole()==ProjectRole.PROJECT_MANAGER){
            project.setProjectManagerId(user.getId());
        }
        // else add a method addProjectManager
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setStartDate(LocalDate.now());
        project.setEstimatedEndDate(request.getEstimatedEndDate());
        project.setOrganizationId(user.getOrganizationId());
        projectRepository.save(project);
        organization.getProjects().add(project.getId());
        organizationRepository.save(organization);
        return loadProjectResponse(project.getId());
    }

    public void addTeam(@NonNull String name){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Team team=teamRepository.findByName(name).orElseThrow(()->new EntityNotFoundException("Team not found"));
        Project project=projectRepository.findByOrganization(user.getOrganizationId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        project.getTeams().add(team.getId());
        team.setProjectId(project.getId());
        teamRepository.save(team);
        projectRepository.save(project);
    }

    public ProjectResponse loadProjectResponse(@NonNull UUID projectId){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new EntityNotFoundException("Project not found"));
        Set<UUID> teamIds=new HashSet<>(projectRepository.findTeamsById(projectId));
        Set<TeamResponse> teams=new HashSet<>();
        for(UUID id:teamIds) {
            teams.add(teamService.loadTeam(id));
        }
        return ProjectResponse.builder()
                .id(projectId)
                .title(project.getTitle())
                .description(project.getDescription())
                .tasksIds(project.getTasks())
                .projectManager(UserDTO.mapToUserDTO(userService.loadUser(project.getProjectManagerId())))
                .startDate(project.getStartDate())
                .estimatedEndDate(project.getEstimatedEndDate())
                .endDate(project.getEndDate())
                .organizationId(project.getOrganizationId())
                .budget(project.getBudget())
                .completionStatus(project.getCompletionStatus())
                .teams(teams)
                .build();
    }
}
