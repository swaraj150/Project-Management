package com.example.server.requests;
import com.example.server.entities.TaskType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateTaskRequest {
    private String title;
    private String description;
    private Integer priority;
    private String type;
    private Date createdAt;
    private Integer estimatedHours;
    private UUID parentTaskId;
    private List<String> assignedTo;

}
