package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeLogRequest {
    private LocalDate date;
    private Integer hours;
    private Integer minutes;
    private UUID taskId;
    private String description;
    private UUID projectId;
}
