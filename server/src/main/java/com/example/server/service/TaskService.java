package com.example.server.service;

import com.example.server.component.NotificationEvent;
import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.enums.*;
import com.example.server.exception.InvalidStatusException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.DependencyRepository;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.TaskRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.CreateTaskRequest;
import com.example.server.requests.WsTaskRequest;
import com.example.server.response.TaskResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final DependencyRepository dependencyRepository;

    public TaskResponse createTask(CreateTaskRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Project project=projectRepository.findById(user.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
//        Team team=teamRepository.findById(teamRepository.findTeamIdByUserId(user.getId())).orElseThrow(()->new EntityNotFoundException("Team not found"));
        Task task=new Task();
        task.setTitle(request.getTitle());
        task.setDescription((request.getDescription()));
        task.setCreatedBy(user.getId());
        task.setCreatedAt(LocalDateTime.now());
        task.setPriority(Priority.valueOf(request.getPriority()));
        task.setType(TaskType.valueOf(request.getType()));
        task.setLevel(Level.valueOf(request.getLevel()));
        task.setEstimatedDays(request.getEstimatedDays());
        task.setParentTaskId(request.getParentTaskId());
        task.setProjectId(project.getId());
//        task.setStartDate(request.getStartDate());
//        task.setEndDate(request.getEndDate());

        if(request.getStartDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getStartDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setStartDate(localDateTime);
        }
        if(request.getEndDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getEndDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setEndDate(localDateTime);
        }
        task.setProgress(0);
        Set<UUID> assignedTo=new HashSet<>();
        for(String s:request.getAssignedTo()){
            assignedTo.add(userService.loadUser(s).getId());
        }
        task.setAssignedTo(assignedTo);
        task.setCompletionStatus(CompletionStatus.PENDING);
        taskRepository.save(task);
        project.getTasks().add(task.getId());
        projectRepository.save(project);

//        notificationService.createNotification(NotificationEvent.builder()
//                        .message("Task created by "+ userService.loadUser(user.getId()).getUsername()+" at "+task.getCreatedAt())
//                        .actorId(user.getId())
//                        .userId(new ArrayList<>(task.getAssignedTo()))
//                        .type(NotificationType.TASK_ASSIGNED)
//                        .build());
        return loadTaskResponse(task.getId());
    }
    public Task createTask(WsTaskRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Project project=projectRepository.findById(user.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        Task task=new Task();
        Optional.ofNullable(request.getTitle())
                        .ifPresent(task::setTitle);
        Optional.ofNullable(request.getDescription())
                .ifPresent(task::setDescription);
//        task.setDescription((request.getDescription()));
        task.setCreatedBy(user.getId());
        task.setCreatedAt(LocalDateTime.now());
        Optional.ofNullable(request.getTaskType())
                .map(String::toUpperCase)
                .map(TaskType::valueOf)
                .ifPresent(task::setType);

        Optional.ofNullable(request.getPriority())
                .map(Priority::valueOf)
                .ifPresent(task::setPriority);

        Optional.ofNullable(request.getLevel())
                .map(Level::valueOf)
                .ifPresent(task::setLevel);

        Optional.ofNullable(request.getStatus())
                .map(String::toUpperCase)
                .map(CompletionStatus::valueOf)
                .ifPresentOrElse(task::setCompletionStatus,()->task.setCompletionStatus(CompletionStatus.PENDING));

        Optional.ofNullable(request.getProgress())
                .ifPresent(task::setProgress);

        if(request.getStartDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getStartDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setStartDate(localDateTime);
        }
        if(request.getEndDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getEndDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setEndDate(localDateTime);
        }
//        Optional.ofNullable(request.getEndDate())
//                .ifPresent(task::setEndDate); // achieved at

        Optional.ofNullable(request.getEstimatedDays())
                .map(Integer::valueOf)
                .ifPresent(task::setEstimatedDays);

        Optional.ofNullable(request.getParentTaskId())
                .map(UUID::fromString)
                .ifPresentOrElse(
                        task::setParentTaskId,
                        () -> task.setParentTaskId(null)
                );
        Optional.ofNullable(request.getProjectId())
                .ifPresent(task::setProjectId);


        Set<UUID> assignedTo=new HashSet<>();
        if(request.getAssignedTo()!=null){
            for(String s:request.getAssignedTo()){
                assignedTo.add(userService.loadUser(s).getId());
            }

        }
        task.setAssignedTo(assignedTo);
        taskRepository.save(task);
        project.getTasks().add(task.getId());
        projectRepository.save(project);
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
    public void changeStatus(@NonNull String status,@NonNull Task task){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.EDIT_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        // findTaskByUser can be used here to further check if user has any access to task
        switch (status){
            case "pending" -> task.setCompletionStatus(CompletionStatus.PENDING);
            case "in_progress" -> task.setCompletionStatus(CompletionStatus.IN_PROGRESS);
            case "completed" -> {
                task.setCompletionStatus(CompletionStatus.COMPLETED);
                task.setCompletedAt(LocalDateTime.now());
            }
            default -> throw new InvalidStatusException("Invalid Status");
        }
        // check if this change affects any dependees or dependents

//        List<Dependency> dependenciesList=task.getDependencies();
//        for(Dependency dependency:dependenciesList){
//            if(!validateDependency(task.getId(),dependency.getDependentTaskId(),dependency.getDependencyType())){
//                log.error("{} dependency between {} and {} is invalid", dependency.getDependencyType(), task.getId(), dependency.getDependentTaskId());
//                throw new InvalidDependencyException("Invalid dependency");
//            }
//        }

        taskRepository.save(task);
    }

    public void addSubTask(CreateTaskRequest request){
        createTask(request);
    }

    public TaskResponse loadTaskResponse(@NonNull UUID id){
        Task task=taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        Set<UserDTO> assignedToUsers=new HashSet<>();
        for(UUID id1:task.getAssignedTo()){
            User user=userService.loadUser(id1);
            UserDTO userDTO=UserDTO.mapToUserDTO(user);
            assignedToUsers.add(userDTO);
        }
        List<Dependency> dependencies=dependencyRepository.findByFromTaskId(id);

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .type(task.getType())
                .createdByUser(UserDTO.mapToUserDTO(userService.loadUser(task.getCreatedBy())))
                .assignedToUsers(assignedToUsers)
                .createdAt(task.getCreatedAt())
                .estimatedDays(task.getEstimatedDays())
                .completedAt(task.getCompletedAt())
                .startDate(task.getStartDate())
                .endDate(task.getEndDate())
                .completionStatus(task.getCompletionStatus())
                .parentTaskId(task.getParentTaskId())
                .dependencies(dependencies)
                .progress(task.getProgress())
//                .subTasks(loadSubTasks(task.getId()).stream().map(this::loadTaskResponse).collect(Collectors.toList()))
                .build();
    }
    public TaskResponse loadTaskResponse(@NonNull UUID id,String clientId){
        Task task=taskRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Task not found"));
        Set<UserDTO> assignedToUsers=new HashSet<>();
        for(UUID id1:task.getAssignedTo()){
            User user=userService.loadUser(id1);
            UserDTO userDTO=UserDTO.mapToUserDTO(user);
            assignedToUsers.add(userDTO);
        }
        List<Dependency> dependencies=dependencyRepository.findByFromTaskId(id);
        return TaskResponse.builder()
                .id(task.getId())
                .clientTaskId(clientId)
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .type(task.getType())
                .createdByUser(UserDTO.mapToUserDTO(userService.loadUser(task.getCreatedBy())))
                .assignedToUsers(assignedToUsers)
                .createdAt(task.getCreatedAt())
                .estimatedDays(task.getEstimatedDays())
                .completedAt(task.getCompletedAt())
                .startDate(task.getStartDate())
                .endDate(task.getEndDate())
                .completionStatus(task.getCompletionStatus())
                .parentTaskId(task.getParentTaskId())
                .dependencies(dependencies)
                .progress(task.getProgress())
//                .dependencies(task.getDependencies())
//                .subTasks(loadSubTasks(task.getId()).stream().map(this::loadTaskResponse).collect(Collectors.toList()))
                .build();
    }

    public List<Task> getActiveTasksByUser(@NonNull UUID userId,@NonNull UUID projectId){
        return taskRepository.findTasksByStatusAndAssignedTo(CompletionStatus.IN_PROGRESS,userId,projectId);
    }
    public List<UUID> getActiveTaskIdsByUser(@NonNull UUID userId,@NonNull UUID projectId){
        return taskRepository.findTaskIdsByStatusAndAssignedTo(CompletionStatus.IN_PROGRESS,userId,projectId);
    }

    public List<UUID> getAllTaskIdsByUser(@NonNull UUID userId,@NonNull UUID projectId){
        return taskRepository.findTaskIdsByStatusAndAssignedTo(CompletionStatus.IN_PROGRESS,userId,projectId);
    }
    public List<Task> getTasksByUser(@NonNull UUID userId,@NonNull UUID projectId){
        return taskRepository.findByAssignedTo(userId,projectId);
    }
    public List<Task> getCompletedTasksByUser(@NonNull UUID userId,@NonNull UUID projectId){
        return taskRepository.findTasksByStatusAndAssignedTo(CompletionStatus.COMPLETED,userId,projectId);
    }
    public List<Task> getActiveTasksByUser(@NonNull UUID projectId){
        return taskRepository.findTasksByStatusAndAssignedTo(CompletionStatus.PENDING,userService.loadAuthenticatedUser().getId(),projectId);
    }

    public Task loadTask(UUID id){
        return taskRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Task not found"));
    }

    public List<UUID> loadSubTasks(@NonNull UUID parentId){
        return taskRepository.findByParentId(parentId);
    }

    public List<TaskResponse> getTasksByOrganization(){
        User user=userService.loadAuthenticatedUser();
        Project project=projectRepository.findByOrganization(user.getOrganizationId()).orElseThrow(()->new EntityNotFoundException("project not found"));
        List<TaskResponse> taskResponses=new ArrayList<>();
        for(UUID taskId:project.getTasks()){
            Task task=loadTask(taskId);
            if(task.getParentTaskId()!=null) continue;
            TaskResponse taskResponse=loadNestedTasks(taskId);
            taskResponses.add(taskResponse);
        }
        return taskResponses;

    }

    public List<TaskResponse> getTasksByProject(@NonNull UUID projectId){
        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Project project=projectRepository.findById(projectId).orElseThrow(()->new EntityNotFoundException("Project not found"));
        List<TaskResponse> taskResponses=new ArrayList<>();
        for(UUID taskId:project.getTasks()){
            Task task=loadTask(taskId);
            if(task.getParentTaskId()!=null) continue;
            TaskResponse taskResponse=loadNestedTasks(taskId);
            taskResponses.add(taskResponse);
        }
        return taskResponses;
    }
    public List<Task> getTasksByProject(){
        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        List<Task> taskResponses=new ArrayList<>();
        if(user.getProjectId()==null){
            return taskResponses;
        }
        Project project=projectRepository.findById(user.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        for(UUID taskId:project.getTasks()){
            Task task=loadTask(taskId);
            taskResponses.add(task);
        }
        return taskResponses;
    }

    public TaskResponse loadNestedTasks(UUID taskId){
        List<UUID> subTasks=loadSubTasks(taskId);
        TaskResponse taskResponse=loadTaskResponse(taskId);
        for(UUID id:subTasks){
            TaskResponse subTask=loadNestedTasks(id);
            if(subTask!=null){
                if(taskResponse.getSubTasks()==null){
                    taskResponse.setSubTasks(new ArrayList<>());
                }
                taskResponse.getSubTasks().add((subTask));
            }
        }
        return taskResponse;
    }
    


    public Integer getNoOfTasksWithStatus(CompletionStatus completionStatus){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        return taskRepository.getTaskCountByStatus(completionStatus,user.getOrganizationId());
    }
    public Integer getNoOfTasksWithStatus(CompletionStatus completionStatus,UUID projectId){
        return taskRepository.getTaskCountByStatusWithinProject(completionStatus,projectId);
    }
    public Integer getNoOfTasksWithPriority(Priority priority,UUID projectId){
        return taskRepository.getTaskCountByPriorityWithinProject(priority,projectId);
    }

    public Integer getTaskCount(UUID projectId){
        return taskRepository.getTaskCountWithinProject(projectId);
    }

    public Double getTaskPercentage(CompletionStatus completionStatus,UUID projectId){
        return (getNoOfTasksWithStatus(completionStatus,projectId)/getTaskCount(projectId).doubleValue())*100;
    }

    public Integer getTotalEstimatedTime(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        return taskRepository.getEstimatedHours(user.getOrganizationId());
    }
    public Integer getTotalEstimatedTime(UUID projectID){
        return taskRepository.getEstimatedHours(projectID);
    }

//    Finish-to-Start (FS): Task B cannot start until Task A is completed (most common).
//    Start-to-Start (SS): Task B cannot start until Task A starts.
//    Finish-to-Finish (FF): Task B cannot finish until Task A finishes.
//    Start-to-Finish (SF): Task B cannot finish until Task A starts (least common).
//If you want to enforce dependency validation dynamically during the task lifecycle, you need:
//
//    Real-Time Validation Hook:
//    Validate dependencies every time a task's status changes. For instance, when a task is moved from PENDING to IN_PROGRESS or COMPLETED.
//
//    State Transition Rules:
//    Define and enforce valid state transitions for tasks based on dependency types. For example:
//    For FINISH_TO_START, Task B can only transition to IN_PROGRESS after Task A transitions to COMPLETED.
//
//    Triggers or Event Listeners:
//    Implement triggers or listeners in the backend to monitor task updates.
//    Whenever a task's status is updated, check dependencies and reject the update if it violates the rules.
//
//    Enhanced Validation Logic:
//    The method should not only validate the initial state but also consider the transitions and actively monitor tasks.


    public boolean validateDependency(UUID fromTaskId,UUID toTaskId,DependencyType dependencyType){

        if (!taskRepository.existsById(fromTaskId) || !taskRepository.existsById(toTaskId)) {
            log.error("One of the tasks with id : {} and {} do not exist",fromTaskId,toTaskId);
            throw new EntityNotFoundException("One or both tasks do not exist");
        }
        if(dependencyRepository.doesExist(fromTaskId,toTaskId,dependencyType).isEmpty()){
            log.error("Dependency from id : {} to {} does not exist",fromTaskId,toTaskId);
            throw new EntityNotFoundException("Dependency does not exist");
        }
        CompletionStatus taskStatus=taskRepository.getCompletionStatus(fromTaskId);
        CompletionStatus dependentStatus=taskRepository.getCompletionStatus(toTaskId);
        switch (dependencyType){
            case FINISH_TO_START -> {
                // task - fs -> dependent task
                if((taskStatus==CompletionStatus.PENDING || taskStatus==CompletionStatus.IN_PROGRESS) && dependentStatus!=CompletionStatus.PENDING){
                    return false;
                }
            }
            case FINISH_TO_FINISH -> {
                // task - ff -> dependent task
                if((taskStatus==CompletionStatus.PENDING || taskStatus==CompletionStatus.IN_PROGRESS) && (dependentStatus==CompletionStatus.COMPLETED)){
                    return false;
                }

            }case START_TO_FINISH -> {
                // task - sf -> dependent task
                if(taskStatus==CompletionStatus.PENDING && dependentStatus==CompletionStatus.COMPLETED){
                    return false;
                }
            }case START_TO_START -> {
                // task - ss -> dependent task
                if(taskStatus==CompletionStatus.PENDING && dependentStatus!=CompletionStatus.PENDING){
                    return false;
                }
            }
            default -> {
                log.error("Invalid dependency type :{}",dependencyType);
                throw new IllegalArgumentException("Invalid DependencyType");
            }
        }
        return true;
    }

    public void triggerStatusUpdates(UUID toTaskId,DependencyType dependencyType){
        Task task=loadTask(toTaskId);
        switch (dependencyType){
            case FINISH_TO_START,START_TO_START -> {
                if(task.getCompletionStatus()==CompletionStatus.PENDING){
                    task.setCompletionStatus(CompletionStatus.IN_PROGRESS);
                }
            }
            case START_TO_FINISH, FINISH_TO_FINISH -> {
                if(task.getCompletionStatus()==CompletionStatus.IN_PROGRESS){
                    task.setCompletionStatus(CompletionStatus.COMPLETED);
                }
            }
            default -> {
                log.error("Invalid dependency type :{}",dependencyType);
                throw new IllegalArgumentException("Invalid DependencyType");
            }
        }

        taskRepository.save(task);
    }
    
    public void deleteTask(UUID taskId){
        // delete task from project
        User user=userService.loadAuthenticatedUser();
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.DELETE_TASKS)){
//            throw new UnauthorizedAccessException("User doesn't have required authority");
//        }
        Task task=loadTask(taskId);
        Project project=projectRepository.findById(task.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        dependencyRepository.deleteByFromTaskId(taskId);
        project.getTasks().remove(taskId);
        projectRepository.save(project);

        // delete assigned to users
        task.getAssignedTo().clear();
        taskRepository.save(task);
        taskRepository.delete(task);

    }

    public void updateTask(UUID id,CreateTaskRequest request){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Task task=loadTask(id);
        Project project=projectRepository.findById(task.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        Optional.ofNullable(request.getTitle())
                .ifPresent(task::setTitle);
        Optional.ofNullable(request.getDescription())
                .ifPresent(task::setDescription);
        Optional.ofNullable(request.getPriority())
                .map(Priority::valueOf)
                .ifPresent(task::setPriority);

        Optional.ofNullable(request.getLevel())
                .map(Level::valueOf)
                .ifPresent(task::setLevel);

        Optional.ofNullable(request.getProgress())
                .ifPresent(task::setProgress);

        if(request.getStartDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getStartDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setStartDate(localDateTime);
        }
        if(request.getEndDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getEndDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setEndDate(localDateTime);
        }
//        Optional.ofNullable(request.getEndDate())
//                .ifPresent(task::setEndDate); // achieved at

        Optional.ofNullable(request.getEstimatedDays())
                .map(Integer::valueOf)
                .ifPresent(task::setEstimatedDays);


        // validation checks are remaining
        Optional.ofNullable(request.getParentTaskId())
                .ifPresentOrElse(
                        task::setParentTaskId,
                        () -> task.setParentTaskId(null)
                );
        Optional.ofNullable(request.getProjectId())
                .ifPresent(task::setProjectId);


        Set<UUID> assignedTo=new HashSet<>();
        if(request.getAssignedTo()!=null){
            for(String s:request.getAssignedTo()){
                assignedTo.add(userService.loadUser(s).getId());
            }
        }
        task.setAssignedTo(assignedTo);
        taskRepository.save(task);
        project.getTasks().add(task.getId());
        projectRepository.save(project);
//        notificationService.createNotification(NotificationEvent.builder()
//                        .message("Task created by "+ userService.loadUser(user.getId()).getUsername()+" at "+task.getCreatedAt())
//                        .actorId(user.getId())
//                        .userId(new ArrayList<>(task.getAssignedTo()))
//                        .type(NotificationType.TASK_ASSIGNED)
//                        .build());
//        return loadTaskResponse(task.getId());
    }

}
