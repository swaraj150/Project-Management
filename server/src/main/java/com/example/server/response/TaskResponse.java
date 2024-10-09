package com.example.server.response;

import com.example.server.dto.UserDTO;
import com.example.server.entities.CompletionStatus;
import com.example.server.entities.TaskType;
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
    private List<UUID> subTaskIds;
    private UUID parentTaskId;
    private UUID projectId;
}
