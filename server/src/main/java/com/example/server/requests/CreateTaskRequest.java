package com.example.server.requests;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateTaskRequest {
    private String title;
    private String description;
    private String priority;
    private String type;
    private String level;
    private Date createdAt;
    private Integer estimatedDays;
    private UUID parentTaskId;
    private List<String> assignedTo;
    private String startDate;
    private String endDate;
    private Integer progress;
    private UUID projectId;

}
