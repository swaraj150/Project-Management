package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
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
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final SecurityUtils securityUtils;
    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationService organizationService;
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final TeamService teamService;
    private final TaskService taskService;
    public ProjectResponse createProject(@NonNull CreateProjectRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Organization organization=organizationRepository.findById(user.getOrganizationId())
                .orElseThrow(()->new EntityNotFoundException("Organization not found"));
        Project project=new Project();
        if(user.getProjectRole()== ProjectRole.PROJECT_MANAGER){
            project.setProjectManagerId(user.getId());
        }
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setStartDate(LocalDate.now());
        project.setEstimatedEndDate(request.getEstimatedEndDate());
        project.setOrganizationId(user.getOrganizationId());
        project.setCompletionStatus(CompletionStatus.PENDING);
        projectRepository.save(project);
        organization.getProjects().add(project.getId());
        organizationRepository.save(organization);
        return loadProjectResponse(project.getId());
    }

    Project loadProject(@NonNull UUID id){
        return projectRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Project not found"));

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
        team.getMemberIds().add(project.getProjectManagerId());
        teamRepository.save(team);
        projectRepository.save(project);
    }
    public void addTeam(@NonNull Team team){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Project project=projectRepository.findByOrganization(user.getOrganizationId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        project.getTeams().add(team.getId());
        team.setProjectId(project.getId());
        team.getMemberIds().add(project.getProjectManagerId());
        teamRepository.save(team);
        projectRepository.save(project);
    }
    public void addTeamsByName(@NonNull List<String> teams){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        for(String s:teams){
            addTeam(s);
        }
    }
    public void addTeamsById(@NonNull List<UUID> teams){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        for(UUID s:teams){
            Team team=teamRepository.findById(s).orElseThrow(()->new EntityNotFoundException("Team not found"));
            addTeam(team);
        }
    }

    public ProjectResponse loadProjectResponse(@NonNull UUID projectId){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new EntityNotFoundException("Project not found"));
        Set<UUID> teamIds=new HashSet<>(projectRepository.findTeamsById(projectId));
        Set<TeamResponse> teams=new HashSet<>();
        for(UUID id:teamIds) {
            teams.add(teamService.loadTeamResponse(id));
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

    public Set<ProjectResponse> loadAllProjectResponses(){
        OrganizationDTO organizationDTO = organizationService.loadOrganizationDTOByCurrentUser();
        Set<ProjectResponse> projectResponses=new HashSet<>();
        for(UUID id1:organizationDTO.getProjects()){
            projectResponses.add(loadProjectResponse(id1));
        }
        return projectResponses;
    }

    public List<Map<String,Object>> suggestTeams(@NonNull UUID projectId){
        Project project=projectRepository.findById(projectId).orElseThrow(()->new EntityNotFoundException("Project not found"));
        return teamService.suggestTeams(projectId,project.getTeams());
    }


    public void deleteProject(UUID projectId){


        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.DELETE_PROJECT)){
            throw new UnauthorizedAccessException("User doesn't have required authority");
        }
        Project project=loadProject(projectId);
        Organization organization=organizationService.loadOrganization(user.getOrganizationId());
        organization.getProjects().remove(projectId);
        organization.getTeams().removeAll(project.getTeams());
        organizationRepository.save(organization);
        for(UUID id:project.getTasks()){
            taskService.deleteTask(id,projectId);
        }
        project.getTasks().clear();
        project.getTeams().clear();
        projectRepository.save(project);

        projectRepository.delete(project);
    }




}
