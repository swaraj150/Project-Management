package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateProjectRequest {
    private String title;
    private String description;
    private LocalDate estimatedEndDate;
    private BigDecimal budget;
    private UUID projectManagerId;
}
