package com.example.server.service;

import com.example.server.entities.Project;
import com.example.server.entities.Task;
import com.example.server.entities.User;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.Priority;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsService {
    private final TaskService taskService;
    private final TeamService teamService;
    private final ProjectService projectService;
    private final UserService userService;
    private final OrganizationService organizationService;

    public Map<UUID,Long> loadTeamWiseWorkload(@NonNull UUID projectId){
        Project project=projectService.loadProject(projectId);
        Map<UUID,Long> workloads=new HashMap<>();
        for(UUID teamId:project.getTeams()){
            workloads.put(teamId,teamService.calculateTotalTeamWorkload(teamId,projectId));
        }
        return workloads;
    }
    public Map<UUID,Map<String,Double>> loadTeamWiseExpertise(@NonNull UUID projectId){
        Project project=projectService.loadProject(projectId);
        Map<UUID,Map<String,Double>> expertise=new HashMap<>();
        for(UUID teamId:project.getTeams()){
            expertise.put(teamId,teamService.calculateTeamExpertise(teamId,projectId));
        }
        return expertise;
    }
    public Map<String,Double> loadTeamExpertise(@NonNull UUID projectId,@NonNull UUID teamId){
        return teamService.calculateTeamExpertise(teamId,projectId);
    }
    public Map<UUID,Map<String,Integer>> loadProjectWisePriority(){
        User user= userService.loadAuthenticatedUser();
        List<UUID> projects=organizationService.getProjectsInOrganization(user.getOrganizationId());
        Map<UUID,Map<String,Integer>> priority=new HashMap<>();
        for(UUID projectId:projects){
            priority.put(projectId,Map.of("Low",taskService.getNoOfTasksWithPriority(Priority.LOW,projectId),"Normal",taskService.getNoOfTasksWithPriority(Priority.NORMAL,projectId),"High",taskService.getNoOfTasksWithPriority(Priority.HIGH,projectId)));
        }
        return priority;
    }

    public Map<String,Double> employeePerformance(@NonNull UUID projectId,@NonNull UUID userId){
        Map<String,Double> metrics=new HashMap<>();
        List<Task> taskList=taskService.getCompletedTasksByUser(userId,projectId);
        // rate of task completion before deadline
        int totalTasks = taskList.size();
        if(totalTasks==0){
            metrics.put("Tasks completed within deadline",0.0);

            metrics.put("No. of tasks completed",0.0);

            metrics.put("Average level of tasks completed",0.0);
            return metrics;
        }
        int onTimeTasks = 0;
        int totalDaysDifference = 0;
        int beginner=0,intermediate=0,expert=0;

        for (Task task : taskList) {
            LocalDateTime startDate = task.getStartDate();
            LocalDateTime endDate = task.getEndDate();
            int estimatedDays = task.getEstimatedDays();
            LocalDateTime estimatedDeadline = startDate.plusDays(estimatedDays);

            long daysDifference = ChronoUnit.DAYS.between(endDate, estimatedDeadline);
            totalDaysDifference += (int) daysDifference;

            if (!endDate.isAfter(estimatedDeadline)) {
                onTimeTasks++;
            }
            switch (task.getLevel()){
                case BEGINNER -> beginner++;
                case INTERMEDIATE -> intermediate++;
                case EXPERT -> expert++;
            }
        }

        double onTimeCompletionRate = ((double) onTimeTasks / totalTasks) * 100;
        double avgDaysEarlyLate = (double) totalDaysDifference / totalTasks;

        double performanceScore = onTimeCompletionRate + (avgDaysEarlyLate * 2);
        metrics.put("Tasks completed within deadline",performanceScore);


        metrics.put("No. of tasks completed",(double)taskList.size());

        metrics.put("Average level of tasks completed",(double)(beginner+intermediate+expert)/taskList.size());

        return metrics;
    }

    public Map<String,Double> employeePerformance(@NonNull UUID userId){
        Map<String,Double> metrics=new HashMap<>();
        User user=userService.loadUser(userId);
        Project project=projectService.loadProjectByOrganization(user.getId());
        List<Task> taskList=taskService.getCompletedTasksByUser(userId,project.getId());
        // rate of task completion before deadline
        int totalTasks = taskList.size();
        if(totalTasks==0){
            metrics.put("Tasks completed within deadline",0.0);

            metrics.put("No. of tasks completed",0.0);

            metrics.put("Average level of tasks completed",0.0);
            return metrics;
        }
        int onTimeTasks = 0;
        int totalDaysDifference = 0;
        int beginner=0,intermediate=0,expert=0;

        for (Task task : taskList) {
            LocalDateTime startDate = task.getStartDate();
            LocalDateTime endDate = task.getEndDate();
            int estimatedDays = task.getEstimatedDays();
            LocalDateTime estimatedDeadline = startDate.plusDays(estimatedDays);

            long daysDifference = ChronoUnit.DAYS.between(endDate, estimatedDeadline);
            totalDaysDifference += (int) daysDifference;

            if (!endDate.isAfter(estimatedDeadline)) {
                onTimeTasks++;
            }
            switch (task.getLevel()){
                case BEGINNER -> beginner++;
                case INTERMEDIATE -> intermediate++;
                case EXPERT -> expert++;
            }
        }

        double onTimeCompletionRate = ((double) onTimeTasks / totalTasks) * 100;
        double avgDaysEarlyLate = (double) totalDaysDifference / totalTasks;

        double performanceScore = onTimeCompletionRate + (avgDaysEarlyLate * 2);
        metrics.put("Tasks completed within deadline",performanceScore);


        metrics.put("No. of tasks completed",(double)taskList.size());

        metrics.put("Average level of tasks completed",(double)(beginner+intermediate+expert)/taskList.size());

        return metrics;
    }

    public Map<String,Double> loadProjectCompletionStatuses(@NonNull UUID projectId){
        int tasks=taskService.getTaskCount(projectId);
        double pendingTasks=0,inProgressTasks=0,completedTasks=0;
        if(tasks==0){
            return Map.of("pending tasks",0.0,"in progress tasks",0.0,"completed tasks",0.0);
        }
        pendingTasks=taskService.getNoOfTasksWithStatus(CompletionStatus.PENDING,projectId);
        inProgressTasks=taskService.getNoOfTasksWithStatus(CompletionStatus.IN_PROGRESS,projectId);
        completedTasks=taskService.getNoOfTasksWithStatus(CompletionStatus.COMPLETED,projectId);
        return Map.of("pending tasks",(pendingTasks /tasks)*100,"in progress tasks",(inProgressTasks /tasks)*100,"completed tasks",(completedTasks /tasks)*100);
    }





}
