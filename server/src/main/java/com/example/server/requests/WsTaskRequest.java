package com.example.server.requests;

import com.example.server.enums.WsPublishType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsTaskRequest {
    private UUID taskId;
    private String clientTaskId;
    private String description;
    private WsPublishType publishType;
    private String title;
    private Integer priority;
    private String taskType;
    private String level;
    private String estimatedHours;
    private String parentTaskId;
    private List<String> assignedTo;
    private String status;
    private LocalDateTime timestamp;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String projectId;

}
