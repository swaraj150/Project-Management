package com.example.server.response;

import com.example.server.dto.UserDTO;
import com.example.server.entities.Dependency;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.TaskType;
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
public class TaskResponse {
    private UUID id;
    private String clientTaskId;
    private String title;
    private String description;
    private Integer priority;
    private TaskType type;
    private UserDTO createdByUser;
    private Set<UserDTO> assignedToUsers;
    private LocalDateTime createdAt;
    private Integer estimatedHours;
    private LocalDateTime completedAt;
    private CompletionStatus completionStatus;
    private List<TaskResponse> subTasks;
    private UUID parentTaskId;
    private UUID projectId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Dependency> dependencies;

}
