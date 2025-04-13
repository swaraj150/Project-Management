package com.example.server.requests;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateTaskRequest {
    @Nullable
    private UUID id;
    private String title;
    private String description;
    private String priority;
    private String type;
    private String level;
    private Integer estimatedDays;
    private List<UUID> assignedTo;
    private String startDate;
    @Nullable
    private Integer progress;
    @Nullable
    private Date createdAt;
    @Nullable
    private String endDate;
    @Nullable
    private UUID projectId;
    @Nullable
    private UUID parentTaskId;
    @Nullable
    private String status;
    @Nullable
    private UUID createdBy;

}
