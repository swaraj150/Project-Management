package com.example.server.service;

import com.example.server.component.NotificationEvent;
import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.enums.*;
import com.example.server.exception.InvalidStatusException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.TaskRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.CreateTaskRequest;
import com.example.server.requests.WsTaskRequest;
import com.example.server.response.TaskResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    public TaskResponse createTask(CreateTaskRequest request){
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
        task.setType(TaskType.valueOf(request.getType()));
        task.setLevel(Level.valueOf(request.getLevel()));
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

        notificationService.createNotification(NotificationEvent.builder()
                        .message("Task created by "+ userService.loadUser(user.getId()).getUsername()+" at "+task.getCreatedAt())
                        .actorId(user.getId())
                        .userId(new ArrayList<>(task.getAssignedTo()))
                        .type(NotificationType.TASK_ASSIGNED)
                        .build());
        return loadTaskResponse(task.getId());
    }
    public Task createTask(WsTaskRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Team team=teamRepository.findById(teamRepository.findTeamIdByUserId(user.getId())).orElseThrow(()->new EntityNotFoundException("Team not found"));
        Project project=projectRepository.findById(team.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        Task task=new Task();
        task.setTitle(request.getTitle());
//        task.setDescription((request.getDescription()));
        task.setCreatedBy(user.getId());
        task.setCreatedAt(LocalDateTime.now());
        task.setPriority(request.getPriority());
        if(request.getTaskType()!=null) task.setType(TaskType.valueOf(request.getTaskType()));
        if(request.getLevel()!=null) task.setLevel(Level.valueOf(request.getLevel()));
        task.setEstimatedHours(request.getEstimatedHours());
        task.setParentTaskId(request.getParentTaskId());
        task.setProjectId(team.getProjectId());
        Set<UUID> assignedTo=new HashSet<>();
        if(request.getAssignedTo()!=null){
            for(String s:request.getAssignedTo()){
                assignedTo.add(userService.loadUser(s).getId());
            }

        }
        task.setAssignedTo(assignedTo);
        task.setCompletionStatus(CompletionStatus.PENDING);
        project.getTasks().add(task.getId());
        projectRepository.save(project);
        taskRepository.save(task);
//        notificationService.createNotification(NotificationEvent.builder()
//                        .message("Task created by "+ userService.loadUser(user.getId()).getUsername()+" at "+task.getCreatedAt())
//                        .actorId(user.getId())
//                        .userId(new ArrayList<>(task.getAssignedTo()))
//                        .type(NotificationType.TASK_ASSIGNED)
//                        .build());
//        return loadTaskResponse(task.getId());
        return task;
    }

//    Task findTaskByUser(@NonNull User user){
//        Optional<Task> task=taskRepository.findByCreatedBy(user.getId());
//        return task.orElseGet(() -> taskRepository.findByAssignedTo(user.getId()).orElseThrow(() -> new EntityNotFoundException("Task not found")));
//    }

    public TaskResponse changeStatus(@NonNull String status,@NonNull UUID id){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.EDIT_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        // findTaskByUser can be used here to further check if user has any access to task
        Task task=taskRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Task not found"));
        switch (status){
            case "Pending" -> task.setCompletionStatus(CompletionStatus.PENDING);
            case "In Progress" -> task.setCompletionStatus(CompletionStatus.IN_PROGRESS);
            case "Completed" -> {
                task.setCompletionStatus(CompletionStatus.COMPLETED);
                task.setCompletedAt(LocalDateTime.now());
            }
            default -> throw new InvalidStatusException("Invalid Status");
        }
        taskRepository.save(task);
        return loadTaskResponse(task.getId());
    }

    public void addSubTask(CreateTaskRequest request){
        createTask(request);
    }

    public TaskResponse loadTaskResponse(@NonNull UUID id){
        Task task=taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
//        Set<UserDTO> assignedToUsers=new HashSet<>();
//        for(UUID id1:task.getAssignedTo()){
//            User user=userService.loadUser(id);
//            UserDTO userDTO=UserDTO.mapToUserDTO(user);
//            assignedToUsers.add(userDTO);
//        }
        return TaskResponse.builder()
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .type(task.getType())
                .createdByUser(UserDTO.mapToUserDTO(userService.loadUser(task.getCreatedBy())))
//                .assignedToUsers(assignedToUsers)
                .createdAt(task.getCreatedAt())
                .estimatedHours(task.getEstimatedHours())
                .completedAt(task.getCompletedAt())
                .completionStatus(task.getCompletionStatus())
                .build();
    }

    public List<Task> getActiveTasksByUser(@NonNull UUID userId){
        return taskRepository.findTasksByStatusAndAssignedTo(CompletionStatus.IN_PROGRESS,userId);
    }
    public List<Task> getActiveTasksByUser(){
        return taskRepository.findTasksByStatusAndAssignedTo(CompletionStatus.PENDING,userService.loadAuthenticatedUser().getId());
    }

    public Task loadTask(UUID id){
        return taskRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Task not found"));
    }









}
