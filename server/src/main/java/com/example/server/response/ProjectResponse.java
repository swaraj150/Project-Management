package com.example.server.response;
import com.example.server.dto.UserDTO;
import com.example.server.enums.CompletionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectResponse {
    private UUID id;
    private String title;
    private String description;
    private Map<String,Object> tasks;
    private Set<UUID> teams;
    private UUID projectManager;
    private LocalDate startDate;
    private LocalDate estimatedEndDate;
    private LocalDate endDate;
    private BigDecimal budget;// in INR
    private CompletionStatus completionStatus;
}
