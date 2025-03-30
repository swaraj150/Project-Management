package com.example.server.dto;
import com.example.server.enums.CompletionStatus;
import com.example.server.entities.Task;
import com.example.server.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private Priority priority;
    private UUID createdByUserId;
    private Set<UUID> assignedToUserIds;
    private LocalDateTime createdAt;
    private Integer estimatedDays;
    private LocalDateTime completedAt;
    private CompletionStatus completionStatus;
    private List<UUID> subTaskIds;
    private UUID parentTaskId;
    private UUID projectId;
    private Integer progress;

    public static TaskDTO fromTask(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setCreatedByUserId(task.getCreatedBy());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setEstimatedDays(task.getEstimatedDays());
        dto.setCompletedAt(task.getCompletedAt());
        dto.setCompletionStatus(task.getCompletionStatus());
        dto.setParentTaskId(task.getParentTaskId());
        dto.setProjectId(task.getProjectId());
        dto.setAssignedToUserIds(task.getAssignedTo());
        dto.setProgress(task.getProgress());
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
        task.setEstimatedDays(this.estimatedDays);
        task.setCompletedAt(this.completedAt);
        task.setCompletionStatus(this.completionStatus);
        task.setParentTaskId(this.parentTaskId);
        task.setProjectId(this.projectId);
        task.setProgress(this.progress);
        return task;
    }

}
