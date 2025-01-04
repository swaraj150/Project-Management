package com.example.server.response;

import com.example.server.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MilestoneResponse {
    private UUID id;
    private String clientTaskId;
    private String title;
    private String description;
    private LocalDateTime date;
    private Set<TaskResponse> dependencies = new HashSet<>();
    private LocalDateTime achievedAt;
    private LocalDateTime createdAt;
    private UUID parentTaskId;
    private UserDTO createdBy;

}
