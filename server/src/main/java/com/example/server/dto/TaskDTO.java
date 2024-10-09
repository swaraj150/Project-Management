package com.example.server.dto;
import com.example.server.entities.CompletionStatus;
import com.example.server.entities.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private Integer priority;
    private UUID createdByUserId;
    private Set<UUID> assignedToUserIds;
    private LocalDateTime createdAt;
    private Integer estimatedHours;
    private LocalDateTime completedAt;
    private CompletionStatus completionStatus;
    private List<UUID> subTaskIds;
    private UUID parentTaskId;
    private UUID projectId;

    public static TaskDTO fromTask(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setCreatedByUserId(task.getCreatedBy());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setEstimatedHours(task.getEstimatedHours());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setCompletionStatus(task.getCompletionStatus());
        dto.setParentTaskId(task.getParentTaskId());
        dto.setProjectId(task.getProjectId());
        dto.setAssignedToUserIds(task.getAssignedTo());
        //assignedToUserIds and subTaskIds need to be set separately
        return dto;
    }

    public Task toTask() {
        Task task = new Task();
        task.setId(this.id);
        task.setTitle(this.title);
        task.setDescription(this.description);
        task.setPriority(this.priority);
        task.setCreatedBy(this.createdByUserId);
        task.setCreatedAt(this.createdAt);
        task.setEstimatedHours(this.estimatedHours);
        task.setCompletedAt(this.completedAt);
        task.setCompletionStatus(this.completionStatus);
        task.setParentTaskId(this.parentTaskId);
        task.setProjectId(this.projectId);
        return task;
    }

}
