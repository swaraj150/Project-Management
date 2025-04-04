package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.exception.IllegalRoleException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.AddTeamsToProjectRequest;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.response.ProjectResponse;
import com.example.server.response.TeamResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final SecurityUtils securityUtils;
    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationService organizationService;
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final TeamService teamService;
    private final TaskService taskService;

    public boolean exists(@NonNull UUID projectId){
        return projectRepository.existsById(projectId);
    }


    public ProjectResponse createProject(@NonNull CreateProjectRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Organization organization=organizationRepository.findById(user.getOrganizationId())
                .orElseThrow(()->new EntityNotFoundException("Organization not found"));
        Project project=new Project();
        User projectManager=userService.loadUser(request.getProjectManagerId());
        // assuming he is already a project manager
        if(projectManager.getProjectRole()!=ProjectRole.PROJECT_MANAGER){
            log.error("User with userId {} is not a project manager",projectManager.getId());
            throw new IllegalRoleException("User with userId {} is not a project manager");
        }
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setProjectManagerId(user.getId());
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
    public void addTeam(@NonNull AddTeamsToProjectRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Project project=projectRepository.findById(request.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        for(UUID teamId:request.getTeamsIds()){
            Optional<Team> team=teamRepository.findById(teamId);
            if(team.isEmpty()){
                log.warn("Team with id: {} does not exist",teamId);
                continue;
            }
            project.getTeams().add(teamId);
            team.get().setProjectId(project.getId());
            team.get().getMemberIds().add(project.getProjectManagerId());
            teamRepository.save(team.get());
        }
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
//    public void addTeamsById(@NonNull List<UUID> teams){
//        User user= userService.loadUser(securityUtils.getCurrentUsername());
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
//            throw new UnauthorizedAccessException("User does not have the required authority");
//        }
//        for(UUID s:teams){
//            Team team=teamRepository.findById(s).orElseThrow(()->new EntityNotFoundException("Team not found"));
//            addTeam(team);
//        }
//    }

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
                .projectManager(project.getProjectManagerId())
                .startDate(project.getStartDate())
                .estimatedEndDate(project.getEstimatedEndDate())
                .endDate(project.getEndDate())
                .budget(project.getBudget())
                .completionStatus(project.getCompletionStatus())
                .teams(teams)
                .build();
    }

    public Set<ProjectResponse> loadAllProjectResponses(){
        OrganizationDTO organizationDTO = organizationService.loadOrganizationDTOByCurrentUser();
        Set<ProjectResponse> projectResponses=new HashSet<>();
        if(organizationDTO.getProjects()==null) return projectResponses;
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
            taskService.deleteTask(id);
        }
        project.getTasks().clear();
        project.getTeams().clear();
        projectRepository.save(project);

        projectRepository.delete(project);
    }




}
