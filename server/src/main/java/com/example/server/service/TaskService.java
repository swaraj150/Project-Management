package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.entities.*;
import com.example.server.exception.InvalidStatusException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.TaskRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.CreateTaskRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.InvalidKeyException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final SecurityUtils securityUtils;

    public void createTask(CreateTaskRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Team team=teamRepository.findById(teamRepository.findTeamIdByUserId(user.getId())).orElseThrow(()->new EntityNotFoundException("Team not found"));
        Project project=projectRepository.findById(team.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));

        Task task=new Task();
        task.setTitle(request.getTitle());
        task.setDescription((request.getDescription()));
        task.setCreatedBy(user.getId());
        task.setCreatedAt(LocalDateTime.now());
        task.setPriority(request.getPriority());
        task.setEstimatedHours(request.getEstimatedHours());
        task.setParentTaskId(request.getParentTaskId());
        task.setProjectId(team.getProjectId());
        Set<UUID> assignedTo=new HashSet<>();
        for(String s:request.getAssignedTo()){
            assignedTo.add(userService.loadUser(s).getId());
        }

        task.setAssignedTo(assignedTo);
        task.setCompletionStatus(CompletionStatus.PENDING);
        project.getTasks().add(task.getId());
        projectRepository.save(project);
        taskRepository.save(task);
    }

//    public void changeStatus(@NonNull String status){
//        User user= userService.loadUser(securityUtils.getCurrentUsername());
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.EDIT_TASKS)){
//            throw new UnauthorizedAccessException("User does not have the required authority");
//        }
//        Task task=taskRepository.findById(taskRepository.getTaskIdByUser(user.getId()))
//                .orElseThrow(()->new EntityNotFoundException("Task not found"));
//        switch (status){
//            case "Pending" -> task.setCompletionStatus(CompletionStatus.PENDING);
//            case "In Progress" -> task.setCompletionStatus(CompletionStatus.IN_PROGRESS);
//            case "Completed" -> {
//                task.setCompletionStatus(CompletionStatus.COMPLETED);
//                task.setCompletedAt(LocalDateTime.now());
//            }
//            default -> throw new InvalidStatusException("Invalid Status");
//        }
//        taskRepository.save(task);
//    }

    public void addSubTask(CreateTaskRequest request){
        createTask(request);
    }





}
